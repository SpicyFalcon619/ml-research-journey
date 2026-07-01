# Using match-case for structural pattern matching (similar to switch-case in other languages)
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

status = int(input("Status: "))
print(http_error(status))


# You can combine several literals in a single pattern using | (“or”):
# case 401 | 403 | 404:
#    #return "Not allowed"

# Pattern matching with tuples to unpack and extract variables
x_input = int(input("Enter X: "))
y_input = int(input("Enter Y: "))
point = (x_input, y_input)

match point:
    case (0, 0):
        print("Origin")
    case (0, y):
        print(f"Y={y}")
    case (x, 0):
        print(f"X={x}")
    case (x, y):
        print(f"X={x}, Y={y}")
    case _:
        raise ValueError("Not a point")
    

# Pattern matching with Python Classes (Objects)
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

def where_is(point):
    match point:
        case Point(x=0, y=0):
            print("Origin")
        case Point(x=0, y=y):
            print(f"Y={y}")
        case Point(x=x, y=0):
            print(f"X={x}")
        case Point():
            print("Somewhere else")
        case _:
            print("Not a point")

# Testing the class pattern matching
where_is(Point(0, 0))
where_is(Point(0, 10))

# Using __match_args__ allows positional matching (e.g. Point(0, 0) instead of Point(x=0, y=0))
class Point:
    __match_args__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y
        
# Pattern matching against sequences (lists/tuples) of objects
points = [Point(0, 3), Point(0, 5)] # Now it's a list containing two Point objects!

match points:
    case []: # Matches an empty list/tuple
        print("No points")
    case [Point(0, 0)]: # Matches a list/tuple with exactly one Point at the origin
        print("The origin")
    case [Point(x, y)]: # Matches a list/tuple with exactly one Point anywhere
        print(f"Single point {x}, {y}")
    case [Point(0, y1), Point(0, y2)]: # Matches a list/tuple with exactly two Points, both on the Y-axis
        print(f"Two on the Y axis at {y1}, {y2}")
    case _:
        print("Something else")
        
        
match point:
    case Point(x, y) if x == y:
        print(f"Y=X at {x}")
    case Point(x, y):
        print(f"Not on the diagonal")