"""
Python Reference: First steps
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Your first loop: repeating code with while
#   - How Python decides which lines belong inside the loop (indentation)
#   - Assigning two variables at once (multiple assignment)
#   - Controlling print() with end=
#
# The program below prints the Fibonacci sequence: every number is the sum of
# the two before it.   0, 1, 1, 2, 3, 5, 8, 13, 21, ...
# =============================================================================


### Topic 1: The finished program ###
# Run it first, then read on to see why it works.

a, b = 0, 1
while a < 1000:
    print(a, end=" ")
    a, b = b, a + b

print()  # finish the line of output with a newline


### Topic 2: How it works, piece by piece ###

# --- Multiple assignment:  a, b = 0, 1 ---------------------------------------
# This is two assignments in one line. a becomes 0 and b becomes 1.
# Python works out EVERYTHING on the right side first, then stores the results.

# --- The while loop ----------------------------------------------------------
#   while a < 1000:
# means "keep repeating the indented lines below AS LONG AS a < 1000 is True".
# Before every round Python re-checks the condition. When it is finally False,
# the loop ends and Python carries on after it.
#
# WARNING: if the condition can never become False, the loop never ends
# (an "infinite loop"). Press Ctrl+C in the terminal to stop a runaway program.

# --- Indentation (the spaces at the start of a line) -------------------------
# Python has no curly braces. The lines that are INDENTED (by convention 4
# spaces) under the "while ...:" line are the loop body. The first line that is
# not indented is outside the loop. Mixing up the indentation changes what your
# program does, so it is part of the code, not decoration.

# --- print(a, end=" ") -------------------------------------------------------
# print normally finishes with a new line. end=" " replaces that with a space,
# so all the numbers appear side by side on one line.

# --- The clever line:  a, b = b, a + b ---------------------------------------
# Because the right side is computed BEFORE anything is stored, this really
# means: "new a = old b, and new b = old a + old b". No temporary variable is
# needed. Walk through the first few rounds by hand (a trace table):
#
#   round |  a  |  b  | prints | after "a, b = b, a + b"
#   ------+-----+-----+--------+------------------------
#     1   |  0  |  1  |   0    | a = 1, b = 0 + 1 = 1
#     2   |  1  |  1  |   1    | a = 1, b = 1 + 1 = 2
#     3   |  1  |  2  |   1    | a = 2, b = 1 + 2 = 3
#     4   |  2  |  3  |   2    | a = 3, b = 2 + 3 = 5
#     5   |  3  |  5  |   3    | a = 5, b = 3 + 5 = 8
#
# Tracing a loop on paper like this is the best way to debug one.


### Topic 3: The same idea, step by step with prints ###
# Here is a tiny loop that shows its work, so you can watch the variables change.

count = 0
while count < 3:
    print("count is", count)
    count += 1  # without this line the loop would never end!
print("loop finished, count is", count)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Change 1000 to 100 so it stops earlier.
#   2. Change end=" " to end=", " and see the difference.
#   3. Make a while loop that prints the numbers 10, 9, 8, ... 1.
#   4. Start with a, b = 2, 1 instead. What sequence do you get? (Lucas numbers)
# =============================================================================
