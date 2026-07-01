# -----------------------------------------------------
# NESTED LIST COMPREHENSIONS (Transposing a Matrix)
# -----------------------------------------------------
# NOTE: In real Machine Learning, we NEVER do this manually! 
# We use NumPy arrays instead, which have a built-in matrix.transpose() function.

matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]

print("Original Matrix:")
for row in matrix:
    print(row)

# This nested comprehension swaps the rows and columns
transposed = [[row[i] for row in matrix] for i in range(4)]

print("\nTransposed Matrix:")
for row in transposed:
    print(row)
    
# The SUPER Pythonic Way (Using zip and unpacking)
# zip() groups elements from multiple iterables together. 
# *matrix unpacks the matrix into separate rows.
print("\nTransposed using zip():")
print(list(zip(*matrix)))