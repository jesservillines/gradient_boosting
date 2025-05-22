import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Documentation = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Documentation
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Learn how to use this application and understand gradient boosting algorithms.
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab value="overview" label="Overview" />
          <Tab value="tutorials" label="Tutorials" />
          <Tab value="algorithms" label="Algorithm Details" />
          <Tab value="api" label="API Reference" />
        </Tabs>
      </Paper>
      
      {/* Overview Tab */}
      {currentTab === 'overview' && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              About This Application
            </Typography>
            <Typography variant="body1" paragraph>
              This application provides interactive visualizations and explanations of gradient boosting algorithms,
              including XGBoost, LightGBM, and CatBoost. It helps you understand how these algorithms work,
              the differences between them, and how to optimize their performance through hyperparameter tuning.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Key Features
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Algorithm Explorer" 
                  secondary="Detailed explanations of XGBoost, LightGBM, and CatBoost algorithms, including their mathematical foundations and key characteristics."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Visualization Playground" 
                  secondary="Interactive visualizations showing how gradient boosting works, including tree construction, residual fitting, and loss optimization."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Hyperparameter Tuning" 
                  secondary="Experiment with different hyperparameters and see how they affect model performance in real-time."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Algorithm Comparison" 
                  secondary="Side-by-side comparison of the three gradient boosting implementations across various aspects like accuracy, speed, and feature handling."
                />
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Getting Started
            </Typography>
            <Typography variant="body1" paragraph>
              Follow these steps to start exploring gradient boosting with our application:
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Step 1: Explore the Algorithms
            </Typography>
            <Typography variant="body1" paragraph>
              Begin by visiting the <strong>Algorithm Explorer</strong> section to learn about the fundamentals of XGBoost, LightGBM, and CatBoost.
              This will provide you with the theoretical background needed to understand the visualizations.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Step 2: See Boosting in Action
            </Typography>
            <Typography variant="body1" paragraph>
              Next, head to the <strong>Visualization Playground</strong> to see how gradient boosting works step by step.
              You can watch how trees are added sequentially to the ensemble and how errors are corrected through the boosting process.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Step 3: Experiment with Hyperparameters
            </Typography>
            <Typography variant="body1" paragraph>
              Use the <strong>Hyperparameter Tuning</strong> section to see how different parameter settings affect model performance.
              This will help you build intuition about which parameters matter most and how to optimize them for your own models.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Step 4: Compare Algorithms
            </Typography>
            <Typography variant="body1" paragraph>
              Finally, use the <strong>Algorithm Comparison</strong> tool to understand the trade-offs between XGBoost, LightGBM, and CatBoost.
              This will help you select the most appropriate algorithm for your specific needs.
            </Typography>
          </Paper>
        </Box>
      )}
      
      {/* Tutorials Tab */}
      {currentTab === 'tutorials' && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Interactive Tutorials
            </Typography>
            <Typography variant="body1" paragraph>
              Follow these step-by-step tutorials to learn about gradient boosting algorithms:
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Understanding the Boosting Process</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  This tutorial explains how gradient boosting works using a simple example:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="1. Navigate to the Visualization Playground" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="2. Select 'XGBoost' as the algorithm and 'simulated' as the dataset" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Set the boosting mode to 'Sequential'" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="4. Use the animation controls to step through the boosting process" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="5. Observe how each tree corrects the errors of the previous trees" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Hyperparameter Tuning Guide</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  Learn how to tune hyperparameters for optimal model performance:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="1. Go to the Hyperparameter Tuning section" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="2. Select your algorithm of choice" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Experiment with learning rate and tree depth first" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="4. Use the 'Compare' feature to see the impact of your changes" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="5. Observe the effect on both training and validation metrics" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Comparing the Algorithms</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  Understand the key differences between XGBoost, LightGBM, and CatBoost:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="1. Navigate to the Algorithm Comparison section" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="2. Select a dataset and comparison aspect (e.g., accuracy, speed)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Run the comparison to see the results" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="4. Explore different aspects to understand trade-offs" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="5. Check algorithm feature cards for a summary of strengths and weaknesses" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Box>
      )}
      
      {/* Algorithm Details Tab */}
      {currentTab === 'algorithms' && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Gradient Boosting Fundamentals
            </Typography>
            <Typography variant="body1" paragraph>
              Gradient boosting is an ensemble machine learning technique that combines the predictions of multiple weak learners (typically decision trees) to create a powerful predictive model. The key idea is to build models sequentially, with each new model correcting the errors of the previous ensemble.
            </Typography>
            
            <Typography variant="body1" paragraph>
              The general algorithm works as follows:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText primary="1. Initialize the model with a constant value (usually the average of the target variable)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. For each iteration t = 1 to T:" />
                <List sx={{ pl: 4 }}>
                  <ListItem>
                    <ListItemText primary="a. Calculate the negative gradient of the loss function with respect to the current predictions (these are the residuals)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="b. Fit a new decision tree to predict these residuals" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="c. Update the model by adding this new tree, scaled by a learning rate" />
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Return the final model, which is the sum of all trees" />
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Algorithm Comparison
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">XGBoost</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  <strong>Key Innovations:</strong>
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Second-order approximation" 
                      secondary="Uses both first and second derivatives of the loss function for more accurate split finding"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Regularized objective" 
                      secondary="Built-in L1 and L2 regularization to prevent overfitting"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Sparsity awareness" 
                      secondary="Efficiently handles missing values and sparse features"
                    />
                  </ListItem>
                </List>
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  <strong>When to Use:</strong> XGBoost is a good all-around choice with balanced performance across various datasets. It's particularly good when you need robust regularization and have missing values in your data.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">LightGBM</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  <strong>Key Innovations:</strong>
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Histogram-based algorithm" 
                      secondary="Bins continuous features into discrete bins for faster training"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Leaf-wise tree growth" 
                      secondary="Grows trees by choosing the leaf with maximum delta loss instead of level-wise growth"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="GOSS & EFB" 
                      secondary="Gradient-based One-Side Sampling and Exclusive Feature Bundling for handling large datasets and high-dimensional features"
                    />
                  </ListItem>
                </List>
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  <strong>When to Use:</strong> LightGBM excels with very large datasets where training speed is critical. It's also memory-efficient and works well for high-dimensional data.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">CatBoost</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  <strong>Key Innovations:</strong>
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Ordered boosting" 
                      secondary="Uses a permutation-driven approach to prevent prediction shift and target leakage"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Automatic categorical feature handling" 
                      secondary="Uses ordered target statistics with Bayesian smoothing to process categorical features effectively"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Symmetric trees" 
                      secondary="Uses oblivious decision trees where all nodes at the same level use the same feature for splitting"
                    />
                  </ListItem>
                </List>
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  <strong>When to Use:</strong> CatBoost is ideal for datasets with many categorical features. It also requires less hyperparameter tuning and is less prone to overfitting, making it good for smaller datasets or when robust out-of-box performance is needed.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Box>
      )}
      
      {/* API Reference Tab */}
      {currentTab === 'api' && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Backend API Reference
            </Typography>
            <Typography variant="body1" paragraph>
              This application provides a RESTful API for training and evaluating gradient boosting models.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              GET /datasets
            </Typography>
            <Typography variant="body1" paragraph>
              Returns a list of available datasets for training and testing models.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Response:
            </Typography>
            <Box component="pre" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
              {`{
  "datasets": ["breast_cancer", "iris", "wine", "diabetes", "housing"],
  "details": {
    "breast_cancer": {
      "shape": [569, 31],
      "columns": ["feature1", "feature2", ..., "target"]
    },
    ...
  }
}`}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              GET /datasets/{'{dataset_name}'}
            </Typography>
            <Typography variant="body1" paragraph>
              Returns detailed information about a specific dataset, including a preview of its data.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              POST /train
            </Typography>
            <Typography variant="body1" paragraph>
              Trains a gradient boosting model with the specified parameters.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Request Body:
            </Typography>
            <Box component="pre" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
              {`{
  "algorithm": "xgboost",  // or "lightgbm", "catboost"
  "params": {
    "learning_rate": 0.1,
    "max_depth": 6,
    "n_estimators": 100,
    ...
  },
  "dataset_name": "breast_cancer",
  "target_column": "target",
  "categorical_features": ["feature1", "feature2"],
  "test_size": 0.2,
  "random_state": 42,
  "task_type": "classification"  // or "regression"
}`}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              POST /visualize-tree
            </Typography>
            <Typography variant="body1" paragraph>
              Returns the structure of a specific tree in the trained model for visualization.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Request Body:
            </Typography>
            <Box component="pre" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
              {`{
  "model_id": "xgboost_1",
  "algorithm": "xgboost",
  "tree_index": 0
}`}
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              External Resources
            </Typography>
            <Typography variant="body1" paragraph>
              For more detailed information about the gradient boosting algorithms, refer to the following resources:
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              XGBoost
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary={<Link href="https://xgboost.readthedocs.io/" target="_blank" rel="noopener">XGBoost Documentation</Link>}
                  secondary="Official documentation with API reference and tutorials"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary={<Link href="https://arxiv.org/abs/1603.02754" target="_blank" rel="noopener">XGBoost Paper</Link>}
                  secondary="Original research paper: 'XGBoost: A Scalable Tree Boosting System'"
                />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              LightGBM
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary={<Link href="https://lightgbm.readthedocs.io/" target="_blank" rel="noopener">LightGBM Documentation</Link>}
                  secondary="Official documentation with API reference and tutorials"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary={<Link href="https://papers.nips.cc/paper/6907-lightgbm-a-highly-efficient-gradient-boosting-decision-tree" target="_blank" rel="noopener">LightGBM Paper</Link>}
                  secondary="Original research paper: 'LightGBM: A Highly Efficient Gradient Boosting Decision Tree'"
                />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              CatBoost
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary={<Link href="https://catboost.ai/docs/" target="_blank" rel="noopener">CatBoost Documentation</Link>}
                  secondary="Official documentation with API reference and tutorials"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary={<Link href="https://arxiv.org/abs/1706.09516" target="_blank" rel="noopener">CatBoost Paper</Link>}
                  secondary="Original research paper: 'CatBoost: unbiased boosting with categorical features'"
                />
              </ListItem>
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Documentation;
