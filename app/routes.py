#Written by amirul sunesara
#References:
# [1] “Features Correlation Matrix: heatmap made by Domeratskii: plotly,” Features Correlation Matrix | heatmap made by Domeratskii | plotly. [Online]. Available: https://plot.ly/~Domeratskii/13860/features-correlation-matrix/#/.  
# [2] “API,” API - Flask Documentation (1.1.x). [Online]. Available: https://flask.palletsprojects.com/en/1.1.x/api/.
# [3] “sklearn.cluster.KMeans,” scikit. [Online]. Available: https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html.
# [4] “sklearn.preprocessing.MinMaxScaler,” scikit. [Online]. Available: https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html.

from flask import Flask, request, render_template, jsonify
from flask_request_params import bind_request_params
from app import app
import pandas as pd
import json
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
import numpy as np


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Home')

@app.route('/getDataset/<datasetName>')
def getDataset(datasetName):
    df_dataset = pd.read_csv('app/datasets/'+datasetName)
    #select only 3000 rows for assignment 1 processed dataset due to performance issue
    if(datasetName=='dataset1_processed.csv'):
        df_dataset = df_dataset[0:3000]
    lstObj = []
    for i in df_dataset.T.to_dict().values():
        lstObj.append(i)
    return json.dumps(lstObj)

@app.route('/getCorrelationMatrix/<datasetName>/<columnName>/<className>')
def getCorrelationMatrix(datasetName,columnName,className):
    trace = {}
    df_dataset = pd.read_csv('app/datasets/'+datasetName)
    if(datasetName=='winequality-red.csv' or datasetName=='winequality-white.csv'):
        df_dataset=df_dataset.loc[df_dataset[columnName]==int(className)]
    else:
        df_dataset=df_dataset.loc[df_dataset[columnName]==className]
    df_dataset = df_dataset.loc[:, df_dataset.columns != 'quality']
    correlationMatrix = df_dataset.corr()
    #prepare trace object dictionery for plotly
    trace["type"] = "heatmap"
    trace["x"] = list(df_dataset.select_dtypes([np.number]).columns)
    trace["y"] = list(df_dataset.select_dtypes([np.number]).columns)
    trace["z"] = json.loads(correlationMatrix.to_json(orient='values'))
    return jsonify(trace)

@app.route('/clusterize/<datasetName>/<numOfClusters>')
def clusterize(datasetName,numOfClusters):
    df_dataset = pd.read_csv('app/datasets/'+datasetName)
    if(datasetName=='iris.csv'):
        scaler = MinMaxScaler(copy=True, feature_range=(0, 1))
        cols = ['sepal length (cm)','Sepal width (cm)','Petal length (cm)','Petal width (cm)']
        df_dataset[cols] = scaler.fit_transform(df_dataset[cols])
        encoded_data = pd.get_dummies(df_dataset,columns=["Class"],prefix=["Class"])
        kmeans = KMeans(n_clusters=int(numOfClusters))
        k_pred = kmeans.fit_predict(encoded_data)
        return jsonify(k_pred.tolist())
    elif(datasetName=='dataset1_processed.csv'):
        df_dataset = df_dataset[0:3000]
        scaler = MinMaxScaler(copy=True, feature_range=(0, 1))
        cols =  ["age","fnlwgt","education-num","capital-loss","hours-per-week"]
        df_dataset[cols] = scaler.fit_transform(df_dataset[cols])
        encoded_data = pd.get_dummies(df_dataset,columns=["workclass","education","marital-status","occupation","relationship","race","sex","native-country","salary"],prefix=["workclass","education","marital-status","occupation","relationship","race","sex","native-country","salary"])
        kmeans = KMeans(n_clusters=int(numOfClusters))
        k_pred = kmeans.fit_predict(encoded_data)
        return jsonify(k_pred.tolist())
    else:
        scaler = MinMaxScaler(copy=True, feature_range=(0, 1))
        cols = ['fixed acidity','volatile acidity','citric acid','residual sugar','chlorides','free sulfur dioxide','total sulfur dioxide','density','pH','sulphates','alcohol']
        df_dataset[cols] = scaler.fit_transform(df_dataset[cols])
        encoded_data = pd.get_dummies(df_dataset,columns=["quality"],prefix=["quality"])
        kmeans = KMeans(n_clusters=int(numOfClusters))
        k_pred = kmeans.fit_predict(encoded_data)
        return jsonify(k_pred.tolist())
    






