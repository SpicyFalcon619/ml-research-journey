import numpy as np

zero_array = np.zeros(3)
print(zero_array)

one_array = np.ones(3)
print(one_array)

range_array = np.arange(4)
print(range_array)

# Challenge 3:
# NumPy provides functions to generate arrays automatically.
# 
# 1. Use np.zeros() to create an array of five 0s called 'zero_array'.
# 2. Use np.ones() to create a 2D matrix of 1s with 2 rows and 4 columns called 'ones_matrix'.
#    (Hint: pass the shape as a tuple like this: (rows, columns))
# 3. Use np.arange() to create an array containing the numbers 0 to 9 called 'range_array'.
# 
# Print all three of them!

zero_array = np.zeros(5)
ones_matrix = np.ones((2, 4))
range_array = np.arange(10)

print(zero_array)
print(ones_matrix)
print(range_array)