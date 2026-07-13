"""
PyTorch Fundamentals: Tensor Operations
"""
import torch

### Topic 1: Basic Operations ###
print("--- Topic 1: Basic Operations ---")
tensor = torch.tensor([1, 2, 3])
print(f"Original tensor: {tensor}")

# Addition
print(f"tensor + 10: {tensor + 10}")

# Multiplication
print(f"tensor * 10: {tensor * 10}")

# Subtraction
print(f"tensor - 10: {tensor - 10}")

# PyTorch in-built functions
print(f"torch.mul(tensor, 10): {torch.mul(tensor, 10)}")
print(f"torch.add(tensor, 10): {torch.add(tensor, 10)}\n")


### Topic 2: Matrix Multiplication (Dot Product) ###
print("--- Topic 2: Matrix Multiplication ---")
# Element-wise multiplication
print(f"Element-wise: {tensor} * {tensor} = {tensor * tensor}")

# Matrix multiplication (Dot product)
# This is much faster in PyTorch compared to using a standard Python for-loop
print(f"Dot product (torch.matmul): {torch.matmul(tensor, tensor)}\n")


### Topic 3: Shape Errors & Transposing ###
print("--- Topic 3: Shape Errors & Transposing ---")
# The main two rules for matrix multiplication:
# 1. The inner dimensions must match
# 2. The resulting matrix has the shape of the outer dimensions

tensor_A = torch.tensor([[1, 2],
                         [3, 4],
                         [5, 6]], dtype=torch.float32)

tensor_B = torch.tensor([[7, 10],
                         [8, 11], 
                         [9, 12]], dtype=torch.float32)

print(f"tensor_A shape: {tensor_A.shape}")
print(f"tensor_B shape: {tensor_B.shape}")

# torch.matmul(tensor_A, tensor_B) would throw a shape error! 
# We fix it by transposing tensor_B (flipping its axes)
print(f"\ntensor_B transposed (.T) shape: {tensor_B.T.shape}")

print(f"\nMultiplying: {tensor_A.shape} * {tensor_B.T.shape} <- inner dimensions match")
output = torch.matmul(tensor_A, tensor_B.T)
print(f"Output:\n{output}")
print(f"Output shape: {output.shape}")
