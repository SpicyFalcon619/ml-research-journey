"""
Python Reference: Unpacking argument lists
"""

# Normal function call passing arguments manually
a = list(range(3, 6))
print(a)

# UNPACKING: Using the * operator to unpack a list (or tuple) into positional arguments.
# This takes the list [3, 6] and unpacks it so the function sees it as: range(3, 6)
args = [3, 6]
b = list(range(*args))
print(b)


def parrot(voltage, state="a stiff", action="voom"):
    print("-- This parrot wouldn't", action, end=" ")
    print("if you put", voltage, "volts through it.", end=" ")
    print("E's", state, "!")


# UNPACKING DICTIONARIES: Using the ** operator to unpack a dictionary into keyword arguments.
# This takes the dictionary `c` and passes it exactly as if you manually typed:
# parrot(voltage="four million", state="bleedin' demised", action="VOOM")
c = {"voltage": "four million", "state": "bleedin' demised", "action": "VOOM"}
parrot(**c)
