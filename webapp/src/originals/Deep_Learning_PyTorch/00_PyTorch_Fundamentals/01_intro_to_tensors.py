"""
PyTorch Fundamentals: Introduction to Tensors
(Based on Daniel Bourke's Zero to Mastery PyTorch course)
"""
import torch

### Topic 1: Creating Tensors (Scalars, Vectors, Matrices) ###
print("--- Topic 1: Creating Tensors ---")

# Scalar (0 dimensions)
scalar = torch.tensor(7)
print(f"Scalar: {scalar}")
print(f"Scalar ndim: {scalar.ndim}")
print(f"Scalar as Python int: {scalar.item()}\n") # .item() gets the Python number back from a tensor

# Vector (1 dimension)
vector = torch.tensor([7, 7])
print(f"Vector: {vector}")
print(f"Vector ndim: {vector.ndim}")
print(f"Vector shape: {vector.shape}\n")

# Matrix (2 dimensions)
MATRIX = torch.tensor([[7, 8],
                       [9, 10]])
print("Matrix:")
print(MATRIX)
print(f"Matrix ndim: {MATRIX.ndim}")
print(f"Matrix shape: {MATRIX.shape}")
print(f"Matrix[0]: {MATRIX[0]}")
print(f"Matrix[0][1]: {MATRIX[0][1]}\n")

# Tensor (3+ dimensions)
TENSOR = torch.tensor([[[4, 7, 2], [9, 1, 5], [3, 2, 8]],
                       [[3, 6, 2], [9, 8, 4], [4, 2, 6]],
                       [[8, 3, 3], [9, 7, 5], [8, 4, 7]]])
print("Tensor (3D):")
print(TENSOR)
print(f"Tensor ndim: {TENSOR.ndim}")
print(f"Tensor shape: {TENSOR.shape}\n")


### Topic 2: Random Tensors ###
print("--- Topic 2: Random Tensors ---")
# Why random tensors? Because many machine learning models start with tensors full of random numbers
# and then adjust those random numbers to better represent the data.

random_tensor = torch.rand(size=(3, 4))
print(f"Random Tensor (3x4):\n{random_tensor}")
print(f"Data type: {random_tensor.dtype}\n")

# Create a random tensor with a similar shape to an image tensor
random_image_size_tensor = torch.rand(size=(224, 224, 3)) # height, width, color channels (R, G, B)
print(f"Random Image-size Tensor shape: {random_image_size_tensor.shape}")
print(f"Random Image-size Tensor ndim: {random_image_size_tensor.ndim}\n")


### Topic 3: Zeros and Ones ###
print("--- Topic 3: Zeros and Ones ---")
# Useful for creating masks or setting a baseline tensor

zeros = torch.zeros(size=(3, 4))
print(f"Tensor of Zeros:\n{zeros}")
print(f"Data type: {zeros.dtype}\n")

ones = torch.ones(size=(3, 4))
print(f"Tensor of Ones:\n{ones}")
print(f"Data type: {ones.dtype}\n")


### Topic 4: Creating a Range of Tensors ###
print("--- Topic 4: Creating a Range ---")
# torch.range() is deprecated. Always use torch.arange() instead!

zero_to_ten = torch.arange(start=1, end=11, step=1)
print(f"Range tensor (1 to 10): {zero_to_ten}")

# We can also create tensors 'like' other tensors
ten_zeros = torch.zeros_like(input=zero_to_ten)
print(f"Zeros like the range tensor: {ten_zeros}\n")
