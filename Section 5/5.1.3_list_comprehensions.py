# THE OLD WAY (Using a traditional for-loop)
# This takes 3 lines of code.
squares1 = []
for i in range(1, 10):
    squares1.append(i**2)
print("Traditional loop:", squares1)

# THE WEIRD WAY (Using map and lambda)
# This works, but it's a bit messy to read.
squares2 = list(map(lambda x: x**2, range(1, 10)))
print("Map and Lambda:", squares2)

# THE PYTHONIC WAY: List Comprehensions
# This is clean, readable, and executes faster than the standard for-loop.
# Syntax: [ expression for item in iterable ]
squares3 = [x**2 for x in range(1, 10)]
print("List Comprehension:", squares3)

# ADVANCED: Nested Loops inside a List Comprehension
# Suppose we want to combine two lists, but only if the numbers aren't equal.

# The Old Way (3 levels deep!)
combs1 = []
for x in [1, 2, 3]:
    for y in [3, 1, 4]:
        if x != y:
            combs1.append((x, y))
print("\nNested Loop:", combs1)

# The Pythonic Way (Flattened into one line)
# Notice how the order of the 'for' and 'if' statements reads EXACTLY the same as the loops above!
combs2 = [(x, y) for x in [1, 2, 3] for y in [3, 1, 4] if x != y]
print("Nested Comprehension:", combs2)