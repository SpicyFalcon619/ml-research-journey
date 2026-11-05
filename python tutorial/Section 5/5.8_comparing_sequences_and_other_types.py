"""
Python Reference: Comparing sequences and other types
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - How Python compares lists, tuples and strings (dictionary order)
#   - How strings are really compared: by character codes
#   - What happens with sequences of different lengths
#   - Why comparing unrelated types is an error
# =============================================================================


### Topic 1: Lexicographic ("dictionary") order ###
# Python compares sequences (lists, tuples, strings) lexicographically, like
# looking up words in an English dictionary:
#   1. Compare the first items. If they differ, that decides it.
#   2. If they are equal, move on to the second items. And so on.
# This is also how sorting uses < under the hood.

print("Tuple comparison:", (1, 2, 3) < (1, 2, 4))  # 1==1, 2==2, then 3 < 4: True
print("List comparison:", [1, 2, 3] < [1, 2, 4])  # same logic
print("Decided on the first item:", (2, 0, 0) > (1, 99, 99))  # 2 > 1, stop right there


### Topic 2: Strings ###
# Strings are compared alphabetically, letter by letter, using each character's
# numeric code (its Unicode code point). ord() reveals the code.
print("\nString comparison:", "ABC" < "C" < "Pascal" < "Python")

print("ord('A') =", ord("A"), " ord('a') =", ord("a"))
# Capital letters have SMALLER codes than lowercase ones, so:
print("'Zebra' < 'apple'?", "Zebra" < "apple")  # True! Surprising but logical
# To compare ignoring case, lower both sides first:
print("Case-insensitive:", "Zebra".lower() < "apple".lower())  # False


### Topic 3: Different lengths ###
# If every item matches so far, the SHORTER sequence is considered smaller.
print("\nLength comparison:", (1, 2, 3, 4) < (1, 2, 4))  # 3 < 4 decides it, length is irrelevant
print("Length comparison 2:", (1, 2) < (1, 2, -1))  # equal so far, and shorter wins


### Topic 4: Numbers of different types ###
# Integers and Floats are treated equally if their value is the same.
print("\nInt vs Float:", (1, 2, 3) == (1.0, 2.0, 3.0))


### Topic 5: Nested sequences ###
# Sequences inside sequences are compared the same way, item by item.
print("\nNested comparison:", (1, 2, ("aa", "ab")) < (1, 2, ("abc", "a"), 4))
# ("aa", "ab") vs ("abc", "a"): "aa" < "abc" (a=a, then a < b), so True.


### Topic 6: Comparing different types ###
# Comparing a number with text makes no sense, so Python refuses rather than guess:
try:
    print([1, 2] < ["a", "b"])
except TypeError as error:
    print("\nTypeError:", error)
# == still works (and just answers False):
print("1 == 'a':", 1 == "a")

# In ML data pipelines, a column that secretly mixes numbers and strings is a
# common cause of this error when sorting. Now you know what it means.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Predict, then check:  (3, "b") < (3, "c")  and  "10" < "9"
#      (why is the second one True?)
#   2. Sort the words ["banana", "Apple", "cherry"]. Where does "Apple" end up
#      and why? Sort again with key=str.lower.
#   3. Which is "bigger": [1, 2, 3] or [1, 2, 3, 0]?
# =============================================================================
