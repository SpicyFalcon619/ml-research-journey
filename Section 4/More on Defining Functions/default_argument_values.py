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
response = ask_ok("Are you OK?\n", 2)
print(response)

# 3. Here we completely override both defaults with our own custom values.
response = ask_ok("Are you OK?\n", 2, 'Response correctly idiot!')
print(response)