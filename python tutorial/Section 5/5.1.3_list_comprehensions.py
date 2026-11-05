"""
Python Reference: List comprehensions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The most "Pythonic" feature: building a list in one readable line
#   - The pattern  [ expression  for item in iterable  if condition ]
#   - How a comprehension maps to the for-loop you already know
#   - Filtering, transforming and flattening data with it
#
# You will read and write comprehensions constantly in data and ML code.
# =============================================================================


### Topic 1: From a loop to a comprehension ###
# THE OLD WAY (a traditional for-loop): make an empty list, then fill it.
# It takes 3 lines of code.
squares1 = []
for i in range(1, 10):
    squares1.append(i**2)  # ** is "to the power of", so i**2 is i squared
print("Traditional loop:", squares1)

# THE WEIRD WAY (using map and lambda, see 4.9.6)
# This works, but it's a bit messy to read.
squares2 = list(map(lambda x: x**2, range(1, 10)))
print("Map and Lambda:", squares2)

# THE PYTHONIC WAY: List Comprehensions
# This is clean, readable, and executes faster than the standard for-loop.
# Syntax:   [ expression  for item in iterable ]
#            ----------   ------------------
#            what to put  where the items
#            in the list  come from
squares3 = [x**2 for x in range(1, 10)]
print("List Comprehension:", squares3)

# Read it aloud: "x squared, for each x in range 1 to 9".
# The square brackets are what tell Python the result is a list.


### Topic 2: Adding a filter with if ###
# Add  if <condition>  at the end to keep only some items.
numbers = [-4, -2, 0, 2, 4]

print("\nPositive only:", [x for x in numbers if x >= 0])
print("Evens up to 10:", [x for x in range(11) if x % 2 == 0])

# The loop version of the first line, so you can see they are the same:
positive = []
for x in numbers:
    if x >= 0:
        positive.append(x)
print("Same, with a loop:", positive)


### Topic 3: Transforming every item ###
vec = [-4, -2, 0, 2, 4]

# Create a new list with the values doubled
print("\nDoubled:", [x * 2 for x in vec])

# Apply a function (abs = absolute value) to all the elements
print("Absolute values:", [abs(x) for x in vec])

# Call a method (.strip() removes surrounding spaces, see 3.1.2) on each string
freshfruit = ["  banana", "  loganberry ", "passion fruit  "]
print("Stripped strings:", [fruit.strip() for fruit in freshfruit])

# Create a list of 2-tuples like (number, square)
# NOTE: The tuple (x, x**2) MUST be wrapped in parentheses, or Python will throw a SyntaxError!
print("Tuples:", [(x, x**2) for x in range(6)])

# if / else INSIDE the expression part (it goes BEFORE the for, not after):
print("Labels:", ["even" if x % 2 == 0 else "odd" for x in range(5)])
# Rule: a lone `if` (filter) goes AFTER the for; an `if ... else` (choice) goes BEFORE it.


### Topic 4: Several loops in one comprehension ###
# Suppose we want to combine two lists, but only if the numbers aren't equal.

# The Old Way (3 levels deep!)
combs1 = []
for x in [1, 2, 3]:
    for y in [3, 1, 4]:
        if x != y:
            combs1.append((x, y))
print("\nNested Loop:", combs1)

# The Pythonic Way (flattened into one line)
# Notice how the order of the 'for' and 'if' parts reads EXACTLY the same as the loops above!
combs2 = [(x, y) for x in [1, 2, 3] for y in [3, 1, 4] if x != y]
print("Nested Comprehension:", combs2)

# Flatten a 2D list (a list of lists) into a single flat list.
# Read the two for-parts in the same order as two nested loops.
vec2d = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print("Flattened list:", [num for elem in vec2d for num in elem])


### Topic 5: Rounding pi, a few functions in one go ###
# `from math import pi` imports the constant pi from the math module (see 6.1).
# Note how it calls a function (round) AND converts to a string (str) in one go!
from math import pi

print("Pi rounded:", [str(round(pi, i)) for i in range(1, 6)])


### Topic 6: Dictionary and set comprehensions ###
# The same idea works with curly braces, for dictionaries and sets:
print("Dict:", {x: x**2 for x in range(1, 5)})  # key: value
print("Set:", {len(w) for w in ["a", "bb", "cc", "ddd"]})  # duplicates collapse
# (More in 5.4 and 5.5.)

# WHEN NOT TO USE ONE: if it no longer fits comfortably on one line, or needs
# more than one `for` and an `if`, a normal loop is easier to read.
# Clever and unreadable is not a win.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make a list of the cubes of 1..10 with a comprehension.
#   2. From ["apple", "kiwi", "banana", "fig"] keep only the words with more
#      than 3 letters, in UPPER case.
#   3. Convert [32, 50, 212] from Fahrenheit to Celsius: (f - 32) * 5 / 9.
#   4. Rewrite your answer to question 2 as a normal for loop, then back again.
# =============================================================================
