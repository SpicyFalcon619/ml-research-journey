"""
NumPy Reference: Creating arrays
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Turning a Python list into a NumPy array with np.array()
#   - How an array prints (no commas!) and how to tell it from a list
#   - The one-type rule, and choosing the type with dtype
#   - How + and * behave differently on lists and on arrays
# =============================================================================

import numpy as np


### Topic 1: From a list to an array ###
# np.array(some_list) copies a list into a new NumPy array.
normal_list = [1, 2, 3, 4]

numpy_array = np.array(normal_list)
print(numpy_array)

# You can also write the list straight inside the call:
my_array = np.array([1, 2, 3, 4])
print(my_array)

# Spot the difference: a list prints with commas, an array with spaces.
print(normal_list)
print(type(normal_list), type(numpy_array))


### Topic 2: The one-type rule ###
# Every item in an array has the same data type, called its dtype
# (see 6_array_attributes). If you mix types, NumPy converts to the one
# that can hold everything:
print(np.array([1, 2, 3]).dtype)  # whole numbers (int)
print(np.array([1, 2.5, 3]).dtype)  # one decimal makes it all float
print(np.array([1, "two", 3]))  # text wins: everything becomes a string!

# You can choose the type yourself with dtype=
print(np.array([1, 2, 3], dtype=float))  # 1. 2. 3. (the dot shows they are floats)


### Topic 3: Lists and arrays do maths differently ###
# This is the biggest day-one difference.
a_list = [1, 2, 3]
an_array = np.array([1, 2, 3])

print(a_list + a_list)  # lists GLUE together: [1, 2, 3, 1, 2, 3]
print(an_array + an_array)  # arrays ADD item by item: [2 4 6]

print(a_list * 2)  # lists REPEAT: [1, 2, 3, 1, 2, 3]
print(an_array * 2)  # arrays MULTIPLY every item: [2 4 6]
# More on array maths in 5_array_math.


### Topic 4: Arrays from other sources ###
# np.array works on anything list-like, such as a tuple or a range:
print(np.array((7, 8, 9)))
print(np.array(range(5)))
# Faster ways to build arrays without typing numbers are in 4_array_generators.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Create a 1D NumPy array called my_array containing the numbers 10, 20,
#      30, 40 and 50. Then print it.
#   2. Create np.array([1, 2, "3"]). What does it print, and why?
#   3. Predict, then check:  np.array([1, 2, 3]) * np.array([4, 5, 6])
# =============================================================================
