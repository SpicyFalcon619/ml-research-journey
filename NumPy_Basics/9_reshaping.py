"""
NumPy Reference: Reshaping
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - reshape: the same numbers, arranged in a different shape
#   - The rule: the item count must stay the same, and -1 means "work it out"
#   - flatten: back to one long row
#   - Transposing: swapping rows and columns with .T
#   - Why ML needs this constantly (images, batches, model inputs)
# =============================================================================

import numpy as np


### Topic 1: reshape ###
# reshape does NOT change any numbers. It re-cuts the same list of numbers into
# a different shape, filling row by row.
my_array = np.arange(9)
print(my_array)  # [0 1 2 3 4 5 6 7 8]

reshaped = my_array.reshape(3, 3)
print(reshaped)
# [[0 1 2]
#  [3 4 5]
#  [6 7 8]]

# The item count must match: 3 x 3 = 9 works. 3 x 4 = 12 does not.
try:
    my_array.reshape(3, 4)
except ValueError as error:
    print("ValueError:", error)


### Topic 2: -1 means "figure it out for me" ###
# Give one dimension as -1 and NumPy calculates it from the others.
data = np.arange(1, 13)  # [1, 2, 3, ..., 12]
print(data.reshape(3, -1))  # 3 rows, columns worked out: 4
print(data.reshape(-1, 2))  # 2 columns, rows worked out: 6
print(data.reshape(2, 3, 2))  # 3D: 2 blocks, each with 3 rows and 2 columns


### Topic 3: flatten ###
# flatten turns any array back into one long 1D row.
flattened = reshaped.flatten()
print(flattened)

# flatten returns a COPY. There is also .ravel(), which returns a view when it can
# (see the views gotcha in 7_indexing): same values, a little faster.
print(reshaped.ravel())


### Topic 4: Transposing ###
# .T flips rows and columns: row i, column j  ->  row j, column i.
tall = np.array([[1, 2, 3], [4, 5, 6]])
print(tall.shape, "->", tall.T.shape)  # (2, 3) -> (3, 2)
print(tall.T)


### Topic 5: Why ML cares ###
# A 28 x 28 grayscale image is a 2D array. Many models want one long row of 784
# numbers per image, so you flatten or reshape it. A batch of 100 such images
# is shape (100, 28, 28), and reshape(100, -1) turns it into the 100 x 784 TABLE
# that a basic model expects.
fake_images = np.zeros((100, 28, 28))
table = fake_images.reshape(100, -1)
print(table.shape)  # (100, 784)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   Start with data = np.arange(1, 13).
#   1. Reshape data into a 3x4 matrix (3 rows, 4 columns) called matrix_3x4.
#   2. Reshape data into a 4x3 matrix called matrix_4x3.
#   3. Flatten matrix_3x4 back into a 1D array called flat.
#   BONUS: reshape data into (2, 3, 2). What does it look like?
#   4. Use -1 to reshape data into 6 columns, with the rows worked out for you.
#   5. Why can a 10-item array not be reshaped to (3, 3)?
# =============================================================================
