"""
Python Reference: Random numbers
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Python's random module: random floats, integers, choices, shuffles
#   - Why computer "randomness" is really a repeatable recipe (pseudo-random)
#   - Seeds: how to make random results reproducible (crucial in ML!)
#   - Building a random train/test split by hand
# =============================================================================

import random


### Topic 1: Why randomness matters in ML ###
# Machine learning is full of dice rolls:
#   - a neural network starts with random weights
#   - the training data is shuffled before every epoch
#   - data is split randomly into train and test sets
#   - dropout randomly switches neurons off
# So you need to know how random numbers work, AND how to control them.


### Topic 2: Pseudo-randomness and seeds ###
# Computers can't truly roll dice. A PSEUDO-random generator is a recipe: it takes
# a starting number, the SEED, and produces a long sequence of numbers that
# LOOKS random. Same seed in, same sequence out, every single time.
#
# By default Python picks a different seed on each run, so each run differs.
# Setting your own seed makes everything repeatable.

random.seed(42)
first_run = [random.random() for _ in range(3)]

random.seed(42)  # reset to the same starting point...
second_run = [random.random() for _ in range(3)]

print("First run :", first_run)
print("Second run:", second_run)
print("Identical?", first_run == second_run)  # True!

# This is why research code starts with something like
#   random.seed(42)   np.random.seed(42)   torch.manual_seed(42)
# so that someone else (or you next week) can get the very same results.
# (42 is just a popular, arbitrary choice.)

# We seed once below, so the examples in the rest of this lesson give the same
# output every time you run the file.
random.seed(2024)


### Topic 3: The main functions ###
# random.random()        a float from 0.0 up to (not including) 1.0
print("\nrandom():", random.random())

# random.uniform(a, b)   a float anywhere between a and b
print("uniform(10, 20):", random.uniform(10, 20))

# random.randint(a, b)   a whole number from a to b, BOTH ends included
print("randint(1, 6) (a dice roll):", random.randint(1, 6))

# random.randrange(...)  like range(): the stop value is NOT included
print("randrange(0, 10, 2) (even number below 10):", random.randrange(0, 10, 2))

# random.gauss(mu, sigma)  a "bell curve" number centred on mu, with spread sigma.
# Neural-network weights are often initialised from a bell curve like this.
print("gauss(0, 1):", random.gauss(0, 1))


### Topic 4: Picking from collections ###
colors = ["red", "green", "blue", "yellow", "purple"]

# choice: ONE random item
print("\nchoice:", random.choice(colors))

# sample: several DIFFERENT items (no repeats), a list is returned
print("sample 3:", random.sample(colors, k=3))

# choices: several items, repeats allowed ("with replacement")
print("choices 3:", random.choices(colors, k=3))

# shuffle: reorders a list IN PLACE (the list itself changes, returns None)
deck = [1, 2, 3, 4, 5, 6]
random.shuffle(deck)
print("shuffled:", deck)


### Topic 5: Does it look uniform? ###
# Roll a die 6000 times and count. Each face should come up about 1000 times.
counts = {face: 0 for face in range(1, 7)}
for _ in range(6000):
    counts[random.randint(1, 6)] += 1
print("\n6000 dice rolls:", counts)
# Not exactly 1000 each, that is what randomness looks like. With more rolls
# the proportions get closer to equal (the law of large numbers).


### Topic 6: A hand-made train/test split ###
# The standard ML recipe: shuffle the samples, then cut the list at 80%.
# (scikit-learn's train_test_split does this for you later; now you know how.)
random.seed(7)
samples = list(range(1, 11))  # pretend these are 10 data points
random.shuffle(samples)

cut = int(len(samples) * 0.8)  # 80% of 10 = 8
train = samples[:cut]
test = samples[cut:]
print("\ntrain:", train)
print("test :", test)
print("No overlap?", set(train).isdisjoint(set(test)))  # sets, see 5.4

# Fixing the seed (7) means you get this same split every time, so results
# from different experiments can be compared fairly.


### Topic 7: NumPy and PyTorch have their own generators ###
# random.seed() only controls THIS module. numpy.random and torch each have
# their own generator, so seed each of them separately.
#   numpy:   np.random.seed(42)    or    rng = np.random.default_rng(42)
#   pytorch: torch.manual_seed(42)
# See the NumPy_Basics and PyTorch lessons for them.

# Security note: random is NOT safe for passwords or secret tokens, because it is
# predictable. For those, Python provides the separate `secrets` module.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Simulate flipping a coin 1000 times (random.choice(["H", "T"])) and
#      print how many heads you got.
#   2. Pick a random day of the week from a list, and a random number from 1-100.
#   3. Remove random.seed() calls, run twice, and watch the output change.
#      Then put the seed back.
#   4. Use random.sample(range(100), 10) to pick 10 different student IDs.
# =============================================================================
