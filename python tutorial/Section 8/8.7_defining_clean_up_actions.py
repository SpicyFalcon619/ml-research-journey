"""
Python Reference: Defining clean up actions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - finally: code that runs no matter what happens in the try block
#   - Why that matters (files, connections, GPU memory must be released)
#   - How finally behaves with errors, early returns and break
# =============================================================================


### Topic 1: finally always runs ###
# The 'finally' clause executes no matter what happens (even if an error occurs).
# Use it for CLEAN-UP: closing files, closing connections, freeing resources.

try:
    print("Trying something risky...")
    # raise KeyboardInterrupt   <- uncomment this to simulate pressing Ctrl+C
finally:
    print("Goodbye, world! (This runs no matter what, even if it crashes)")


### Topic 2: With an error ###
# The cleanup runs even when the try block fails. Afterwards the error carries
# on upwards as normal, so we catch it on the outside here.
try:
    try:
        print("\nStarting a job...")
        result = 1 / 0
    finally:
        print("Cleaning up (this still ran)")
except ZeroDivisionError:
    print("...and the error reached the outside code")


### Topic 3: With return ###
# finally runs even if the function has already decided to return.


def try_return():
    try:
        return "from try"
    finally:
        print("\nfinally runs BEFORE the function actually returns")


print(try_return())


### Topic 4: A realistic shape ###
# Imagine reserving something that MUST be given back (a file, a database
# connection, memory on the GPU). Whatever happens in between:
#
#   resource = open_something()
#   try:
#       use(resource)
#   finally:
#       resource.close()       # always executed
#
# In practice, Python offers a tidier version of this exact idea: the `with`
# statement (next lesson, 8.8).

# try / except / else / finally can all be combined in that order (8.3).


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write a function with try: return 1 and finally: print("bye"). Call it.
#      In which order do you see the output?
#   2. Open a file with open() and close it in a finally block, even though
#      reading from it fails.
#   3. Uncomment the KeyboardInterrupt line in Topic 1: does the cleanup
#      message still show before the program stops?
# =============================================================================
