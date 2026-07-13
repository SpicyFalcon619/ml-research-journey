"""
PyTorch Fundamentals: Indexing (selecting data from tensors)
"""
import torch

### Topic 1: Indexing ###
print("--- Topic 1: Indexing ---")
x = torch.arange(1, 10).reshape(1, 3, 3)
print(f"Tensor:\n{x}")
print(f"Shape: {x.shape}\n") # [batch, height, width]

print(f"Indexing the first dimension (x[0]):\n{x[0]}\n")
print(f"Indexing the middle dimension (x[0][0] or x[0, 0]):\n{x[0][0]}\n")
print(f"Indexing the inner-most dimension (x[0][0][0] or x[0, 0, 0]):\n{x[0][0][0]}\n")

# Using ":" to select "all" of a target dimension
print(f"Get all values of 0th dimension and the 0th index of 1st dimension (x[:, 0]):\n{x[:, 0]}\n")

print(f"Get all values of 0th and 1st dimensions but only index 1 of 2nd dimension (x[:, :, 1]):\n{x[:, :, 1]}\n")

print(f"Get all values of 0th dimension but only the 1 index value of 1st and 2nd dimension (x[:, 1, 1]):\n{x[:, 1, 1]}\n")

print(f"Get index 0 of 0th and 1st dimension and all values of 2nd dimension (x[0, 0, :]):\n{x[0, 0, :]}")
