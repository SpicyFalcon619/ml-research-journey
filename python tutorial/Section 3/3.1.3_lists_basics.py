"""
Python Reference: Lists basics
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a list is and why we need one
#   - Reading items by position (indexing) and in chunks (slicing)
#   - Changing a list: adding items, replacing items
#   - Lists inside lists (the shape of a table or a matrix)
#   - The #1 beginner trap: two names pointing at the SAME list
#
# This is the gentle introduction. Section 5 comes back with every list method,
# plus stacks, queues and comprehensions.
# =============================================================================


### Topic 1: Why lists? ###
# Imagine storing the test scores of 30 students. 30 separate variables
# (score1, score2, score3, ...) would be a nightmare. A LIST holds many values
# in ONE variable, in order. Write it with square brackets, separated by commas.

scores = [72, 88, 95, 60, 81]
print(scores)
print(type(scores))  # <class 'list'>

# A list can hold any kind of value, even a mix (though same-type is usual).
mixed = ["Ada", 36, 5.5, True]
empty = []  # an empty list: a basket with nothing in it yet
print(mixed, empty)

# len() tells you how many items there are.
print(len(scores))  # 5


### Topic 2: Reading items (indexing) ###
# Exactly like characters in a string (3.1.2): positions start at 0,
# and negative numbers count from the end.
#
#    scores =  [ 72,  88,  95,  60,  81 ]
#   position:     0    1    2    3    4
#   from end:    -5   -4   -3   -2   -1

print(scores[0])  # 72  (first item)
print(scores[2])  # 95
print(scores[-1])  # 81  (last item)

# scores[5] would be an IndexError: the last valid index is len(scores) - 1.


### Topic 3: Slicing a list ###
# list[start:stop] gives a NEW list. It includes start but stops BEFORE stop.
print(scores[1:4])  # [88, 95, 60]  (positions 1, 2 and 3)
print(scores[:2])  # [72, 88]      (the first two)
print(scores[-2:])  # [60, 81]      (the last two)
print(scores[::2])  # [72, 95, 81]  (every second item)
print(scores[::-1])  # [81, 60, 95, 88, 72]  (reversed)

# In ML you split data like this constantly:
#   train = data[:80]     # the first 80 samples
#   test = data[80:]      # everything after


### Topic 4: Lists can be changed ###
# Unlike strings, a list is MUTABLE: you can change it after creating it.

scores[0] = 75  # replace the item at position 0
print(scores)

scores.append(99)  # add one item to the END
print(scores)

scores.insert(1, 70)  # insert 70 at position 1, pushing the others right
print(scores)

scores.remove(60)  # remove the first item that equals 60
print(scores)

last = scores.pop()  # remove AND hand back the last item
print("Removed:", last, "-> now", scores)

# Join two lists with +, repeat a list with *.
print([1, 2] + [3, 4])  # [1, 2, 3, 4]
print([0] * 5)  # [0, 0, 0, 0, 0]  (a quick way to make a list of zeros)

# Test membership with 'in'.
print(95 in scores)  # True
print(100 in scores)  # False

# Some handy built-in functions that work on a list of numbers:
print(min(scores), max(scores), sum(scores))
print(sorted(scores))  # a NEW sorted list; 'scores' itself is untouched


### Topic 5: Lists inside lists ###
# A list can contain other lists. A list of rows is how you describe a table,
# a grid, or a MATRIX.

grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(grid[0])  # [1, 2, 3]  -> the first row
print(grid[1][2])  # 6          -> row 1, then item 2 inside that row
# Read grid[1][2] left to right: "take row 1, then take item 2 from it."

# NumPy arrays and PyTorch tensors are the grown-up, fast version of exactly
# this idea. If you understand grid[row][column], you understand most of
# array indexing already.


### Topic 6: The aliasing trap (two names, ONE list) ###
# This catches everybody once. Assigning a list to a new name does NOT copy it.
# It just sticks a second label on the SAME list.

original = [1, 2, 3]
alias = original  # NOT a copy: both names point at one list
alias.append(4)
print(original)  # [1, 2, 3, 4] <- 'original' changed too!
print(alias is original)  # True: 'is' checks "the very same object"

# To get a real, independent copy, ask for one:
real_copy = original.copy()  # or:  list(original)  or:  original[:]
real_copy.append(5)
print(original)  # [1, 2, 3, 4]    untouched this time
print(real_copy)  # [1, 2, 3, 4, 5]

# Rule of thumb: numbers, strings and tuples can't be changed, so sharing them
# is harmless. Lists (and dictionaries, sets) CAN be changed, so be careful
# who else is holding a label to the same one.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make a list of your 5 favourite foods. Print the first, the last, and
#      the middle three.
#   2. Add a sixth food, then remove the second one.
#   3. Build a 3x3 list of lists, then print the diagonal (grid[0][0],
#      grid[1][1], grid[2][2]).
#   4. Predict the output, then check:  a = [1, 2]; b = a; b.append(3); print(a)
# =============================================================================
