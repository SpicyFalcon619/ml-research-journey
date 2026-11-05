"""
Python Reference: Break continue statements
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - break: leave a loop immediately
#   - continue: skip the rest of THIS round and go straight to the next one
#   - Nested loops (a loop inside a loop) and the % / // operators in action
# =============================================================================


### Topic 1: break ###
# Normally a loop keeps going until it runs out of items. break says
# "stop now, I've seen enough" and jumps to the first line after the loop.
# Typical use: SEARCHING. Once you find what you want, stop looking.

numbers = [7, 13, 22, 31, 40, 55]

for n in numbers:
    print("Checking", n)
    if n % 2 == 0:  # % gives the remainder: 0 means "divisible by 2" = even
        print("Found the first even number:", n)
        break  # leave the loop, 31, 40 and 55 are never checked

print("Search finished.")

# break also stops a loop that would otherwise never end:
attempts = 0
while True:  # "True" is always True, so this loop runs until a break
    attempts += 1
    if attempts == 3:
        break
print("Gave up after", attempts, "attempts")


### Topic 2: continue ###
# continue does NOT leave the loop. It abandons the current round only
# and jumps back to the top for the next item.
# Typical use: SKIPPING items you don't want to process.

for num in range(2, 10):
    if num % 2 == 0:
        print(f"Found an even number {num}")
        continue  # skip everything below, go to the next num
    print(f"Found an odd number {num}")  # only odd numbers reach this line

# Another common use: skip bad data.
readings = [21.5, None, 22.1, None, 23.0]
for r in readings:
    if r is None:  # None means "no value"; 'is None' is how you test for it
        continue
    print("Valid reading:", r)


### Topic 3: Nested loops ###
# A loop inside a loop. The INNER loop runs completely for every single round
# of the OUTER loop. Here we find which numbers divide evenly into n.
#   n // x  is floor division (the whole-number part of n / x).
# So for n = 12 and x = 3 it prints "3 * 4 = 12".

for n in range(2, 20):
    for x in range(2, n):
        if n % x == 0:
            print(f"{x} * {n // x} = {n}")

# Reading the output: 4 = 2*2, 6 = 2*3, 8 = 2*4, 9 = 3*3, 10 = 2*5 ...
# Numbers that never print (2, 3, 5, 7, 11, ...) have no factors: primes.
# 4.5 shows how to detect primes cleanly using break + else.

# NOTE: break and continue only affect the INNERMOST loop they sit in.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. In a list of words, stop at the first word that starts with "z".
#   2. Print the numbers 1 to 20 but skip every multiple of 3 (use continue).
#   3. Use a while True loop that doubles a number starting from 1 and breaks
#      the first time it goes above 1000. What number does it stop on?
# =============================================================================
