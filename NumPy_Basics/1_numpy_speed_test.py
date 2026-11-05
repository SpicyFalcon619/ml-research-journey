"""
NumPy Reference: Numpy speed test
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What NumPy is and why every ML library is built on it
#   - How to import it:  import numpy as np
#   - What an "array" is, and how it differs from a Python list
#   - Why the same job can be many times faster with an array
#
# New to Python lists? Read 3.1.3 and 5.1 in the Python Tutorial first.
# =============================================================================


### Topic 1: What is NumPy? ###
# NumPy (Numerical Python) is a library for working with big collections of
# numbers quickly. Pandas, scikit-learn, PyTorch and TensorFlow are all built on
# the same idea: the ARRAY.
#
# An array looks like a list, but with two big differences:
#   1. Every item has the SAME type (all integers, or all decimals...).
#   2. Maths runs on the WHOLE array at once, in fast compiled code, so you
#      don't write a loop.
#
# NumPy is not part of Python itself, so it has to be installed once (pip install
# numpy) and then imported. By universal convention it is imported under the
# short nickname np (see 6.1 for how imports work).

import time

import numpy as np


### Topic 2: The race ###
# We will square 5 million numbers two ways and time both.
# (Want a bigger race? Change 5_000_000 to 10_000_000. It needs more memory.)

size = 5_000_000

print("Creating the massive lists...")
# A standard Python list holding 0, 1, 2, ... 4_999_999
python_list = list(range(size))

# A NumPy array holding the same numbers. np.arange works like range() but
# gives an array (see 4_array_generators for more).
numpy_array = np.arange(size)
print("Done! Let's race.\n")


### Topic 3: Standard Python ###
# time.time() returns the current clock time in seconds. Taking it before and
# after a job and subtracting tells you how long the job took.
print("Starting Standard Python...")
start_time = time.time()

# Squaring every number with a list comprehension (see 5.1.3): Python visits
# the numbers one at a time.
python_result = [x**2 for x in python_list]

python_end_time = time.time() - start_time
print(f"Standard Python took: {python_end_time:.4f} seconds")


### Topic 4: NumPy ###
print("\nStarting NumPy...")
start_time = time.time()

# Squaring every number in the array. There is no loop. We write the maths once
# and NumPy applies it to every item. (Look how clean this syntax is!)
numpy_result = numpy_array**2

numpy_end_time = time.time() - start_time
print(f"NumPy took: {numpy_end_time:.4f} seconds")

# The results
print(f"\n--- NumPy was {python_end_time / numpy_end_time:.1f}x faster! ---")
# The exact numbers change on every run and on every computer, but the gap is big.


### Topic 5: Why is it so much faster? ###
# 1. SAME TYPE, SIDE BY SIDE. A list stores a pointer to each item, and every
#    item can be a different kind of object. An array stores plain numbers packed
#    together in one block of memory, so the computer can race through them.
# 2. NO PYTHON LOOP. The loop runs inside NumPy's pre-compiled C code, not in
#    slow, step-by-step Python.
# 3. This style, doing one operation on a whole array at once, is called
#    VECTORISATION. You will use it all through ML: a neural network layer is
#    just one big vectorised operation on arrays of numbers.

# Peek at the "same type" rule: NumPy converts everything to one type.
print(np.array([1, 2, 3]))  # whole numbers
print(np.array([1, 2.5, 3]))  # one decimal: EVERYTHING becomes decimal


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Time the two approaches for cubing instead of squaring (x**3).
#   2. Change size to 1000. Is NumPy still faster? Why might the gap shrink
#      for tiny arrays?
#   3. Find the sum of 5 million numbers with Python's sum(python_list) and with
#      numpy_array.sum(). Time both.
# =============================================================================
