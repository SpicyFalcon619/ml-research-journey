"""
Python Reference: Exception chaining
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What exception chaining is: one error that remembers the one before it
#   - raise ... from ... (explicit chaining) and how to read the result
#   - Implicit chaining, and how to suppress it
#
# You won't use this much in basic ML, but you will READ chained tracebacks all
# the time in big libraries ("The above exception was the direct cause...").
# =============================================================================


### Topic 1: Explicit chaining with "from" ###
# Low-level code raises a technical error (ConnectionError). The code that called
# it translates that into a more meaningful one (RuntimeError) but keeps the
# original attached with `from`, so nothing is lost for debugging.


def func():
    raise ConnectionError("server did not answer")


try:
    try:
        func()
    except ConnectionError as exc:
        raise RuntimeError("Failed to open database") from exc
except RuntimeError as error:
    print("Caught:", error)
    print("Caused by:", repr(error.__cause__))  # the original error is kept here

# If it had gone uncaught, the traceback would read:
#   ConnectionError: server did not answer
#
#   The above exception was the direct cause of the following exception:
#
#   RuntimeError: Failed to open database


### Topic 2: Implicit chaining ###
# If you raise a NEW exception while handling another, Python links them
# automatically (without `from`). The old error is stored in __context__ and the
# traceback says "During handling of the above exception, another exception occurred".
try:
    try:
        1 / 0
    except ZeroDivisionError:
        raise ValueError("bad input")  # raised while handling the ZeroDivisionError
except ValueError as error:
    print("\nContext:", repr(error.__context__))


### Topic 3: Hiding the chain ###
# `from None` tells Python to throw the old error away if it would only be noise.
try:
    try:
        {}["missing"]
    except KeyError:
        raise ValueError("setting 'missing' is required") from None
except ValueError as error:
    print("\nCause:", error.__cause__)
    print("Suppressed context:", error.__suppress_context__)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write load_config(path) that catches FileNotFoundError and raises a
#      RuntimeError("config missing") from the original error. Don't catch the
#      RuntimeError and read the traceback.
#   2. Why is keeping the original error helpful when debugging?
# =============================================================================
