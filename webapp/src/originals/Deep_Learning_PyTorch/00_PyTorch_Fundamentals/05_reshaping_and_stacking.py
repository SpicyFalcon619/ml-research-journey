"""
PyTorch Fundamentals: Reshaping, Stacking, Squeezing, and Permuting
"""
import torch

### Topic 1: Reshaping tensors ###
print("--- Topic 1: Reshaping tensors ---")
x = torch.arange(1., 11.) # 1 to 10
print(f"Original tensor:\n{x}")
print(f"Original shape: {x.shape}\n")

# Reshape adds an extra dimension or reorganizes the shape (must be compatible with original size!)
x_reshaped = x.reshape(5, 2)
print(f"Reshaped to (5, 2):\n{x_reshaped}")
print(f"Reshaped shape: {x_reshaped.shape}\n")


### Topic 2: Changing the view ###
print("--- Topic 2: Changing the view ---")
# .view() shares memory with the original tensor
z = x.view(1, 10)
print(f"View z (1, 10): {z}")

# Changing z changes x because they share the same memory!
z[:, 0] = 5
print(f"We changed z[:, 0] to 5.")
print(f"z is now: {z}")
print(f"x is now: {x}\n") # Notice the first element of x is also 5


### Topic 3: Stacking tensors ###
print("--- Topic 3: Stacking tensors ---")
# torch.stack() concatenates a sequence of tensors along a new dimension
x_stacked = torch.stack([x, x, x], dim=0) # stacked vertically
print(f"Stacked (dim=0):\n{x_stacked}")

x_stacked_dim1 = torch.stack([x, x, x], dim=1) # stacked horizontally
print(f"\nStacked (dim=1):\n{x_stacked_dim1}\n")


### Topic 4: Squeezing and Unsqueezing ###
print("--- Topic 4: Squeezing and Unsqueezing ---")
# Squeeze removes all dimensions with size 1
x_reshaped_for_squeeze = x.reshape(1, 10)
print(f"Before squeeze: {x_reshaped_for_squeeze} | Shape: {x_reshaped_for_squeeze.shape}")

x_squeezed = x_reshaped_for_squeeze.squeeze()
print(f"After squeeze: {x_squeezed} | Shape: {x_squeezed.shape}")

# Unsqueeze adds a dimension of size 1 at a specific index
x_unsqueezed = x_squeezed.unsqueeze(dim=0)
print(f"\nAfter unsqueeze (dim=0): {x_unsqueezed} | Shape: {x_unsqueezed.shape}\n")


### Topic 5: Permuting dimensions ###
print("--- Topic 5: Permuting dimensions ---")
# Permute rearranges dimensions (often used for images)
# Note: Permute also returns a *view* (shares memory)
x_original = torch.rand(size=(224, 224, 3)) # height, width, color channels
print(f"Original image shape: {x_original.shape} -> [height, width, color_channels]")

x_permuted = x_original.permute(2, 0, 1) # shift axis 0->1, 1->2, 2->0
print(f"Permuted image shape: {x_permuted.shape} -> [color_channels, height, width]")
