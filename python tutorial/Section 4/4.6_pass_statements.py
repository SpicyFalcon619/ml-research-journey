"""
Python Reference: Pass statements
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What pass does (nothing, on purpose)
#   - Why Python needs it: a block is never allowed to be empty
#   - Where it is used: stubs for code you will write later, empty classes
# =============================================================================


### Topic 1: Why does "do nothing" exist? ###
# In Python an indented block MUST contain at least one statement. Comments do
# not count. So this is a SyntaxError:
#
#     def train_model():
#         # TODO: write this later
#
# pass is a statement that does absolutely nothing, so it fills the hole.
# Think of it as a sign saying "to be continued".


### Topic 2: Placeholders while you are planning ###
# Sketch the structure of a program first, and fill in the details later.
def load_data():
    pass  # TODO: read the dataset from disk


def train_model(data):
    pass  # TODO: the training loop goes here


def initlog(*args):
    pass  # Remember to implement this!


# The program runs fine because the functions exist, they just return None.
data = load_data()
print("load_data() returned:", data)


### Topic 3: Empty classes ###
# Classes (see Section 9) are blueprints for objects. Sometimes you need a
# class that exists only as a name, for example a custom error type.
class MyEmptyClass:
    pass


thing = MyEmptyClass()
print("Made an object:", type(thing))


### Topic 4: An 'if' you want to handle later ###
temperature = 30
if temperature > 40:
    pass  # TODO: decide what to do when it is dangerously hot
else:
    print("Temperature is fine")


### Topic 5: Careful with the busy-wait loop ###
# The official Python tutorial shows this example:
#
#     while True:
#         pass      # waits forever, until you press Ctrl+C
#
# It is a loop that does nothing and NEVER ends, which freezes your terminal.
# That is why it is commented out here. If you run it on purpose, stop it
# with Ctrl+C (which raises KeyboardInterrupt).
#
# Other "do-nothing" placeholders you may see:
#   ...        (three dots, the Ellipsis) works the same as pass in stubs
#   raise NotImplementedError("write me")   crashes loudly if someone uses
#                                            the unfinished code by accident


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Plan a tiny "quiz game": write four empty functions (ask_question,
#      check_answer, update_score, show_result) using pass, and call them in order.
#   2. Replace one pass with a print statement and run it again.
#   3. Replace one pass with raise NotImplementedError and see what the
#      crash message looks like. When is that better than pass?
# =============================================================================
