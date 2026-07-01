# A normal function vs a lambda function:
# Normal: def add(x, y): return x + y
# Lambda: add = lambda x, y: x + y

# EXAMPLE 1: A function that returns another function
def make_incrementor(n):
    # This creates a mini, nameless function that takes 'x' and adds 'n' to it
    return lambda x: x + n

f = make_incrementor(42) # 'f' is now a function where n = 42

print(f(0)) # 0 + 42 = 42
print(f(1)) # 1 + 42 = 43

# EXAMPLE 2: Passing a small function as an argument
pairs = [(1, 'one'), (2, 'two'), (3, 'three'), (4, 'four')]

# We want to sort this list of tuples.
# By default it would sort by the first item (1, 2, 3, 4).
# We use a lambda to tell the sort function: "Look at the second item (index 1) to sort alphabetically!"
pairs.sort(key=lambda pair: pair[1])

# Alphabetical order: 'four' (f), 'one' (o), 'three' (t), 'two' (t)
print(pairs)
