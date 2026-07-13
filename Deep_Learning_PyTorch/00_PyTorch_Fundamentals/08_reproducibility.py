"""
PyTorch Fundamentals: Reproducibility (trying to take the random out of random)
"""
import torch

### Topic 1: Random Seeds ###
print("--- Topic 1: Random Seeds ---")
# In short how a neural network learns:
# start with random numbers -> tensor operations -> update random numbers -> tensor operations -> ...

# Create two random tensors
random_tensor_A = torch.rand(3, 4)
random_tensor_B = torch.rand(3, 4)

print(f"Tensor A:\n{random_tensor_A}")
print(f"Tensor B:\n{random_tensor_B}")
print(f"Are they equal? {random_tensor_A == random_tensor_B}\n")

# But what if we want to share our results and guarantee someone else gets the exact same "random" numbers?
# We use a random seed!
print("--- Using Random Seeds ---")
RANDOM_SEED = 42

# We have to set the seed manually BEFORE EACH random operation we want to be reproducible
torch.manual_seed(RANDOM_SEED)
random_tensor_C = torch.rand(3, 4)

torch.manual_seed(RANDOM_SEED) # Set it again right before the next random generation!
random_tensor_D = torch.rand(3, 4)

print(f"Tensor C (Seed 42):\n{random_tensor_C}")
print(f"Tensor D (Seed 42):\n{random_tensor_D}")
print(f"Are they equal now? {random_tensor_C == random_tensor_D}")
