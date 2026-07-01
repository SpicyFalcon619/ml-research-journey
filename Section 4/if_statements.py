x = int(input("Enter an integer: "))

# Basic conditional branching using if, elif, and else
if x < 0:
    x = 0
    print("Negative changed to zero")
elif x == 0:
    print("Zero")
elif x == 1:
    print("Single")
else:
    print("More")