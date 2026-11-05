"""
Python Reference: Raising exceptions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - raise: triggering an exception yourself
#   - Why you would: refusing bad input with a clear message
#   - Re-raising an error after looking at it
#   - assert: a quick sanity check
# =============================================================================


### Topic 1: The raise statement ###
# The raise statement allows you to force a specified exception to occur.
# The exception is created like a function call; the text is its message.

try:
    raise NameError("HiThere")
except NameError:
    print("An exception flew by! (We caught the custom error we just raised)")


### Topic 2: Why raise? Validating input ###
# A function that receives nonsense should fail LOUDLY and EARLY, with a clear
# message, rather than quietly producing wrong answers.


def set_learning_rate(lr):
    if not isinstance(lr, (int, float)):  # isinstance: "is it a number?"
        raise TypeError(f"learning rate must be a number, got {type(lr).__name__}")
    if lr <= 0:
        raise ValueError(f"learning rate must be positive, got {lr}")
    return lr


print(set_learning_rate(0.01))

for bad_value in [-1, "fast"]:
    try:
        set_learning_rate(bad_value)
    except (ValueError, TypeError) as error:
        print(f"{type(error).__name__}: {error}")

# Pick the exception type that fits: ValueError = right type, wrong value.
# TypeError = the wrong type altogether.


### Topic 3: Re-raising ###
# Sometimes you want to log something and then let the error continue on its
# way. A bare `raise` inside except re-raises the same exception.
try:
    try:
        1 / 0
    except ZeroDivisionError:
        print("Logging: a division by zero happened")
        raise  # pass the same error upward
except ZeroDivisionError:
    print("The outer code received it too")


### Topic 4: assert ###
# assert condition, "message"   raises AssertionError if the condition is False.
# A quick way to state "this must be true here", very handy while developing,
# for example to check a list's length matches.
features = [1, 2, 3]
labels = [0, 1, 0]
assert len(features) == len(labels), "features and labels must match"
print("assert passed")

try:
    assert len(features) == 5, "expected 5 features"
except AssertionError as error:
    print("AssertionError:", error)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write a function percent(value) that raises ValueError if value is not
#      between 0 and 100.
#   2. Call it inside try/except and print the message.
#   3. Add an assert that checks a list is not empty before you divide by its
#      length.
# =============================================================================
