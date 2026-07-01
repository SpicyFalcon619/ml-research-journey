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

# THE PYTHONIC WAY: List Comprehensions (🔥 MUST KNOW 🔥)
# This is clean, readable, and executes faster than the standard for-loop.
# Syntax: [ expression for item in iterable ]
squares3 = [x**2 for x in range(1, 10)]
print("List Comprehension:", squares3)