# The / indicates parameters before it are POSITIONAL ONLY.
# The * indicates parameters after it are KEYWORD ONLY.

def standard_arg(arg):
    print(arg)

def pos_only_arg(arg, /):
    print(arg)

def kwd_only_arg(*, arg):
    print(arg)

def combined_example(pos_only, /, standard, *, kwd_only):
    print(pos_only, standard, kwd_only)
    
standard_arg(2)
standard_arg(arg=2)

pos_only_arg(1)
# pos_only_arg(arg=1) # Raises TypeError

kwd_only_arg(arg=3)
# kwd_only_arg(3) # Raises TypeError

# combined_example(1, 2, 3) # Raises TypeError
combined_example(1, 2, kwd_only=3)
combined_example(1, standard=2, kwd_only=3)
# combined_example(pos_only=1, standard=2, kwd_only=3) # Raises TypeError


# Avoiding Name Collisions

# By making 'name' positional-only (/), we can safely use 'name' as a key in **kwds
def foo(name, /, **kwds):
    return 'name' in kwds

print(foo(1, **{'name': 2})) # Returns True