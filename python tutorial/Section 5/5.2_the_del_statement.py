"""
Python Reference: The del statement
"""

# THE DEL STATEMENT
a = [-1, 1, 66.25, 333, 333, 1234.5]
print("Original:", a)

# Delete a single item by its index
del a[0]
print("Deleted index 0:", a)

# Delete a slice (index 2 up to, but not including, 4)
del a[2:4]
print("Deleted slice [2:4]:", a)

# Delete all elements (clear the list)
del a[:]
print("Deleted all elements:", a)

# Delete the actual variable from memory completely!
del a

# If we try to print 'a' now, Python will crash with a NameError because 'a' doesn't exist anymore.
# We use a try/except block here to catch the error safely:
try:
    print(a)
except NameError as e:
    print("\nCrash Avoided! Error caught:", repr(e))
