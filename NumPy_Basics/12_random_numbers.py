"""
NumPy Reference: Random numbers
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Making arrays of random numbers: rand, randint, uniform, randn
#   - Seeds: getting the SAME random numbers every time (reproducibility)
#   - Shuffling and picking at random
#   - The modern generator, default_rng
#
# Why? Generating random data is essential in ML: initialising a network's
# weights, making dummy data, shuffling and splitting a dataset. If you haven't
# seen the idea of "pseudo-random" numbers and seeds yet, read 6.2 first.
# =============================================================================

import numpy as np

# Seeding makes the numbers below the same on every run. Without it they change
# each time. Topic 3 explains this properly.
np.random.seed(42)


### Topic 1: The main functions ###
# NumPy has a whole submodule for this: np.random.
# Most functions take  size=  to say how many numbers (and in what shape).

# randint(low, high, size): whole numbers. The HIGH value is excluded!
print(np.random.randint(0, 2))  # 0 or 1, like a coin flip
print(np.random.randint(1, 100, size=(3, 3)))  # a 3x3 table of whole numbers

# uniform(low, high, size): decimals, evenly spread between low and high
custom_floats = np.random.uniform(10, 50, size=5)
print(custom_floats)
print(np.random.uniform(10, 50, size=(2, 4)))

# rand(...): decimals between 0 and 1. The shape goes in as separate numbers,
# no tuple needed.
print(np.random.rand(5))  # 5 numbers
print(np.random.rand(3, 3))  # a 3x3 table

# randn(...): numbers from a "bell curve" (normal distribution), centred on 0.
# Most are near 0, a few are far away. Neural-network weights usually start
# this way.
print(np.random.randn(5))


### Topic 2: Picking and shuffling ###
names = np.array(["Ada", "Bob", "Cy", "Di", "Ed"])

print(np.random.choice(names))  # one random name
print(np.random.choice(names, size=3, replace=False))  # 3 different names

# permutation gives a shuffled copy; shuffle shuffles in place
print(np.random.permutation(5))  # the numbers 0..4 in random order


### Topic 3: Seeds make randomness repeatable ###
# The numbers are pseudo-random: a recipe that starts from a seed number.
# Same seed, same numbers.
np.random.seed(7)
first = np.random.rand(3)
np.random.seed(7)
second = np.random.rand(3)
print(first)
print(second)
print("Identical?", np.array_equal(first, second))

# In ML you set the seed so your experiments can be repeated exactly:
#   random.seed(42)   np.random.seed(42)   torch.manual_seed(42)
# Each library has its OWN generator, so seed each one.


### Topic 4: The modern way, default_rng ###
# np.random.rand(...) and friends are the "legacy" style: simple, and fine for
# learning, but they use one hidden global generator. New code is encouraged to
# make its own generator object instead:
rng = np.random.default_rng(42)  # your own generator, seeded
print(rng.random(3))  # like rand
print(rng.integers(1, 7, size=5))  # like randint (dice rolls: high excluded)
print(rng.normal(0, 1, size=3))  # like randn, with mean and spread you choose
# You will see both styles in tutorials. Now you can read either.


### Topic 5: A random train/test split ###
# Shuffle the row numbers, then cut at 80%:
data = np.arange(10) * 10  # pretend these are 10 samples
indices = np.random.permutation(len(data))
cut = int(len(data) * 0.8)

train = data[indices[:cut]]
test = data[indices[cut:]]
print("train:", train)
print("test :", test)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Generate a 1D array of 5 random floats between 0 and 1 using
#      np.random.rand(). Call it random_floats and print it.
#   2. Generate a 3x3 matrix of random floats between 0 and 1, called
#      random_matrix. (Hint: np.random.rand(3, 3), no tuple needed here!)
#   3. Generate an array of 10 random INTEGERS between 1 and 100 using
#      np.random.randint(). Call it random_ints. (Hint: the arguments are
#      (low, high, size). The high number is exclusive.)
#   4. Simulate 1000 dice rolls and check each face appeared about 1000/6 times.
#      (Hint: np.bincount counts occurrences.)
# =============================================================================
