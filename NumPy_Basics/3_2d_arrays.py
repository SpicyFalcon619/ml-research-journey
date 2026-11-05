"""
NumPy Reference: 2D arrays
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Building a 2D array (a matrix) from a list of lists
#   - Rows and columns, and how to read the shape
#   - Why every row must be the same length
#   - Where 1D, 2D and 3D arrays show up in ML
# =============================================================================

import numpy as np


### Topic 1: A list of lists becomes a matrix ###
# A 1D array is a row of numbers. A 2D array is a TABLE: several rows stacked.
# You build one from a list of lists. Each inner list is one ROW.
my_matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(my_matrix)

# This one has 3 rows and 3 columns:
#
#          col 0  col 1  col 2
#   row 0 [  1      2      3  ]
#   row 1 [  4      5      6  ]
#   row 2 [  7      8      9  ]
#
# Writing each row on its own line makes it much easier to read:
grades = np.array(
    [
        [90, 85],
        [70, 60],
        [88, 92],
    ]
)
print(grades)


### Topic 2: Shape ###
# The SHAPE tells you the size in each direction, as (rows, columns).
# (More attributes in 6_array_attributes.)
print(my_matrix.shape)  # (3, 3)
print(grades.shape)  # (3, 2): 3 rows, 2 columns
print(np.array([1, 2, 3]).shape)  # (3,): a 1D array has only one number


### Topic 3: Rows must match ###
# An array is a perfect rectangle. If the rows have different lengths NumPy
# refuses (an error we catch here with try/except, see Section 8):
try:
    np.array([[1, 2, 3], [4, 5]])
except ValueError as error:
    print("ValueError:", error)


### Topic 4: Why this matters for ML ###
# In machine learning, almost everything is an array of some dimension:
#   1D  one sample's features, e.g. [age, salary, height]
#   2D  a whole dataset: each ROW is a sample and each COLUMN is a feature
#   3D  e.g. a grayscale image batch, or one colour image (height, width, colours)
#   4D  a batch of colour images: (batch, colours, height, width)
# A table like the one above is exactly what you will feed to scikit-learn.

rgb_pixel_image = np.zeros((2, 2, 3))  # a tiny 2x2 colour image (3 colour values per pixel)
print(rgb_pixel_image.shape)
print(rgb_pixel_image.ndim, "dimensions")


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Create a 2D array called tic_tac_toe that looks like this, then print it:
#         [[1 0 1]
#          [0 1 0]
#          [1 0 1]]
#   2. Make a 2x4 array of your own numbers and print its shape.
#   3. What error do you get for np.array([[1, 2], [3, 4, 5]])? Read it.
# =============================================================================
