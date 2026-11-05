"""
PyTorch Fundamentals: Exercises (practice sheet)
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Whether lessons 1 to 9 actually stuck: this sheet has nothing new in it
#   - How to practise: write each answer yourself before you look anywhere else
#
# How to use it: copy each task into a scratch file and try it. When you are
# stuck, re-read the lesson in the brackets. Only then open the next lesson
# (11, the solutions) and compare. Struggling a little is how it sticks.
#
# Based on the exercises from Daniel Bourke's Zero to Mastery PyTorch course.
# =============================================================================

import torch

print("Exercises for PyTorch Fundamentals. Write the code in your own editor.")
print("The solutions are in the next lesson. Try first!")


### Exercise 1: Read ###
# Spend 10 minutes reading the torch.Tensor documentation page at
# pytorch.org/docs/stable/tensors.html. You do not need to understand it all.
# The goal is to get used to what the official docs look like, because you will
# live in them.


### Exercise 2: A random tensor  (lesson 1) ###
# Create a random tensor with shape (7, 7).


### Exercise 3: Matrix multiplication  (lesson 3) ###
# Multiply the tensor from Exercise 2 with another random tensor of shape (1, 7).
# Hint: the shapes will not match as they are, so you will have to transpose one.
# Predict the output shape before you run it.


### Exercise 4: Random seeds  (lesson 8) ###
# Set the random seed to 0 and do Exercises 2 and 3 over again.
# Set the seed ONCE, before you create the first tensor, then create both.
#
# Your answer should be exactly this (if it is not, check where you put the seed):
#
#   (tensor([[1.8542],
#            [1.9611],
#            [2.2884],
#            [3.0481],
#            [1.7067],
#            [2.5290],
#            [1.7989]]), torch.Size([7, 1]))


### Exercise 5: GPU random seeds  (lesson 8, lesson 9) ###
# We saw torch.manual_seed(). Is there a GPU equivalent? Find it (the docs help),
# and use it to set the GPU random seed to 1234.


### Exercise 6: Tensors on the GPU  (lesson 9) ###
# Create two random tensors of shape (2, 3) and send both to the GPU (or the CPU
# if you have no GPU, using device-agnostic code). Set torch.manual_seed(1234)
# before you create them.


### Exercise 7: GPU matrix multiplication  (lesson 3) ###
# Perform a matrix multiplication on the two tensors from Exercise 6.
# Hint: the shapes are both (2, 3), so remember Rule 1 and the transpose.


### Exercise 8: Max and min  (lesson 4) ###
# Find the maximum and minimum values of the output of Exercise 7.


### Exercise 9: Argmax and argmin  (lesson 4) ###
# Find the INDEX of the maximum and minimum values of the output of Exercise 7.


### Exercise 10: Squeezing  (lesson 5) ###
# Make a random tensor of shape (1, 1, 1, 10), then create a new tensor from it with
# all the size-1 dimensions removed, leaving shape (10,). Set the seed to 7 first.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Do Exercises 2 to 10 above, in order, in one file.
#   2. Run it on the CPU, then (if you have one) on the GPU. Are results the same?
#   3. For each exercise, write down the shape of every tensor BEFORE running it.
#   4. Only then open lesson 11 and compare with the solutions.
# =============================================================================
