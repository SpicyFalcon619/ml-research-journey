import numpy as np

random = np.random.randint(0, 2)
# print(random)

custom_floats = np.random.uniform(10, 50, size=5)
# print(custom_floats)

int_matrix = np.random.randint(1, 100, size=(3, 3))
# print(int_matrix)

float_matrix = np.random.uniform(10, 50, size=(2, 4))
# print(float_matrix)

# Challenge 11: Random Numbers
# Generating random data is essential in ML for initializing weights or creating dummy data.
# NumPy has a whole submodule for this: np.random

# 1. Generate a 1D array of 5 random floats between 0 and 1 using np.random.rand()
#    Call it 'random_floats' and print it.
# 
# 2. Generate a 3x3 matrix of random floats between 0 and 1.
#    Call it 'random_matrix' and print it.
#    (Hint: pass the dimensions directly like np.random.rand(3, 3) — no tuple needed here!)
#
# 3. Generate an array of 10 random INTEGERS between 1 and 100 using np.random.randint()
#    Call it 'random_ints' and print it.
#    (Hint: the arguments are (low, high, size). The 'high' number is exclusive.)

random_floats = np.random.rand(5)
print(random_floats)

random_matrix = np.random.rand(3, 3)
print(random_matrix)

random_ints = np.random.randint(1, 100, size=10)
print(random_ints)