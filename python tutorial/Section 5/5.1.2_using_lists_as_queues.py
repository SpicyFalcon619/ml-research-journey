"""
Python Reference: Using lists as queues
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a queue is (First-In, First-Out)
#   - Why a plain list is a poor queue, and what to use instead (deque)
#   - Your first import: bringing in tools that Python doesn't load by default
# =============================================================================


### Topic 1: The queue idea ###
# QUEUES: "First-In, First-Out" (FIFO).
# Think of a line at a grocery store. The first person in line is the first to
# be served; newcomers join at the back. Print jobs, download lists and the
# requests hitting a web server all wait in queues.


### Topic 2: Why not just use a list? ###
# You CAN use a list: append() to join at the back, and pop(0) to serve the
# front. But removing the FIRST item forces Python to shift every other item
# one place to the left. With a list of a million items, that is a million
# moves for every single removal. Slow!
#
# The fix is a different container built for the job: deque (say "deck", short
# for "double-ended queue"). It adds and removes at BOTH ends quickly.


### Topic 3: import ###
# Python ships with many extra tools (the "standard library"), but keeps them
# in separate packages called MODULES so your program starts quickly.
# To use one, you IMPORT it first:
#
#       from collections import deque
#
# read as: "from the collections module, bring in the tool called deque".
# (Section 6 explains imports in full.)

from collections import deque

queue = deque(["Eric", "John", "Michael"])
print("Initial queue:", list(queue))  # list(...) just to print it in a familiar way

queue.append("Terry")  # Terry arrives and gets in the back of the line
queue.append("Graham")  # Graham arrives and gets in the back
print("After Terry and Graham arrive:", list(queue))

# The first person to arrive (Eric) is the first to leave.
# .popleft() removes and returns the item at the FRONT (the left end).
print("Served and left the queue:", queue.popleft())

# The second person to arrive (John) leaves next
print("Served and left the queue:", queue.popleft())

print("Remaining queue:", list(queue))


### Topic 4: Both ends ###
# deque also supports the left side for adding: appendleft(), and the right
# side for removing: pop() (as with a list).
queue.appendleft("VIP")  # jumps the line
print("After VIP arrives:", list(queue))
print("Right end leaves:", queue.pop())

# Rule of thumb: need LIFO (a stack)? Use a list. Need FIFO (a queue)? Use deque.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Simulate a printer: a queue of document names, print "Printing <name>"
#      for each in order until the queue is empty (use a while loop with
#      `while queue:`).
#   2. Use deque(maxlen=3) and append 5 items. What remains? (It keeps only
#      the 3 most recent: useful for "last N values" moving averages.)
# =============================================================================
