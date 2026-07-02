"""
Pandas Reference: Inspecting data
"""
import pandas as pd

# Let's load the data again
dataset = pd.read_csv('Pandas_Basics/mock_data.csv')

### Topic: Inspecting Data ###
# When you load a real dataset, it might have 100,000 rows. You can't just print it!
# Instead, Pandas gives you 3 amazing tools to inspect it quickly:

# 1. Print dataset.head() 
#    (This shows only the first 5 rows. You can pass a number like head(2) to see just 2 rows).

# 2. Print dataset.info() 
#    (This tells you what columns exist, how many non-null values they have, and their data types).

# 3. Print dataset.describe() 
#    (This instantly calculates the mean, min, max, and percentiles for every numeric column!).

print(dataset.head(2))
print()
print(dataset.info())
print()
print(dataset.describe())