"""
Python Reference: Nested list comprehensions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - A list inside a list as a MATRIX (rows and columns)
#   - Transposing a matrix: swapping rows and columns
#   - Doing it with a nested comprehension, and with zip() and the * unpack
#   - Why real ML code uses NumPy for this instead
# =============================================================================


### Topic 1: A matrix as a list of lists ###
# A MATRIX is a grid of numbers. In plain Python it is a list of ROW lists.
# This one has 3 rows and 4 columns.

matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]

print("Original Matrix:")
for row in matrix:
    print(row)

print("\nmatrix[1][2] =", matrix[1][2])  # row 1, column 2 -> 7


### Topic 2: Transposing with a nested comprehension ###
# TRANSPOSE = swap rows and columns: the first column becomes the first row.
#
#      1  2  3  4                1  5  9
#      5  6  7  8      ->        2  6  10
#      9 10 11 12                3  7  11
#                                4  8  12
#
# The inner comprehension  [row[i] for row in matrix]  collects column i
# (the i-th item of every row). The outer one repeats that for i = 0, 1, 2, 3.
# The result: a list of 4 new rows.

transposed = [[row[i] for row in matrix] for i in range(4)]

print("\nTransposed Matrix:")
for row in transposed:
    print(row)

# The same thing as ordinary loops:
transposed_loop = []
for i in range(4):
    new_row = []
    for row in matrix:
        new_row.append(row[i])
    transposed_loop.append(new_row)
print("\nSame result with loops?", transposed_loop == transposed)


### Topic 3: The super Pythonic way, zip() and * ###
# Two tools combine here:
#   *matrix   unpacks the list of rows into separate arguments (see 4.9.5), so
#             zip receives [1,2,3,4], [5,6,7,8], [9,10,11,12] as three arguments.
#   zip(...)  walks through all its arguments in parallel and groups the
#             1st items together, then the 2nd items, and so on. (See 5.6.)
# The first column (1, 5, 9) is exactly the first row of the transpose.

print("\nTransposed using zip():")
print(list(zip(*matrix)))  # a list of TUPLES (rows as tuples)


### Topic 4: What machine learning actually does ###
# NOTE: In real Machine Learning, we NEVER do this manually!
# NumPy arrays and PyTorch tensors have it built in and run it in fast C code:
#       matrix.T                (NumPy)
#       tensor.T / tensor.mT    (PyTorch)
# Understanding the "list of lists" version still pays off: it is exactly the
# structure that arrays organise for you, and "swap rows and columns" is
# what happens inside nearly every neural-network layer.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make a 3x3 matrix and print its diagonal with a comprehension:
#      [m[i][i] for i in range(3)].
#   2. Build a 3x3 multiplication table as a list of lists with a nested
#      comprehension.
#   3. Double every number in `matrix` while keeping the 3x4 shape:
#      [[x * 2 for x in row] for row in matrix]. Explain what each part does.
# =============================================================================
