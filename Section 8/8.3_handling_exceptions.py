# In Machine Learning, you will use try/except blocks to catch errors so your script doesn't completely crash.
# For example, if your code tries to load a corrupted image file, you want to catch the error, log it, and skip it, not crash the whole training loop!

while True:
    try:
        x = int(input("Please enter a number: "))
        print(f"Great! You entered {x}")
        break
    except ValueError:
        print("Oops! That was no valid number. Try again...")
