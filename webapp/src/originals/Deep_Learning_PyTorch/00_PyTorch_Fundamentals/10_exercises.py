"""
PyTorch Fundamentals: Exercises (Practice Sheet)
"""
import torch

print("Welcome to the PyTorch Fundamentals Exercises!")
print("Try to write the code for these exercises in your own editor before checking the solutions file.\n")

### Topic 1: Create a random tensor with shape (7, 7) ###
print("--- Exercise 2: Create a random tensor with shape (7, 7) ---")
print("# Write your code here:")
print("# x = ...\n")

### Topic 2: Perform a matrix multiplication ###
print("--- Exercise 3: Perform a matrix multiplication ---")
print("Multiply the tensor from Exercise 2 with another random tensor with shape (1, 7).")
print("Hint: you may have to transpose the second tensor.")
print("# Write your code here:")
print("# y = ...")
print("# z = ...\n")

### Topic 3: Random Seeds ###
print("--- Exercise 4: Random Seeds ---")
print("Set the random seed to 0 and do exercises 2 & 3 over again.")
print("The output should be:")
print("(tensor([[1.8542],")
print("         [1.9611],")
print("         [2.2884],")
print("         [3.0481],")
print("         [1.7067],")
print("         [2.5290],")
print("         [1.7989]]), torch.Size([7, 1]))")
print("# Write your code here:")
print("# RANDOM_SEED = ...\n")

### Topic 4: GPU Random Seeds ###
print("--- Exercise 5: GPU Random Seeds ---")
print("We saw how to set it with torch.manual_seed() but is there a GPU equivalent?")
print("If there is, set the GPU random seed to 1234.")
print("# Write your code here:")
print("# torch.cuda...\n")

### Topic 5: Tensors on GPU ###
print("--- Exercise 6: Tensors on GPU ---")
print("Create two random tensors of shape (2, 3) and send them both to the GPU.")
print("Set torch.manual_seed(1234) when creating the tensors.")
print("# Write your code here:")
print("# device = ...\n")

### Topic 6: GPU Matrix Multiplication ###
print("--- Exercise 7: GPU Matrix Multiplication ---")
print("Perform a matrix multiplication on the tensors you created in Exercise 6.")
print("# Write your code here:")
print("# z = ...\n")

### Topic 7: Max and Min ###
print("--- Exercise 8: Max and Min ---")
print("Find the maximum and minimum values of the output of Exercise 7.")
print("# Write your code here:")
print("# max = ...")
print("# min = ...\n")

### Topic 8: Argmax and Argmin ###
print("--- Exercise 9: Argmax and Argmin ---")
print("Find the maximum and minimum index values of the output of Exercise 7.")
print("# Write your code here:")
print("# arg_max = ...")
print("# arg_min = ...\n")

### Topic 9: Squeezing Tensors ###
print("--- Exercise 10: Squeezing Tensors ---")
print("Make a random tensor with shape (1, 1, 1, 10) and then create a new tensor with all the 1 dimensions removed to be left with a tensor of shape (10).")
print("Set the seed to 7 when you create it.")
print("# Write your code here:")
print("# x = ...")
print("# y = ...\n")
