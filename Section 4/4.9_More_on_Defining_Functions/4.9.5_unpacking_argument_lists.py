# Normal function call passing arguments manually
a = list(range(3, 6))
print(a)

# UNPACKING: Using the * operator to unpack a list (or tuple) into positional arguments.
# This takes the list [3, 6] and unpacks it so the function sees it as: range(3, 6)
args = [3, 6]
b = list(range(*args))
print(b)