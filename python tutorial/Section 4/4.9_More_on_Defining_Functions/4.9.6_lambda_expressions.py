"""
Python Reference: Lambda expressions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Lambda: a tiny, nameless, one-expression function
#   - When lambdas are genuinely handy (the key= argument of sort, sorted, max)
#   - Returning a function from a function (a closure)
# =============================================================================


### Topic 1: A normal function vs a lambda ###
# These two do exactly the same thing:

def add(x, y):
    return x + y


add_lambda = lambda x, y: x + y  # lambda <parameters>: <the value to return>

print(add(2, 3), add_lambda(2, 3))

# A lambda is limited to ONE expression, and the result is returned automatically
# (no 'return' keyword). Anything longer deserves a proper def.
# Lambdas are mainly for short, throwaway functions that you hand to another
# function, as in the next topics, so they usually have no name.


### Topic 2: Passing a small function as an argument ###
# Many tools take a function as input and call it for you. sort() accepts a
# key= argument: "run this on each item, and sort by the result".

pairs = [(1, "one"), (2, "two"), (3, "three"), (4, "four")]

# By default, tuples are sorted by their first item (1, 2, 3, 4).
# We want alphabetical order by the WORD, which is the second item, index 1.
# The lambda says: "given a pair, look at pair[1]".
pairs.sort(key=lambda pair: pair[1])

# Alphabetical order: 'four' (f), 'one' (o), 'three' (t, h), 'two' (t, w)
print(pairs)

# More key= examples with sorted(), which returns a new list:
words = ["banana", "kiwi", "apple", "fig"]
print(sorted(words, key=lambda w: len(w)))  # shortest word first
print(sorted(words, key=lambda w: w[-1]))  # by LAST letter
print(max(words, key=lambda w: len(w)))  # the longest word

# And with map() / filter(): apply, or keep, based on a function
print(list(map(lambda x: x * 2, [1, 2, 3])))  # [2, 4, 6]
print(list(filter(lambda x: x > 1, [1, 2, 3])))  # [2, 3]
# (List comprehensions in 5.1.3 usually read better than map/filter.)


### Topic 3: A function that returns a function ###
# A function can build and return another function. The inner lambda
# REMEMBERS the value of n from when it was created (this is called a closure).


def make_incrementor(n):
    # This creates a mini, nameless function that takes 'x' and adds 'n' to it
    return lambda x: x + n


f = make_incrementor(42)  # 'f' is now a function where n = 42
g = make_incrementor(10)  # a separate function with n = 10

print(f(0))  # 0 + 42 = 42
print(f(1))  # 1 + 42 = 43
print(g(1))  # 1 + 10 = 11


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write a lambda that squares a number and test it: square(9) -> 81.
#   2. Sort ["Charlie", "alice", "Bob"] case-insensitively with
#      sorted(names, key=...). (Hint: str.lower)
#   3. Sort a list of (name, score) tuples from the HIGHEST score to lowest.
#      (Hint: key=lambda t: t[1] and the reverse=True option.)
#   4. Write make_multiplier(k) that returns a function multiplying by k.
# =============================================================================
