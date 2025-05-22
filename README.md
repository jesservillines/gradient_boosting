# Gradient Boosting Visualization

An interactive application for understanding and visualizing gradient boosting algorithms (XGBoost, LightGBM, and CatBoost).

## Overview

This application provides in-depth explanations and interactive visualizations of how gradient boosting algorithms work. It allows users to:

- Learn about the mathematical foundations of gradient boosting algorithms
- Visualize the training process and tree construction 
- Experiment with hyperparameters and see their effects in real time
- Compare the performance and behavior of XGBoost, LightGBM, and CatBoost

## Features

- **Educational Content**: Detailed explanations of gradient boosting fundamentals
- **Interactive Visualizations**: Dynamic visualizations showing algorithm mechanics
- **Hyperparameter Playground**: Tools to experiment with parameter changes
- **Algorithm Comparison**: Side-by-side comparison of the three algorithms
- **Prediction Explainer**: Tools to understand how models make predictions

## Tech Stack

- **Frontend**: React.js with D3.js/Plotly for visualizations
- **Backend**: Python FastAPI
- **ML Libraries**: scikit-learn, XGBoost, LightGBM, and CatBoost

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   python main.py
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/frontend` - React application code
- `/backend` - FastAPI server code
- `/docs` - Documentation and tutorials
- `/data` - Sample datasets for demonstrations
