"""
PyTorch Fundamentals: Reproducibility (taking the random out of random)
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Why "random" numbers are central to how neural networks learn
#   - Why two runs of the same code can give different answers
#   - torch.manual_seed: making randomness repeatable
#   - The rule: set the seed right BEFORE each random operation
# =============================================================================

import torch


### Topic 1: Why randomness matters ###
# In short, this is how a neural network learns:
#
#   start with random numbers
#   -> do tensor operations -> see how wrong the answer is
#   -> nudge the random numbers to be less wrong
#   -> repeat
#
# Since every model starts from random numbers, two training runs of IDENTICAL
# code can end differently. That makes results hard to share and bugs hard to track.

random_tensor_A = torch.rand(3, 4)
random_tensor_B = torch.rand(3, 4)

print("Tensor A:")
print(random_tensor_A)
print("Tensor B:")
print(random_tensor_B)
print("Are they equal?")
print(random_tensor_A == random_tensor_B)  # compares item by item: all False


### Topic 2: Random is not really random ###
# A computer cannot truly be random. It uses a formula that produces numbers that
# LOOK random, starting from a number called the SEED. Same seed, same sequence.
# So if we fix the seed, we can share results and get the same "random" numbers.
RANDOM_SEED = 42

torch.manual_seed(RANDOM_SEED)
random_tensor_C = torch.rand(3, 4)

torch.manual_seed(RANDOM_SEED)  # set it AGAIN before the next random operation
random_tensor_D = torch.rand(3, 4)

print("Tensor C (seed 42):")
print(random_tensor_C)
print("Tensor D (seed 42):")
print(random_tensor_D)
print("Are they equal now?")
print(random_tensor_C == random_tensor_D)  # all True


### Topic 3: The seed is used up ###
# One seed call covers only the random numbers made right AFTER it. Without the
# second manual_seed above, D would have continued the sequence and been different.
torch.manual_seed(RANDOM_SEED)
first = torch.rand(2)
second = torch.rand(2)  # no seed in between: it continues the sequence
print("Two draws after ONE seed are different:", first, second)

# Your habit: call torch.manual_seed(...) right before the random thing you want to repeat.


### Topic 4: Does 42 matter? ###
# No. 42 is a joke from The Hitchhiker's Guide to the Galaxy, and a tradition in
# data science. Any number works. What matters is that you and your reader use
# the SAME one.
torch.manual_seed(0)
print("Seed 0:", torch.rand(2))
torch.manual_seed(1234)
print("Seed 1234:", torch.rand(2))


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Set the seed to 7, create torch.rand(2, 2), print it. Run it twice.
#   2. Remove the seed and run it again. Does the output change each run?
#   3. Create two random tensors after a single seed call. Are they equal?
#   4. Why would a research paper tell you which seed it used?
# =============================================================================
