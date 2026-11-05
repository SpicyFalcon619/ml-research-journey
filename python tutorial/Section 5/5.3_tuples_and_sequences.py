"""
Python Reference: Tuples and sequences
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a tuple is and how it differs from a list (immutable)
#   - Packing and unpacking (the trick behind  a, b = b, a )
#   - The one-item tuple gotcha:  (5,) not (5)
#   - Why tuples exist and where you will meet them in ML
# =============================================================================


### Topic 1: Creating and reading tuples ###
# A tuple is an ordered group of values, much like a list.
# The big difference: Tuples are IMMUTABLE (cannot be changed after creation).
# Tuples are usually written with parentheses, but the COMMAS are what make one.

t = 12345, 54321, "hello!"
print("Tuple t:", t)
print("First item in t:", t[0])  # indexing and slicing work like lists
print("Last two:", t[-2:])
print("Length:", len(t))

# Tuples may be nested inside other tuples
u = t, (1, 2, 3, 4, 5)
print("\nNested tuple u:", u)


### Topic 2: Immutable ###
# You cannot change a tuple's items, add to it, or remove from it.
print("\nAttempting to change t[0] to 88888...")
try:
    t[0] = 88888
except TypeError as e:
    print("Crash Avoided! Error caught:", repr(e))

# BUT, they can contain mutable objects (like lists), and THOSE can change.
# The tuple still holds the same two lists, it's the lists' contents that move.
v = ([1, 2, 3], [3, 2, 1])
print("\nTuple containing lists:", v)
v[0].append(99)
print("After v[0].append(99):", v)


### Topic 3: Empty and one-item tuples ###
# A tuple of one item needs a trailing comma. Without it, the parentheses are
# just grouping brackets, like in maths: (5) is the number 5.
empty = ()
singleton = ("hello",)  # note the trailing comma
not_a_tuple = ("hello")
print("\nempty:", empty, type(empty))
print("singleton:", singleton, type(singleton))
print("no comma:", not_a_tuple, type(not_a_tuple))


### Topic 4: Packing and unpacking ###
# PACKING: putting values together into a tuple (that is what t = 1, 2, 3 did).
# UNPACKING: spreading a tuple's items into separate variables, in order.
# The number of variables must match the number of items.

x, y, z = t
print("\nx =", x, " y =", y, " z =", z)

# This is the real trick behind swapping variables (3.1.1):
a, b = 1, 2
a, b = b, a  # the right side is packed into a tuple, then unpacked
print("swapped:", a, b)

# Functions return several values this way (4.8):
def min_max(numbers):
    return min(numbers), max(numbers)  # returns ONE tuple


low, high = min_max([4, 9, 2])
print("low/high:", low, high)

# A star collects "the rest":
first, *middle, last = [1, 2, 3, 4, 5]
print(first, middle, last)  # 1 [2, 3, 4] 5


### Topic 5: So why tuples at all? ###
# 1. SAFETY. Data that must never change (coordinates, RGB colours, a date)
#    is protected from accidental edits.
# 2. DICTIONARY KEYS. Only immutable values may be dictionary keys (5.5), so
#    a tuple can be one but a list cannot:
distance = {(0, 0): "origin", (3, 4): "far away"}
print("\nDictionary with tuple keys:", distance[(3, 4)])

# 3. THEY ARE EVERYWHERE IN ML. The SHAPE of a NumPy array or a PyTorch tensor
#    is a tuple, e.g. (32, 3, 224, 224) = 32 images, 3 colour channels, 224x224.
#    And images are often sized with a tuple like (height, width).
image_shape = (3, 224, 224)
channels, height, width = image_shape
print("channels:", channels, "height:", height, "width:", width)

# Two tuple methods exist (they can't change anything, so there are few):
print((1, 2, 2, 3).count(2), (1, 2, 2, 3).index(3))


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Store a point as (x, y) = (3, 7). Unpack it and print the sum.
#   2. Why does  t = (5)  give you an int instead of a tuple? Fix it.
#   3. Write a function that returns (total, average, count) for a list of
#      numbers, and unpack the three results.
#   4. Try to use a list as a dictionary key and read the error.
# =============================================================================
