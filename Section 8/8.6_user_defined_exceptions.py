# 8.6 User-defined Exceptions
# Programs can name their own exceptions by creating a new exception class.
# We skip this because ML libraries (like PyTorch) have already built their own exceptions for us.

class MyCustomError(Exception):
    pass

# raise MyCustomError("This is a custom error!")
