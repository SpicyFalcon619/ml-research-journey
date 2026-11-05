"""
Python Reference: Syntax errors
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The two families of errors: syntax errors vs exceptions
#   - What a SyntaxError looks like and how to read the message
#   - The most common syntax slips and how to spot them
# =============================================================================


### Topic 1: What is a syntax error? ###
# Python reads your WHOLE file before running a single line. If the grammar is
# broken (a missing colon, a missing bracket), it refuses to run anything and
# reports a SyntaxError. These are the most common errors when you are learning,
# and the easiest to fix, since Python points right at the problem.
#
# Example of a broken program (this is why it is commented out, otherwise the
# whole file would refuse to run):
#
#   while True print('Hello world')
#
# Running that gives:
#
#     File "example.py", line 1
#       while True print('Hello world')
#                  ^^^^^
#   SyntaxError: invalid syntax
#
# How to read it:
#   1. The file and LINE NUMBER tell you where to look.
#   2. The line is repeated, and the ^^^^ arrows mark where Python got confused.
#   3. The last line names the error. The mistake is often just BEFORE the arrow.
#      Here the colon after "True" is missing.


### Topic 2: Seeing real error messages safely ###
# To show real messages without breaking this file, we hand Python some broken
# code as TEXT. compile() checks the grammar without running it.
# (A trick for demonstrations only; you would not do this in normal programs.)

broken_examples = {
    "missing colon": "while True print('Hello world')",
    "missing closing bracket": "print('hi'",
    "unclosed string": "print('hello)",
    "bad indentation": "if True:\nprint('hi')",
    "= instead of ==": "if 5 = 5:\n    pass",
}

for label, code in broken_examples.items():
    try:
        compile(code, "<example>", "exec")
    except SyntaxError as error:  # IndentationError is a kind of SyntaxError
        print(f"{label:25} -> {type(error).__name__}: {error.msg}")


### Topic 3: Common causes (a checklist) ###
#   - Forgot the colon  :  after if / elif / else / for / while / def / class
#   - A bracket ( [ { or a quote that was opened but never closed
#   - Used = (assign) where you meant == (compare)
#   - Indentation inconsistent: don't mix tabs and spaces; use 4 spaces
#   - Misspelled a keyword (esle, retrun, fro)
#   - Used a reserved word (class, for, if) as a variable name
#
# Debugging tip: if the reported line looks fine, check the line ABOVE it.
# An unclosed bracket makes Python swallow the next lines, then complain later.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Type the broken while-loop above in a scratch file and run it. Find and
#      fix the error using only the message.
#   2. Delete the closing bracket of any print(...) in a longer file. Is the
#      reported line the broken one, or a later one?
#   3. Why can't Python run the earlier, correct lines of a file that has a
#      syntax error further down?
# =============================================================================
