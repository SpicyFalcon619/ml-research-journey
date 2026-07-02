# SETS
# A Set is an UNORDERED collection with NO DUPLICATE elements.
# Very useful in Machine Learning for quickly removing duplicates from a massive list.

basket = {'apple', 'orange', 'apple', 'pear', 'orange', 'banana'}
print("Basket (duplicates removed!):", basket)

# Fast membership testing (Checking if an item exists is much faster in a Set than a List)
print("Is 'orange' in basket?", 'orange' in basket)
print("Is 'crabgrass' in basket?", 'crabgrass' in basket)


# SET MATH OPERATIONS
a = set('abracadabra')
b = set('alacazam')

print("\nSet A (unique letters in 'abracadabra'):", a)
print("Set B (unique letters in 'alacazam'):", b)

# Difference (in a, but not in b)
print("\na - b (Difference):", a - b)

# Union (in a OR b OR both)
print("a | b (Union):", a | b)

# Intersection (in BOTH a AND b)
print("a & b (Intersection):", a & b)

# Symmetric Difference (in a OR b, but NOT BOTH)
print("a ^ b (Symmetric Difference):", a ^ b)