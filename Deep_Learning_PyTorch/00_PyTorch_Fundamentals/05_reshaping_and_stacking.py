"""
PyTorch Fundamentals: Reshaping, stacking, squeezing and permuting
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Why shapes must be changed so often (most errors are shape errors)
#   - reshape vs view, and the "shared memory" trap
#   - stack: joining tensors along a NEW dimension
#   - squeeze and unsqueeze: removing and adding dimensions of size 1
#   - permute: reordering dimensions, as when converting an image layout
# =============================================================================

import torch

torch.manual_seed(42)  # so the random image below matches yours (see lesson 8)


### Topic 1: Reshaping ###
# Different layers and functions want data in different shapes. RESHAPING changes
# the shape WITHOUT changing the numbers. The only rule: the total count of items
# must stay the same, because you are re-arranging, not adding or removing.
x = torch.arange(1.0, 11.0)  # 1 to 10
print("Original tensor:", x)
print("Original shape:", x.shape)  # 10 items

x_reshaped = x.reshape(5, 2)  # 5 x 2 = 10 items, so it works
print("Reshaped to (5, 2):")
print(x_reshaped)
print("Reshaped shape:", x_reshaped.shape)

# Try an impossible one: 3 x 3 = 9, but we have 10 items.
try:
    x.reshape(3, 3)
except RuntimeError as error:
    print("RuntimeError:", str(error).splitlines()[0])


### Topic 2: Views share memory ###
# .view() also changes the shape, but the new tensor is a WINDOW onto the same
# numbers, not a copy. Change one and the other changes too.
z = x.view(1, 10)
print("View z (1, 10):", z)

z[:, 0] = 5  # set the first item (of every row) to 5
print("We changed z[:, 0] to 5.")
print("z is now:", z)
print("x is now:", x)  # x changed as well: same memory

# WARNING: this is a classic source of silent bugs. If you need a separate copy
# so edits do not leak, use x.clone().


### Topic 3: Stacking ###
# torch.stack joins tensors along a NEW dimension. The result has one more
# dimension than the inputs. Use dim to pick where the new one goes.
x_stacked = torch.stack([x, x, x], dim=0)  # three rows (a new first dimension)
print("Stacked (dim=0):")
print(x_stacked)
print("Shape:", x_stacked.shape)

x_stacked_dim1 = torch.stack([x, x, x], dim=1)  # three columns
print("Stacked (dim=1):")
print(x_stacked_dim1)
print("Shape:", x_stacked_dim1.shape)


### Topic 4: Squeeze and unsqueeze ###
# Some shapes carry a pointless dimension of size 1, like (1, 10): one row of 10.
# SQUEEZE removes every dimension of size 1. UNSQUEEZE adds one back where you ask.
x_with_extra = x.reshape(1, 10)
print("Before squeeze:", x_with_extra, "| Shape:", x_with_extra.shape)

x_squeezed = x_with_extra.squeeze()
print("After squeeze:", x_squeezed, "| Shape:", x_squeezed.shape)

x_unsqueezed = x_squeezed.unsqueeze(dim=0)  # a new dimension at position 0
print("After unsqueeze (dim=0):", x_unsqueezed, "| Shape:", x_unsqueezed.shape)

# You will do this a lot: models usually expect a BATCH dimension up front, so a
# single image of shape (3, 224, 224) becomes (1, 3, 224, 224) with unsqueeze(0).


### Topic 5: Permuting dimensions ###
# PERMUTE reorders the dimensions. The classic use: image libraries store an image
# as [height, width, colour channels], but PyTorch wants [colour channels, height, width].
x_original = torch.rand(size=(224, 224, 3))
print("Original image shape:", x_original.shape, "-> [height, width, colour_channels]")

# The numbers say which OLD axis goes in each NEW position:
#   new axis 0 = old axis 2 (colour), new axis 1 = old axis 0 (height), new axis 2 = old axis 1
x_permuted = x_original.permute(2, 0, 1)
print("Permuted image shape:", x_permuted.shape, "-> [colour_channels, height, width]")

# NOTE: permute also returns a VIEW (shared memory), like Topic 2.
x_original[0, 0, 0] = 999
print("Changed the original's corner. The permuted one sees it:", x_permuted[0, 0, 0].item())


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Reshape torch.arange(1, 13) into (3, 4), then (2, 6), then (2, 3, 2).
#   2. Make a copy with .clone(), change the copy, and check the original is untouched.
#   3. Stack two tensors of shape (3,) with dim=0 and with dim=1. Predict each
#      shape BEFORE you run it.
#   4. A single (3, 28, 28) image needs a batch dimension. Which call adds it?
# =============================================================================
