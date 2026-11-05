"""
PyTorch Fundamentals: Tensor Aggregation
"""
import torch

### Topic 1: Finding min, max, mean, sum ###
print("--- Topic 1: Finding min, max, mean, sum ---")
x = torch.arange(0, 100, 10)
print(f"Tensor x: {x}")

print(f"Minimum: {x.min()} (or torch.min(x): {torch.min(x)})")
print(f"Maximum: {x.max()} (or torch.max(x): {torch.max(x)})")
# Note: torch.mean() requires tensors to be in float32 datatype
print(f"Mean: {x.type(torch.float32).mean()} (or torch.mean(x.type(torch.float32)): {torch.mean(x.type(torch.float32))})")
print(f"Sum: {x.sum()} (or torch.sum(x): {torch.sum(x)})\n")


### Topic 2: Positional min/max ###
print("--- Topic 2: Positional min/max (argmin/argmax) ---")
# Finding the index where the min or max occurs
tensor = torch.arange(0, 100, 10)
print(f"Tensor: {tensor}")
print(f"Index where max value occurs (argmax): {tensor.argmax()}")
print(f"Index where min value occurs (argmin): {tensor.argmin()}\n")


### Topic 3: Change tensor datatype dynamically ###
print("--- Topic 3: Change tensor datatype dynamically ---")
tensor_float32 = torch.arange(10., 100., 10.)
print(f"Original tensor dtype: {tensor_float32.dtype}")

# We use .type() to change the datatype
tensor_float16 = tensor_float32.type(torch.float16)
print(f"New tensor dtype after using .type(torch.float16): {tensor_float16.dtype}")
