# Initial list
fruits = ['orange', 'apple', 'pear', 'banana', 'kiwi', 'apple', 'banana']
print("Original list:", fruits)

# .count() returns how many times an item appears in the list
print("Count of 'apple':", fruits.count('apple'))
print("Count of 'tangerine':", fruits.count('tangerine'))

# .index() returns the first index where the item is found
print("Index of 'banana':", fruits.index('banana'))
print("Index of 'banana' starting search at position 4:", fruits.index('banana', 4))

# .reverse() modifies the list in-place (reverses the order)
fruits.reverse()
print("After .reverse():", fruits)

# .append() adds a single item to the END of the list
fruits.append('grape')
print("After .append('grape'):", fruits)

# .sort() modifies the list in-place (sorts alphabetically or numerically)
fruits.sort()
print("After .sort():", fruits)

# .pop() removes and returns the LAST item in the list
last_item = fruits.pop()
print("Popped item:", last_item)
print("After .pop():", fruits)