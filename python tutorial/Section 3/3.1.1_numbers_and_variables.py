"""
Python Reference: Numbers and variables
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - How to show results with print(), and how to leave notes with # comments
#   - Python as a calculator:  +  -  *  /  //  %  **
#   - The two kinds of numbers: int (whole) and float (with a decimal point)
#   - Variables: giving a name to a value so you can use it again later
#   - Two more basic values you will meet everywhere: True/False and None
#
# HOW TO USE THIS FILE
#   Read the comments, run the file, then CHANGE a number and run it again.
#   Breaking things on purpose is the fastest way to find out what they do.
# =============================================================================


### Topic 1: Comments and print() ###
# Any line that starts with # is a COMMENT. Python skips it completely.
# Comments are notes for humans (including future you). You can also put one
# at the end of a line of code.

print("Hello, world!")  # print() shows something on the screen
print(2024)  # numbers do not need quotes; text does (see 3.1.2)
print("Two", "things")  # several values at once: print puts a space between them
print()  # print with nothing inside just gives an empty line


### Topic 2: Python as a calculator ###
# Python understands the usual arithmetic. Type an expression, print the result.

print(2 + 3)  # addition        -> 5
print(10 - 4)  # subtraction     -> 6
print(6 * 7)  # multiplication  -> 42  (the symbol is *, not x)
print(7 / 2)  # division        -> 3.5

# Three operators beginners rarely see in school, but programmers use constantly:
print(7 // 2)  # floor division: divide, then throw away the remainder -> 3
print(7 % 2)  # modulo: ONLY the remainder                            -> 1
print(2**10)  # power: 2 to the power of 10                            -> 1024

# Why bother with % ?  It answers "is this divisible by that?"
#   10 % 2 == 0  -> 10 is even.      9 % 2 == 1  -> 9 is odd.
# You will use it for even/odd checks, repeating patterns, "every 100th step"...
print(10 % 2, 9 % 2)

# ORDER OF OPERATIONS works like maths class: ** first, then * / // %, then + -.
# Parentheses always win, so use them whenever you want to be sure.
print(2 + 3 * 4)  # 14  (the multiplication happens first)
print((2 + 3) * 4)  # 20  (the parentheses happen first)


### Topic 3: int vs float ###
# Python has two kinds of numbers:
#   int   = whole numbers:   42, -7, 0
#   float = numbers with a decimal point:   3.14, -0.5, 2.0
# type() tells you which kind you are holding.

print(type(42))  # <class 'int'>
print(type(3.14))  # <class 'float'>

# Dividing with / ALWAYS gives a float, even when the answer is a whole number.
print(8 / 2)  # 4.0   (not 4)
print(8 // 2)  # 4     (// keeps it an int when both sides are ints)

# Convert between them with int() and float().
print(float(3))  # 3.0
print(int(3.9))  # 3  <- int() chops off the decimals, it does NOT round
print(round(3.14159, 2))  # 3.14  <- round(number, how_many_decimals)

# Big numbers: underscores are ignored, they just help your eyes.
print(1_000_000)

# Very small / very large numbers can use scientific notation:
#   1e-3 means 1 x 10^-3 = 0.001      2.5e6 means 2.5 x 10^6 = 2500000.0
# In machine learning you will write learning rates like 1e-3 all the time.
print(1e-3, 2.5e6)


### Topic 4: A famous float surprise ###
# Computers store floats in binary, and some decimals (like 0.1) cannot be stored
# exactly, just like 1/3 cannot be written exactly as a decimal. So:

print(0.1 + 0.2)  # 0.30000000000000004  (not exactly 0.3!)
print(0.1 + 0.2 == 0.3)  # False

# This is normal and happens in every programming language. The lesson:
# NEVER trust == to compare two floats. Compare "close enough" instead
# (math.isclose does this, see 6.1). It matters in ML, where nearly every
# value is a float and tiny rounding differences are everywhere.


### Topic 5: Variables ###
# A variable is a NAME attached to a value. Think of a sticky label on a box:
# the label lets you find the value again without retyping it.
# The = sign means "store the right side under the name on the left".
# It is NOT the "equals" of maths. (Python's "is equal to" test is ==, see 4.1.)

price = 20
quantity = 3
total = price * quantity  # the right side is worked out FIRST, then stored
print(total)  # 60

# A variable can be changed (re-assigned) whenever you like.
quantity = 5
print(price * quantity)  # 100 -- the variable 'total' did NOT update by itself

# Very common pattern: new value = old value, modified.
counter = 0
counter = counter + 1  # read counter (0), add 1, store 1 back into counter
counter += 1  # the shortcut for exactly the same thing
print(counter)  # 2
# The other shortcuts: -=  *=  /=  //=  %=  **=

# A variable's type comes from the value it currently holds.
print(type(price))  # <class 'int'>
price = 19.99
print(type(price))  # <class 'float'> -- same name, new value, new type

# Handy: assign several variables in one line, or give them the same value.
width, height = 4, 5
x = y = 0
print(width * height, x, y)

# Swapping two variables needs no helper variable in Python:
a, b = 1, 2
a, b = b, a
print(a, b)  # 2 1


### Topic 6: Naming variables ###
# Rules (Python enforces these):
#   - letters, digits and underscores only, and it cannot START with a digit
#   - uppercase and lowercase are different: score, Score and SCORE are 3 names
#   - you cannot use Python's own keywords (if, for, class, True, ...)
# Conventions (Python does not enforce these, but everyone follows them):
#   - use snake_case: lowercase words joined by underscores
#   - choose names that explain themselves

learning_rate = 1e-3  # good: you can tell what it is
lr = 1e-3  # fine only if everyone in the project knows "lr"
q = 1e-3  # bad: what is q?
# 2fast = 1          <- illegal, starts with a digit
# my-score = 1       <- illegal, the dash would mean "minus"
# for = 1            <- illegal, 'for' is a keyword

# Good names make a program readable without any comments at all.


### Topic 7: True, False and None ###
# Two more basic values.
#   bool  -> exactly two values: True and False (capital first letter!)
#   None  -> a special value that means "nothing here yet"

is_raining = True
has_umbrella = False
print(is_raining, type(is_raining))

# Comparing things produces a bool. (More about these in 4.1.)
print(5 > 3)  # True
print(5 == 3)  # False  <- two equals signs: "is it equal?"
print(5 != 3)  # True   <- "is it NOT equal?"

# None is how you say "no value": a variable that is waiting to be filled in.
best_score = None
print(best_score)
print(type(best_score))  # <class 'NoneType'>


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Store a temperature in celsius = 25, then compute and print Fahrenheit.
#      Formula: celsius * 9 / 5 + 32.   (Check: 25 C should give 77.0 F.)
#   2. Make three variables holding test scores, then print their average.
#   3. Before running it, guess what 17 // 5 and 17 % 5 print. Then check.
#   4. Why does  seconds = 3 * 60  followed by  minutes = seconds / 60
#      give you 3.0 rather than 3?  How could you get a plain 3?
# =============================================================================
