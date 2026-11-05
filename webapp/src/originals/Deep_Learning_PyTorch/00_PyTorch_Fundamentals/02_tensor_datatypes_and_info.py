"""
PyTorch Fundamentals: Tensor Datatypes and Information
"""
import torch

### Topic 1: Tensor Datatypes ###
print("--- Topic 1: Tensor Datatypes ---")
# Default datatype for tensors is float32
float_32_tensor = torch.tensor([3.0, 6.0, 9.0],
                               dtype=None, # defaults to torch.float32
                               device=None, # defaults to None, which uses the default tensor type
                               requires_grad=False) # if True, operations are recorded for gradients
print(f"Float 32 Tensor: {float_32_tensor}")
print(f"Data type: {float_32_tensor.dtype}\n")

# Changing the data type
float_16_tensor = float_32_tensor.type(torch.float16)
print(f"Float 16 Tensor: {float_16_tensor}")
print(f"Data type: {float_16_tensor.dtype}\n")

# Mixing datatypes
int_32_tensor = torch.tensor([3, 6, 9], dtype=torch.int32)
print(f"Int 32 Tensor: {int_32_tensor}")
print(f"Multiplying Int32 and Float32: {int_32_tensor * float_32_tensor}\n")


### Topic 2: Getting information from tensors ###
print("--- Topic 2: Getting information from tensors ---")
# The 3 most common attributes you'll want to check
some_tensor = torch.rand(3, 4)
print(f"Here is our tensor:\n{some_tensor}\n")

print(f"1. Datatype of tensor: {some_tensor.dtype}")
print(f"2. Shape of tensor: {some_tensor.shape}")
print(f"3. Device tensor is on: {some_tensor.device}")
