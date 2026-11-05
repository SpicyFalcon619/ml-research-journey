"""
PyTorch Fundamentals: Tensor datatypes and information
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Why a tensor has a datatype, and what float32 / float16 / int32 mean
#   - How to change the datatype of a tensor
#   - The three attributes to check when something breaks: dtype, shape, device
#   - Why wrong datatype, wrong shape and wrong device cause most PyTorch errors
# =============================================================================

import torch

torch.manual_seed(42)  # so the random numbers below match yours (see lesson 8)


### Topic 1: Datatypes ###
# Every number in a tensor is stored using a fixed amount of computer memory. That
# choice is the DATATYPE (dtype). More bits means more precision, but more memory
# and slower maths:
#   torch.float32   32 bits per number. The default for decimals. Safe choice.
#   torch.float16   16 bits. Half the memory, less precise. Used to speed up GPUs.
#   torch.int32     32 bits, whole numbers only
#   torch.int64     64 bits, whole numbers. What torch.tensor([1, 2]) gives you.
#
# Beginners rarely need to choose, but you MUST know the dtype exists, because
# mixing the wrong ones is a very common error.

float_32_tensor = torch.tensor(
    [3.0, 6.0, 9.0],
    dtype=None,  # None means the default, float32
    device=None,  # None means the default device (the CPU)
    requires_grad=False,  # True would make PyTorch track maths for learning
)
print("Float32 tensor:", float_32_tensor)
print("Its dtype:", float_32_tensor.dtype)

# requires_grad is how PyTorch knows which numbers a model is allowed to adjust
# while learning. You will meet it for real in the Workflow lessons.


### Topic 2: Changing the datatype ###
# .type(...) returns a COPY with the new type. The original is unchanged.
float_16_tensor = float_32_tensor.type(torch.float16)
print("Float16 tensor:", float_16_tensor)
print("Its dtype:", float_16_tensor.dtype)
print("Original is still:", float_32_tensor.dtype)


### Topic 3: Mixing datatypes ###
# Operations between different types often work, because PyTorch promotes the
# result to the "bigger" type. Here whole numbers times decimals gives decimals.
int_32_tensor = torch.tensor([3, 6, 9], dtype=torch.int32)
print("Int32 tensor:", int_32_tensor)
print("Int32 * Float32:", int_32_tensor * float_32_tensor)

# But some functions refuse. torch.mean needs decimals, as the next lesson shows.
try:
    torch.mean(int_32_tensor)
except RuntimeError as error:
    print("RuntimeError:", str(error).splitlines()[0])


### Topic 4: Getting information from a tensor ###
# When something goes wrong, ask the tensor these THREE questions first:
#   1. What datatype is it?    (.dtype)
#   2. What shape is it?       (.shape)
#   3. Which device is it on?  (.device)  CPU or GPU
some_tensor = torch.rand(3, 4)
print("Here is our tensor:")
print(some_tensor)

print("1. Datatype of tensor:", some_tensor.dtype)
print("2. Shape of tensor:", some_tensor.shape)
print("3. Device tensor is on:", some_tensor.device)

# The three big PyTorch errors, in plain words:
#   "wrong dtype"   your two tensors hold different kinds of number
#   "wrong shape"   the grids do not line up (lesson 3)
#   "wrong device"  one tensor is on the GPU and the other is on the CPU (lesson 9)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make torch.tensor([1, 2, 3]) and print its dtype. Is it float or int?
#   2. Convert it to float32 with .type() and print the result.
#   3. Create a random tensor of shape (2, 5) and print all three attributes.
#   4. Why might someone choose float16 over float32?
# =============================================================================
