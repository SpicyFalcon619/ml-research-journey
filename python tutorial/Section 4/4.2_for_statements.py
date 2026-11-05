"""
Python Reference: For statements
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a for loop does and when to choose it over while
#   - Looping over lists, strings and dictionaries
#   - Keeping a running total (the accumulator pattern)
#   - The danger of changing a collection while looping over it, and two fixes
#
# Quick vocabulary: a for loop walks through an ITERABLE, which is anything
# that can hand over its items one at a time (lists, strings, dicts, ranges...).
# =============================================================================


### Topic 1: Looping over a list ###
# Read:  for <name> in <collection>:
# On each round, <name> is set to the next item, and the indented block runs.
# The loop ends by itself when the items run out. (No counter needed, unlike
# the while loop in 3.2.)

words = ["Cat", "Watermelon", "Xong Xina"]

for w in words:
    print(w, len(w))  # len() = number of characters in the word

# The loop variable name is your choice. Pick something meaningful:
for fruit in ["apple", "banana"]:
    print("I like", fruit)


### Topic 2: Looping over a string, and the accumulator pattern ###
# A string is a sequence of characters, so you can loop over it too.
for letter in "Hi!":
    print(letter)

# ACCUMULATOR PATTERN: start with an empty/zero value before the loop and
# update it each round. You will write this shape again and again in ML code
# (summing losses over batches, counting correct predictions, ...).
numbers = [4, 8, 15, 16, 23, 42]

total = 0
for n in numbers:
    total += n  # same as: total = total + n
print("Total:", total)
print("Average:", total / len(numbers))

# (The built-in sum(numbers) does the same in one go. The loop shows how.)


### Topic 3: Looping over a dictionary ###
# A dictionary stores key -> value pairs (the full story is in 5.5).
# There are three ways to loop over one:
scores = {"Hans": 72, "Eleonore": 55, "Keitaro": 90}

for name in scores:  # plain loop: gives the KEYS
    print(name)

for value in scores.values():  # .values() gives only the VALUES
    print(value)

for name, score in scores.items():  # .items() gives (key, value) PAIRS
    print(name, "scored", score)
# "for name, score in ..." unpacks each pair into two variables at once.


### Topic 4: Don't change what you are looping over ###
# Deleting from a dictionary (or adding to it) WHILE looping over that same
# dictionary breaks the loop. Python protects you with an error:
users = {"Hans": "active", "Éléonore": "inactive", "景太郎": "active"}

try:
    for user, status in users.items():
        if status == "inactive":
            del users[user]  # changing the dict we are looping over
except RuntimeError as error:
    print("Error:", error)
# (try/except just lets the program survive the error so we can print it.
#  It is explained properly in Section 8.)

# For lists the situation is sneakier: removing items while looping makes the
# loop SKIP elements, with no error to warn you. Same rule applies to both.

# FIX 1: loop over a COPY, and edit the original.
users1 = {"Hans": "active", "Éléonore": "inactive", "景太郎": "active"}

for user, status in users1.copy().items():  # .copy() makes a separate dictionary
    if status == "inactive":
        del users1[user]  # del removes the key (and its value)

print(users1)

# FIX 2 (usually cleaner): build a NEW collection holding what you want to keep.
users2 = {"Hans": "active", "Éléonore": "inactive", "景太郎": "active"}

active_users = {}

for user, status in users2.items():
    if status == "active":
        active_users[user] = status  # add this pair to the new dictionary

print(active_users)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Loop over ["red", "green", "blue"] and print each colour in UPPER case.
#   2. Given prices = [9.99, 4.5, 12.0], compute the total with a loop.
#   3. Count how many vowels are in the word "encyclopedia" using a loop and
#      an 'if letter in "aeiou"' check.
#   4. From the numbers 1..10 in a list, build a new list of only the even ones.
# =============================================================================
