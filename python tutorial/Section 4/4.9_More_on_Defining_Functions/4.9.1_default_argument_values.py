"""
Python Reference: Default argument values
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Giving a parameter a default value, so callers may leave it out
#   - How to override defaults, positionally or by name
#   - A subtle rule: defaults are worked out ONCE, when the function is defined
#   - The classic bug: a list as a default value, and the standard fix
# =============================================================================


### Topic 1: Defaults in action ###
# Write  parameter=value  in the def line. If the caller leaves that argument
# out, Python fills in the default. Parameters WITHOUT a default are required
# and must come first.
#
# This function keeps asking a yes/no question until it gets a clear answer,
# and gives up after 'retries' wrong answers.
#   - `in {...}` checks if the reply is one of several accepted words
#   - `raise ValueError(...)` stops the function with an error (see 8.4)


def ask_ok(prompt, retries=4, reminder="Please try again!"):
    while True:
        reply = input(prompt)
        if reply in {"y", "ye", "yes"}:
            return True
        if reply in {"n", "no", "nop", "nope"}:
            return False
        retries = retries - 1
        if retries < 0:
            raise ValueError("invalid user response")
        print(reminder)


# Three ways to call it:
#   1. Only the required argument: retries stays 4, reminder stays the default.
#        ask_ok("Are you OK?\n")
#   2. Override 'retries' (the second argument), leave the reminder alone.
#        ask_ok("Are you OK?\n", 2)
#   3. Override both defaults.
#        ask_ok("Are you OK?\n", 2, "Please answer yes or no!")

response = ask_ok("Are you OK?\n")
print(response)


### Topic 2: Defaults are evaluated when the function is DEFINED ###
# The default value is captured at the moment the def line runs, not each time
# the function is called. So changing the variable later does not matter:

i = 5


def show(arg=i):  # arg's default is locked in as 5 right here
    print(arg)


i = 6  # too late: the default was already fixed
show()  # prints 5, not 6


### Topic 3: The mutable default trap ###
# For numbers and strings, Topic 2 is harmless. But for a MUTABLE default (a list,
# dictionary or set) it is a famous bug: the one list created at definition time
# is shared by EVERY call that doesn't pass its own list, and keeps growing.


def add_item_buggy(a, L=[]):
    L.append(a)
    return L


print(add_item_buggy(1))  # [1]
print(add_item_buggy(2))  # [1, 2]     <- 1 is still in there from the last call!
print(add_item_buggy(3))  # [1, 2, 3]


### Topic 4: The fix: None as the default ###
# Use None as the default ("nothing was passed"), and create the fresh list
# INSIDE the function body, which runs anew on each call. Memorise this
# pattern; you will use it for the rest of your Python life.


def add_item(a, L=None):
    if L is None:
        L = []
    L.append(a)
    return L


print(add_item(1))  # [1]
print(add_item(2))  # [2]   <- independent lists this time
print(add_item(3))  # [3]

# In ML you will see defaults everywhere, e.g. a function like
#   train(model, epochs=10, learning_rate=1e-3)
# runs happily with just train(model), and you override only what you want.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write power(base, exponent=2) that returns base ** exponent.
#      Call it as power(5), power(5, 3), and power(2, exponent=10).
#   2. Write greet(name, greeting="Hello") that prints e.g. "Hello, Ada!".
#   3. Predict the output: def f(x, items=[]): items.append(x); return items
#      then call f(1) and f(2). Fix it with the None pattern.
# =============================================================================
