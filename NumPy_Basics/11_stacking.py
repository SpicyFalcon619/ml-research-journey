"""
NumPy Reference: Stacking
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Joining arrays: concatenate, vstack, hstack
#   - Which direction is which (vertical = on top, horizontal = side by side)
#   - The shape rules, and the one-type rule again
# =============================================================================

import numpy as np


### Topic 1: Joining 1D arrays ###
# Stacking means joining arrays into a bigger one. The functions take the arrays
# inside a TUPLE (note the double brackets), not as separate arguments.
class_a = np.array([85, 90, 88])
class_b = np.array([78, 82, 80])

# np.concatenate glues them end to end into one longer 1D array.
all_scores = np.concatenate((class_a, class_b))
print(all_scores)  # [85 90 88 78 82 80]


### Topic 2: vstack, on top of each other ###
# np.vstack ("vertical stack") puts the arrays on top of each other as ROWS.
# Two 1D arrays of length 3 become a 2 x 3 table.
score_matrix = np.vstack((class_a, class_b))
print(score_matrix)
print(score_matrix.shape)  # (2, 3)


### Topic 3: hstack, side by side ###
# np.hstack ("horizontal stack") puts the arrays side by side.
# For plain 1D arrays that is the same as concatenate:
horizontal_scores = np.hstack((class_a, class_b))
print(horizontal_scores)

# With 2D tables it adds extra COLUMNS to each row:
table1 = np.array([[1, 2], [3, 4]])
table2 = np.array([[10, 20], [30, 40]])
print(np.hstack((table1, table2)))
# [[ 1  2 10 20]
#  [ 3  4 30 40]]
print(np.vstack((table1, table2)))  # four rows instead
# ML use: adding a new feature column to a dataset with hstack.


### Topic 4: The shapes must fit ###
# To put arrays side by side they need the same number of ROWS;
# to stack them on top they need the same number of COLUMNS.
try:
    np.vstack((np.array([1, 2, 3]), np.array([1, 2])))
except ValueError as error:
    print("ValueError:", error)


### Topic 5: Remember the one-type rule ###
# Stacking text with numbers turns EVERYTHING into text (see 2_creating_arrays):
names = np.array([["John", "Felipe", "Michael"], ["Russel", "Jim", "Andrew"]])
numbers = np.array([[1, 2, 3], [4, 5, 6]])

mixed = np.hstack((names, numbers))
print(mixed)
print(mixed.dtype)  # a string type: the numbers are now text too, "1", "2", ...
# That is why datasets with names and numbers go in Pandas, which allows a
# different type for each column (see Pandas_Basics).


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   class_a = np.array([85, 90, 88])    class_b = np.array([78, 82, 80])
#   1. Combine them into one long 1D array called all_scores with
#      np.concatenate(). (Hint: pass them as a tuple inside the function!)
#   2. Stack them vertically into a 2D array called score_matrix, with class A as
#      the first row, using np.vstack().
#   3. Stack them horizontally using np.hstack(), called horizontal_scores.
#      Compare how this looks to your answer in #1!
#   4. Add a column of ones to the front of table1 above (hint: np.ones((2, 1))).
# =============================================================================
