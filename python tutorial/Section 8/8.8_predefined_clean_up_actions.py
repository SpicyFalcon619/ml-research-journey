"""
Python Reference: Predefined clean up actions
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The with statement: automatic clean-up, with no try/finally needed
#   - Writing a file and reading it back
#   - File modes ("r", "w", "a") and reading line by line
#   - Why with is the right way to open files
# =============================================================================

import os


### Topic 1: Writing a file ###
# The 'with' statement is super important for opening files!
# open(name, mode) returns a file object.
#   "w" = write (creates the file, ERASES it if it already exists)
#   "a" = append (add to the end, keep what's there)
#   "r" = read (the default)
# The 'with' statement automatically closes the file for you when the block
# finishes, even if an error occurs.

with open("dummy.txt", "w") as f:
    f.write("Hello, world!\n")  # \n = new line (3.1.2): write() doesn't add one itself
    f.write("Second line\n")

# The file is automatically closed here! We don't have to manually call f.close()
print("Is the file closed?", f.closed)


### Topic 2: Reading it back ###
with open("dummy.txt") as f:  # mode "r" is the default
    content = f.read()  # the entire file as ONE string
print("Whole file:", repr(content))

# For big files, loop over the lines instead. Only one line is in memory at a
# time. (Datasets can be gigabytes, so this matters.)
with open("dummy.txt") as f:
    for line_number, line in enumerate(f, start=1):
        print(line_number, line.strip())  # strip() removes the trailing \n (3.1.2)


### Topic 3: Appending ###
with open("dummy.txt", "a") as f:
    f.write("Third line\n")

with open("dummy.txt") as f:
    lines = f.readlines()  # a LIST with one string per line
print("Now has", len(lines), "lines")


### Topic 4: Why not just open() and close() by hand? ###
# This works:
#       f = open("dummy.txt")
#       data = f.read()
#       f.close()
# but if read() fails, close() never runs and the file stays locked/open.
# 'with' guarantees the close, the same guarantee as try/finally in 8.7, with
# less to write. Any object that supports `with` (files, database connections,
# locks, PyTorch's torch.no_grad()) is called a CONTEXT MANAGER.


### Topic 5: Tidy up after ourselves ###
# dummy.txt was just a scratch file. os.remove deletes it.
os.remove("dummy.txt")
print("dummy.txt exists?", os.path.exists("dummy.txt"))

# Where do files go? Relative names like "dummy.txt" are created in the
# CURRENT WORKING DIRECTORY, the folder your terminal was in when you ran Python.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Write a file notes.txt with three lines, then read it back and print
#      them in upper case.
#   2. Count the words in a file by reading it and using split().
#   3. What happens if you open a file that doesn't exist in "r" mode? Catch the
#      exception (8.3). What if you open it in "w" mode instead?
#   4. Write a list of numbers to a file, one per line, then read it back and
#      sum them (don't forget int()).
# =============================================================================
