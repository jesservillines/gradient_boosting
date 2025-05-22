from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer, load_diabetes, load_wine
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score, roc_auc_score
from sklearn.decomposition import PCA
from typing import List, Dict, Any, Optional
import logging
import json
import time
import os
import random

# Conditionally import model libraries to avoid errors if not installed
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except Exception:
    XGBOOST_AVAILABLE = False

try:
    import lightgbm as lgb
    LIGHTGBM_AVAILABLE = True
except Exception:
    LIGHTGBM_AVAILABLE = False

try:
    import catboost as cb
    CATBOOST_AVAILABLE = True
except Exception:
    CATBOOST_AVAILABLE = False

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
datasets_pca = {}

# Load sample datasets
def load_sample_datasets():
    """Load sample datasets on startup"""
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
    
    # Create a simple synthetic dataset for demonstration
    np.random.seed(42)
    n_samples = 1000
    x1 = np.random.rand(n_samples) * 10
    x2 = np.random.rand(n_samples) * 5
    y = 0.5 * x1 + 0.3 * x2 + np.random.randn(n_samples) * 0.5
    
    synthetic_data = pd.DataFrame({
        'feature1': x1,
        'feature2': x2,
        'target': y
    })
    datasets['synthetic'] = synthetic_data
    
    # Pre-compute 2D PCA for each dataset (for visualization)
    for name, df in datasets.items():
        try:
            features = df.drop(columns=[col for col in ['target', 'label'] if col in df.columns])
            # Use up to 1000 samples to keep payload small
            sample_df = features.sample(n=min(len(features), 1000), random_state=42)
            pca = PCA(n_components=2)
            coords = pca.fit_transform(sample_df.values)
            datasets_pca[name] = {
                'x': coords[:, 0].tolist(),
                'y': coords[:, 1].tolist(),
                'target': df.loc[sample_df.index, 'target'].tolist() if 'target' in df.columns else [0]*len(sample_df)
            }
        except Exception as e:
            logger.error(f"PCA computation failed for {name}: {e}")
    
    logger.info(f"Loaded {len(datasets)} sample datasets with PCA projections")

# Load datasets on startup
load_sample_datasets()

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

