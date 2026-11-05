"""
Pandas Reference: Selecting and filtering data
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Picking one column (a Series) or several columns (a DataFrame)
#   - .loc (select by LABEL) and .iloc (select by POSITION)
#   - Filtering rows with a condition (boolean masking, like NumPy)
#   - Combining conditions, and sorting
# =============================================================================

import pandas as pd

# Let's load the data
dataset = pd.read_csv("Pandas_Basics/mock_data.csv")
print(dataset)


### Topic 1: Selecting columns ###
# One column: put its name in square brackets. You get back a Series.
names = dataset["name"]
print(names)

# Several columns: give a LIST of names. Notice the double brackets! The inner
# brackets make the list, and the outer ones do the selecting. You get back a
# smaller DataFrame.
name_and_age = dataset[["name", "age"]]
print(name_and_age)


### Topic 2: Selecting rows with .loc (by label) ###
# The .loc accessor selects by LABELS: dataset.loc[row_label, column_label]
# Square brackets, not round ones. Here the row labels are 0, 1, 2, ...
print(dataset.loc[2])  # the whole row labelled 2 (a Series)
print(dataset.loc[2, "city"])  # one cell: row 2, column "city"
print(dataset.loc[1:3, ["name", "salary"]])  # rows 1 TO 3 (inclusive!), two columns
print(dataset.loc[:, "age"].tolist())  # a colon means "all rows"


### Topic 3: Selecting by position with .iloc ###
# .iloc ("integer location") selects by POSITION, counting from 0, exactly like
# NumPy and lists. The stop is NOT included.
print(dataset.iloc[0])  # the first row
print(dataset.iloc[0:2, 1:3])  # rows 0-1 and columns 1-2 (stop excluded)

# .loc vs .iloc:
#   .loc[1:3]   includes row 3, because labels, not positions, are used
#   .iloc[1:3]  stops before position 3, like a normal slice
# They look the same while the index is 0, 1, 2... but they differ as soon as the
# index changes (after filtering, for example).


### Topic 4: Filtering rows (boolean masking!) ###
# Just like NumPy (see 10_boolean_masking), a condition on a column gives
# True/False for every row, and putting that inside the brackets keeps only the
# True rows.
print(dataset["age"] > 30)  # the mask: one True/False per row

older = dataset[dataset["age"] > 30]
print(older)

high_salary = dataset[dataset["salary"] > 85000]
print(high_salary)
# Notice how the index numbers are preserved: the surviving rows keep their
# original labels. Use .reset_index(drop=True) if you want 0, 1, 2... again.
print(high_salary.reset_index(drop=True))


### Topic 5: Combining conditions ###
# Use & (and), | (or), ~ (not), with each condition in BRACKETS (as in NumPy).
print(dataset[(dataset["age"] < 30) & (dataset["salary"] > 80000)])
print(dataset[(dataset["city"] == "Chicago") | (dataset["city"] == "Austin")])

# isin checks "is it one of these?" and is tidier than many | signs:
print(dataset[dataset["city"].isin(["Chicago", "Austin"])])


### Topic 6: Sorting ###
print(dataset.sort_values("salary"))  # smallest first
print(dataset.sort_values("salary", ascending=False))  # biggest first
print(dataset.sort_values("salary", ascending=False).head(2))  # the top 2


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Use .loc to get the city of the person at row index 2. Store it in
#      person_2_city and print it.
#   2. Create a DataFrame called high_salary containing only people who make
#      more than 85000. Print it. Notice how the index numbers are preserved!
#   3. Select only the name and city columns of people younger than 30.
#   4. Who is the second-oldest person? (Sort, then use .iloc.)
# =============================================================================
