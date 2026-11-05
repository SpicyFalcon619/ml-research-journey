"""
NumPy Reference: Array attributes
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Asking an array about itself: shape, ndim, size, dtype
#   - Attributes versus methods (and why attributes have no brackets)
#   - Converting between types with astype()
#   - Why checking shape and dtype is the #1 debugging habit in ML
# =============================================================================

import numpy as np


### Topic 1: The three basics ###
my_array = np.array([[1, 2, 3], [4, 5, 6]])

print(my_array.shape)  # (2, 3): 2 rows, 3 columns
print(my_array.ndim)  # 2: the number of dimensions
print(my_array.dtype)  # int64: the type of every item (whole numbers)

# What each one means:
#   .shape  the size of each dimension, as a tuple (rows, columns)
#   .ndim   how many dimensions (1 = row of numbers, 2 = table, 3 = stack of tables)
#   .dtype  the data type of the items


### Topic 2: Attributes have no brackets ###
# NOTE: these are properties (facts stored on the array), NOT function calls.
# Write my_array.shape, never my_array.shape(). Methods that DO something, like
# my_array.sum() or my_array.reshape(...), are called with brackets.

print(my_array.size)  # 6: the total number of items
print(len(my_array))  # 2: len() counts only the FIRST dimension (rows)


### Topic 3: dtype in action ###
# Mixing whole numbers and decimals makes the whole array float:
mixed = np.array([[1, 2, 3], [4.4, 5.5, 6.6], [7.7, 8, 9.9]])

print(mixed.shape)
print(mixed.ndim)
print(mixed.dtype)  # float64: every item is a decimal now

# Common dtypes you will meet:
#   int64 / int32   whole numbers          float64 / float32   decimals
#   bool            True / False           <U5 (etc.)           text
# float32 is what neural networks usually use: smaller and faster than float64.


### Topic 4: Changing the type with astype ###
# astype returns a NEW array converted to the type you ask for.
floats = np.array([1.9, 2.5, 3.7])
print(floats.astype(int))  # [1 2 3]  <- chops the decimals, does NOT round
print(floats.astype(np.float32).dtype)
print(np.array([1, 0, 2]).astype(bool))  # 0 is False, everything else True

# Text that looks like numbers can be converted too:
print(np.array(["1", "2", "3"]).astype(int))


### Topic 5: Why you check these constantly ###
# Most ML errors are shape or dtype mismatches, such as
# "expected 2 dimensions but got 3" or "can't multiply (3, 2) by (3, 2)".
# Before you debug anything else, print the shape and dtype of your arrays.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Create a 2D array of your choice with at least 2 rows and 3 columns.
#      Print its .shape, .ndim and .dtype.
#   2. Without running it: what are the shape and ndim of
#      np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])?  Then check.
#   3. Convert np.array([3.99, 1.2]) to integers. Is 3.99 rounded to 4? How
#      could you round first with np.round()?
# =============================================================================
