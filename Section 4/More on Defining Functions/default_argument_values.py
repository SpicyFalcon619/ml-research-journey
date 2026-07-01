# Functions can have default argument values (e.g. retries=4, reminder='...')
# If you call the function without these arguments, Python uses the defaults!
def ask_ok(prompt, retries=4, reminder='Please try again!'):
    while True:
        reply = input(prompt)
        if reply in {'y', 'ye', 'yes'}:
            return True
        if reply in {'n', 'no', 'nop', 'nope'}:
            return False
        retries = retries - 1
        if retries < 0:
            raise ValueError('invalid user response')
        print(reminder)
        
# 1. Here we only pass the mandatory 'prompt' argument, so 'retries' stays at 4 and 'reminder' stays the same.
response = ask_ok("Are you OK?\n")
print(response)

# 2. Here we override 'retries' to 2, but let 'reminder' stay as the default.
# response = ask_ok("Are you OK?\n", 2)
# print(response)

# 3. Here we completely override both defaults with our own custom values.
# response = ask_ok("Are you OK?\n", 2, 'Response correctly idiot!')
# print(response)


# Default values are evaluated at the point of function DEFINITION, not execution.
# So 'arg' locks in the value of 5 here, even though 'i' is later changed to 6.
i = 5
def f(arg=i):
    print(arg)

i = 6
f()

# WARNING: Mutable default arguments (like lists or dictionaries) are only evaluated ONCE.
# This means the exact same list is shared across all function calls, accumulating values:
def f(a, L=[]):
    L.append(a)
    return L

print(f(1)) # Prints [1]
print(f(2)) # Prints [1, 2]
print(f(3)) # Prints [1, 2, 3]

# BEST PRACTICE: If you don't want the list to be shared across calls, use None as the default.
# Then, create a brand new list inside the function itself.
def f(a, L=None):
    if L is None:
        L = []
    L.append(a)
    return L

print(f(1)) # Prints [1]
print(f(2)) # Prints [2]
print(f(3)) # Prints [3]