# 8.7 Defining Clean-up Actions
# The 'finally' clause executes no matter what happens (even if an error occurs).

try:
    print("Trying something risky...")
    # raise KeyboardInterrupt
finally:
    print("Goodbye, world! (This runs no matter what, even if it crashes)")
