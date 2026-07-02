"""
Python Reference: Using lists as stacks
"""

# STACKS: "Last-In, First-Out" (LIFO)
# Think of it like a stack of plates. The last plate you put on top is the first one you take off.

stack = [3, 4, 5]
print("Initial stack:", stack)

# Pushing to the top of the stack
stack.append(6)
stack.append(7)
print("After appending 6 and 7:", stack)

# Popping from the top of the stack (removes the last item)
print("Popped item:", stack.pop())
print("Stack after one pop:", stack)

print("Popped item:", stack.pop())
print("Popped item:", stack.pop())
print("Final stack:", stack)
