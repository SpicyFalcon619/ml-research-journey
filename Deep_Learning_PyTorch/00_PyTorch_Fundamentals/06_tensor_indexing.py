"""
PyTorch Fundamentals: Indexing (selecting data from tensors)
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Picking values out of a tensor with square brackets, one index per dimension
#   - Using ":" to mean "everything in this dimension"
#   - Reading a 3D shape as [batch, height, width]
#   - Predicting the shape of an index result before you run it
#
# This is the same indexing idea as lists and NumPy (see 5.1 and NumPy_Basics 7).
# =============================================================================

import torch


### Topic 1: Indexing one dimension at a time ###
# Make a 3D tensor holding 1 to 9, shaped (1, 3, 3).
x = torch.arange(1, 10).reshape(1, 3, 3)
print("Tensor:")
print(x)
print("Shape:", x.shape)  # [batch, height, width]: 1 block, 3 rows, 3 columns

# Each index you add goes one dimension deeper (outermost first):
print("x[0]:")  # the first (only) block: a 3x3 table
print(x[0])
print("x[0][0] or x[0, 0]:", x[0][0])  # then its first row
print("x[0][0][0] or x[0, 0, 0]:", x[0][0][0])  # then the first number in that row

# x[0, 0, 0] (commas) and x[0][0][0] (chained brackets) give the same answer.
# The comma form is preferred: it is clearer and faster.


### Topic 2: The colon means "all" ###
# A colon : in a position means "take everything along this dimension".
# Each index REMOVES a dimension, but a colon KEEPS it. Look at the shapes.
print("x[:, 0] (all blocks, row 0):")
print(x[:, 0])  # shape (1, 3)

print("x[:, :, 1] (all blocks, all rows, column 1):")
print(x[:, :, 1])  # the middle column of every row: shape (1, 3)

print("x[:, 1, 1] (all blocks, row 1, column 1):")
print(x[:, 1, 1])  # the centre of the grid: shape (1,)

print("x[0, 0, :] (block 0, row 0, all columns):")
print(x[0, 0, :])  # the whole first row: shape (3,)


### Topic 3: Slicing ranges ###
# Just like lists, start:end picks a range and the END is NOT included.
print("x[0, :2, :2] (the top-left 2x2 corner):")
print(x[0, :2, :2])

# Negative numbers count from the end:
print("x[0, -1, -1] (the bottom-right value):", x[0, -1, -1])


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Using the tensor above, write the index that returns the number 9.
#   2. Write the index that returns the whole last column: tensor([3, 6, 9]).
#   3. Without running it, predict the SHAPE of x[:, 1, :], then check.
#   4. Make a (2, 3, 4) tensor with arange + reshape and pick out the last row of
#      the second block.
# =============================================================================
