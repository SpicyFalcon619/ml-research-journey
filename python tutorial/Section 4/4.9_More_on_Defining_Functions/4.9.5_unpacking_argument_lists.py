"""
Python Reference: Unpacking argument lists
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The reverse of 4.9.4: you have a list/dict and want to SPREAD it out
#     into separate arguments
#   - * unpacks a list or tuple into positional arguments
#   - ** unpacks a dictionary into keyword arguments
#
# Memory trick:  in a DEF line, * and ** PACK arguments up.
#                in a CALL, * and ** UNPACK a container into arguments.
# =============================================================================


### Topic 1: Normal call ###
# range(3, 6) needs two separate arguments (start and stop).
a = list(range(3, 6))
print(a)  # [3, 4, 5]


### Topic 2: Unpacking a list with * ###
# Suppose the two numbers already live in a list:
args = [3, 6]

# range(args) would be wrong, because range would receive ONE argument (a list).
# The star unpacks the list so the function sees two separate arguments:
#   range(*args)  is treated exactly like  range(3, 6)
b = list(range(*args))
print(b)  # [3, 4, 5]

# Works with tuples too, and with ANY number of items:
numbers = (10, 20, 30)
print(*numbers)  # same as print(10, 20, 30)  -> 10 20 30


### Topic 3: Unpacking a dictionary with ** ###
# A dictionary maps names to values, which is exactly what keyword arguments
# are. ** turns each "key: value" into "key=value":


def parrot(voltage, state="a stiff", action="voom"):
    print("-- This parrot wouldn't", action, end=" ")
    print("if you put", voltage, "volts through it.", end=" ")
    print("E's", state, "!")


# This takes the dictionary `c` and passes it exactly as if you manually typed:
#   parrot(voltage="four million", state="bleedin' demised", action="VOOM")
c = {"voltage": "four million", "state": "bleedin' demised", "action": "VOOM"}
parrot(**c)

# The dictionary's keys must match the function's parameter names.


### Topic 4: Why you will care ###
# In ML you often keep settings in one dictionary and hand them to a function:
config = {"epochs": 5, "learning_rate": 0.01}


def train(epochs, learning_rate, verbose=True):
    print(f"Training for {epochs} epochs at lr={learning_rate}, verbose={verbose}")


train(**config)  # same as train(epochs=5, learning_rate=0.01)
train(**config, verbose=False)  # you can add more keywords beside the ** one


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Given point = (3, 4) and def distance(x, y): ... call it with point
#      unpacked using *.
#   2. Given settings = {"sep": " | ", "end": "!\n"}, print three words using
#      print("a", "b", "c", **settings).
#   3. What error do you get if the dictionary has a key the function doesn't
#      accept? Try it.
# =============================================================================
