"""
Pandas Reference: Handling missing data
"""
import pandas as pd
import numpy as np

# A messy real-world dataset with missing values (represented as np.nan or None)
messy_data = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie", "Diana", "Ethan"],
    "Age": [28, np.nan, 22, 29, 41],
    "Salary": [85000, 120000, np.nan, 90000, 110000],
    "City": ["New York", "San Francisco", "Chicago", None, "New York"]
})

print("--- Original Messy Data ---")
print(messy_data)
print("\n")

### Topic: Handling Missing Data ###
# Machine Learning models hate missing data. They will crash if you feed them NaNs.
# You have two choices: Drop the rows, or Fill the holes.

# 1. Use dropna() to create a DataFrame called 'clean_data' that drops ANY row with a missing value.
# 2. Print 'clean_data'.

# 3. Use fillna() to create a DataFrame called 'filled_data' that replaces all missing values with 0.
# 4. Print 'filled_data'.

clean_data = messy_data.dropna()
print(clean_data)

filled_data = messy_data.fillna(0)
print(filled_data)

print()

messy_data["City"] = messy_data['City'].fillna('Unknown')
print(messy_data)