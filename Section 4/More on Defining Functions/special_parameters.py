# ---------------------------------------------------------
# SPECIAL PARAMETERS (/, *)
# ---------------------------------------------------------
# The / indicates that parameters before it are POSITIONAL ONLY.
# The * indicates that parameters after it are KEYWORD ONLY.

# 1. Standard Argument (can be passed by position OR by keyword)
def standard_arg(arg):
    print("Standard:", arg)

standard_arg(2)       # Valid
standard_arg(arg=2)   # Valid


# 2. Positional-Only Argument (Must NOT use the parameter name)
def pos_only_arg(arg, /):
    print("Positional Only:", arg)

pos_only_arg(1)       # Valid
# pos_only_arg(arg=1) # INVALID: TypeError: got some positional-only arguments passed as keyword arguments


# 3. Keyword-Only Argument (Must ALWAYS use the parameter name)
def kwd_only_arg(*, arg):
    print("Keyword Only:", arg)

# kwd_only_arg(3)     # INVALID: TypeError: takes 0 positional arguments but 1 was given
kwd_only_arg(arg=3)   # Valid


# 4. Combined Example (All three in one function)
def combined_example(pos_only, /, standard, *, kwd_only):
    print("Combined:", pos_only, standard, kwd_only)

# combined_example(1, 2, 3)                                 # INVALID: kwd_only must be a keyword
combined_example(1, 2, kwd_only=3)                          # Valid: 'standard' is used by position
combined_example(1, standard=2, kwd_only=3)                 # Valid: 'standard' is used by keyword
# combined_example(pos_only=1, standard=2, kwd_only=3)      # INVALID: pos_only must be positional


# ---------------------------------------------------------
# ADVANCED: Avoiding name collisions with **kwds
# ---------------------------------------------------------
# Consider this function without a slash:
# def foo(name, **kwds):
#     return 'name' in kwds
# 
# foo(1, **{'name': 2})  <-- This throws a TypeError because it thinks you passed 'name' twice!

# By adding the / to make 'name' positional-only, we free up the word 'name' 
# so it can be safely used as a key inside the **kwds dictionary without confusing Python.
def foo(name, /, **kwds):
    return 'name' in kwds

print("Collision avoided:", foo(1, **{'name': 2})) # Returns True!