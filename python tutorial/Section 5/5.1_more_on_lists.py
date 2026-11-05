"""
Python Reference: More on lists
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The full toolbox of list methods (append, extend, insert, remove, pop,
#     index, count, sort, reverse, copy, clear)
#   - The big difference between methods that CHANGE the list and ones that
#     return something new
#   - The "returns None" trap with sort() and reverse()
#
# Basics (creating, indexing, slicing) are in 3.1.3. This lesson builds on it.
# A METHOD is a function attached to a value, called with a dot: fruits.append(...)
# =============================================================================

fruits = ["orange", "apple", "pear", "banana", "kiwi", "apple", "banana"]
print("Original list:", fruits)


### Topic 1: Adding items ###
# .append(x)       add ONE item at the end
# .extend(list)    add EVERY item of another list at the end
# .insert(i, x)    put x at position i, shifting the rest to the right

fruits.append("grape")
print("After .append('grape'):", fruits)

fruits.extend(["mango", "lime"])
print("After .extend([...]):", fruits)

fruits.insert(0, "cherry")
print("After .insert(0, 'cherry'):", fruits)

# append vs extend, a classic mix-up:
#   [1, 2].append([3, 4])  -> [1, 2, [3, 4]]   the whole list becomes ONE item
#   [1, 2].extend([3, 4])  -> [1, 2, 3, 4]     the items are added separately
nums = [1, 2]
nums.append([3, 4])
print(nums)
nums = [1, 2]
nums.extend([3, 4])
print(nums)


### Topic 2: Removing items ###
# .remove(x)   delete the FIRST item equal to x (error if it isn't there)
# .pop()       remove the LAST item and hand it back
# .pop(i)      remove the item at position i and hand it back
# .clear()     remove everything
# (del can remove by position or slice too, see 5.2)

fruits.remove("lime")
print("After .remove('lime'):", fruits)

last_item = fruits.pop()
print("Popped item:", last_item)
print("After .pop():", fruits)

first_item = fruits.pop(0)
print("Popped position 0:", first_item)


### Topic 3: Searching ###
# .count(x)      how many times x appears
# .index(x)      position of the FIRST x (error if missing)
# .index(x, n)   same, but start searching at position n
# `x in list`    just True/False: is it there at all?

print("Count of 'apple':", fruits.count("apple"))
print("Count of 'tangerine':", fruits.count("tangerine"))

print("Index of 'banana':", fruits.index("banana"))
print("Index of 'banana' starting search at position 4:", fruits.index("banana", 4))
print("Is 'kiwi' in the list?", "kiwi" in fruits)

# If you aren't sure the item exists, check with `in` first.
# fruits.index("tangerine") would crash with ValueError: not in list


### Topic 4: Ordering, and the "returns None" trap ###
# .reverse()   flip the order, IN PLACE
# .sort()      sort alphabetically/numerically, IN PLACE
# "In place" means the list itself is changed and the method gives back nothing.

fruits.reverse()
print("After .reverse():", fruits)

fruits.sort()
print("After .sort():", fruits)

fruits.sort(reverse=True)  # biggest/last-in-alphabet first
print("After .sort(reverse=True):", fruits)

# THE TRAP: methods that change a list in place return None. So this is a bug:
oops = fruits.sort()
print("oops is:", oops)  # None! You just threw your list away, if you had stored it there

# If you want the list UNCHANGED plus a sorted copy, use the built-in sorted():
original = [3, 1, 2]
sorted_copy = sorted(original)  # returns a NEW list
print(original, sorted_copy)


### Topic 5: Copying ###
# Remember (3.1.3): `b = a` makes a second name for the SAME list.
# Use .copy() for a real copy.
backup = fruits.copy()
fruits.clear()
print("fruits after .clear():", fruits)
print("backup is safe:", backup)


### Quick reference ###
# Changes the list:  append  extend  insert  remove  pop  clear  sort  reverse
# Returns new info:  count  index  copy      (and sorted(), len(), sum() ...)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Start from [5, 3, 8, 1]. Append 7, insert 0 at the front, sort it, then
#      pop the largest value. What is left?
#   2. What is wrong with  nums = [3, 1, 2].sort()  and why does print(nums)
#      show None?
#   3. Remove ALL occurrences of "apple" from a list (hint: one remove() only
#      deletes the first; think loop, or the comprehension from 5.1.3).
# =============================================================================
