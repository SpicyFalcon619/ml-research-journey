# -----------------------------------------------------
# DICTIONARIES (🔥 CRITICAL FOR MACHINE LEARNING! 🔥)
# -----------------------------------------------------
# Dictionaries store data in "Key: Value" pairs.
# You will use these constantly to store Model configurations, hyperparameters, and datasets.

tel = {'jack': 4098, 'sape': 4139}
print("Initial Dictionary:", tel)

# Adding a new Key-Value pair
tel['guido'] = 4127
print("After adding guido:", tel)

# Accessing a value by its Key
print("Jack's number:", tel['jack'])

# Accessing a missing Key using standard brackets crashes with a KeyError!
# tel['irv'] <-- CRASHES!
# Instead, we use .get() which safely returns None if the key doesn't exist:
print("Irv's number (using .get safely):", tel.get('irv'))

# Deleting a Key-Value pair
del tel['sape']

# Adding Irv back in
tel['irv'] = 4127
print("After deleting sape and adding irv:", tel)

# Getting just the Keys
print("List of Keys:", list(tel))
print("Sorted Keys:", sorted(tel))

# Checking if a Key exists (Very fast, just like Sets!)
print("Is 'guido' a key in tel?", 'guido' in tel)
print("Is 'jack' NOT a key in tel?", 'jack' not in tel)

# -----------------------------------------------------
# OTHER WAYS TO CREATE DICTIONARIES
# -----------------------------------------------------
# From a list of tuples
dict1 = dict([('sape', 4139), ('guido', 4127), ('jack', 4098)])

# Using Keyword Arguments
dict2 = dict(sape=4139, guido=4127, jack=4098)

# DICT COMPREHENSIONS (Just like List Comprehensions, but building dictionaries!)
dict3 = {x: x**2 for x in (2, 4, 6)}
print("\nDict Comprehension:", dict3)