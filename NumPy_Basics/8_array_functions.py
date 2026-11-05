"""
NumPy Reference: Array functions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Summarising an array: sum, mean, max, min, std
#   - Finding WHERE the biggest or smallest value is: argmax / argmin
#   - The axis idea: summarising per column or per row
#   - Function style  np.sum(a)  vs method style  a.sum()
# =============================================================================

import numpy as np


### Topic 1: Summaries of a 1D array ###
my_array = np.array([3, 4, 5])

print(np.sum(my_array))  # 12: add everything up
print(np.mean(my_array))  # 4.0: the average
print(np.max(my_array))  # 5: the biggest
print(np.min(my_array))  # 3: the smallest
print(np.std(my_array))  # 0.816...: standard deviation, how spread out the numbers are

# Every one of these also exists as a METHOD, written with a dot. Same result:
print(my_array.sum(), my_array.mean())


### Topic 2: Summaries of a 2D array ###
# By default a function looks at EVERY number in the table and gives one answer.
my_matrix = np.array([[1, 2, 3], [4, 5, 6]])

print(np.sum(my_matrix))  # 21
print(np.mean(my_matrix))  # 3.5
print(np.max(my_matrix))  # 6
print(np.min(my_matrix))  # 1
print(np.std(my_matrix))


### Topic 3: axis, summarising per column or per row ###
# axis tells the function WHICH DIRECTION to collapse.
#
#                 axis=1  (collapse the columns -> one answer per ROW)
#                 ------>
#      axis=0   [  1  2  3 ]
#         |     [  4  5  6 ]
#         v
#   (collapse the rows -> one answer per COLUMN)
#
# A way to remember it: the axis you name is the one that DISAPPEARS.

print(np.sum(my_matrix, axis=0))  # [5 7 9]: one total per column
print(np.sum(my_matrix, axis=1))  # [ 6 15]: one total per row
print(np.mean(my_matrix, axis=1))  # [2. 5.]: the average of each row


### Topic 4: Where is the biggest value? ###
# argmax / argmin return the POSITION of the largest / smallest value, not the
# value itself. In ML, argmax picks the class a model is most sure about.
probabilities = np.array([0.1, 0.7, 0.2])
print(np.argmax(probabilities))  # 1: the position of 0.7
print(np.argmin(probabilities))  # 0

# Sorting and running totals:
print(np.sort(np.array([3, 1, 2])))  # [1 2 3] (a new array)
print(np.cumsum(np.array([1, 2, 3, 4])))  # [ 1  3  6 10] running total


### Topic 5: A worked example ###
# Rows = students, columns = subjects (Math, Science, English)
scores = np.array([[72, 85, 90], [88, 79, 95], [60, 70, 65], [91, 88, 84]])

print("Average per student:", np.mean(scores, axis=1))
print("Average per subject:", np.mean(scores, axis=0))
best_student = np.argmax(np.mean(scores, axis=1))
print("Best student is number", best_student)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   Using the 4x3 scores array from Topic 5:
#   1. Find the total sum of ALL scores combined.
#   2. Find the overall average (mean) score across all students and subjects.
#   3. Find the highest score in the entire array.
#   4. Find the average for EACH student (one value per student). Hint: axis=1
#   5. Find the average for EACH subject (one value per subject). Hint: axis=0
#   6. Which subject has the lowest average? (Combine mean, axis and argmin.)
# =============================================================================
