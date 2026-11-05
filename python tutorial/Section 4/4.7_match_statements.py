"""
Python Reference: Match statements
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - match / case: a cleaner alternative to long if/elif chains
#   - Matching exact values, several values at once (|), and "anything else" (_)
#   - Matching the SHAPE of data: tuples, objects and lists, and pulling
#     values out of them at the same time
#   - Guards: adding an extra "if" to a case
#
# Needs Python 3.10 or newer. This lesson uses functions (def / return, see
# 4.8) and a class (see Section 9) a little early; the comments explain them.
# =============================================================================


### Topic 1: Matching exact values ###
# A function is a named, reusable block of code. 'def http_error(status):' says
# "here is a function that takes one input, which I'll call status".
# 'return' hands a result back to whoever called the function (4.8 explains).
#
# match takes a value and compares it with each 'case' pattern from top to
# bottom. The FIRST pattern that fits wins and the others are ignored.
# The underscore  _  is the WILDCARD: it matches anything, so it goes last as
# the "everything else" case (like else in an if chain).


def http_error(status):
    match status:
        case 400:
            return "Bad request"
        case 404:
            return "Not found"
        case 418:
            return "I'm a teapot"
        case _:
            return "Something's wrong with the internet"


status = int(input("Status: "))  # input() gives text, int() makes it a number
print(http_error(status))


### Topic 2: Several values in one case ###
# Use | (read it as "or") to combine patterns that share one result.


def describe_status(status):
    match status:
        case 401 | 403 | 404:
            return "Not allowed or not found"
        case 200 | 201:
            return "Success"
        case _:
            return "Unknown"


print(describe_status(403))
print(describe_status(201))
print(describe_status(500))


### Topic 3: Matching the shape of a tuple ###
# This is where match goes beyond a normal switch statement. A pattern can
# describe the STRUCTURE of the data, and any plain name inside the pattern
# becomes a variable that captures the matching piece.
#
# A tuple is a fixed group of values, like the point (3, 5). (See 5.3.)
#   case (0, 0)   matches only the exact tuple (0, 0)
#   case (0, y)   matches any tuple whose FIRST item is 0, and stores the second in y
#   case (x, y)   matches any 2-item tuple, storing both values

x_input = int(input("Enter X: "))
y_input = int(input("Enter Y: "))
point = (x_input, y_input)

match point:
    case (0, 0):
        print("Origin")
    case (0, y):
        print(f"Y={y}")  # on the Y axis, at height y
    case (x, 0):
        print(f"X={x}")  # on the X axis, at distance x
    case (x, y):
        print(f"X={x}, Y={y}")  # anywhere else
    case _:
        raise ValueError("Not a point")  # raising errors: see 8.4


### Topic 4: Matching objects (class patterns) ###
# A class is a blueprint for objects (Section 9). Here Point objects have two
# attributes, x and y. __init__ is the setup method that fills them in.
# A class pattern looks like a call:  Point(x=0, y=0).


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y


def where_is(point):
    match point:
        case Point(x=0, y=0):
            print("Origin")
        case Point(x=0, y=y):  # the second y is a NEW variable capturing point.y
            print(f"Y={y}")
        case Point(x=x, y=0):
            print(f"X={x}")
        case Point():  # any Point at all (no conditions on its attributes)
            print("Somewhere else")
        case _:
            print("Not a point")


where_is(Point(0, 0))
where_is(Point(0, 10))
where_is(Point(4, 4))
where_is("hello")  # not a Point, so it falls through to the wildcard


### Topic 5: Positional patterns with __match_args__ ###
# Writing Point(x=0, y=0) is wordy. If the class lists its attribute names in
# __match_args__, you can write Point(0, 0) and Python knows the first value
# means x and the second means y.
#
# (We define Point again with the extra line. The new definition replaces the
#  old one for everything below.)


class Point:
    __match_args__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y


### Topic 6: Matching lists ###
# Square brackets match a list (or tuple) of a certain length and shape.
points = [Point(0, 3), Point(0, 5)]  # a list containing two Point objects

match points:
    case []:  # an empty list
        print("No points")
    case [Point(0, 0)]:  # a list with exactly one item: the origin
        print("The origin")
    case [Point(x, y)]:  # a list with exactly one point, anywhere
        print(f"Single point {x}, {y}")
    case [
        Point(0, y1),
        Point(0, y2),
    ]:  # exactly two points, both with x == 0 (so both on the Y axis)
        print(f"Two on the Y axis at {y1}, {y2}")
    case _:
        print("Something else")


### Topic 7: Guards (an extra if) ###
# Add 'if condition' after a pattern. The case matches only when the pattern
# fits AND the condition is True.
# (We rebuild the point as a Point object so the Point patterns can match it.)

pt = Point(x_input, y_input)

match pt:
    case Point(x, y) if x == y:
        print(f"Y=X at {x}")  # a point on the diagonal, like (2, 2)
    case Point(x, y):
        print("Not on the diagonal")


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write a function day_type(day) that returns "weekend" for "Sat" | "Sun",
#      "weekday" for Mon-Fri, and "invalid" otherwise.
#   2. Match a command like ("move", 3) and ("say", "hello") with patterns
#      case ("move", steps) and case ("say", message).
#   3. Add a guard to a (x, y) tuple pattern: "x > 0 and y > 0" -> "Quadrant 1".
# =============================================================================
