"""
Pandas Reference: Handling missing data
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - How missing values appear (NaN) and how to find them
#   - Dropping rows with dropna()
#   - Filling the holes with fillna(): a fixed value, or the column average
#   - Why ML cares, and the "fill with the TRAIN average" rule
# =============================================================================

import numpy as np
import pandas as pd


### Topic 1: What does missing data look like? ###
# Real datasets are messy: people skip a form field, a sensor fails. Pandas shows
# a missing value as NaN ("Not a Number"), or None in a text column. You create
# one with np.nan.
messy_data = pd.DataFrame(
    {
        "Name": ["Alice", "Bob", "Charlie", "Diana", "Ethan"],
        "Age": [28, np.nan, 22, 29, 41],
        "Salary": [85000, 120000, np.nan, 90000, 110000],
        "City": ["New York", "San Francisco", "Chicago", None, "New York"],
    }
)

print("--- Original Messy Data ---")
print(messy_data)
print("\n")

# Machine Learning models hate missing data. Most will crash if you feed them
# NaNs. You have two choices: DROP the rows, or FILL the holes.


### Topic 2: Finding missing values ###
print(messy_data.isna())  # True where a value is missing
print(messy_data.isna().sum())  # how many missing in each column
print(messy_data.isna().sum().sum())  # the total number of missing values
# (True counts as 1, so summing a True/False table counts the Trues, as in NumPy.)


### Topic 3: Option 1, drop ###
# dropna() throws away every row that has ANY missing value.
clean_data = messy_data.dropna()
print(clean_data)  # only Alice and Ethan survive: 3 of 5 rows are lost!

# Gentler versions:
print(messy_data.dropna(subset=["Age"]))  # only care about the Age column
print(messy_data.dropna(how="all"))  # drop only rows where EVERYTHING is missing

# Important: dropna() does NOT change messy_data. It RETURNS a new DataFrame.
# Most pandas methods work this way. Store the result if you want to keep it.
print(messy_data.shape, "->", clean_data.shape)


### Topic 4: Option 2, fill with a fixed value ###
# fillna(value) replaces every missing value with the value you give.
filled_data = messy_data.fillna(0)
print(filled_data)
# Filling a text column with 0 is odd, though. Fill each column with something
# that makes sense: pass a dictionary of column: value.
filled_by_column = messy_data.fillna({"City": "Unknown", "Age": 0, "Salary": 0})
print(filled_by_column)


### Topic 5: Smart filling (mean / median) ###
# Instead of filling with a hardcoded number like 0, it's usually better in
# Machine Learning to fill missing numbers with the average (mean) of that
# column. Filling an age with 0 would drag every statistic down, but the mean
# keeps the column's overall shape. (The median is safer when there are outliers.)

# Let's fill the missing Age with the average age, and the missing Salary with
# the average salary. .mean() ignores the NaNs when it works the average out.
smart_filled_data = messy_data.copy()  # a copy, so messy_data stays messy

smart_filled_data["Age"] = smart_filled_data["Age"].fillna(smart_filled_data["Age"].mean())
smart_filled_data["Salary"] = smart_filled_data["Salary"].fillna(smart_filled_data["Salary"].mean())
smart_filled_data["City"] = smart_filled_data["City"].fillna("Unknown")

print("--- Data Filled with Column Averages ---")
print(smart_filled_data)


### Topic 6: The leakage rule (for later) ###
# When you build a model you split the data into train and test sets. Work out the
# fill value (the mean) from the TRAIN set only, and use that same number to fill
# the test set too. Using the whole dataset's mean leaks information from the
# test set into your training ("data leakage").


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Use dropna() to make a DataFrame called clean_data without any row that
#      has a missing value. Print it.
#   2. Use fillna() to make filled_data, replacing all missing values with 0.
#   3. Fill the missing Age values with the MEDIAN age instead of the mean.
#   4. Count the missing values in each column, then decide: would you drop or
#      fill each one? Why?
# =============================================================================
