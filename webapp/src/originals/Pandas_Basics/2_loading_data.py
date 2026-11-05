"""
Pandas Reference: Loading data
"""
import pandas as pd

### Topic: Loading Data ###
# 1. Use pd.read_csv() to load 'mock_data.csv' into a DataFrame called 'dataset'
# 2. Print 'dataset' to see what the raw data looks like!
# 
# 3. DataFrames have a great trick to quickly get the shape of the data, 
#    just like NumPy! Print dataset.shape

dataset = pd.read_csv('Pandas_Basics/mock_data.csv')
print(dataset)
print(dataset.shape)