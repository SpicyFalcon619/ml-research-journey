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

# -----------------------------------------------------
# MORE EXAMPLES OF LIST COMPREHENSIONS
# -----------------------------------------------------
vec = [-4, -2, 0, 2, 4]

# Create a new list with the values doubled
print("\nDoubled:", [x*2 for x in vec])

# Filter the list to exclude negative numbers using an 'if' condition
print("Positive only:", [x for x in vec if x >= 0])

# Apply a function (abs) to all the elements
print("Absolute values:", [abs(x) for x in vec])

# Call a method (.strip()) on each string element to remove whitespace
freshfruit = ['  banana', '  loganberry ', 'passion fruit  ']
print("Stripped strings:", [weapon.strip() for weapon in freshfruit])

# Create a list of 2-tuples like (number, square)
# NOTE: The tuple (x, x**2) MUST be wrapped in parentheses, or Python will throw a SyntaxError!
print("Tuples:", [(x, x**2) for x in range(6)])

# Flatten a 2D list (a list of lists) into a single flat list
vec2d = [[1,2,3], [4,5,6], [7,8,9]]
print("Flattened list:", [num for elem in vec2d for num in elem])