"""
PyTorch Fundamentals: Tensor aggregation
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Aggregation: squashing many numbers into one (min, max, mean, sum)
#   - Why torch.mean needs a decimal (float) tensor
#   - argmin and argmax: WHERE the smallest or biggest value sits
#   - Changing a tensor's datatype when a function demands it
# =============================================================================

import torch


### Topic 1: Min, max, mean and sum ###
# AGGREGATING means boiling many numbers down to one. You will do this constantly,
# for example to turn a long list of errors into one "how wrong am I?" number.
x = torch.arange(0, 100, 10)  # 0, 10, 20, ... 90
print("Tensor x:", x)

# Each exists as a method (x.min()) and as a function (torch.min(x)). Same result.
print("Minimum:", x.min(), "| torch.min(x):", torch.min(x))
print("Maximum:", x.max(), "| torch.max(x):", torch.max(x))
print("Sum:", x.sum(), "| torch.sum(x):", torch.sum(x))

# The answer is still a tensor (a 0-dimensional one). Use .item() for a plain number.
print("Minimum as a normal number:", x.min().item())


### Topic 2: The mean needs decimals ###
# x holds whole numbers (int64), and torch.mean() refuses those, because an
# average is usually a decimal. See the error, then the fix.
try:
    torch.mean(x)
except RuntimeError as error:
    print("RuntimeError:", str(error).splitlines()[0])

# The fix: convert to float32 first (datatypes, lesson 2).
x_float = x.type(torch.float32)
print("Mean:", x_float.mean(), "| torch.mean(...):", torch.mean(x_float))


### Topic 3: Where is the min or max? (argmin / argmax) ###
# min() and max() tell you the VALUE. argmin() and argmax() tell you the POSITION
# (the index) where that value sits. Useful whenever you need to know WHICH
# item won, for example which class a model thinks is most likely.
tensor = torch.arange(0, 100, 10)
print("Tensor:", tensor)
print("Index where max value occurs (argmax):", tensor.argmax())
print("Index where min value occurs (argmin):", tensor.argmin())

# Check it: the biggest value 90 is the last of 10 items, so its index is 9.
print("tensor[9]:", tensor[9])


### Topic 4: Changing the datatype on the fly ###
# We converted with .type(...) above. Here it is on its own, going the other way,
# to a smaller, faster (but less precise) float16.
tensor_float32 = torch.arange(10.0, 100.0, 10.0)  # decimals, so float32
print("Original dtype:", tensor_float32.dtype)

tensor_float16 = tensor_float32.type(torch.float16)
print("New dtype after .type(torch.float16):", tensor_float16.dtype)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make torch.tensor([4, 9, 2, 7]) and find the min, max and the index of each.
#   2. Find the mean of that same tensor. What do you have to do first?
#   3. Make a tensor where the maximum appears twice. Which index does argmax return?
#   4. Why would a model care about the index of the largest value, not the value?
# =============================================================================
