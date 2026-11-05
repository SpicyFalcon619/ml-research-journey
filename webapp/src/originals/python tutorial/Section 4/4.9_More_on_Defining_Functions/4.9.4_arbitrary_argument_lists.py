"""
Python Reference: Arbitrary argument lists
"""


# The *args parameter catches an arbitrary number of positional arguments in a tuple.
# Any parameters declared after *args (like 'sep') are automatically forced to be keyword-only!
def concat(*args, sep="/"):
    return sep.join(args)


# Joins using the default separator ("/")
print(concat("earth", "mars", "venus"))

# Overrides the 'sep' keyword argument to use a dot
print(concat("earth", "mars", "venus", sep="."))
