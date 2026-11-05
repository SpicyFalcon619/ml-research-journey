"""
Python Reference: Looping techniques
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - items(): loop over a dictionary's keys and values together
#   - enumerate(): loop with a counter, without managing one yourself
#   - zip(): loop over two (or more) lists in step
#   - reversed() and sorted(): loop in a different order
#   - Filtering out bad values (such as NaN) while looping
# =============================================================================


### Topic 1: Looping through dictionaries ###
# Use .items() to get the Key AND the Value at the same time (see 5.5).
knights = {"gallahad": "the pure", "robin": "the brave"}
print("--- Dictionary Looping ---")
for k, v in knights.items():
    print(k, v)


### Topic 2: enumerate(), the index AND the value ###
# Very useful when you need to know *where* you are in the list.
# Without it you would write range(len(a)) and a[i] (4.3). enumerate does
# the counting for you, and hands you (index, item) pairs.
a = ["tic", "tac", "toe"]
print("\n--- Enumerate ---")
for i, v in enumerate(a):
    print(f"Index {i}: {v}")

# Want to count from 1 instead of 0? Use start=
for number, v in enumerate(a, start=1):
    print(f"Item {number}: {v}")


### Topic 3: zip(), two lists at the same time ###
# zip pairs up the 1st items, then the 2nd items, and so on.
questions = ["name", "quest", "favorite color"]
answers = ["lancelot", "the holy grail", "blue"]
print("\n--- Zip ---")
for q, ans in zip(questions, answers):
    print(f"What is your {q}?  It is {ans}.")

# zip STOPS at the shorter list, quietly dropping the extras:
print(list(zip([1, 2, 3], ["a", "b"])))  # [(1, 'a'), (2, 'b')]

# In ML you will zip inputs with their labels all the time: zip(images, labels)


### Topic 4: reversed(), loop backwards ###
print("\n--- Reversed ---")
for i in reversed(range(1, 10, 2)):  # range(1, 10, 2) is 1, 3, 5, 7, 9
    print(i)


### Topic 5: sorted(), loop in order without changing the original ###
# sorted() returns a NEW sorted list; the original is left alone.
basket = ["apple", "orange", "apple", "pear", "orange", "banana"]
print("\n--- Sorted ---")
for i in sorted(basket):
    print(i)
print("Original is untouched:", basket)

# Combining Sorted and Set! (Unique items, in alphabetical order)
# set() removes duplicates (5.4), sorted() puts them in order.
print("\n--- Sorted Set ---")
for f in sorted(set(basket)):
    print(f)


### Topic 6: Filtering out bad data ###
# Real datasets contain missing values. NaN means "Not a Number" and is how
# float data marks "missing". math.isnan() tests for it.
#
# Why not "value == NaN"? Because NaN is never equal to anything, not even to
# itself. That is a quirk of how computers store floats, so we need isnan.
import math

print("\nIs NaN equal to itself?", float("NaN") == float("NaN"))  # False!

raw_data = [56.2, float("NaN"), 51.7, 55.3, 52.5, float("NaN"), 47.8]
filtered_data = []
for value in raw_data:
    if not math.isnan(value):
        filtered_data.append(value)

print("\n--- Filtering NaN ---")
print("Original:", raw_data)
print("Filtered:", filtered_data)

# The same thing as a list comprehension (5.1.3):
print("Comprehension:", [v for v in raw_data if not math.isnan(v)])
# (Pandas has dropna() and fillna() that do this to whole tables later on.)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Print every item of ["a", "b", "c"] together with its position,
#      starting the position at 1.
#   2. Given names = ["Ada", "Bob"] and ages = [36, 41], print "Ada is 36".
#   3. Use zip and a dict comprehension to build {name: age}.
#   4. Loop over "hello" backwards, in two different ways.
# =============================================================================
