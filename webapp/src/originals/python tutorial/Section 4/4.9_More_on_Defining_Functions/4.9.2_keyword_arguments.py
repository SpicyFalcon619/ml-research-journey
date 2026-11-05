"""
Python Reference: Keyword arguments
"""


# Keyword arguments allow you to pass values by explicitly naming the parameter.
# This lets you skip certain default arguments or pass them completely out of order!
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


# Invalid calls:
# parrot()                     # required argument missing
# parrot(voltage=5.0, 'dead')  # non-keyword argument after a keyword argument
# parrot(110, voltage=220)     # duplicate value for the same argument
# parrot(actor='John Cleese')  # unknown keyword argument


def function(a):
    pass


# *arguments (often written as *args) packs any extra positional arguments into a TUPLE.
# **keywords (often written as **kwargs) packs any extra keyword arguments into a DICTIONARY.
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


# PRACTICE PROBLEM: Pizza Delivery System
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
