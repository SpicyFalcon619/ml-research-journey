"""
Python Reference: Modules and import
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a module is and why Python keeps tools in separate ones
#   - The three ways to import:  import x,  from x import y,  import x as z
#   - Exploring a module with dir() and help()
#   - The difference between the standard library and packages you install
#   - What  if __name__ == "__main__":  means
#
# You have already met imports: `from collections import deque` (5.1.2) and
# `from math import pi` (5.1.3). This lesson explains what they were doing.
# =============================================================================


### Topic 1: What is a module? ###
# A MODULE is just a Python file full of ready-made functions, constants and
# classes. Python does not load them all at startup (it would be slow and
# cluttered), so you IMPORT the ones you need.
#
# Python's built-in "standard library" has hundreds of modules:
#   math (maths), random (random numbers), statistics, datetime (dates and
#   times), json, csv, os (files and folders), collections (extra containers) ...


### Topic 2: import module ###
# Brings in the whole module. You reach its contents with a dot:
# module_name.thing

import math

print(math.pi)  # a constant
print(math.sqrt(16))  # a function: square root
print(math.floor(3.7), math.ceil(3.2))  # round down, round up -> 3 4

# Why the dot? It tells you WHERE sqrt comes from. Without it, a name like
# sqrt could clash with something you wrote yourself.


### Topic 3: from module import name ###
# Pulls specific names straight into your program, so you drop the prefix.
from math import sqrt, pi

print(sqrt(25), pi)

# Convenient for a few names. Avoid  from math import *  (imports everything),
# because you can no longer tell where a name came from.


### Topic 4: import module as alias ###
# Gives the module a shorter nickname. This is a convention you will see in
# nearly every data-science script:
#       import numpy as np
#       import pandas as pd
#       import matplotlib.pyplot as plt
#       import torch
import math as m

print(m.e)  # Euler's number, 2.718...


### Topic 5: Exploring a module ###
# dir(module) lists every name inside it; help(module.name) shows its docs.
names = [n for n in dir(math) if not n.startswith("_")]  # skip private names
print(len(names), "public names in math. The first ten:", names[:10])

help(math.sqrt)


### Topic 6: A few handy math tools ###
print(math.isclose(0.1 + 0.2, 0.3))  # True: "close enough" (see 3.1.1)
print(math.log(math.e))  # natural logarithm -> 1.0
print(math.exp(0))  # e to the power 0 -> 1.0
print(math.isnan(float("nan")))  # True: is it Not-a-Number? (see 5.6)
print(math.factorial(5))  # 5*4*3*2*1 = 120

# math.log, math.exp and friends reappear in ML as the building blocks of the
# sigmoid, softmax and cross-entropy loss.


### Topic 7: Standard library vs installed packages ###
# Everything above came with Python. Other modules, like NumPy, Pandas,
# scikit-learn and PyTorch, are THIRD-PARTY PACKAGES written by other people.
# You install them once from the terminal with pip, then import them exactly
# the same way:
#
#       pip install numpy
#       import numpy as np
#
# If you import something that isn't installed, Python tells you:
try:
    import some_package_that_does_not_exist
except ModuleNotFoundError as error:
    print("Error:", error)


### Topic 8: Your own modules, and __name__ ###
# Every .py file you write is also a module. Another file could import it with
#       import my_file        (the file name without .py)
#
# When Python imports a file it RUNS it from top to bottom. If that file also
# has test or demo code at the bottom, that code would run on every import,
# which you don't want. The standard guard against this:
#
#       if __name__ == "__main__":
#           main()
#
# __name__ is a special variable. It equals "__main__" only when the file is run
# directly (python my_file.py), and equals the module's name when it's imported.

print("__name__ here is:", __name__)


def main():
    print("Running as a script!")


if __name__ == "__main__":
    main()


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Use math to compute the circumference of a circle of radius 7.
#   2. Import datetime and print today's date: datetime.date.today()
#   3. Use help() on a function from the math module you've never used.
#   4. Make two small files, helpers.py and main.py, where main.py imports a
#      function from helpers.py. Add an __name__ guard to helpers.py.
# =============================================================================
