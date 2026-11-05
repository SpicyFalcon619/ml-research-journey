"""
Pandas Reference: Data Transformation and Encoding
"""
import pandas as pd

# In Machine Learning, models cannot understand text. They only understand math.
# We often need to "encode" text into numbers, or map specific values to new values.

data = pd.DataFrame({
    "Passenger": ["Alice", "Bob", "Charlie", "Diana"],
    "Sex": ["female", "male", "male", "female"],
    "Ticket_Class": ["First", "Third", "Second", "Third"]
})

print("--- Original Data ---")
print(data)
print("\n")

### Topic 1: The .map() Function ###
# The .map() function takes a dictionary. It looks at every single row in the column,
# and if it finds a dictionary key, it replaces it with the dictionary value.

# Let's map "female" to 1 and "male" to 0 so a Machine Learning model can read it!
data["Sex_Encoded"] = data["Sex"].map({"female": 1, "male": 0})

print("--- Data After Mapping Sex to 1s and 0s ---")
print(data)
print("\n")

### Topic 2: Mapping Multiple Values ###
# We can do the same thing for Ticket_Class to turn them into numeric rankings!
data["Class_Number"] = data["Ticket_Class"].map({
    "First": 1,
    "Second": 2,
    "Third": 3
})

print("--- Data After Mapping Classes to Numbers ---")
print(data)
