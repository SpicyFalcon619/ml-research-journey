"""
NumPy Reference: Indexing
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Picking items from a 1D array by position, and slicing out a range
#   - The 2D form  array[row, column]  and the colon : for "everything"
#   - Fancy indexing: picking several positions at once
#   - The most important gotcha: slices are VIEWS, not copies
#
# Counting starts at 0, and a slice stops BEFORE its end, exactly like lists
# (3.1.3). Everything here builds on that.
# =============================================================================

import numpy as np


### Topic 1: One dimension ###
arr = np.array([10, 20, 30, 40])
#   values:    10  20  30  40
#   position:   0   1   2   3
#   from end:  -4  -3  -2  -1

print(arr[0])  # 10, the first item
print(arr[-1])  # 40, the last item
print(arr[1:3])  # [20 30]: positions 1 and 2 (the stop, 3, is NOT included)
print(arr[:2])  # [10 20]: from the start
print(arr[2:])  # [30 40]: to the end
print(arr[::2])  # [10 30]: every second item


### Topic 2: Two dimensions: array[row, column] ###
# With a table, give TWO positions separated by a comma: first the row, then
# the column.
matrix = np.array([[1, 2, 3], [4, 5, 6]])
#           col 0  col 1  col 2
#   row 0  [  1      2      3  ]
#   row 1  [  4      5      6  ]

print(matrix[0, 0])  # 1: row 0, column 0
print(matrix[1, 0])  # 4: row 1, column 0
print(matrix[1, 2])  # 6

# A colon : on its own means "everything in this direction".
print(matrix[0, :])  # [1 2 3]: the whole of row 0
print(matrix[:, 0])  # [1 4]: the whole of column 0
print(matrix[:, :])  # everything
print(matrix[:, 1:])  # all rows, columns 1 and onward

# Plain Python lists need matrix[0][0]. NumPy's [0, 0] is the cleaner way.


### Topic 3: Fancy indexing (a list of positions) ###
# Pass a LIST of positions to pick exactly those items, in that order.
print(arr[[0, 3]])  # [10 40]
print(arr[[3, 3, 0]])  # positions can repeat: [40 40 10]
print(matrix[[1, 0]])  # swap the order of the rows


### Topic 4: Changing values ###
# Put the indexing on the LEFT of = to overwrite those items.
numbers = np.array([1, 2, 3, 4, 5])
numbers[0] = 99
numbers[-2:] = 0  # a slice: set the last two items to 0
print(numbers)


### Topic 5: Slices are views, not copies ###
# GOTCHA. A slice does NOT copy the data. It is a window onto the SAME numbers.
# Change the window and you change the original array too.
original = np.array([1, 2, 3, 4, 5])
window = original[1:4]
window[0] = 100
print(original)  # [  1 100   3   4   5] <- the original changed!

# When you want an independent copy, ask for one:
safe = original[1:4].copy()
safe[0] = -1
print(original)  # unchanged this time

# (Fancy indexing with a list of positions DOES make a copy.)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   scores = np.array([[85, 92, 78], [90, 88, 95], [70, 75, 80]])
#   This is a 3x3 matrix: 3 students, each with 3 test scores.
#   Row 0 = Student 1, Row 1 = Student 2, Row 2 = Student 3.
#   Column 0 = Test 1, Column 1 = Test 2, Column 2 = Test 3.
#   1. Print the score of Student 2 on Test 3 (should be 95).
#   2. Print ALL scores of Student 3 (the entire last row).
#   3. Print all students' scores on Test 1 (the entire first column).
#   4. BONUS: Print only the scores of Students 1 and 2 (the first two rows).
#   5. Print the bottom-right 2x2 block.
# =============================================================================
