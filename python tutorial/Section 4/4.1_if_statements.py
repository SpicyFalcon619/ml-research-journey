"""
Python Reference: If statements
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Booleans and comparison operators (==, !=, <, >, <=, >=)
#   - if / elif / else: making your program choose between paths
#   - Combining conditions with and, or, not
#   - Asking the user for a value with input(), and why you must convert it
#   - Why indentation matters
# =============================================================================


### Topic 1: Booleans and comparisons ###
# A condition is a question that has a True or False answer (type: bool).
# You build one with a COMPARISON operator:
#
#     ==   equal to               (two equals signs; one = would store a value)
#     !=   not equal to
#     <    less than              >    greater than
#     <=   less than or equal     >=   greater than or equal

temperature = 30
print(temperature == 30)  # True
print(temperature != 30)  # False
print(temperature > 25)  # True
print(temperature <= 20)  # False

# Combine conditions with the words and / or / not:
#   a and b   -> True only if BOTH are True
#   a or b    -> True if AT LEAST ONE is True
#   not a     -> flips True to False and False to True
print(temperature > 20 and temperature < 35)  # True
print(temperature < 10 or temperature > 25)  # True
print(not temperature > 25)  # False

# Python lets you chain comparisons like in maths class:
print(20 < temperature < 35)  # True, the same as the 'and' version above


### Topic 2: The if statement ###
# if runs its indented block ONLY when the condition is True.

if temperature > 25:
    print("It is warm today.")  # runs: 30 > 25 is True

if temperature > 40:
    print("This line is skipped, because the condition is False.")

# THE COLON AND THE INDENTATION ARE REQUIRED.
#   - The line ends with a colon  :
#   - The block under it is indented (4 spaces is the standard)
# The block ends at the first line that is not indented any more.
print("This line is always printed: it is outside the if blocks.")


### Topic 3: else and elif ###
# else  = "if the condition was False, do this instead".
# elif  = "else if": try another condition. Python checks from top to bottom
#         and runs ONLY THE FIRST block whose condition is True, then skips the
#         rest of the chain.

if temperature < 15:
    print("Cold")
elif temperature < 25:
    print("Mild")
elif temperature < 35:
    print("Warm")  # <- the first True one: 30 < 35. The chain stops here.
else:
    print("Hot")  # else has no condition: it catches everything left over

# Because ONLY the first match runs, ORDER MATTERS. If you checked
# "temperature < 35" first, a temperature of 10 would be called "Warm".


### Topic 4: Truthiness (a shortcut you will see everywhere) ###
# if does not strictly need True or False. Python treats these as "empty" (False):
#   0, 0.0, "" (empty string), [] (empty list), {} (empty dict), None
# and nearly everything else as True.

shopping_list = []
if shopping_list:  # an empty list counts as False
    print("You have things to buy")
else:
    print("Your list is empty")  # runs

if not shopping_list:  # the usual way to ask "is it empty?"
    print("Nothing to buy!")

# (5.7 goes deeper into this.)


### Topic 5: A one-line choice (conditional expression) ###
# For simple either/or choices, Python has a compact form:
#       value_if_true  if  condition  else  value_if_false
label = "pass" if 72 >= 50 else "fail"
print(label)


### Topic 6: Getting a value from the user with input() ###
# input("message") shows the message, waits for the user to type something and
# press Enter, and gives back whatever they typed.
#
# IMPORTANT: input() ALWAYS returns a STRING (text), even if the user types 42.
# Text "42" is not the number 42. You cannot compare it with numbers or do maths
# on it. So we wrap it with int(), which converts the text to a whole number:
#       int("42")  ->  42          (use float() if decimals are allowed)
# If the text cannot be converted (e.g. "abc"), int() raises a ValueError.
# Section 8.3 shows how to handle that gracefully.

x = int(input("Enter an integer: "))

# Basic conditional branching using if, elif, and else
if x < 0:
    x = 0
    print("Negative changed to zero")
elif x == 0:
    print("Zero")
elif x == 1:
    print("Single")
else:
    print("More")


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Ask for a test score (0-100) and print the grade: A for 80+, B for 70+,
#      C for 60+, otherwise F.  (Think carefully about the ORDER of your checks.)
#   2. Ask for a year and say whether it is a leap year. Rule: divisible by 4,
#      except years divisible by 100, unless also divisible by 400.
#      Hint: you will need %, and, or.
#   3. Try int("3.5") and see what happens. How would you accept decimals?
# =============================================================================
