"""
Python Reference: More on conditions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Truthy and falsy values: what counts as True/False inside an if
#   - Short-circuiting: how `and` / `or` stop early and what they return
#   - The "default value" idiom with `or`
#   - The membership test (in) and the identity test (is)
# =============================================================================


### Topic 1: Truthy and falsy ###
# Any value can be used as a condition. Python treats these as False ("falsy"):
#   False, None, 0, 0.0, ""  (empty string), []  (empty list), ()  {}  set()
# and EVERYTHING else as True ("truthy"). bool(x) shows which way a value counts.

for value in [0, 1, -5, "", "hi", [], [0], None]:
    print(f"{value!r:>6} counts as {bool(value)}")
# (!r in an f-string shows the value the way you would type it in code)

# This is why you can write the short form:
items = []
if not items:  # instead of: if len(items) == 0
    print("\nNo items yet")


### Topic 2: Short-circuit evaluation ###
# `or` and `and` evaluate left to right and STOP as soon as the answer is known.
#   a or b    if a is truthy, the answer is a (b is never even looked at)
#   a and b   if a is falsy, the answer is a (b is never even looked at)
# They return one of the ACTUAL VALUES, not just True or False.

print("\n0 or 7     ->", 0 or 7)  # 0 is falsy, so move on and give 7
print("5 or 7     ->", 5 or 7)  # 5 is already truthy, stop and give 5
print("5 and 7    ->", 5 and 7)  # both truthy, so the LAST one is the answer
print("0 and 7    ->", 0 and 7)  # 0 is falsy, stop and give 0

# Short-circuiting also makes this check SAFE (b = 0 would otherwise crash):
a, b = 10, 0
print("\nSafe division check:", b != 0 and a / b > 2)  # a / b is never evaluated


### Topic 3: The "first non-empty value" idiom ###
# The 'or' operator short-circuits and returns the FIRST truthy value it finds!
# Empty strings ('') are considered "falsy".

string1, string2, string3 = "", "Trondheim", "Hammer Dance"

# It checks string1 (empty, so false).
# Then it checks string2 ('Trondheim', so true!).
# It stops checking and assigns 'Trondheim' to the variable.
non_null = string1 or string2 or string3

print(f"\nThe first non-empty string is: {non_null}")

# Everyday use: a fallback when something is missing or empty.
username = ""
display_name = username or "Anonymous"
print("Hello,", display_name)


### Topic 4: Chained comparisons ###
x = 15
print("\n10 < x < 20 :", 10 < x < 20)  # reads like maths
print("1 == 1 < 2  :", 1 == 1 < 2)


### Topic 5: == versus is ###
# ==  asks "do these have the same VALUE?"
# is  asks "are these the very same OBJECT in memory?"
list_a = [1, 2, 3]
list_b = [1, 2, 3]
list_c = list_a

print("\nlist_a == list_b:", list_a == list_b)  # True: same contents
print("list_a is list_b:", list_a is list_b)  # False: two separate lists
print("list_a is list_c:", list_a is list_c)  # True: one list, two names (3.1.3)

# Use `is` only for None (and True/False). For everything else, use ==.
result = None
if result is None:
    print("No result yet")


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Predict each, then check with print:  "" or "x",  "a" and "b",  [] or [0],
#      None and 5,  0 or None.
#   2. Write a line that uses `or` to pick the learning rate from a user value,
#      falling back to 0.01 when the user value is None.
#   3. Why is  if x == None  worse style than  if x is None ?
# =============================================================================
