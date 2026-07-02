import numpy as np

my_array = np.array([3, 4, 5])
# print(np.sum(my_array))
# print(np.mean(my_array))
# print(np.max(my_array))
# print(np.min(my_array))
# print(np.std(my_array))

my_matrix = np.array([[1, 2, 3],
                     [4, 5, 6]])
# print(np.sum(my_matrix))
# print(np.mean(my_matrix))
# print(np.max(my_matrix))
# print(np.min(my_matrix))
# print(np.std(my_matrix))

# print(np.mean(my_matrix, axis=1))

# Challenge 7: Array Functions
# Here are the exam scores from 4 students across 3 subjects:
scores = np.array([[72, 85, 90],
                   [88, 79, 95],
                   [60, 70, 65],
                   [91, 88, 84]])

# Row = Student, Column = Subject (Math, Science, English)

# 1. Find the total sum of ALL scores combined.
# 2. Find the overall average (mean) score across all students and subjects.
# 3. Find the highest score in the entire array.
# 4. Find the average score for EACH student (one value per student).
#    Hint: use axis=1
# 5. Find the average score for EACH subject (one value per subject).
#    Hint: use axis=0

print(np.sum(scores))
print(np.mean(scores))
print(np.max(scores))
print(np.mean(scores, axis=1))
print(np.mean(scores, axis=0))