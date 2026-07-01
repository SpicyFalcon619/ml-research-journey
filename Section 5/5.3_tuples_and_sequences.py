# -----------------------------------------------------
# TUPLES AND SEQUENCES
# -----------------------------------------------------
# A tuple is a sequence of values, much like a list.
# The big difference: Tuples are IMMUTABLE (cannot be changed).

# Tuples are usually created with parentheses, but commas are enough!
t = 12345, 54321, 'hello!'
print("Tuple t:", t)
print("First item in t:", t[0])

# Tuples may be nested inside other tuples
u = t, (1, 2, 3, 4, 5)
print("\nNested tuple u:", u)

# Tuples are IMMUTABLE. You cannot change their values.
print("\nAttempting to change t[0] to 88888...")
try:
    t[0] = 88888
except TypeError as e:
    print("Crash Avoided! Error caught:", repr(e))

# BUT, they can contain mutable objects (like lists)!
v = ([1, 2, 3], [3, 2, 1])
print("\nTuple containing lists:", v)