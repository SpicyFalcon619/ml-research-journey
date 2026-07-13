"""
PyTorch Fundamentals: PyTorch & NumPy
"""
import torch
import numpy as np

### Topic 1: NumPy to Tensor ###
print("--- Topic 1: NumPy to Tensor ---")
# Data in NumPy, want in PyTorch tensor -> torch.from_numpy(ndarray)
# Note: NumPy default is float64, PyTorch default is float32
array = np.arange(1.0, 8.0)
tensor = torch.from_numpy(array)

print(f"NumPy array: {array}")
print(f"PyTorch tensor: {tensor}")
print(f"Tensor dtype: {tensor.dtype} (inherited from NumPy!)\n")

# Changing the value of the array does NOT change the tensor
array = array + 1
print(f"Added 1 to array.")
print(f"Array is now: {array}")
print(f"Tensor remains: {tensor}\n")


### Topic 2: Tensor to NumPy ###
print("--- Topic 2: Tensor to NumPy ---")
# Data in PyTorch tensor, want in NumPy -> tensor.numpy()
tensor = torch.ones(7)
numpy_tensor = tensor.numpy()

print(f"PyTorch tensor: {tensor}")
print(f"NumPy array: {numpy_tensor}\n")

# Changing the tensor does NOT change the array
tensor = tensor + 1
print(f"Added 1 to tensor.")
print(f"Tensor is now: {tensor}")
print(f"NumPy array remains: {numpy_tensor}")
