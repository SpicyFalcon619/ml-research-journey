"""
PyTorch Fundamentals: Tensor operations
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Element-wise operations: add, subtract, multiply a whole tensor at once
#   - Element-wise vs matrix multiplication, which are NOT the same thing
#   - The two rules of matrix multiplication (inner dimensions match)
#   - How to read and fix a shape error with a transpose (.T)
#
# Matrix multiplication is THE core operation of deep learning: a neural
# network layer is, at heart, one matrix multiplication.
# =============================================================================

import torch


### Topic 1: Basic operations ###
# Operators work on EVERY item at once, with no loop needed. This is called
# element-wise, and it is the same idea you saw in NumPy.
tensor = torch.tensor([1, 2, 3])
print("Original tensor:", tensor)

print("tensor + 10:", tensor + 10)
print("tensor * 10:", tensor * 10)
print("tensor - 10:", tensor - 10)

# The same operations exist as functions. Same result; the operators are shorter.
print("torch.mul(tensor, 10):", torch.mul(tensor, 10))
print("torch.add(tensor, 10):", torch.add(tensor, 10))

# NOTE: none of these change `tensor`. They return a NEW tensor. To keep the
# result you must store it:  tensor = tensor + 10


### Topic 2: Element-wise vs matrix multiplication ###
# There are two completely different ways to "multiply" tensors:
#   1. ELEMENT-WISE  (the * operator): multiply matching positions
#        [1, 2, 3] * [1, 2, 3] = [1*1, 2*2, 3*3] = [1, 4, 9]
#   2. MATRIX MULTIPLICATION (torch.matmul or @): multiply, then ADD UP
#        [1, 2, 3] . [1, 2, 3] = 1*1 + 2*2 + 3*3 = 14   (the "dot product")
print("Element-wise:", tensor, "*", tensor, "=", tensor * tensor)
print("Dot product (torch.matmul):", torch.matmul(tensor, tensor))

# The @ symbol is a shortcut for matmul:
print("Same thing with @:", tensor @ tensor)

# Why not just write a Python for loop? Because PyTorch does this in optimised
# code (and on a GPU it does thousands of these at once), which is vastly faster.


### Topic 3: The two rules of matrix multiplication ###
# To multiply two matrices, a shape of (rows, columns) must follow two rules:
#   RULE 1. The INNER dimensions must match.
#             (3, 2) @ (2, 3)  works: the inner numbers are both 2
#             (3, 2) @ (3, 2)  fails: the inner numbers are 2 and 3
#   RULE 2. The result has the shape of the OUTER dimensions.
#             (3, 2) @ (2, 3)  gives (3, 3)
tensor_A = torch.tensor([[1, 2], [3, 4], [5, 6]], dtype=torch.float32)
tensor_B = torch.tensor([[7, 10], [8, 11], [9, 12]], dtype=torch.float32)

print("tensor_A shape:", tensor_A.shape)
print("tensor_B shape:", tensor_B.shape)


### Topic 4: Reading a shape error ###
# Both are (3, 2), so the inner numbers (2 and 3) do not match. PyTorch complains.
try:
    torch.matmul(tensor_A, tensor_B)
except RuntimeError as error:
    print("RuntimeError:", str(error).splitlines()[0])

# Shape errors are the most common error you will ever see. Do not panic: write
# the two shapes down, and check Rule 1.


### Topic 5: Fixing it with a transpose ###
# TRANSPOSING flips a tensor's axes: rows become columns. A (3, 2) becomes (2, 3).
# The shortcut for it is .T
print("tensor_B transposed (.T) shape:", tensor_B.T.shape)
print("Multiplying:", tensor_A.shape, "@", tensor_B.T.shape, "<- inner dimensions match")

output = torch.matmul(tensor_A, tensor_B.T)
print("Output:")
print(output)
print("Output shape:", output.shape)  # Rule 2: the outer dimensions, (3, 3)

# CAUTION: a transpose changes how the numbers line up, so it changes the answer.
# Use it because it is mathematically right, not just to silence the error.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Work out BY HAND what shape (2, 3) @ (3, 4) gives, then check in PyTorch.
#   2. Will (4, 3) @ (4, 3) work? Fix it two different ways: transpose the first
#      or the second. Do the two answers have the same shape?
#   3. Compute torch.tensor([2, 3, 4]) @ torch.tensor([1, 0, 2]) by hand first.
#   4. Why is the * operator not the same thing as matrix multiplication?
# =============================================================================
