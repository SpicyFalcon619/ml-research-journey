"""
Python Reference: Defining functions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Why functions exist (don't repeat yourself)
#   - Defining a function with def, giving it inputs (parameters) and calling it
#   - print vs return: showing a result versus handing it back
#   - What a function returns when you forget return (None)
#   - Local variables: what happens inside a function stays inside
# =============================================================================


### Topic 1: Your first function ###
# A FUNCTION is a named, reusable block of code. You write it once with def,
# then run it as many times as you like by CALLING it.
#
#   def name(parameters):      <- the colon and the indented body, as always
#       body

def greet(name):
    print("Hello,", name)


# PARAMETER vs ARGUMENT:
#   'name' in the def line is the PARAMETER (an empty slot).
#   "Ada" in the call is the ARGUMENT (the real value that fills the slot).
greet("Ada")
greet("Bob")

# Defining a function does NOT run it. Only a call runs the body.


### Topic 2: A function that prints a Fibonacci series ###
# The Fibonacci loop from 3.2, now packaged as a function. Pass n to say
# "up to which number". Wrapping code in a function makes it reusable.

def fib(n):
    a, b = 0, 1
    while a <= n:
        print(a, end=" ")
        a, b = b, a + b
    print()


fib(200)

# Functions are VALUES in Python, like numbers or strings. You can store one in
# another variable and call it through that name:
f = fib
f(200)


### Topic 3: print vs return ###
# print() just SHOWS something on the screen. The value is gone afterwards.
# return HANDS A VALUE BACK to the caller, who can store it and use it further.
# If a function has no return statement, it returns the special value None:

print(fib(0))  # fib(0) prints "0 " (the series), THEN print shows None

# A version that returns the series as a list instead of printing it:

def fib2(n):
    result = []
    a, b = 0, 1
    while a <= n:
        result.append(a)  # collect each number instead of printing it
        a, b = b, a + b
    return result  # return ends the function immediately and gives back 'result'


fib100 = fib2(200)  # store what came back
print(fib100)
print("How many terms?", len(fib100))  # we can keep working with the result

# This is the better design: the function only COMPUTES, and the caller decides
# what to do with the answer (print it, save it, plot it...).


### Topic 4: Returning more than one value ###
# Return several values separated by commas. Python packs them into a tuple,
# and you can unpack them straight into separate variables.

def min_and_max(numbers):
    return min(numbers), max(numbers)


low, high = min_and_max([4, 9, 2, 7])
print("low:", low, "high:", high)


### Topic 5: Local variables (scope) ###
# Variables created inside a function are LOCAL: they exist only while the
# function runs, and the outside world cannot see them.

def make_total():
    total = 100  # local to make_total
    return total


print(make_total())

try:
    print(total)  # 'total' only existed inside the function
except NameError as error:
    print("Error:", error)

# A function can READ variables from outside, but assigning to a name inside a
# function creates a new local variable instead of changing the outer one:
counter = 0


def try_to_change():
    counter = 99  # a brand-new LOCAL variable, also called counter
    return counter


try_to_change()
print("outer counter is still", counter)


### Topic 6: Early return ###
# return ends the function on the spot, so you can exit early.

def is_adult(age):
    if age < 0:
        return "invalid age"
    if age >= 18:
        return "adult"
    return "minor"


print(is_adult(20), is_adult(10), is_adult(-5))


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write square(n) that RETURNS n * n. Then print(square(7)).
#   2. Write average(numbers) that returns the mean of a list.
#   3. Write is_even(n) that returns True or False. Use it inside a loop.
#   4. What does this print, and why?   def f(): x = 5     print(f())
# =============================================================================
