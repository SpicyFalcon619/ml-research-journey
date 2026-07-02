"""
Pandas Reference: Selecting and filtering data
"""
import pandas as pd

# Let's load the data
dataset = pd.read_csv('Pandas_Basics/mock_data.csv')

### Topic: Selecting Data (Columns) ###
# Getting a single column (returns a Series)
names = dataset['name']

# Getting multiple columns (returns a smaller DataFrame)
# Notice the double brackets! You are passing a list of column names.
name_and_age = dataset[['name', 'age']]

### Topic: Selecting Data (Rows & Columns using .loc) ###
# The .loc accessor allows you to select by labels: dataset.loc[row_label, column_label]

# 1. Use .loc to get the 'city' of the person at row index 2. Variable: 'person_2_city'
# 2. Print 'person_2_city'

### Topic: Filtering Data (Boolean Masking!) ###
# Just like NumPy, we can filter our data using conditions!
# For example: dataset[dataset['age'] > 30]

# 3. Create a new DataFrame called 'high_salary' that only contains people 
#    who make more than 85000.
# 4. Print 'high_salary'. Notice how the index numbers are preserved!

person_2_city = dataset.loc[2, 'city']
print(person_2_city)

high_salary = pd.DataFrame(dataset[dataset['salary'] > 85000])
print(high_salary)