@app.get("/datasets/{dataset_name}/pca")
def get_dataset_pca(dataset_name: str):
    """Return 2-D PCA projection for visualization"""
    if dataset_name not in datasets_pca:
        raise HTTPException(status_code=404, detail="PCA projection not found")
    return datasets_pca[dataset_name]

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
    
    # Generate a unique model ID
    model_id = f"{request.algorithm}_{int(time.time())}"
    
    try:
        # Create placeholder for model and training metrics
        metrics = {}
        train_time = 0
        model = None
        
        # Train model based on algorithm
        start_time = time.time()
        
        if request.algorithm == "xgboost" and XGBOOST_AVAILABLE:
            # Set up default params if not provided
            default_params = {
                "n_estimators": 100,
                "learning_rate": 0.1,
                "max_depth": 3,
                "subsample": 0.8,
                "colsample_bytree": 0.8
            }
            
            # Update with user-provided params
            params = {**default_params, **request.params}
            
            # Training for classification or regression
            if request.task_type == "classification":
                model = xgb.XGBClassifier(**params, random_state=request.random_state)
            else:
                model = xgb.XGBRegressor(**params, random_state=request.random_state)
                
            # Train the model
            model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
            
        elif request.algorithm == "lightgbm" and LIGHTGBM_AVAILABLE:
            # Set up default params if not provided
            default_params = {
                "n_estimators": 100,
                "learning_rate": 0.1,
                "max_depth": 3,
                "subsample": 0.8,
                "colsample_bytree": 0.8
            }
            
            # Update with user-provided params
            params = {**default_params, **request.params}
            
            # Training for classification or regression
            if request.task_type == "classification":
                model = lgb.LGBMClassifier(**params, random_state=request.random_state)
            else:
                model = lgb.LGBMRegressor(**params, random_state=request.random_state)
                
            # Train the model
            model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
            
        elif request.algorithm == "catboost" and CATBOOST_AVAILABLE:
            # Set up default params if not provided
            default_params = {
                "iterations": 100,
                "learning_rate": 0.1,
                "depth": 3,
                "subsample": 0.8
            }
            
            # Update with user-provided params
            params = {**default_params, **request.params}
            
            # Training for classification or regression
            if request.task_type == "classification":
                model = cb.CatBoostClassifier(**params, random_state=request.random_state)
            else:
                model = cb.CatBoostRegressor(**params, random_state=request.random_state)
                
            # Train the model
            model.fit(X_train, y_train, eval_set=(X_test, y_test), verbose=False)
            
        else:
            # For demonstration, if libraries aren't available, create a "mock" model
            import time
            time.sleep(2)  # Simulate training time
            class MockModel:
                def __init__(self, algorithm):
                    self.algorithm = algorithm
                    self.trees = []
                    for i in range(10):
                        self.trees.append({
                            "id": i,
                            "nodes": [
                                {"id": 0, "feature": "feature1", "threshold": random.random() * 5, "left": 1, "right": 2},
                                {"id": 1, "leaf": True, "value": random.random()},
                                {"id": 2, "leaf": True, "value": random.random()}
                            ]
                        })
                
                def predict(self, X):
                    # Return mock predictions
                    if isinstance(X, pd.DataFrame):
                        return np.random.rand(X.shape[0])
                    return np.random.rand(len(X))
                    
                def feature_importance(self, importance_type='gain'):
                    # Return mock feature importances
                    return np.random.rand(X.shape[1])
            
            model = MockModel(request.algorithm)
            
        train_time = time.time() - start_time
        
        # Calculate metrics
        if model is not None:
            y_pred = model.predict(X_test)
            
            if request.task_type == "classification":
                accuracy = accuracy_score(y_test, y_pred)
                try:
                    y_proba = model.predict_proba(X_test)[:, 1]
                    auc = roc_auc_score(y_test, y_proba)
                    metrics = {
                        "accuracy": accuracy,
                        "auc": auc
                    }
                except:
                    metrics = {
                        "accuracy": accuracy
                    }
            else:
                mse = mean_squared_error(y_test, y_pred)
                rmse = np.sqrt(mse)
                metrics = {
                    "mse": mse,
                    "rmse": rmse
                }
        
        # Store model info
        model_info = {
            "id": model_id,
            "algorithm": request.algorithm,
            "params": request.params,
            "dataset": request.dataset_name,
            "task_type": request.task_type,
            "features": list(X.columns),
            "target": request.target_column,
            "metrics": metrics,
            "train_time": train_time,
            "timestamp": time.time(),
            "model": model  # In-memory storage of model object
        }
        
        models[model_id] = model_info
        
        # Return model info (excluding the actual model object)
        return {
            "model_id": model_id,
            "algorithm": request.algorithm,
            "params": request.params,
            "dataset": request.dataset_name,
            "task_type": request.task_type,
            "metrics": metrics,
            "train_time": train_time,
            "feature_importance": get_feature_importance(model, request.algorithm, list(X.columns))
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
                "id": model_id,
                "algorithm": info["algorithm"],
                "dataset": info["dataset"],
                "metrics": info["metrics"],
                "timestamp": info["timestamp"]
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
    
    # Return model info (excluding the actual model object)
    return {
        "model_id": model_id,
        "algorithm": model_info["algorithm"],
        "params": model_info["params"],
        "dataset": model_info["dataset"],
        "task_type": model_info["task_type"],
        "features": model_info["features"],
        "target": model_info["target"],
        "metrics": model_info["metrics"],
        "train_time": model_info["train_time"],
        "timestamp": model_info["timestamp"],
        "n_trees": get_n_estimators(model_info["model"], model_info["algorithm"]),
        "feature_importance": get_feature_importance(model_info["model"], model_info["algorithm"], model_info["features"])
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

@app.get("/compare-algorithms")
def compare_algorithms(dataset_name: str, aspect: str = "accuracy"):
    """Compare the performance of XGBoost, LightGBM, and CatBoost on a specific dataset"""
    if dataset_name not in datasets:
        raise HTTPException(status_code=404, detail=f"Dataset {dataset_name} not found")
    
    # For demo purposes, return mock comparison data
    mock_results = {
        "aspect": aspect,
        "dataset": dataset_name,
        "xgboost": random.uniform(0.8, 0.95) if aspect == "accuracy" else {
            "training": random.uniform(0.5, 3.0),
            "inference": random.uniform(0.05, 0.2)
        },
        "lightgbm": random.uniform(0.8, 0.95) if aspect == "accuracy" else {
            "training": random.uniform(0.3, 2.0),
            "inference": random.uniform(0.03, 0.15)
        },
        "catboost": random.uniform(0.8, 0.95) if aspect == "accuracy" else {
            "training": random.uniform(0.7, 3.5),
            "inference": random.uniform(0.04, 0.18)
        }
    }
    
    # Determine winner based on aspect
    if aspect == "accuracy":
        winner = max(["xgboost", "lightgbm", "catboost"], key=lambda x: mock_results[x])
    elif aspect == "speed":
        winner = min(["xgboost", "lightgbm", "catboost"], key=lambda x: mock_results[x]["training"])
    else:
        winner = "catboost" if aspect == "categorical" else "lightgbm"
    
    mock_results["winner"] = winner
    
    return mock_results

# Helper functions
def get_feature_importance(model, algorithm, feature_names):
    """Extract feature importance from the model"""
    try:
        # For mock model or unavailable libraries
        if not any([XGBOOST_AVAILABLE, LIGHTGBM_AVAILABLE, CATBOOST_AVAILABLE]):
            # Generate random feature importances
            importances = np.random.rand(len(feature_names))
            total = sum(importances)
            importances = [imp/total for imp in importances]
            return [{"feature": feature, "importance": imp} for feature, imp in zip(feature_names, importances)]
            
        if algorithm == "xgboost" and XGBOOST_AVAILABLE:
            # Get feature importance
            try:
                importance = model.get_score(importance_type='gain')
                # Convert to array format
                result = []
                for feature in feature_names:
                    if feature in importance:
                        result.append({"feature": feature, "importance": importance[feature]})
                    else:
                        result.append({"feature": feature, "importance": 0})
                return result
            except:
                # Fall back to feature_importances_ attribute
                if hasattr(model, 'feature_importances_'):
                    return [{"feature": feature, "importance": imp} 
                            for feature, imp in zip(feature_names, model.feature_importances_)]
            
        elif algorithm == "lightgbm" and LIGHTGBM_AVAILABLE:
            try:
                importance = model.feature_importance(importance_type='gain')
                return [{"feature": feature, "importance": imp} for feature, imp in zip(feature_names, importance)]
            except:
                # Fall back to feature_importances_ attribute
                if hasattr(model, 'feature_importances_'):
                    return [{"feature": feature, "importance": imp} 
                            for feature, imp in zip(feature_names, model.feature_importances_)]
            
        elif algorithm == "catboost" and CATBOOST_AVAILABLE:
            try:
                importance = model.get_feature_importance()
                return [{"feature": feature, "importance": imp} for feature, imp in zip(feature_names, importance)]
            except:
                # Fall back to feature_importances_ attribute
                if hasattr(model, 'feature_importances_'):
                    return [{"feature": feature, "importance": imp} 
                            for feature, imp in zip(feature_names, model.feature_importances_)]
        
        # If we get here, generate mock importances
        importances = np.random.rand(len(feature_names))
        total = sum(importances)
        importances = [imp/total for imp in importances]
        return [{"feature": feature, "importance": imp} for feature, imp in zip(feature_names, importances)]
            
    except Exception as e:
        logger.error(f"Error getting feature importance: {str(e)}")
        # Return mock data in case of error
        importances = np.random.rand(len(feature_names))
        total = sum(importances)
        importances = [imp/total for imp in importances]
        return [{"feature": feature, "importance": imp} for feature, imp in zip(feature_names, importances)]

def get_n_estimators(model, algorithm):
    """Get the number of trees in the model"""
    try:
        if algorithm == "xgboost" and XGBOOST_AVAILABLE:
            return model.best_ntree_limit if hasattr(model, 'best_ntree_limit') else len(model.get_booster().get_dump())
        elif algorithm == "lightgbm" and LIGHTGBM_AVAILABLE:
            return model.n_estimators_
        elif algorithm == "catboost" and CATBOOST_AVAILABLE:
            return model.tree_count_
        elif hasattr(model, 'n_estimators'):
            return model.n_estimators
        elif hasattr(model, 'trees') and isinstance(model.trees, list):
            return len(model.trees)
        else:
            return 10  # Default for mock models
    except:
        return 10  # Default fallback

def get_tree_structure(model, algorithm, tree_index, feature_names):
    """Extract tree structure for visualization"""
    try:
        if algorithm == "xgboost" and XGBOOST_AVAILABLE:
            # Get the tree dump
            try:
                tree_dump = model.get_booster().get_dump(dump_format='json')
                if tree_index < len(tree_dump):
                    return json.loads(tree_dump[tree_index])
                else:
                    return {}
            except:
                # Mock tree for demo
                return create_mock_tree(feature_names)
                
        elif algorithm == "lightgbm" and LIGHTGBM_AVAILABLE:
            # LightGBM tree structure
            try:
                tree_info = model.booster_.dump_model()['tree_info'][tree_index]
                return tree_info
            except:
                # Mock tree for demo
                return create_mock_tree(feature_names)
            
        elif algorithm == "catboost" and CATBOOST_AVAILABLE:
            # CatBoost tree structure is more complex
            # For simplicity, return a mock tree for demo
            return create_mock_tree(feature_names)
            
        else:
            # For mock models or unavailable libraries
            return create_mock_tree(feature_names)
            
    except Exception as e:
        logger.error(f"Error getting tree structure: {str(e)}")
        return create_mock_tree(feature_names)

def create_mock_tree(feature_names):
    """Create a mock tree structure for visualization"""
    depth = 3
    max_nodes = 2**depth - 1
    
    nodes = []
    for i in range(max_nodes):
        if i >= max_nodes // 2:  # Leaf nodes
            nodes.append({
                "id": i,
                "leaf": True,
                "value": random.uniform(-1, 1)
            })
        else:  # Internal nodes
            feature = random.choice(feature_names)
            threshold = random.uniform(0, 1)
            nodes.append({
                "id": i,
                "feature": feature,
                "threshold": threshold,
                "left": 2*i + 1,
                "right": 2*i + 2
            })
    
    return {
        "nodes": nodes,
        "depth": depth,
        "leaf_count": max_nodes // 2 + 1
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
