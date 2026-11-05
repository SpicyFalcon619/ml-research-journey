"""
Python Reference: Sets
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a set is: unordered, no duplicates, very fast lookups
#   - Creating sets (and the {} empty-set trap)
#   - Adding and removing items
#   - Set maths: union, intersection, difference, symmetric difference
#   - A real ML use: checking that train and test data don't overlap
# =============================================================================


### Topic 1: Creating a set ###
# A Set is an UNORDERED collection with NO DUPLICATE elements.
#   - Unordered: there is no "first" item and you cannot index it (s[0] fails)
#   - Unique: adding something that is already there changes nothing
# Very useful in Machine Learning for quickly removing duplicates from a massive list.

basket = {"apple", "orange", "apple", "pear", "orange", "banana"}

# A set's print order can differ from run to run (Python shuffles string hashes
# for security), so for stable output we print sorted(...) in this lesson.
print("Basket (duplicates removed!):", sorted(basket))
print("Size:", len(basket))

# set(...) turns any iterable into a set, which is the classic dedup trick:
labels = ["cat", "dog", "cat", "bird", "dog", "cat"]
print("Unique labels:", sorted(set(labels)))

# THE EMPTY-SET TRAP: {} is an empty DICTIONARY, not a set. Use set() instead.
print(type({}), type(set()))


### Topic 2: Membership testing (the superpower) ###
# Checking if an item exists is much faster in a Set than in a List.
# A list must check items one by one; a set jumps straight to the answer.
# With millions of items, that is the difference between instant and minutes.
print("Is 'orange' in basket?", "orange" in basket)
print("Is 'crabgrass' in basket?", "crabgrass" in basket)


### Topic 3: Adding and removing ###
fruits = {"apple", "pear"}
fruits.add("kiwi")  # adding an existing item silently does nothing
fruits.add("apple")
print("\nAfter add:", sorted(fruits))

fruits.remove("pear")  # raises KeyError if missing
fruits.discard("mango")  # same job but NO error if missing
print("After remove/discard:", sorted(fruits))

# Items must be immutable (like strings, numbers, tuples): a list can't be in a set.


### Topic 4: Set maths ###
# Sets mirror the Venn diagrams you drew in school.
a = set("abracadabra")
b = set("alacazam")

print("\nSet A (unique letters in 'abracadabra'):", sorted(a))
print("Set B (unique letters in 'alacazam'):", sorted(b))

# Difference (in a, but not in b)
print("\na - b (Difference):", sorted(a - b))

# Union (in a OR b OR both)
print("a | b (Union):", sorted(a | b))

# Intersection (in BOTH a AND b)
print("a & b (Intersection):", sorted(a & b))

# Symmetric Difference (in a OR b, but NOT BOTH)
print("a ^ b (Symmetric Difference):", sorted(a ^ b))

# Handy yes/no questions:
print("\n{1, 2} is a subset of {1, 2, 3}?", {1, 2} <= {1, 2, 3})
print("{1, 2} and {3, 4} share nothing?", {1, 2}.isdisjoint({3, 4}))


### Topic 5: Set comprehension ###
# Just like a list comprehension (5.1.3), but with curly braces.
print("\nLast letters:", sorted({word[-1] for word in ["cat", "dog", "bat", "owl"]}))


### Topic 6: A real ML use, spotting data leakage ###
# When you split data into a TRAIN set and a TEST set, no sample should be in
# both, or the test score becomes meaningless ("data leakage"). A set
# intersection checks it instantly:
train_ids = {1, 2, 3, 4, 5, 6}
test_ids = {6, 7, 8}
overlap = train_ids & test_ids
if overlap:
    print("\nLEAK! These samples are in both sets:", sorted(overlap))
else:
    print("\nClean split.")


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. How many UNIQUE words are in "to be or not to be that is the question"?
#   2. Two students list their hobbies. Print hobbies they share, and hobbies
#      that only one of them has.
#   3. Why does {1, 2, 3}[0] fail? How would you get an arbitrary item?
#   4. Predict:  len({1, 1.0, True})  (hint: 1 == 1.0 == True)
# =============================================================================
