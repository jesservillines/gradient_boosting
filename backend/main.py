from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import xgboost as xgb
import lightgbm as lgb
import catboost as cb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score, roc_auc_score
import json
from typing import List, Dict, Any, Optional
import logging

app = FastAPI(title="Gradient Boosting Visualization API",
              description="API for interactive visualization of gradient boosting algorithms")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Data models
class TrainingRequest(BaseModel):
    algorithm: str  # "xgboost", "lightgbm", or "catboost"
    params: Dict[str, Any]
    dataset_name: str
    target_column: str
    categorical_features: Optional[List[str]] = None
    test_size: float = 0.2
    random_state: int = 42
    task_type: str = "classification"  # or "regression"

class TreeVisualizationRequest(BaseModel):
    algorithm: str
    tree_index: int
    model_id: str

# Simple in-memory storage for models and datasets
models = {}
datasets = {}

# Load sample datasets
@app.on_event("startup")
def load_sample_datasets():
    """Load sample datasets on startup"""
    from sklearn.datasets import load_breast_cancer, load_diabetes, load_wine
    
    # Load classification datasets
    breast_cancer = load_breast_cancer()
    bc_data = pd.DataFrame(breast_cancer.data, columns=breast_cancer.feature_names)
    bc_data['target'] = breast_cancer.target
    datasets['breast_cancer'] = bc_data
    
    wine = load_wine()
    wine_data = pd.DataFrame(wine.data, columns=wine.feature_names)
    wine_data['target'] = wine.target
    datasets['wine'] = wine_data
    
    # Load regression dataset
    diabetes = load_diabetes()
    diabetes_data = pd.DataFrame(diabetes.data, columns=diabetes.feature_names)
    diabetes_data['target'] = diabetes.target
    datasets['diabetes'] = diabetes_data
    
    logger.info(f"Loaded {len(datasets)} sample datasets")

@app.get("/")
def root():
    return {"message": "Welcome to the Gradient Boosting Visualization API"}

@app.get("/datasets")
def get_datasets():
    """Get list of available datasets"""
    return {
        "datasets": list(datasets.keys()),
        "details": {name: {"shape": data.shape, "columns": list(data.columns)} 
                  for name, data in datasets.items()}
    }

@app.get("/datasets/{dataset_name}")
def get_dataset_info(dataset_name: str):
    """Get information about a specific dataset"""
    if dataset_name not in datasets:
        raise HTTPException(status_code=404, detail=f"Dataset {dataset_name} not found")
    
    df = datasets[dataset_name]
    return {
        "name": dataset_name,
        "shape": df.shape,
        "columns": list(df.columns),
        "dtypes": {col: str(df[col].dtype) for col in df.columns},
        "preview": df.head(5).to_dict(orient="records")
    }

