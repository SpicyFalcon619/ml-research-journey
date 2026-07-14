"""
PyTorch Fundamentals: Exercises (Solutions)
"""
import torch

### Topic 1: Create a random tensor with shape (7, 7) ###
print("--- Exercise 2: Create a random tensor with shape (7, 7) ---")
x = torch.rand(size=(7, 7))
print(f"x:\n{x}\nShape: {x.shape}\n")


### Topic 2: Perform a matrix multiplication ###
print("--- Exercise 3: Perform a matrix multiplication ---")
y = torch.rand(size=(1, 7))
print(f"y:\n{y}\nShape: {y.shape}\n")

# Matrix multiply tensors
z = torch.matmul(x, y.T)
print(f"Result (z = x * y.T):\n{z}\nShape: {z.shape}\n")


### Topic 3: Random Seeds ###
print("--- Exercise 4: Random Seeds ---")
RANDOM_SEED = 0

torch.manual_seed(RANDOM_SEED)
x = torch.rand(size=(7, 7))

torch.manual_seed(RANDOM_SEED)
y = torch.rand(size=(1, 7))

z = torch.matmul(x, y.T)
print(f"Result with seed {RANDOM_SEED}:\n{z}\nShape: {z.shape}\n")


### Topic 4: GPU Random Seeds ###
print("--- Exercise 5: GPU Random Seeds ---")
torch.cuda.manual_seed(1234)
gpu_x = torch.rand(7, 1)
print(f"Random tensor with GPU seed 1234:\n{gpu_x}\n")


### Topic 5: Tensors on GPU ###
print("--- Exercise 6: Tensors on GPU ---")
torch.manual_seed(1234)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Device: {device}")

tensor_A = torch.rand(size=(2, 3)).to(device)
tensor_B = torch.rand(size=(2, 3)).to(device)
print(f"Tensor A:\n{tensor_A}")
print(f"Tensor B:\n{tensor_B}\n")


### Topic 6: GPU Matrix Multiplication ###
print("--- Exercise 7: GPU Matrix Multiplication ---")
tensor_C = torch.mm(tensor_A, tensor_B.T)
print(f"Result (A * B.T):\n{tensor_C}\nShape: {tensor_C.shape}\n")


### Topic 7: Max and Min ###
print("--- Exercise 8: Max and Min ---")
max_val = torch.max(tensor_C)
min_val = torch.min(tensor_C)
print(f"Max: {max_val}")
print(f"Min: {min_val}\n")


### Topic 8: Argmax and Argmin ###
print("--- Exercise 9: Argmax and Argmin ---")
arg_max = torch.argmax(tensor_C)
arg_min = torch.argmin(tensor_C)
print(f"Argmax (index of max): {arg_max}")
print(f"Argmin (index of min): {arg_min}\n")


### Topic 9: Squeezing Tensors ###
print("--- Exercise 10: Squeezing Tensors ---")
torch.manual_seed(7)
tensor_1 = torch.rand(size=(1, 1, 1, 10))
tensor_2 = tensor_1.squeeze()

print(f"Original tensor:\n{tensor_1}\nShape: {tensor_1.shape}\n")
print(f"Squeezed tensor:\n{tensor_2}\nShape: {tensor_2.shape}")
