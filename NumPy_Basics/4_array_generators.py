"""
NumPy Reference: Array generators
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Making arrays without typing every number: zeros, ones, full, arange,
#     linspace, eye
#   - Passing a shape as a tuple
#   - Why arange and linspace are different
# =============================================================================

import numpy as np


### Topic 1: zeros and ones ###
# Need an array of 1000 numbers? You don't type them. You ask NumPy.
# np.zeros(n) makes n zeros, np.ones(n) makes n ones.
zero_array = np.zeros(3)
print(zero_array)

one_array = np.ones(3)
print(one_array)

# Notice the dots: the numbers are floats (3. means 3.0). zeros and ones make
# floats unless you ask otherwise:
print(np.zeros(3, dtype=int))


### Topic 2: Shapes as tuples ###
# For a 2D array, pass the shape as a TUPLE: (rows, columns).
# The double brackets are the tuple inside the function call.
print(np.zeros((2, 3)))  # 2 rows, 3 columns
print(np.ones((3, 2)))

# np.full fills the array with any number you choose:
print(np.full((2, 2), 7))

# np.eye makes an identity matrix (1s on the diagonal), common in linear algebra:
print(np.eye(3))


### Topic 3: arange ###
# np.arange works like Python's range() (4.3): start, stop, step, and the stop
# value is NOT included. The result is an array.
range_array = np.arange(4)
print(range_array)  # [0 1 2 3]
print(np.arange(2, 10, 3))  # [2 5 8]
print(np.arange(0, 1, 0.25))  # steps can be decimals


### Topic 4: linspace ###
# np.linspace(start, stop, count) gives exactly `count` evenly spaced numbers,
# and (unlike arange) INCLUDES the stop value. Handy when you know how many
# points you want, for example to draw a smooth curve.
print(np.linspace(0, 1, 5))  # 5 numbers from 0 to 1, both ends included

# Rule of thumb: you know the STEP size -> arange. You know the COUNT -> linspace.


### Topic 5: Why ML cares ###
# A neural network's weights must start somewhere. Zeros and ones are the
# simplest starting points, and linspace/arange build input data for plots.
# (Random starting values are in 12_random_numbers.)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Use np.zeros() to create an array of five 0s called zero_array.
#   2. Use np.ones() to create a 2D matrix of 1s with 2 rows and 4 columns,
#      called ones_matrix. (Hint: pass the shape as a tuple: (rows, columns))
#   3. Use np.arange() to create an array with the numbers 0 to 9, called
#      range_array.
#   Print all three!
#   4. Make an array of the even numbers from 10 to 50 using arange.
#   5. Use linspace to get 11 evenly spaced numbers from 0 to 100.
# =============================================================================
