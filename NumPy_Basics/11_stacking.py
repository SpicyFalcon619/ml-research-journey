"""
NumPy Reference: Stacking
"""

import numpy as np

arr1 = np.array([["John", "Felipe", "Michael"], ["Russel", "Jim", "Andrew"]])

arr2 = np.array([[1, 2, 3], [4, 5, 6]])

# print(np.hstack((arr1, arr2)))

### Topic: Stacking and Concatenating ###
# Here are the test scores for Class A and Class B
class_a = np.array([85, 90, 88])
class_b = np.array([78, 82, 80])

# 1. Combine them into a single long 1D array called 'all_scores' using np.concatenate()
#    (Hint: you need to pass them as a tuple inside the function!)
# 2. Print 'all_scores'
#
# 3. Stack them vertically so they form a 2D array (matrix) where Class A is the first row
#    and Class B is the second row. Variable: 'score_matrix' and use np.vstack()
# 4. Print 'score_matrix'
#
# 5. Stack them horizontally using np.hstack() called 'horizontal_scores'
# 6. Print 'horizontal_scores'. (Compare how this looks to your answer in #1!)

all_scores = np.concat((class_a, class_b))
print(all_scores)

score_matrix = np.vstack((class_a, class_b))
print(score_matrix)

horizontal_scores = np.hstack((class_a, class_b))
print(horizontal_scores)
