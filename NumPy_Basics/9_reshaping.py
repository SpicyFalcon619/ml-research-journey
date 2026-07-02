from numpy import reshape
import numpy as np

my_array = np.arange(9)
# print(my_array)

reshaped = my_array.reshape(3, 3)
# print(reshaped)

flattened = reshaped.flatten();
# print(flattened)

# Challenge 8: Reshaping
# Start with this 1D array of 12 numbers:
data = np.arange(1, 13)   # [1, 2, 3, ..., 12]

# 1. Reshape 'data' into a 3x4 matrix (3 rows, 4 columns) called 'matrix_3x4'.
#    Print it.
# 2. Reshape 'data' into a 4x3 matrix (4 rows, 3 columns) called 'matrix_4x3'.
#    Print it.
# 3. Flatten 'matrix_3x4' back into a 1D array called 'flat'.
#    Print it.
# BONUS: Try reshaping 'data' into a (2, 3, 2) 3D array. What does it look like?

matrix_3x4 = data.reshape(3, 4)
matrix_4x3 = data.reshape(4, 3)
flat = matrix_3x4.flatten()
matrix_3d = data.reshape(2, 3, 2)

print(matrix_3x4)
print(matrix_4x3)
print(flat)
print(matrix_3d)