@app.post("/train")
def train_model(request: TrainingRequest):
    """Train a gradient boosting model based on the specified parameters"""
    if request.dataset_name not in datasets:
        raise HTTPException(status_code=404, detail=f"Dataset {request.dataset_name} not found")
    
    # Get dataset
    df = datasets[request.dataset_name]
    
    # Split features and target
    X = df.drop(columns=[request.target_column])
    y = df[request.target_column]
    
    # Convert categorical features if specified
    if request.categorical_features:
        for col in request.categorical_features:
            if col in X.columns:
                X[col] = X[col].astype('category')
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=request.test_size, random_state=request.random_state
    )
    
    # Train model based on algorithm
    model_id = f"{request.algorithm}_{len(models)}"
    training_history = []
    
    try:
        if request.algorithm == "xgboost":
            # Prepare evaluation set
            eval_set = [(X_train, y_train), (X_test, y_test)]
            
            # Set objective based on task
            params = request.params.copy()
            if request.task_type == "classification":
                if "objective" not in params:
                    if len(np.unique(y)) == 2:
                        params["objective"] = "binary:logistic"
                    else:
                        params["objective"] = "multi:softprob"
                        params["num_class"] = len(np.unique(y))
            else:
                if "objective" not in params:
                    params["objective"] = "reg:squarederror"
            
            # Convert to DMatrix for faster processing
            dtrain = xgb.DMatrix(X_train, label=y_train)
            dtest = xgb.DMatrix(X_test, label=y_test)
            
            # Track history
            callback = xgb.callback.TrainingCallback()
            
            # Train model
            model = xgb.train(
                params,
                dtrain,
                num_boost_round=params.get("n_estimators", 100),
                evals=[(dtrain, 'train'), (dtest, 'test')],
                verbose_eval=False,
                callbacks=[callback]
            )
            
            # Extract training history
            for i in range(len(callback.history['train'])):
                metrics = {}
                for dataset in callback.history:
                    metrics[dataset] = callback.history[dataset][i]
                training_history.append({
                    'iteration': i,
                    'metrics': metrics
                })
                
        elif request.algorithm == "lightgbm":
            # Set objective based on task
            params = request.params.copy()
            if request.task_type == "classification":
                if "objective" not in params:
                    if len(np.unique(y)) == 2:
                        params["objective"] = "binary"
                    else:
                        params["objective"] = "multiclass"
                        params["num_class"] = len(np.unique(y))
            else:
                if "objective" not in params:
                    params["objective"] = "regression"
            
            # Prepare datasets
            train_data = lgb.Dataset(X_train, label=y_train, categorical_feature=request.categorical_features)
            test_data = lgb.Dataset(X_test, label=y_test, reference=train_data, categorical_feature=request.categorical_features)
            
            # Dictionary to store training history
            history = {}
            
            # Callback to record history
            def callback(env):
                iteration = env.iteration
                if 'iteration' not in history:
                    history['iteration'] = []
                if 'metrics' not in history:
                    history['metrics'] = {}
                
                history['iteration'].append(iteration)
                
                for dataset, metric, score, _ in env.evaluation_result_list:
                    if dataset not in history['metrics']:
                        history['metrics'][dataset] = {}
                    if metric not in history['metrics'][dataset]:
                        history['metrics'][dataset][metric] = []
                    
                    history['metrics'][dataset][metric].append(score)
            
            # Train model
            model = lgb.train(
                params,
                train_data,
                num_boost_round=params.get("num_iterations", 100),
                valid_sets=[train_data, test_data],
                valid_names=['train', 'test'],
                callbacks=[callback],
                verbose_eval=False
            )
            
            # Format history to match expected structure
            for i, iteration in enumerate(history['iteration']):
                metrics = {}
                for dataset in history['metrics']:
                    metrics[dataset] = {}
                    for metric in history['metrics'][dataset]:
                        metrics[dataset][metric] = history['metrics'][dataset][metric][i]
                
                training_history.append({
                    'iteration': iteration,
                    'metrics': metrics
                })
                
        elif request.algorithm == "catboost":
            # Set objective based on task
            params = request.params.copy()
            if request.task_type == "classification":
                if "loss_function" not in params:
                    if len(np.unique(y)) == 2:
                        params["loss_function"] = "Logloss"
                    else:
                        params["loss_function"] = "MultiClass"
            else:
                if "loss_function" not in params:
                    params["loss_function"] = "RMSE"
            
            # Create pool objects
            train_pool = cb.Pool(X_train, y_train, cat_features=request.categorical_features)
            test_pool = cb.Pool(X_test, y_test, cat_features=request.categorical_features)
            
            # Dictionary to store metrics
            metrics = {}
            
            # Train model
            model = cb.CatBoost(params)
            model.fit(
                train_pool,
                eval_set=test_pool,
                verbose=False,
                plot=False
            )
            
            # Extract training history
            train_metrics = model.get_evals_result()
            
            # Format history to match expected structure
            for i in range(len(list(train_metrics.values())[0][list(train_metrics.values())[0].keys()[0]])):
                iteration_metrics = {}
                for dataset in train_metrics:
                    iteration_metrics[dataset] = {}
                    for metric in train_metrics[dataset]:
                        iteration_metrics[dataset][metric] = train_metrics[dataset][metric][i]
                
                training_history.append({
                    'iteration': i,
                    'metrics': iteration_metrics
                })
                
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported algorithm: {request.algorithm}")
        
        # Store model for later use
        models[model_id] = {
            "model": model,
            "algorithm": request.algorithm,
            "params": request.params,
            "dataset": request.dataset_name,
            "features": list(X.columns),
            "target": request.target_column,
            "categorical_features": request.categorical_features,
            "task_type": request.task_type
        }
        
        # Calculate metrics
        metrics = {}
        if request.task_type == "classification":
            # Make predictions
            if request.algorithm == "xgboost":
                y_pred_proba = model.predict(xgb.DMatrix(X_test))
                if len(np.unique(y)) == 2:
                    y_pred = (y_pred_proba > 0.5).astype(int)
                    metrics["accuracy"] = accuracy_score(y_test, y_pred)
                    metrics["auc"] = roc_auc_score(y_test, y_pred_proba)
                else:
                    y_pred = np.argmax(y_pred_proba, axis=1)
                    metrics["accuracy"] = accuracy_score(y_test, y_pred)
                    # Multi-class AUC is more complex, skipping for now
            
            elif request.algorithm == "lightgbm":
                y_pred_proba = model.predict(X_test)
                if len(np.unique(y)) == 2:
                    y_pred = (y_pred_proba > 0.5).astype(int)
                    metrics["accuracy"] = accuracy_score(y_test, y_pred)
                    metrics["auc"] = roc_auc_score(y_test, y_pred_proba)
                else:
                    y_pred = np.argmax(y_pred_proba, axis=1)
                    metrics["accuracy"] = accuracy_score(y_test, y_pred)
            
            elif request.algorithm == "catboost":
                y_pred_proba = model.predict(test_pool, prediction_type='Probability')
                if len(np.unique(y)) == 2:
                    y_pred = model.predict(test_pool)
                    metrics["accuracy"] = accuracy_score(y_test, y_pred)
                    metrics["auc"] = roc_auc_score(y_test, y_pred_proba)
                else:
                    y_pred = model.predict(test_pool)
                    metrics["accuracy"] = accuracy_score(y_test, y_pred)
        
        else:  # regression
            if request.algorithm == "xgboost":
                y_pred = model.predict(xgb.DMatrix(X_test))
            elif request.algorithm == "lightgbm":
                y_pred = model.predict(X_test)
            elif request.algorithm == "catboost":
                y_pred = model.predict(test_pool)
                
            metrics["rmse"] = np.sqrt(mean_squared_error(y_test, y_pred))
            metrics["mse"] = mean_squared_error(y_test, y_pred)
        
        return {
            "model_id": model_id,
            "algorithm": request.algorithm,
            "training_history": training_history,
            "evaluation_metrics": metrics,
            "feature_importance": get_feature_importance(model, request.algorithm, list(X.columns)),
            "model_structure": {
                "n_estimators": get_n_estimators(model, request.algorithm),
                "features": list(X.columns)
            }
        }
        
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error training model: {str(e)}")

