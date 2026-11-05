"""
Python Reference: Else clause on loops
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - A weird-but-useful Python feature: else attached to a loop
#   - The rule: loop-else runs only if the loop finished WITHOUT hitting break
#   - How it replaces the "flag variable" trick when searching
# =============================================================================


### Topic 1: The rule ###
# In Python, for and while loops may have an else block.
# Do NOT read it as "otherwise". Read it as "no break":
#
#     The else block runs when the loop ended normally (ran out of items).
#     The else block is SKIPPED if the loop was stopped by break.
#
# This is exactly what you want for searching: "if I never found it, then ...".

for n in [1, 3, 5]:
    if n % 2 == 0:
        print("Found an even number:", n)
        break
else:
    # reached because the loop never hit 'break' (there were no even numbers)
    print("No even numbers in the list")

for n in [1, 4, 5]:
    if n % 2 == 0:
        print("Found an even number:", n)
        break
else:
    print("This line does not print: the loop was ended by break")


### Topic 2: The same thing WITHOUT loop-else ###
# Before knowing about loop-else, people used a "flag" variable to remember
# whether something was found:
found = False
for n in [1, 3, 5]:
    if n % 2 == 0:
        found = True
        break
if not found:
    print("(flag version) No even numbers in the list")

# It works, but loop-else says the same with one less variable.


### Topic 3: Finding prime numbers ###
# A PRIME number is only divisible by 1 and itself (2, 3, 5, 7, 11, ...).
# Method: for each n, try to divide it by every x from 2 up to n - 1.
#   - If any x divides it evenly, n is NOT prime, so print the factors and break.
#   - If the inner loop finishes without a break, nothing divided n, so
#     the else block runs and we announce a prime.

for n in range(2, 20):
    for x in range(2, n):
        if n % x == 0:
            print(f"{x} * {n // x} = {n}")
            break
    else:
        print(f"{n} is a prime number")

# Notice the else is lined up with the INNER 'for', not with the 'if'.
# Its position tells Python which loop it belongs to.

# TIP: if loop-else ever feels confusing, a function that returns early is an
# equally good (and more common) way to write a search. Use what reads best.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Search a list of names for "Zed". Print where you found it, or use
#      loop-else to print "Zed is not here".
#   2. Change the prime program so it checks numbers 20 to 40.
#   3. Make it faster: the inner loop only needs to go up to the square root
#      of n. (Hint: range(2, int(n ** 0.5) + 1). Why is that enough?)
# =============================================================================
