"""
PyTorch Fundamentals: PyTorch and NumPy
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Converting NumPy arrays to tensors (from_numpy) and back (.numpy())
#   - The datatype difference: NumPy defaults to float64, PyTorch to float32
#   - Shared memory: a converted tensor and its array can change TOGETHER
#   - The difference between REASSIGNING a variable and changing it IN PLACE
#
# Why this matters: pandas and scikit-learn speak NumPy, PyTorch speaks tensors.
# You will convert between them constantly.
# =============================================================================

import numpy as np
import torch


### Topic 1: NumPy to tensor ###
# Data in NumPy, want it in PyTorch?  ->  torch.from_numpy(ndarray)
array = np.arange(1.0, 8.0)
tensor = torch.from_numpy(array)

print("NumPy array:", array)
print("PyTorch tensor:", tensor)
print("Tensor dtype:", tensor.dtype)  # float64: inherited from NumPy!

# NOTE: NumPy defaults to float64, PyTorch to float32. A float64 tensor often
# causes a datatype error later. Convert it right away:
tensor = tensor.type(torch.float32)
print("After .type(torch.float32):", tensor.dtype)

# Careful: .type() makes a COPY, so this new tensor no longer shares anything.
# We will look at sharing in Topic 3, so start fresh there.


### Topic 2: Tensor to NumPy ###
# Data in a PyTorch tensor, want it in NumPy?  ->  tensor.numpy()
tensor = torch.ones(7)
numpy_tensor = tensor.numpy()

print("PyTorch tensor:", tensor)
print("NumPy array:", numpy_tensor)
print("NumPy dtype:", numpy_tensor.dtype)  # float32: inherited from PyTorch


### Topic 3: Do they share memory? ###
# They can. torch.from_numpy and .numpy() do NOT copy the numbers; the tensor and
# the array are two names for the SAME block of memory. So whether a change shows
# up depends on HOW you change it:
#
#   in place   array += 1    edits the numbers where they sit. Both see it.
#   reassign   array = array + 1   builds a BRAND NEW array and moves the name
#                                  array to it. The old numbers (and the tensor) stay.
shared_array = np.arange(1.0, 4.0)
shared_tensor = torch.from_numpy(shared_array)

shared_array += 10  # IN PLACE: change the numbers themselves
print("After shared_array += 10")
print("Array:", shared_array)
print("Tensor:", shared_tensor)  # changed too: same memory

shared_array = shared_array + 1  # REASSIGN: a new array, the name moves
print("After shared_array = shared_array + 1")
print("Array:", shared_array)
print("Tensor:", shared_tensor)  # unchanged: it still points at the OLD array

# The same applies in the other direction (tensor.numpy() shares memory with the tensor).
t = torch.ones(3)
a = t.numpy()
t.add_(5)  # the trailing underscore means "in place" in PyTorch
print("After t.add_(5) -> tensor:", t, "| array:", a)

# WARNING: if you want them to be independent, make a copy: torch.tensor(array)
# copies the numbers, whereas torch.from_numpy(array) shares them.
independent = torch.tensor(np.arange(1.0, 4.0))
print("torch.tensor(...) makes an independent copy:", independent)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make np.array([1, 2, 3]), convert it with from_numpy and check the dtype.
#      Is it float or int this time? Why is it different from the lesson?
#   2. Create an array, share it with from_numpy, then change a SINGLE item with
#      array[0] = 100. Does the tensor see it?
#   3. Repeat step 2 with torch.tensor(array) instead. What changes?
#   4. Why would sharing memory be useful for big datasets, and dangerous too?
# =============================================================================
