# DOCSTRINGS: A multi-line string right below the function definition that acts as documentation.
# Whenever you use the built-in help() function on a library, it is reading these docstrings!
def my_function():
    """Do nothing, but document it.

    No, really, it doesn't do anything:

        >>> my_function()
        >>>
    """
    pass

# You can access any function's docstring using its special .__doc__ attribute
print(my_function.__doc__)