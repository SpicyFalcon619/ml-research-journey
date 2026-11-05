"""
Pandas Reference: Inspecting data
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The first look at any dataset: head, tail, info, describe
#   - How to read the output of info() and describe()
#   - Why print(dataset.info()) prints a stray "None"
#   - Counting categories and checking for missing values
# =============================================================================

import pandas as pd

# Let's load the data again
dataset = pd.read_csv("Pandas_Basics/mock_data.csv")


### Topic 1: Why inspect? ###
# When you load a real dataset, it might have 100,000 rows. You can't just print it!
# Pandas gives you a handful of tools to inspect it quickly. This is always the
# first thing you do with new data, before any cleaning or modelling.


### Topic 2: head and tail ###
# .head() shows only the first 5 rows. Pass a number to choose how many.
# .tail() shows the LAST rows.
print(dataset.head(2))
print()
print(dataset.tail(2))


### Topic 3: info ###
# .info() tells you what columns exist, how many NON-missing values each one
# has, and their data types. It is the fastest way to spot missing data.
dataset.info()

# How to read it:
#   RangeIndex          how many rows there are
#   Non-Null Count      for every column, how many values are NOT missing; if it is
#                       lower than the row count, that column has gaps
#   Dtype               int64 = whole numbers, float64 = decimals, text columns
#                       show as str (or "object" in older pandas versions)

# GOTCHA: info() PRINTS its report itself and returns nothing (None). So
# print(dataset.info()) shows the report and then a useless "None" line.
# Just call dataset.info() on its own.


### Topic 4: describe ###
# .describe() instantly calculates the count, mean, spread (std), min, max and
# quartiles (25%, 50% = the median, 75%) for every NUMERIC column.
print(dataset.describe())

# Look for numbers that seem wrong: an age of 400, or a max far bigger than the
# 75% mark, usually means an error or an outlier.


### Topic 5: More quick checks ###
print(dataset.dtypes)  # the type of each column
print(dataset["city"].unique())  # the distinct values in a column
print(dataset["city"].nunique())  # how many distinct values there are
print(dataset["city"].value_counts())  # how many rows have each value

# Count missing values per column (this file has none, so all zeros):
print(dataset.isna().sum())


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Print the first 3 rows and the last 3 rows of the dataset.
#   2. Use info() and say how many columns hold text and how many hold numbers.
#   3. Use describe() to find the average salary and the oldest age.
#   4. Why is a describe() row called "50%" the same thing as the median?
# =============================================================================
