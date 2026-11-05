"""
Pandas Reference: Data Transformation and Encoding
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Why models need text turned into numbers (encoding)
#   - .map(): replace values using a dictionary
#   - Creating new columns from old ones
#   - .apply(): run your own function on a column
#   - One-hot encoding with get_dummies, for categories with no natural order
# =============================================================================

import pandas as pd


### Topic 1: Why transform? ###
# In Machine Learning, models cannot understand text. They only understand math.
# So we often need to "encode" text into numbers, or map specific values to new
# values. This lesson uses a tiny Titanic-style passenger table.

data = pd.DataFrame(
    {
        "Passenger": ["Alice", "Bob", "Charlie", "Diana"],
        "Sex": ["female", "male", "male", "female"],
        "Ticket_Class": ["First", "Third", "Second", "Third"],
        "Fare": [80.0, 7.5, 21.0, 8.1],
    }
)

print("--- Original Data ---")
print(data)
print("\n")


### Topic 2: The .map() function ###
# The .map() function takes a dictionary. It looks at every single row in the column,
# and if it finds a dictionary key, it replaces it with the dictionary value.

# Let's map "female" to 1 and "male" to 0 so a Machine Learning model can read it!
# We store the result in a NEW column, which keeps the original text column too.
data["Sex_Encoded"] = data["Sex"].map({"female": 1, "male": 0})

print("--- Data After Mapping Sex to 1s and 0s ---")
print(data)
print("\n")

# A value that is NOT in the dictionary becomes NaN (missing), so make sure the
# dictionary covers every possible value.


### Topic 3: Mapping multiple values ###
# We can do the same thing for Ticket_Class to turn it into a numeric ranking.
# This works because the classes have a natural ORDER (First < Second < Third).
data["Class_Number"] = data["Ticket_Class"].map(
    {
        "First": 1,
        "Second": 2,
        "Third": 3,
    }
)

print("--- Data After Mapping Classes to Numbers ---")
print(data)
print("\n")


### Topic 4: New columns from old ones ###
# Maths on columns works on the whole column at once (just like NumPy):
data["Fare_Doubled"] = data["Fare"] * 2
data["Is_Cheap"] = data["Fare"] < 10  # a True/False column
print(data[["Passenger", "Fare", "Fare_Doubled", "Is_Cheap"]])
print()

# .apply() runs a function on every item in a column. Use it when no ready-made
# method exists. (lambda is a small nameless function, see 4.9.6.)
data["Name_Length"] = data["Passenger"].apply(lambda name: len(name))
print(data[["Passenger", "Name_Length"]])
print()

# Text columns have a .str toolbox with string methods (see 3.1.2):
print(data["Passenger"].str.upper())


### Topic 5: One-hot encoding ###
# Mapping to 1, 2, 3 would be WRONG for a category with no order, like a city:
# a model would think Chicago (3) is "bigger than" Austin (1). Instead, give each
# value its own yes/no column. That is ONE-HOT encoding, and get_dummies does it:
cities = pd.DataFrame({"City": ["Austin", "Chicago", "Austin", "Boston"]})
encoded = pd.get_dummies(cities, columns=["City"], dtype=int)
print(encoded)
# Each row has a 1 in exactly one City column: "hot" for that city.
# (Check your own category: ordered -> map to numbers, unordered -> one-hot.)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Add a column Embarked_Code by mapping {"S": 0, "C": 1, "Q": 2} onto the
#      column ["S", "C", "S", "Q"]. What happens if the column contains "X"?
#   2. Add a column Fare_Rounded that rounds the Fare to the nearest whole number
#      (hint: data["Fare"].round()).
#   3. One-hot encode the Ticket_Class column of the passenger table. Would you
#      rather map it or one-hot it? Why?
#   4. Make an Age_Group column ("child" under 18, otherwise "adult") using apply.
# =============================================================================
