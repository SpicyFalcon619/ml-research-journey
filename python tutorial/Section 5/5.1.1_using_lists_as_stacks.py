"""
Python Reference: Using lists as stacks
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a stack is (Last-In, First-Out)
#   - Using a plain list as a stack with append() and pop()
#   - A real-world example where a stack is the right tool
# =============================================================================


### Topic 1: The stack idea ###
# STACKS: "Last-In, First-Out" (LIFO).
# Think of a stack of plates. The last plate you put on top is the first one you
# take off. You never pull from the middle. Your browser's Back button and your
# editor's Undo both work this way: the most recent thing is undone first.
#
#   push (add to top)  ->  list.append(x)
#   pop  (take off top) ->  list.pop()
#
# Both act on the END of the list, and both are fast.

stack = [3, 4, 5]
print("Initial stack:", stack)

# Pushing to the top of the stack
stack.append(6)
stack.append(7)
print("After appending 6 and 7:", stack)

# Popping from the top of the stack (removes the LAST item and gives it back)
print("Popped item:", stack.pop())  # 7: the most recent addition
print("Stack after one pop:", stack)

print("Popped item:", stack.pop())
print("Popped item:", stack.pop())
print("Final stack:", stack)

# Popping from an EMPTY stack is an error (IndexError: pop from empty list),
# so check first:
empty = []
if empty:  # an empty list is "falsy" (see 4.1 and 5.7)
    empty.pop()
else:
    print("Nothing to pop")


### Topic 2: A stack at work, checking matching brackets ###
# Every "(" must be closed by a ")" in the right order. A stack solves it:
#   - on "(" push it
#   - on ")" pop one; if there is nothing to pop, the brackets are unbalanced
# This is how code editors and compilers verify your parentheses.


def is_balanced(text):
    open_brackets = []
    for char in text:
        if char == "(":
            open_brackets.append(char)
        elif char == ")":
            if not open_brackets:  # a ")" with nothing open to match it
                return False
            open_brackets.pop()
    return not open_brackets  # balanced only if nothing is left open


print(is_balanced("(1 + 2) * (3 + 4)"))  # True
print(is_balanced("((1 + 2)"))  # False: one "(" never closed
print(is_balanced(")("))  # False: closes before opening


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Reverse the word "stack" using a stack: push each letter, then pop them
#      all into a new string.
#   2. Simulate an Undo button: keep a list of actions and pop to undo them.
#   3. Extend is_balanced so it handles [] and {} as well as ().
# =============================================================================
