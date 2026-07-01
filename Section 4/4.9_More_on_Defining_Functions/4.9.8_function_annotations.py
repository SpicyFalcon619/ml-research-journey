# ANNOTATIONS (Type Hints): You can optionally declare what type of data your function expects.
# `ham: str` means ham should be a string. `-> str` means it should return a string.
# WARNING: Python DOES NOT enforce this! You can still pass an integer, and Python won't care. It is purely for you and your code editor to read.
def f(ham: str, eggs: str = 'eggs') -> str:
    # All those hints are automatically stored in a dictionary called .__annotations__
    print("Annotations:", f.__annotations__)
    print("Arguments:", ham, eggs)
    return ham + ' and ' + eggs

f('spam')