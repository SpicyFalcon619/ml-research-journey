"""
PyTorch Basics: Introduction to Tensors
"""
import torch

# Basecamp 2: Deep Learning begins!
# At the heart of PyTorch (and all of deep learning) is the Tensor.
# A tensor is essentially a multi-dimensional matrix containing elements of a single data type.
# If you survived NumPy, you already know tensors. They are exactly like NumPy arrays!

### Topic 1: Creating Tensors ###
# Let's create our very first PyTorch tensor.
scalar = torch.tensor(7)
print("Scalar (0-D Tensor):")
print(scalar)
print(f"Dimensions: {scalar.ndim}\n")

vector = torch.tensor([7, 7])
print("Vector (1-D Tensor):")
print(vector)
print(f"Dimensions: {vector.ndim}\n")

MATRIX = torch.tensor([[7, 8],
                       [9, 10]])
print("Matrix (2-D Tensor):")
print(MATRIX)
print(f"Dimensions: {MATRIX.ndim}\n")

### Topic 2: Random Tensors ###
# In deep learning, a neural network starts with random weights.
# We create random tensors constantly.
random_tensor = torch.rand(size=(3, 4))
print("Random Tensor (3 rows, 4 columns):")
print(random_tensor)
print(f"Data type: {random_tensor.dtype}\n")

### Topic 3: Why PyTorch? (GPU Acceleration) ###
# Why not just use NumPy? Because PyTorch can run on GPUs!
# GPUs are blazingly fast at matrix multiplication, which is all neural networks do.

# We can check what device our tensor is currently on:
print(f"Random tensor is on device: {random_tensor.device}")

# Best practice for setting up your device (works on any machine):
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"System device selected: {device}")

# Move the tensor to the device!
random_tensor = random_tensor.to(device)
print(f"Tensor is now on device: {random_tensor.device}")

print("\nWelcome to PyTorch! You've taken your first step into Deep Learning.")
