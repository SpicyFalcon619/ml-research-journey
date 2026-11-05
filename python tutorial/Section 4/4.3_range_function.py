"""
Python Reference: Range function
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - range(): a ready-made sequence of numbers for loops
#   - start, stop and step, and why "stop" is never included
#   - Looping with positions (indices) using range(len(...))
#   - Why range() does not build a whole list in memory
# =============================================================================


### Topic 1: range(stop) ###
# When you need to repeat something N times, or count, use range().
# range(5) produces 0, 1, 2, 3, 4  -> five numbers, starting at ZERO,
# and it stops BEFORE 5. (The "stop" value is exclusive, just like in slicing.)

for i in range(5):
    print(i, end=" ")

# An empty print() outputs just a newline, to end the line above.
print()

# Often you don't need the number at all, only the repetition.
# By convention an unused loop variable is named _
for _ in range(3):
    print("Hello!")


### Topic 2: range(start, stop, step) ###
# range can take up to three numbers:
#   range(stop)               0 up to (not including) stop
#   range(start, stop)        start up to (not including) stop
#   range(start, stop, step)  jump by 'step' each time (step can be negative)
#
# range() itself is a lazy object, so wrap it in list() to see the numbers.

print(list(range(5, 10)))  # [5, 6, 7, 8, 9]
print(list(range(0, 10, 3)))  # [0, 3, 6, 9]        steps of 3
print(list(range(10, 0, -2)))  # [10, 8, 6, 4, 2]    counting DOWN needs a negative step
print(list(range(-10, -100, -20)))  # [-10, -30, -50, -70, -90]
print(list(range(5, 5)))  # []  start == stop gives nothing

# A counting-down loop, for example a rocket launch:
for second in range(3, 0, -1):
    print(second, "...")
print("Liftoff!")


### Topic 3: Looping with positions ###
# Sometimes you need the INDEX (position) of each item, not just the item.
# Combine range with len(): len(a) is 5, so range(len(a)) is 0, 1, 2, 3, 4,
# which are exactly the valid positions.

a = ["Rahim", "had", "a", "little", "lamb"]

for i in range(len(a)):
    print(i, a[i])

# This works, but Python has a neater tool for it: enumerate() (see 5.6).
# Use whichever reads best.


### Topic 4: range is lazy ###
# range() does NOT create a giant list up front. It remembers (start, stop,
# step) and produces each number only when asked. So range(1_000_000_000) uses
# almost no memory! This "generate as needed" idea comes back in ML as data
# loaders that feed your model one batch at a time.

print(range(10))  # prints range(0, 10), not the numbers
print(sum(range(10)))  # 45: sum() asks for each number in turn and adds it up

# You can still ask normal questions about it:
big = range(1_000_000_000)
print(len(big))
print(999 in big)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Print the 7 times table (7 x 1 = 7 ... 7 x 10 = 70) using range.
#   2. Print every odd number from 1 to 99.
#   3. Use range(len(...)) to print each item of a list together with its
#      position, but starting the numbering at 1 instead of 0.
#   4. Predict, then check:  list(range(10, 0))   Why is it empty?
# =============================================================================