@app.get("/models")
def get_models():
    """Get list of trained models"""
    return {
        "models": [
            {
                "model_id": model_id,
                "algorithm": info["algorithm"],
                "dataset": info["dataset"],
                "task_type": info["task_type"]
            }
            for model_id, info in models.items()
        ]
    }

@app.get("/models/{model_id}")
def get_model_info(model_id: str):
    """Get information about a specific model"""
    if model_id not in models:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found")
    
    model_info = models[model_id]
    
    return {
        "model_id": model_id,
        "algorithm": model_info["algorithm"],
        "params": model_info["params"],
        "dataset": model_info["dataset"],
        "features": model_info["features"],
        "target": model_info["target"],
        "categorical_features": model_info["categorical_features"],
        "task_type": model_info["task_type"],
        "feature_importance": get_feature_importance(model_info["model"], model_info["algorithm"], model_info["features"]),
        "model_structure": {
            "n_estimators": get_n_estimators(model_info["model"], model_info["algorithm"]),
            "features": model_info["features"]
        }
    }

@app.post("/visualize-tree")
def visualize_tree(request: TreeVisualizationRequest):
    """Get visualization data for a specific tree in the model"""
    if request.model_id not in models:
        raise HTTPException(status_code=404, detail=f"Model {request.model_id} not found")
    
    model_info = models[request.model_id]
    model = model_info["model"]
    
    if request.algorithm != model_info["algorithm"]:
        raise HTTPException(status_code=400, detail=f"Model algorithm mismatch: expected {model_info['algorithm']}, got {request.algorithm}")
    
    try:
        # Get the number of trees in the model
        n_trees = get_n_estimators(model, request.algorithm)
        
        if request.tree_index < 0 or request.tree_index >= n_trees:
            raise HTTPException(status_code=400, detail=f"Tree index out of range: 0 <= {request.tree_index} < {n_trees}")
        
        # Get tree structure
        tree_structure = get_tree_structure(model, request.algorithm, request.tree_index, model_info["features"])
        
        return {
            "model_id": request.model_id,
            "algorithm": request.algorithm,
            "tree_index": request.tree_index,
            "tree_structure": tree_structure
        }
        
    except Exception as e:
        logger.error(f"Error visualizing tree: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error visualizing tree: {str(e)}")

