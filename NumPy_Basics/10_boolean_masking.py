"""
NumPy Reference: Boolean masking
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a boolean mask is (an array of True/False)
#   - Filtering an array by a condition in one line
#   - Combining conditions with & | ~ (and why and / or don't work)
#   - Counting matches, and replacing values by condition
#   - np.where: an if/else for whole arrays
# =============================================================================

import numpy as np


### Topic 1: A mask is a True/False array ###
# Comparing an array to a number checks EVERY item and gives back an array of
# True/False, called a boolean mask.
arr = np.array([10, 25, 5, 40, 15])

mask = arr > 15
print(mask)  # [False  True False  True False]


### Topic 2: Filtering with a mask ###
# Put the mask inside the square brackets. NumPy keeps only the items where
# the mask is True.
print(arr[mask])  # [25 40]

# You rarely need to store the mask. Write the condition right inside:
print(arr[arr > 15])


### Topic 3: Combining conditions ###
# Use & for AND, | for OR, ~ for NOT. WRAP EACH CONDITION IN BRACKETS,
# because & and | bind tighter than > and <.
print(arr[(arr > 10) & (arr < 30)])  # between 10 and 30: [25 15]
print(arr[(arr < 10) | (arr > 30)])  # [ 5 40]
print(arr[~(arr > 15)])  # NOT greater than 15: [10  5 15]

# The Python words and / or do NOT work on arrays. NumPy can't decide whether a
# whole array is "True", so it raises an error:
try:
    print(arr[(arr > 10) and (arr < 30)])
except ValueError as error:
    print("ValueError:", error)


### Topic 4: Counting matches ###
# True counts as 1 and False as 0, so adding up a mask counts the Trues.
temps = np.array([22, 35, 18, 40, 28, 15, 33, 26, 41, 19])

print(np.sum(temps > 30))  # number of days above 30
print(np.mean(temps > 30))  # the FRACTION of days above 30
# This is how you compute accuracy in ML: np.mean(predictions == labels)


### Topic 5: Changing values by condition ###
# Put the mask on the left of = to overwrite only the matching items.
values = np.array([-2, 5, -1, 8])
values[values < 0] = 0  # any negative becomes 0
print(values)  # [0 5 0 8]  (this is exactly the ReLU activation in neural nets!)

# np.where(condition, if_true, if_false) builds a NEW array item by item:
print(np.where(temps > 30, "hot", "ok"))


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   temps = np.array([22, 35, 18, 40, 28, 15, 33, 26, 41, 19])  (10 days, Celsius)
#   1. Create a boolean mask called hot_mask for days where temp > 30. Print the
#      mask itself.
#   2. Use that mask to print only the hot temperatures.
#   3. In ONE line (no separate mask variable), print temperatures below 20.
#   4. Count how many days were above 30 degrees. Hint: np.sum() on a boolean
#      array counts the Trues.
#   5. Print the temperatures between 20 and 30.
# =============================================================================
