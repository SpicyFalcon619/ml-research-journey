"""
Python Reference: Keyword arguments
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Positional vs keyword arguments, and why keywords make calls readable
#   - The rules for mixing them (and the four errors you get from breaking them)
#   - *args and **kwargs: functions that accept any number of extra arguments
#   - How to read the funny names (a tuple and a dictionary come out of these)
# =============================================================================


### Topic 1: Positional vs keyword arguments ###
# POSITIONAL: Python matches arguments to parameters by their ORDER.
#     parrot(1000, "pining")      1000 -> voltage, "pining" -> state
# KEYWORD: you write  name=value  and the order no longer matters.
#     parrot(state="pining", voltage=1000)
# Keywords make calls self-explanatory:  train(epochs=10, lr=0.01)  is far
# clearer than  train(10, 0.01).
#
# The parameter list below mixes one required parameter (voltage) with three
# that have defaults (see 4.9.1).


def parrot(voltage, state="a stiff", action="voom", type="Norwegian Blue"):
    print("-- This parrot wouldn't", action, end=" ")
    print("if you put", voltage, "volts through it.")
    print("-- Lovely plumage, the", type)
    print("-- It's", state, "!")


parrot(1000)  # 1 positional argument
print()
parrot(voltage=1000)  # 1 keyword argument
print()

parrot(voltage=1000000, action="VOOOOOM")  # 2 keyword arguments
print()

parrot(action="VOOOOOM", voltage=1000000)  # 2 keyword arguments (out of order!)
print()

parrot("a million", "bereft of life", "jump")  # 3 positional arguments
print()

parrot("a thousand", state="pushing up the daisies")  # 1 positional, 1 keyword
print()


### Topic 2: The rules, shown by breaking them ###
# 1. Positional arguments come FIRST, keyword arguments after them.
# 2. Every required parameter must be given exactly once.
# 3. Keyword names must exist in the function's parameter list.
#
# Here each broken call is wrapped in try/except TypeError (see Section 8),
# so you can read the real error messages Python gives you.

try:
    parrot()  # required argument missing
except TypeError as error:
    print("1)", error)

try:
    parrot(110, voltage=220)  # the same parameter twice
except TypeError as error:
    print("2)", error)

try:
    parrot(actor="John Cleese")  # no parameter named 'actor'
except TypeError as error:
    print("3)", error)

# A fourth mistake can't even run, it is a SyntaxError found before the
# program starts:  parrot(voltage=5.0, "dead")   (positional after keyword)


### Topic 3: *arguments and **keywords ###
# What if you want a function that accepts ANY number of extra arguments?
#   *arguments   collects the extra POSITIONAL arguments into a TUPLE
#   **keywords   collects the extra KEYWORD arguments into a DICTIONARY
# The names are your choice; the convention is *args and **kwargs.
# The * and ** are what do the work.


def cheeseshop(kind, *arguments, **keywords):
    print("-- Do you have any", kind, "?")
    print("-- I'm sorry, we're all out of", kind)

    # Loop through the tuple of extra positional arguments
    for arg in arguments:
        print(arg)

    print("-" * 40)

    # Loop through the dictionary of extra keyword arguments
    for kw in keywords:
        print(kw, ":", keywords[kw])


# "Limburger" maps to `kind`.
# The next two strings map to `*arguments`.
# The final three key=value pairs map to `**keywords`.
cheeseshop(
    "Limburger",
    "It's very runny, sir.",
    "It's really very, VERY runny, sir.",
    shopkeeper="Michael Palin",
    client="John Cleese",
    sketch="Cheese Shop Sketch",
)

print()

# Peek inside to see exactly what was collected:


def inspect_args(*args, **kwargs):
    print("args   =", args, type(args))
    print("kwargs =", kwargs, type(kwargs))


inspect_args(1, 2, 3, color="red", size=10)

# You have already used this: print("a", "b", "c") accepts any number of values
# because print is defined with *args.
# And ML libraries are full of **kwargs: they let you forward options along.


### Topic 4: Practice problem, a pizza ordering system ###
# `size` is a required positional argument.
# `*toppings` gathers all extra positional arguments into a tuple.
# `**details` gathers all extra keyword arguments into a dictionary.


def order_pizza(size, *toppings, **details):
    print("--- Ordering a", size, "pizza ---")

    for topping in toppings:
        print(topping)

    print("-" * 30)

    for detail in details:
        print(detail, ":", details[detail])


order_pizza(
    "Large",
    "Pepperoni",
    "Extra Cheese",
    "Olives",
    name="John Doe",
    address="123 Main St",
    tip=5,
)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write describe_person(name, age, city="Dhaka") and call it three ways:
#      all positional, all keyword, and mixed.
#   2. Write total(*numbers) that returns the sum of however many numbers it
#      receives:  total(1, 2, 3)  ->  6.
#   3. Write make_profile(**info) that prints each "key: value" pair, then call
#      it with make_profile(name="Ada", job="engineer").
# =============================================================================
