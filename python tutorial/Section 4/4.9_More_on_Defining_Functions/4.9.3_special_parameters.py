"""
Python Reference: Special parameters
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Two special markers in a parameter list:  /  and  *
#   - Positional-only, keyword-only and "either" parameters
#   - Why a library author would restrict how arguments are passed
#
# This is a slightly advanced topic. You will mostly READ it in library
# signatures (like torch or sklearn docs) rather than write it yourself.
# =============================================================================


### Topic 1: Three kinds of parameter ###
# A normal parameter accepts its argument either by position OR by keyword.
# Two markers in the def line let you restrict that:
#
#     def f(pos_only, /, standard, *, kwd_only):
#            ------     --------    --------
#            before /    between     after *
#            POSITION    either way  KEYWORD
#            only                    only
#
#   /  = "everything BEFORE me must be passed by position"
#   *  = "everything AFTER me must be passed by keyword"


def standard_arg(arg):
    print(arg)


def pos_only_arg(arg, /):
    print(arg)


def kwd_only_arg(*, arg):
    print(arg)


def combined_example(pos_only, /, standard, *, kwd_only):
    print(pos_only, standard, kwd_only)


### Topic 2: What each one allows ###
# standard: any style works.
standard_arg(2)
standard_arg(arg=2)

# positional-only: the name 'arg' is not available as a keyword.
pos_only_arg(1)
try:
    pos_only_arg(arg=1)
except TypeError as error:
    print("Error:", error)

# keyword-only: you MUST write the name.
kwd_only_arg(arg=3)
try:
    kwd_only_arg(3)
except TypeError as error:
    print("Error:", error)

# All three together: 1 is positional-only, 2 is flexible, 3 is keyword-only.
combined_example(1, 2, kwd_only=3)
combined_example(1, standard=2, kwd_only=3)

try:
    combined_example(1, 2, 3)  # kwd_only given by position -> not allowed
except TypeError as error:
    print("Error:", error)

try:
    combined_example(pos_only=1, standard=2, kwd_only=3)  # pos_only by keyword
except TypeError as error:
    print("Error:", error)


### Topic 3: Why would anyone do this? ###
# 1. POSITIONAL-ONLY (/) when the parameter name is not meaningful, or when you
#    want the freedom to rename it later without breaking everyone's code.
#    Example: len(obj). The name of that parameter is irrelevant.
#
# 2. KEYWORD-ONLY (*) when a call would be unreadable otherwise. Compare
#       train(model, 10, True, False)       <- what do True and False mean?
#       train(model, epochs=10, shuffle=True, verbose=False)
#    Forcing keywords makes the second style mandatory.

# A neat side effect: avoiding NAME COLLISIONS. Because 'name' is
# positional-only, the key "name" is still free to arrive via **kwds:


def foo(name, /, **kwds):
    return "name" in kwds


print(foo(1, **{"name": 2}))  # True: 1 went into 'name', 2 went into kwds["name"]
# (The ** in the call unpacks a dictionary into keyword arguments, see 4.9.5.)
# Without the "/", Python would complain that 'name' was given twice.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write area(width, height, *, unit="cm") and call it as area(3, 4) and
#      area(3, 4, unit="m"). Then try area(3, 4, "m") to see the error.
#   2. Look up the signature of the built-in sorted() with help(sorted).
#      Which of its parameters are keyword-only?
# =============================================================================
