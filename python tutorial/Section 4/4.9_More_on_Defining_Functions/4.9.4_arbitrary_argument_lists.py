"""
Python Reference: Arbitrary argument lists
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Writing a function that accepts any number of positional arguments
#   - What happens to parameters that come AFTER *args
#   - A real use: join() with a flexible separator
# =============================================================================


### Topic 1: *args collects the extras ###
# Put a * in front of a parameter name and it soaks up ALL the positional
# arguments that are left over, packing them into a tuple.


def count_args(*args):
    print("I received", len(args), "arguments:", args)


count_args()
count_args("a")
count_args("a", "b", "c")


### Topic 2: Parameters after *args are keyword-only ###
# *args swallows every remaining positional argument, so Python can no longer
# tell where "extra items" end and "the next parameter" begins. Therefore any
# parameter AFTER *args can only be given by keyword (it is keyword-only,
# like in 4.9.3).
#
# "separator".join(list) glues a list of strings together with the separator
# in between; here we wrap that into our own function.


def concat(*args, sep="/"):
    return sep.join(args)


# Joins using the default separator ("/")
print(concat("earth", "mars", "venus"))

# Overrides the 'sep' keyword argument to use a dot
print(concat("earth", "mars", "venus", sep="."))

# sep MUST be named; "." on its own would just be treated as one more planet.
print(concat("earth", "mars", "."))


### Topic 3: A numeric example ###
# Any number of values in, one answer out:


def average(*numbers):
    return sum(numbers) / len(numbers)


print(average(4, 8))  # 6.0
print(average(1, 2, 3, 4, 5))  # 3.0

# Sketch for later: if you already HAVE a list, you can still call average
# without typing each item by "unpacking" it with a star. That is the next
# lesson (4.9.5):   average(*my_list)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write biggest(*numbers) that returns the largest of any amount of numbers
#      (do not just call max; use a loop).
#   2. Write make_sentence(*words, end=".") returning "I like cats." from
#      make_sentence("I", "like", "cats").
# =============================================================================
