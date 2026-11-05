"""
Pandas Reference: Intro to pandas
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What pandas is for, and the import:  import pandas as pd
#   - Series: ONE labelled column of values
#   - DataFrame: a whole TABLE made of Series, like a spreadsheet in code
#   - Building a DataFrame from a dictionary (see 5.5 for dictionaries)
#   - The index: the label attached to each row
# =============================================================================

import pandas as pd


### Topic 1: What is pandas? ###
# NumPy (see NumPy_Basics) is great for grids of numbers, but real data looks
# like a spreadsheet: names, prices, dates, yes/no flags, all in different
# columns. pandas is the library for that kind of table data. Almost every ML
# project starts by loading a table with pandas and cleaning it up.
#
# It gives you two building blocks:
#   Series      one column  (a labelled list of values)
#   DataFrame   a table     (several columns that share the same row labels)


### Topic 2: Series ###
# A Series is like a list where every item also has a LABEL, called the index.
# By default the labels are 0, 1, 2, ... (just like list positions).
fruits = pd.Series(["Apple", "Banana", "Cherry"])
print(fruits)
# Read the output: the left column is the INDEX, the right column the VALUES,
# and the line at the bottom shows the dtype (the type of the values, as in NumPy).

print(fruits[1])  # Banana: look a value up by its label
print(len(fruits))  # 3

# You can choose your own labels:
prices = pd.Series([1.2, 0.5, 3.0], index=["apple", "banana", "cherry"])
print(prices["banana"])  # 0.5: look up by label instead of position
print(prices * 2)  # maths works on the whole Series, like a NumPy array


### Topic 3: DataFrame from a dictionary ###
# The easiest way to make a table: a dictionary where each KEY is a column name
# and each VALUE is a list holding that column's data. All the lists must be the
# same length.
car_data = {
    "Brand": ["Toyota", "Ford", "Tesla"],
    "Price": [25000, 30000, 50000],
    "Electric": [False, False, True],
}

cars = pd.DataFrame(car_data)
print(cars)
# Notice how nicely it formats the table. The numbers on the far left are the
# row INDEX (0, 1, 2), the headings are the column names.

# Each column can have its own dtype, which a NumPy array can't do:
print(cars.dtypes)


### Topic 4: Looking at the parts ###
print(cars.shape)  # (3, 3): 3 rows and 3 columns, just like NumPy
print(cars.columns)  # the column names
print(cars.index)  # the row labels

# Pulling one column out gives you a Series:
print(cars["Brand"])
print(type(cars["Brand"]))

# So a DataFrame really is a dictionary-like collection of Series that share
# one index. (Selecting data in detail: 4_selecting_data.)


### Topic 5: Changing the index ###
# Some people prefer the rows numbered from 1:
numbered = cars.copy()  # work on a copy so `cars` stays as it was
numbered.index = numbered.index + 1
print(numbered)

# Or label the rows with a column:
print(cars.set_index("Brand"))


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Create a Series called fruits from ["Apple", "Banana", "Cherry"] and print
#      it.
#   2. Convert the car_data dictionary into a DataFrame called cars. Print it.
#   3. Make a DataFrame of three of your friends with columns Name, Age, City.
#      Then print its shape.
#   4. What error do you get if one list in the dictionary is shorter than the
#      others? Try it.
# =============================================================================
