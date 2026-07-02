import numpy as np

arr = np.array([10, 20, 30, 40])
# print(arr[0])
# print(arr[-1])
# print(arr[1:3])

matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
# print(matrix[0, 0])
# print(matrix[0, :])
# print(matrix[1, 0])
# print(matrix[:, :])

# Challenge 6: Indexing & Slicing
# Here is your array to work with:
scores = np.array([[85, 92, 78],
                   [90, 88, 95],
                   [70, 75, 80]])

# This is a 3x3 matrix. Think of it as 3 students, each with 3 test scores.
# Row 0 = Student 1, Row 1 = Student 2, Row 2 = Student 3
# Column 0 = Test 1,  Column 1 = Test 2,  Column 2 = Test 3

# 1. Print the score of Student 2 on Test 3 (should be 95)
# 2. Print ALL scores of Student 3 (the entire last row)
# 3. Print ALL students' scores on Test 1 (the entire first column)
# 4. BONUS: Print only the scores of Students 1 and 2 (first two rows)

print(scores[1, 2])
print(scores[2, :])
print(scores[:, 0])
print(scores[0:2, :])