"""
Python Reference: Break continue statements
"""

# Nested loops to find and print all factors of numbers from 2 to 19
for n in range(2, 20):
    for x in range(2, n):
        if n % x == 0:
            print(f"{x} * {n//x} = {n}")


# Using 'continue' to skip the rest of the loop block for even numbers
for num in range(2, 10):
    if num % 2 == 0:
        print(f"Found an even number {num}")
        continue
    print(f"Found an odd number {num}")
