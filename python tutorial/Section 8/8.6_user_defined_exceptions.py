"""
Python Reference: User defined exceptions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Creating your own exception type by inheriting from Exception
#   - Why a custom exception makes error handling clearer
#   - Adding extra information to an exception
#   - An exception family: catching a general type or a specific one
#
# This uses classes and inheritance (Section 9). The short version: a class
# is a blueprint, and `class B(A)` means "B is a special kind of A".
# =============================================================================


### Topic 1: The smallest custom exception ###
# Programs can name their own exceptions by creating a new exception class.
# Inheriting from Exception is what makes it a real exception.
# (`pass` means the class body adds nothing new, see 4.6.)


class MyCustomError(Exception):
    pass


try:
    raise MyCustomError("This is a custom error!")
except MyCustomError as error:
    print("Caught:", error)

# Why bother? The NAME says what went wrong, and callers can catch exactly it
# without also catching unrelated errors.
# PyTorch and scikit-learn define their own, so you often catch theirs rather
# than create new ones. Still worth knowing how it works.


### Topic 2: Carrying extra information ###
# Give the exception an __init__ (setup method, see 9.1) to store details.


class InvalidScoreError(Exception):
    def __init__(self, score):
        self.score = score
        super().__init__(f"score must be between 0 and 100, got {score}")


def record_score(score):
    if not 0 <= score <= 100:
        raise InvalidScoreError(score)
    return score


try:
    record_score(150)
except InvalidScoreError as error:
    print("Caught:", error)
    print("The bad score was:", error.score)  # extra data attached to the error


### Topic 3: A family of exceptions ###
# Make one base class for your project, and specific errors below it. Callers
# can then catch either the whole family or one member.


class DataError(Exception):
    """Base class for every data-related problem."""


class MissingColumnError(DataError):
    pass


class EmptyDatasetError(DataError):
    pass


for problem in [MissingColumnError("no 'age' column"), EmptyDatasetError("0 rows")]:
    try:
        raise problem
    except MissingColumnError:
        print("handled a missing column")
    except DataError as error:  # catches any other member of the family
        print("handled a general data error:", error)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Create NegativeAgeError and raise it when an age below zero is given.
#   2. Store the offending age on the error, like InvalidScoreError does.
#   3. Make ModelError the base class for TrainingError and PredictionError,
#      then write one except that catches both.
# =============================================================================
