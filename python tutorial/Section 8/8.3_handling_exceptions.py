"""
Python Reference: Handling exceptions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - try / except: catching an error so your program carries on
#   - Catching specific exception types (and why a bare "except" is risky)
#   - Handling several different errors, and reading the error message
#   - The else and finally parts
#   - Retrying until the user gives valid input
#
# In Machine Learning you will use try/except blocks to catch errors so your
# script doesn't completely crash. For example, if your code tries to load a
# corrupted image file, you want to catch the error, log it, and skip it, not
# crash the whole training loop!
# =============================================================================


### Topic 1: try / except ###
# Put the risky code in the try block. If it raises an exception, Python jumps
# straight to the matching except block instead of crashing. If there is no
# error, the except block is skipped.

try:
    result = 10 / 0  # raises ZeroDivisionError
    print("This line never runs")
except ZeroDivisionError:
    print("You can't divide by zero!")

print("The program keeps going.")


### Topic 2: Catching the error object ###
# Add  as name  to get the exception itself, so you can show its message.
try:
    int("abc")
except ValueError as error:
    print("Caught:", error)


### Topic 3: Several except blocks ###
# Different problems often need different responses. Python checks the except
# blocks from top to bottom and runs the first one that matches.


def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("  (cannot divide by zero)")
    except TypeError:
        print("  (both values must be numbers)")
    return None


print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, "x"))

# One except can catch several types if you list them in a tuple:
#       except (ValueError, TypeError):

# WARNING: avoid a bare `except:`. It also swallows Ctrl+C and typos in your own
# code, hiding real bugs. If you must catch "anything", write
# `except Exception as error:` and at least print the error.


### Topic 4: else and finally ###
#   else:     runs ONLY if the try block finished with NO exception
#   finally:  runs ALWAYS, error or not (it's for cleaning up, see 8.7)
for text in ["25", "abc"]:
    try:
        number = int(text)
    except ValueError:
        print(repr(text), "-> not a number")
    else:
        print(repr(text), "->", number * 2)
    finally:
        print("  done with", repr(text))

# Keep the try block SMALL (just the risky line), so you know exactly what
# might have failed.


### Topic 5: Asking again until the answer is valid ###
# A very common pattern: loop forever, try the conversion, and break out only
# when it works. input() always gives text (see 4.1), so int() may fail.

while True:
    try:
        x = int(input("Please enter a number: "))
        print(f"Great! You entered {x}")
        break
    except ValueError:
        print("Oops! That was no valid number. Try again...")


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write a function that asks for an age and keeps asking until it gets a
#      whole number between 0 and 120.
#   2. Try to open a file that doesn't exist and catch FileNotFoundError, then
#      print a friendly message.
#   3. Given ["3", "x", "7", ""], convert each to int, skipping the ones that
#      fail, and sum the rest.
# =============================================================================
