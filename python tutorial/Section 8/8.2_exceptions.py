"""
Python Reference: Exceptions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The difference between a syntax error and an exception
#   - The most common exception types you will see in ML work
#   - How to read a traceback (the red wall of text Python prints)
# =============================================================================


### Topic 1: Exceptions ###
# Even if a statement is syntactically correct, it may cause an error when
# executed (while the program is running). These errors are called "Exceptions".
# Unlike syntax errors, the lines before the problem DO run.
# If nothing deals with the exception, the program stops and prints a TRACEBACK.
#
# Here are a few common ones you will see in ML:
#
#   ZeroDivisionError   division by zero:                10 * (1/0)
#   NameError           name 'spam' is not defined:      4 + spam*3
#   TypeError           can only concatenate str to str: '2' + 2
#
# We cannot run those lines directly here, or the file would stop at the first
# one. exec() runs a piece of Python given as TEXT, and try/except (explained in
# 8.3) catches the error so the file can continue. This is just a
# demonstration tool, not something to use in real programs.


def show_error(code):
    try:
        exec(code)
    except Exception as error:
        print(f"{code!r:35} -> {type(error).__name__}: {error}")


### Topic 2: A tour of the most common exceptions ###
show_error("10 * (1/0)")  # dividing by zero
show_error("4 + spam*3")  # using a variable that was never created (typo?)
show_error("'2' + 2")  # mixing text and numbers
show_error("int('abc')")  # converting something that is not a number
show_error("[1, 2, 3][10]")  # list position that doesn't exist
show_error("{'a': 1}['b']")  # dictionary key that doesn't exist
show_error("'hello'.push('x')")  # method that doesn't exist
show_error("open('no_such_file.txt')")  # file that isn't there
show_error("import not_a_module")  # package that is not installed

# In ML you will meet others constantly:
#   ValueError    right type but a bad value (int('abc'), a wrong array shape)
#   KeyError      a column or dictionary key that isn't there
#   IndexError    asking for item 10 of a 3-item list
#   TypeError     passing a list where a tensor was expected
#   FileNotFoundError  a wrong path to your dataset
#   RuntimeError  PyTorch complaining about shapes or devices


### Topic 3: Reading a traceback ###
# When an exception is NOT caught, Python prints something like:
#
#   Traceback (most recent call last):
#     File "train.py", line 12, in <module>
#       result = average([])
#     File "train.py", line 5, in average
#       return sum(items) / len(items)
#   ZeroDivisionError: division by zero
#
# How to read it:
#   1. START AT THE BOTTOM. The last line says what went wrong (the type of the
#      exception and a message).
#   2. Read upward. Each "File ... line N, in ..." pair is one step in the chain
#      of function calls that led there; the one directly above the error is
#      where it actually happened.
#   3. The indented text under each File line is the code on that line.
# Most debugging is: read the last line, go to the line number, think.
# All exceptions are objects too. The names above are classes (see Section 9).


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Trigger each of these on purpose and read the message: 1/0,
#      int("hello"), [1, 2][5], undefined_name.
#   2. Write a function average(items) that returns sum(items) / len(items),
#      call it with [], and read the traceback bottom to top.
#   3. Which is a syntax error and which is an exception?  print("hi"   and
#      print(1/0)
# =============================================================================
