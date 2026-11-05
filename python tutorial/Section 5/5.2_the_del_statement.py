"""
Python Reference: The del statement
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Deleting list items by position or by slice with del
#   - How del differs from .remove() and .pop()
#   - Deleting a variable itself, and what a NameError is
# =============================================================================


### Topic 1: del on list items ###
# del removes items BY POSITION and (unlike pop) gives nothing back.
#   del a[i]      remove the item at position i
#   del a[i:j]    remove a whole slice (i up to, not including, j)
#   del a[:]      remove everything (same as a.clear())
#
# Compare the three ways to remove from a list:
#   a.remove(x)  removes by VALUE ("take out the first 333")
#   a.pop(i)     removes by POSITION and RETURNS the item
#   del a[i]     removes by POSITION and returns nothing

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


### Topic 2: del on a whole variable ###
# del can also delete a NAME, as if you had never created the variable.
del a

# If we try to print 'a' now, Python will crash with a NameError because 'a' doesn't exist anymore.
# We use a try/except block here to catch the error safely (Section 8 covers this):
try:
    print(a)
except NameError as e:
    print("\nCrash Avoided! Error caught:", repr(e))
# (repr(e) shows the error object's technical form, handy for debugging.)

# del also removes a key from a dictionary (see 5.5):
ages = {"Ada": 36, "Bob": 41}
del ages["Bob"]
print(ages)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. From [10, 20, 30, 40, 50] delete the middle item, then the last two.
#   2. What is the difference between `del x[:]` and `del x`? Try both and then
#      print(x) in each case.
#   3. Use pop() to delete AND capture the value; do the same with del. Which
#      one lets you store what was removed?
# =============================================================================
