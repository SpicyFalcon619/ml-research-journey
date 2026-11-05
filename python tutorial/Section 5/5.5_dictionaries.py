"""
Python Reference: Dictionaries
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a dictionary is and how it differs from a list
#   - Creating one, reading, adding, changing and deleting entries
#   - Safe lookups with .get() and the KeyError you get without it
#   - Looping over keys, values and items
#   - Nested dictionaries (the shape of a config file or a JSON response)
#   - Counting things, and dict comprehensions
#
# Dictionaries are probably THE most used structure in practical Python:
# hyperparameters, model configs, JSON from web APIs, DataFrame columns...
# =============================================================================


### Topic 1: What is a dictionary? ###
# A list finds things by POSITION:  names[2]
# A dictionary finds things by a NAME you choose, called a KEY:  phone["jack"]
# Each key is attached to a VALUE. Together they form a "Key: Value" pair.
# It works like a real dictionary: look up a word (key), get its meaning (value).
#
#   {  "jack": 4098,   "sape": 4139  }
#      ----   ----     ----   ----
#      key   value     key    value
#
# You write one with curly braces, colons between key and value, commas between pairs.

tel = {"jack": 4098, "sape": 4139}
print("Initial Dictionary:", tel)
print(type(tel))  # <class 'dict'>
print("Number of entries:", len(tel))


### Topic 2: Reading, adding and changing ###
# Read a value:  dictionary[key]
print("Jack's number:", tel["jack"])

# Add a new Key-Value pair: assign to a key that doesn't exist yet.
tel["guido"] = 4127
print("After adding guido:", tel)

# Change an existing one: assign to a key that does exist (the old value is replaced).
tel["jack"] = 5000
print("After changing jack:", tel)

# Keys are UNIQUE. Writing the same key again overwrites, never duplicates.
# Values can repeat, and can be anything (numbers, text, lists, even dictionaries).


### Topic 3: Missing keys, and .get() ###
# Accessing a missing Key using standard brackets crashes with a KeyError!
try:
    print(tel["irv"])
except KeyError as error:
    print("KeyError for key:", error)

# Instead, we can use .get(), which safely returns None if the key doesn't exist:
print("Irv's number (using .get safely):", tel.get("irv"))

# .get() accepts a second argument: the fallback to use instead of None.
print("With a default:", tel.get("irv", "no number on file"))

# You can also ask first with `in`:
if "irv" in tel:
    print("found irv")
else:
    print("irv is not in the dictionary")


### Topic 4: Deleting ###
# del removes a pair by key
del tel["sape"]

# .pop(key) removes it AND returns the value (like for lists)
removed = tel.pop("jack")
print("Removed jack, who had:", removed)

# Adding Irv back in
tel["irv"] = 4127
print("After deleting sape and jack, adding irv:", tel)


### Topic 5: Keys, values, items and checking ###
# Getting just the Keys
print("\nList of Keys:", list(tel))
print("Sorted Keys:", sorted(tel))

# Three "views" of a dictionary:
print(".keys()  :", list(tel.keys()))
print(".values():", list(tel.values()))
print(".items() :", list(tel.items()))  # each pair comes out as a (key, value) tuple

# Checking if a Key exists (Very fast, just like Sets!)
# NOTE: `in` checks KEYS only, not values.
print("Is 'guido' a key in tel?", "guido" in tel)
print("Is 'jack' NOT a key in tel?", "jack" not in tel)
print("Is 4127 a key in tel?", 4127 in tel)  # False: 4127 is a value, not a key

# Since Python 3.7 a dictionary remembers the order in which keys were inserted.


### Topic 6: Looping over a dictionary ###
for name in tel:  # a plain loop gives the KEYS
    print("key:", name)

for name, number in tel.items():  # .items() gives key AND value together
    print(f"{name} -> {number}")


### Topic 7: Nested dictionaries ###
# A value can be another dictionary (or a list). This is exactly how JSON files
# and config files look, and how ML experiments are usually described:
experiment = {
    "name": "baseline",
    "model": {"layers": 3, "activation": "relu"},
    "hyperparameters": {"learning_rate": 0.001, "epochs": 20},
    "datasets": ["train.csv", "val.csv"],
}

print("\nLearning rate:", experiment["hyperparameters"]["learning_rate"])
# Read it left to right: "from experiment take hyperparameters, from that take learning_rate".
print("First dataset:", experiment["datasets"][0])

experiment["hyperparameters"]["epochs"] = 50  # changing a deep value
print("Epochs now:", experiment["hyperparameters"]["epochs"])


### Topic 8: Merging and updating ###
defaults = {"epochs": 10, "lr": 0.01}
overrides = {"lr": 0.1, "batch_size": 32}

merged = defaults | overrides  # the right side wins on shared keys (Python 3.9+)
print("\nMerged:", merged)

defaults.update(overrides)  # the same, but changes `defaults` in place
print("Updated in place:", defaults)


### Topic 9: What can be a key? ###
# Keys must be IMMUTABLE (unchangeable): strings, numbers and tuples are fine,
# lists are not. (Reason: Python needs a key to never change, so it can find it again.)
try:
    bad = {[1, 2]: "a list as key"}
except TypeError as error:
    print("\nTypeError:", error)


### Topic 10: Counting with a dictionary ###
# A very common pattern: count how often each item appears.
words = ["to", "be", "or", "not", "to", "be"]
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1  # start at 0 if never seen, then add 1
print("\nWord counts:", counts)
# (The standard library has collections.Counter that does this in one line.)


### Topic 11: Other ways to create dictionaries ###
# From a list of tuples
dict1 = dict([("sape", 4139), ("guido", 4127), ("jack", 4098)])

# Using Keyword Arguments (keys must be simple names, written without quotes)
dict2 = dict(sape=4139, guido=4127, jack=4098)

print("\ndict1 == dict2:", dict1 == dict2)

# From two lists with zip (see 5.6):
keys = ["a", "b", "c"]
vals = [1, 2, 3]
print(dict(zip(keys, vals)))

# DICT COMPREHENSIONS (just like List Comprehensions, but building dictionaries!)
dict3 = {x: x**2 for x in (2, 4, 6)}
print("\nDict Comprehension:", dict3)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make a dictionary describing yourself (name, age, city, hobbies as a list).
#      Print each item as "key: value" using a loop.
#   2. Write a function that takes a sentence and returns how many times each
#      LETTER appears, as a dictionary.
#   3. You have scores = {"Ada": 90, "Bob": 72, "Cy": 85}. Find the name with the
#      highest score (hint: max(scores, key=scores.get)).
#   4. Invert {"a": 1, "b": 2} into {1: "a", 2: "b"} with a dict comprehension.
# =============================================================================
