"""
NumPy Reference: Array attributes
"""

import numpy as np

my_array = np.array([[1, 2, 3], [4, 5, 6]])

print(my_array.shape)
print(my_array.ndim)
print(my_array.dtype)

### Topic: Array Attributes ###
# Create a 2D array of your choice with at least 2 rows and 3 columns.
# Then print the following attributes:
#   - .shape  → the dimensions (rows, columns)
#   - .ndim   → number of dimensions
#   - .dtype  → the data type of the elements
# Note: These are properties, NOT function calls — no () needed!

my_array = np.array([[1, 2, 3], [4.4, 5.5, 6.6], [7.7, 8, 9.9]])

print(my_array.shape)
print(my_array.ndim)
print(my_array.dtype)
