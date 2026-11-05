"""
NumPy Reference: Array math
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Element-wise maths: one operation applied to EVERY item at once
#   - Maths between an array and a single number, and between two arrays
#   - Built-in maths functions (sqrt, exp, log...)
#   - Broadcasting: how NumPy stretches a small array to fit a bigger one
#   - Comparisons that give True/False for each item
# =============================================================================

import numpy as np


### Topic 1: An array and a single number ###
# NumPy arrays allow you to do math on every single item in the array at once!
# No loop needed. This is called "element-wise" maths.
my_array = np.array([1, 2, 3]) + 3
print(my_array)  # [4 5 6]

prices = np.array([10, 20, 30, 40, 50])
print(prices * 2)  # every price doubled
print(prices - 5)
print(prices / 10)
print(prices**2)  # ** is "to the power of"
print(prices % 20)  # remainder after dividing by 20 (see 3.1.1)


### Topic 2: Two arrays of the same shape ###
# With two arrays the maths pairs up the items in the same position:
a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

print(a + b)  # [11 22 33]: 1+10, 2+20, 3+30
print(a * b)  # [10 40 90]: 1*10, 2*20, 3*30  (NOT a matrix multiplication)

# If the shapes don't match, NumPy complains:
try:
    print(np.array([1, 2, 3]) + np.array([1, 2]))
except ValueError as error:
    print("ValueError:", error)


### Topic 3: Maths functions ###
# NumPy has a function for every common operation, and each works on a whole array:
numbers = np.array([1, 4, 9, 16])
print(np.sqrt(numbers))  # square roots
print(np.exp(np.array([0, 1])))  # e to the power of each
print(np.log(np.array([1, np.e])))  # natural logarithm
print(np.abs(np.array([-3, 2, -1])))  # absolute values
# exp and log appear in ML in the sigmoid, softmax and cross-entropy loss.


### Topic 4: Broadcasting ###
# We already used it above: prices * 2 stretched the single number 2 to fit the
# whole array. That stretching is called BROADCASTING. It also works between
# arrays of different shapes, as long as they line up. Example: add one row to
# every row of a table.
table = np.array([[1, 2, 3], [4, 5, 6]])
row = np.array([10, 20, 30])

print(table + row)
# [[11 22 33]   <- row added to the first row
#  [14 25 36]]  <- and to the second row

# Real ML use: normalising data. Subtract the average and divide by the spread:
scores = np.array([70, 80, 90, 100])
normalised = (scores - scores.mean()) / scores.std()
print(normalised)  # centred on 0


### Topic 5: Comparisons ###
# Comparing an array gives an array of True/False, one for each item.
# This is the basis of filtering (see 10_boolean_masking).
print(prices > 25)
print(prices == 30)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   prices = np.array([10, 20, 30, 40, 50])
#   1. Everything is on sale for 50% off! Make sale_prices by dividing prices by 2
#      and print it.
#   2. An evil wizard cursed the store and added $100 to every original price.
#      Make cursed_prices and print it.
#   3. Add 10% tax to every price with one line of array maths.
#   4. Convert the temperatures [0, 25, 100] from Celsius to Fahrenheit using
#      the formula  c * 9 / 5 + 32.
# =============================================================================
