# -----------------------------------------------------
# COMPARING SEQUENCES
# -----------------------------------------------------
# Python compares sequences (lists, tuples, strings) lexicographically (like an English dictionary).
# It compares the first items. If they are the same, it moves to the second items, etc.

print("Tuple comparison:", (1, 2, 3) < (1, 2, 4))
print("List comparison:", [1, 2, 3] < [1, 2, 4])

# Strings are compared alphabetically (by their ASCII value)
print("String comparison:", 'ABC' < 'C' < 'Pascal' < 'Python')

# Shorter sequences are considered "smaller" if all previous items match
print("Length comparison:", (1, 2, 3, 4) < (1, 2, 4))
print("Length comparison 2:", (1, 2) < (1, 2, -1))

# Integers and Floats are treated equally if their value is the same
print("Int vs Float:", (1, 2, 3) == (1.0, 2.0, 3.0))

# Nested sequences are also compared item by item
print("Nested comparison:", (1, 2, ('aa', 'ab')) < (1, 2, ('abc', 'a'), 4))