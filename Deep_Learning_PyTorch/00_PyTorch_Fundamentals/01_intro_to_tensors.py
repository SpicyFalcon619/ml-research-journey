"""
PyTorch Fundamentals: Introduction to tensors
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a tensor is, and how scalars, vectors, matrices and tensors differ
#   - The two numbers that describe any tensor: ndim (how many dimensions) and shape
#   - Making tensors: from your own numbers, random, all zeros, all ones, a range
#   - Why neural networks begin with random numbers
#
# Based on Daniel Bourke's Zero to Mastery PyTorch course.
# If NumPy arrays are familiar (NumPy_Basics), a tensor is the same idea with
# extra powers: it can run on a GPU and PyTorch can differentiate through it.
# =============================================================================

import torch

# Random numbers differ on every run. This line fixes them so YOUR numbers match
# the ones shown here. Lesson 8 explains how it works; ignore it for now.
torch.manual_seed(42)


### Topic 1: What is a tensor? ###
# A TENSOR is a container of numbers arranged in a grid. It is the one data
# structure of deep learning: images, text, sound and a model's own learned
# values are all stored as tensors.
#
# The grid can have any number of directions, called DIMENSIONS:
#   0 dimensions   a scalar       a single number
#   1 dimension    a vector       a row of numbers
#   2 dimensions   a matrix       a table of rows and columns
#   3+ dimensions  a tensor       a stack of tables (and so on)
#
# (Strictly speaking, ALL of these are tensors. The names are just handy.)


### Topic 2: Scalar (0 dimensions) ###
scalar = torch.tensor(7)
print("Scalar:", scalar)
print("Scalar ndim:", scalar.ndim)  # ndim = number of dimensions = 0
print("As a plain Python int:", scalar.item())  # .item() unwraps a 1-number tensor

# NOTE: the output shows tensor(7), not 7. It is still wrapped as a tensor.


### Topic 3: Vector (1 dimension) ###
vector = torch.tensor([7, 7])
print("Vector:", vector)
print("Vector ndim:", vector.ndim)
print("Vector shape:", vector.shape)  # the size of each dimension: 2 items

# TIP: count the SQUARE BRACKETS. One opening bracket in a row means 1 dimension.
# Or look at the shape: its length is the ndim.


### Topic 4: Matrix (2 dimensions) ###
MATRIX = torch.tensor([[7, 8], [9, 10]])
print("Matrix:")
print(MATRIX)
print("Matrix ndim:", MATRIX.ndim)
print("Matrix shape:", MATRIX.shape)  # 2 rows, 2 columns

# Indexing works like a list of lists: the first number picks the row.
print("Matrix[0]:", MATRIX[0])  # the first row
print("Matrix[0][1]:", MATRIX[0][1])  # first row, second item


### Topic 5: Tensor (3 dimensions) ###
TENSOR = torch.tensor(
    [
        [[4, 7, 2], [9, 1, 5], [3, 2, 8]],
        [[3, 6, 2], [9, 8, 4], [4, 2, 6]],
        [[8, 3, 3], [9, 7, 5], [8, 4, 7]],
    ]
)
print("Tensor (3D):")
print(TENSOR)
print("Tensor ndim:", TENSOR.ndim)
print("Tensor shape:", TENSOR.shape)

# Read the shape (3, 3, 3) as: 3 blocks, each with 3 rows, each with 3 columns.
# An image is the same idea: height rows, width columns, and 3 colour layers.


### Topic 6: Random tensors ###
# Why make random tensors? Because a neural network STARTS with random numbers
# and then adjusts them, little by little, until they fit the data. Training is
# "random numbers in, useful numbers out".
random_tensor = torch.rand(size=(3, 4))  # values between 0 and 1
print("Random tensor (3x4):")
print(random_tensor)
print("Data type:", random_tensor.dtype)  # float32: see the next lesson

# A random tensor shaped like a small colour image: height, width, colour channels.
random_image = torch.rand(size=(224, 224, 3))
print("Random image shape:", random_image.shape)
print("Random image ndim:", random_image.ndim)


### Topic 7: Zeros and ones ###
# Handy for placeholders, masks, and baselines.
zeros = torch.zeros(size=(3, 4))
ones = torch.ones(size=(3, 4))
print("Zeros:")
print(zeros)
print("Ones:")
print(ones)
print("Their data types:", zeros.dtype, ones.dtype)


### Topic 8: A range of numbers ###
# torch.arange(start, end, step) counts like Python's range(), and the END is NOT
# included. (The older torch.range() is deprecated. Do not use it.)
one_to_ten = torch.arange(start=1, end=11, step=1)
print("Range:", one_to_ten)

# The "_like" helpers copy the SHAPE (and type) of another tensor.
ten_zeros = torch.zeros_like(input=one_to_ten)
print("Zeros like it:", ten_zeros)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make a 2D tensor of shape (2, 5) full of ones. Print its ndim and shape.
#   2. Use torch.arange to make the even numbers 0, 2, 4, ..., 20.
#   3. Make a random tensor of shape (4, 4) and use .item() to get one single
#      value out of it as a normal Python number.
#   4. Why does torch.rand(size=(224, 224, 3)) have 3 as its last number?
# =============================================================================
