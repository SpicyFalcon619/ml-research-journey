"""
Python Reference: Documentation strings
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Docstrings: documentation that lives INSIDE your function
#   - How help() and your editor's hover-tooltips find them
#   - A practical, readable docstring layout (Args / Returns)
#   - The difference between a comment (#) and a docstring
# =============================================================================


### Topic 1: What is a docstring? ###
# A DOCSTRING is a string written as the very FIRST thing inside a function
# (or class, or file). Python stores it, so tools can show it to users.
# By convention it uses triple quotes: """ ... """, and the first line is a
# short summary sentence.


def my_function():
    """Do nothing, but document it.

    No, really, it doesn't do anything:

        >>> my_function()
        >>>
    """
    pass


# Whenever you call help() on a library function, or hover over one in your
# editor, you are reading that function's docstring.
help(my_function)

# You can also read it directly. It lives in the special attribute __doc__
print(my_function.__doc__)


### Topic 2: A docstring you would actually write ###
# Describe what the function does, what goes in, and what comes out.
# (This is the "Google style"; you will see it in most ML libraries.)


def mean_squared_error(predictions, targets):
    """Return the average squared difference between two lists.

    Args:
        predictions: list of numbers the model produced.
        targets: list of the correct numbers, same length as predictions.

    Returns:
        A single float. Lower is better, 0.0 means a perfect match.
    """
    total = 0
    for p, t in zip(predictions, targets):
        total += (p - t) ** 2
    return total / len(predictions)


print(mean_squared_error([2, 4], [1, 6]))  # ((2-1)^2 + (4-6)^2) / 2 = 2.5
help(mean_squared_error)


### Topic 3: Comment vs docstring ###
# A # comment explains HOW or WHY a line of code works, for people reading the
# source. A docstring explains WHAT a function is for, for people USING it
# (who might never open the source). Good code has both, used sparingly.
#
# The first string at the very top of THIS file is a docstring too: it is the
# file's own documentation. You can read it like this:
print("This file's docstring:", __doc__.strip())


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Add a docstring to a function of your own and read it with help().
#   2. Run help(len) and help(str.upper). These are docstrings written by the
#      Python team.
#   3. Write a function with a docstring that has Args and Returns sections,
#      then hover over a call to it in VS Code to see the tooltip.
# =============================================================================
