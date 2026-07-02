# QUEUES: "First-In, First-Out" (FIFO)
# Think of it like a line at a grocery store. The first person in line is the first to leave.
# Regular Python lists are slow at doing this, so we use `deque` from the collections library.

from collections import deque

queue = deque(["Eric", "John", "Michael"])
print("Initial queue:", list(queue))

queue.append("Terry")           # Terry arrives and gets in the back of the line
queue.append("Graham")          # Graham arrives and gets in the back
print("After Terry and Graham arrive:", list(queue))

# The first person to arrive (Eric) is the first to leave
print("Served and left the queue:", queue.popleft())                 

# The second person to arrive (John) leaves next
print("Served and left the queue:", queue.popleft())                 

print("Remaining queue:", list(queue))