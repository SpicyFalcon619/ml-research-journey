"""
Pandas Reference: Loading data
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Reading a CSV file into a DataFrame with pd.read_csv()
#   - What a file path is, and why "file not found" is so common
#   - Checking what you loaded: shape, columns, index
#   - A few useful read_csv options
#
# Run this from the ROOT folder of the project. The file path below starts
# from there. (In the Field Guide, the CSV is shown as a lesson: "Mock Data".)
# =============================================================================

import pandas as pd


### Topic 1: What is a CSV? ###
# CSV means "comma-separated values": a plain text file where each line is a
# row and commas separate the columns. The first line holds the column names.
# Spreadsheets and databases export to it, and most datasets you download
# (Kaggle, for example) are CSVs. mock_data.csv starts like this:
#
#   id,name,age,city,salary
#   1,Alice,28,New York,85000
#   2,Bob,34,San Francisco,120000


### Topic 2: read_csv ###
# pd.read_csv(path) reads the whole file and returns a DataFrame.
dataset = pd.read_csv("Pandas_Basics/mock_data.csv")

# Print it to see what the raw data looks like. With a small file you see it all:
print(dataset)


### Topic 3: Shape and parts ###
# DataFrames have a great trick to quickly get the shape of the data,
# just like NumPy: .shape is (rows, columns). It has no brackets (see 6_array_attributes).
print(dataset.shape)

print(list(dataset.columns))  # the column names, as a plain list
print(len(dataset))  # the number of rows


### Topic 4: File paths ###
# The text "Pandas_Basics/mock_data.csv" is a RELATIVE path: it says where the
# file is, starting from the folder you ran Python in (the "working directory").
# If you run from a different folder, Python cannot find it and raises
# FileNotFoundError. Here is what that looks like:
try:
    pd.read_csv("this_file_does_not_exist.csv")
except FileNotFoundError as error:
    print("FileNotFoundError:", error)

# Fixes: run from the project root, or give the full path, e.g.
#   pd.read_csv("C:/Users/you/data/mock_data.csv")


### Topic 5: Useful options ###
# read_csv has many options. The ones you will meet first:
print(pd.read_csv("Pandas_Basics/mock_data.csv", nrows=2))  # only the first 2 rows
print(pd.read_csv("Pandas_Basics/mock_data.csv", usecols=["name", "age"]))  # only these columns
print(pd.read_csv("Pandas_Basics/mock_data.csv", index_col="id"))  # use a column as the index
#   sep=";"   for files that use another separator
# And the opposite direction: dataset.to_csv("out.csv", index=False) saves a table.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Use pd.read_csv() to load mock_data.csv into a DataFrame called dataset.
#   2. Print dataset to see the raw data.
#   3. Print dataset.shape. How many rows and columns are there?
#   4. Load only the columns "name" and "salary".
#   5. Download any small CSV from Kaggle and load it. What does its shape say?
# =============================================================================