# Helper functions
def get_feature_importance(model, algorithm, feature_names):
    """Extract feature importance from the model"""
    try:
        if algorithm == "xgboost":
            # Get feature importance
            importance = model.get_score(importance_type='gain')
            # Convert to array format
            result = []
            for feature in feature_names:
                if feature in importance:
                    result.append({"feature": feature, "importance": importance[feature]})
                else:
                    result.append({"feature": feature, "importance": 0})
            return result
            
        elif algorithm == "lightgbm":
            importance = model.feature_importance(importance_type='gain')
            return [{"feature": feature, "importance": imp} for feature, imp in zip(feature_names, importance)]
            
        elif algorithm == "catboost":
            importance = model.get_feature_importance()
            return [{"feature": feature, "importance": imp} for feature, imp in zip(feature_names, importance)]
            
        else:
            return []
            
    except Exception as e:
        logger.error(f"Error getting feature importance: {str(e)}")
        return []

def get_n_estimators(model, algorithm):
    """Get the number of trees in the model"""
    if algorithm == "xgboost":
        return model.best_ntree_limit if hasattr(model, 'best_ntree_limit') else len(model.get_dump())
    elif algorithm == "lightgbm":
        return model.num_trees()
    elif algorithm == "catboost":
        return model.tree_count_
    else:
        return 0

def get_tree_structure(model, algorithm, tree_index, feature_names):
    """Extract tree structure for visualization"""
    if algorithm == "xgboost":
        # Get the tree dump
        tree_dump = model.get_dump(dump_format='json')
        if tree_index < len(tree_dump):
            return json.loads(tree_dump[tree_index])
        else:
            return {}
            
    elif algorithm == "lightgbm":
        # LightGBM has a built-in function to extract tree structure
        return model.dump_model()['tree_info'][tree_index]
        
    elif algorithm == "catboost":
        # CatBoost tree structure is more complex
        # This is a simplified version, could be expanded
        tree_structure = {
            "nodes": []
        }
        # In a real implementation, we would parse CatBoost's internal tree representation
        # For now, we return a placeholder
        return tree_structure
        
    else:
        return {}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
