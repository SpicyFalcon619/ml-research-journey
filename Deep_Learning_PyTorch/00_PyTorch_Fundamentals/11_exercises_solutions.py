"""
PyTorch Fundamentals: Exercises (solutions)
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - One worked answer for each exercise in lesson 10, with the reasoning
#   - How to check your own answer: compare shapes first, then values
#
# Spoiler warning: try lesson 10 on your own before reading this. A solution you
# read is forgotten by tomorrow. A solution you wrote stays.
# =============================================================================

import torch


### Exercise 2: A random tensor ###
# torch.rand takes the shape. Values come out between 0 and 1.
x = torch.rand(size=(7, 7))
print("x shape:", x.shape)


### Exercise 3: Matrix multiplication ###
# x is (7, 7). y is (1, 7). Inner dimensions: 7 and 1 do not match, so transpose y
# to (7, 1). Now (7, 7) @ (7, 1) works and the result is the outer dimensions: (7, 1).
y = torch.rand(size=(1, 7))
z = torch.matmul(x, y.T)
print("y shape:", y.shape)
print("z = x @ y.T shape:", z.shape)


### Exercise 4: Random seeds ###
# The seed is set ONCE, before x. Both tensors are then drawn from one repeatable
# sequence, which is what produces the exact numbers the exercise showed.
# (Re-seeding before y would give y the same start as x and change the answer.)
RANDOM_SEED = 0
torch.manual_seed(RANDOM_SEED)
x = torch.rand(size=(7, 7))
y = torch.rand(size=(1, 7))
z = torch.matmul(x, y.T)
print("Result with seed 0:")
print(z)
print("Shape:", z.shape)


### Exercise 5: GPU random seeds ###
# The GPU has its own random generator, set with torch.cuda.manual_seed. (Use
# torch.cuda.manual_seed_all to cover several GPUs.) It is harmless without a GPU.
device = "cuda" if torch.cuda.is_available() else "cpu"
torch.cuda.manual_seed(1234)
gpu_x = torch.rand(7, 1, device=device)  # created ON the device, so the GPU seed matters
print(f"Random tensor made on {device}:")
print(gpu_x)


### Exercise 6: Tensors on the GPU ###
# Build on the CPU with the CPU seed, then move with .to(device).
torch.manual_seed(1234)
tensor_A = torch.rand(size=(2, 3)).to(device)
tensor_B = torch.rand(size=(2, 3)).to(device)
print("Device:", device)
print("Tensor A:")
print(tensor_A)
print("Tensor B:")
print(tensor_B)


### Exercise 7: GPU matrix multiplication ###
# Both are (2, 3): the inner numbers (3 and 2) clash, so transpose B to (3, 2).
# (2, 3) @ (3, 2) gives the outer dimensions (2, 2).
tensor_C = torch.matmul(tensor_A, tensor_B.T)
print("A @ B.T:")
print(tensor_C)
print("Shape:", tensor_C.shape)


### Exercise 8: Max and min ###
max_val = torch.max(tensor_C)
min_val = torch.min(tensor_C)
print("Max:", max_val)
print("Min:", min_val)


### Exercise 9: Argmax and argmin ###
# These give a position in the FLATTENED tensor (counting across rows), not a
# (row, column) pair. In a (2, 2) tensor the positions are 0 to 3.
arg_max = torch.argmax(tensor_C)
arg_min = torch.argmin(tensor_C)
print("Argmax (index of max):", arg_max)
print("Argmin (index of min):", arg_min)


### Exercise 10: Squeezing ###
torch.manual_seed(7)
tensor_1 = torch.rand(size=(1, 1, 1, 10))
tensor_2 = tensor_1.squeeze()  # removes every dimension of size 1
print("Original tensor:")
print(tensor_1)
print("Shape:", tensor_1.shape)
print("Squeezed tensor:")
print(tensor_2)
print("Shape:", tensor_2.shape)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Which exercise did you get wrong first time? Re-do it from scratch tomorrow.
#   2. Rewrite Exercise 7 using the @ operator instead of torch.matmul.
#   3. Make up two NEW exercises of your own for a friend, covering lessons 5 and 6.
#   4. Why does Exercise 4 give different numbers when the seed is set twice?
# =============================================================================
