"""
Python Reference: First steps
"""

# Fibonacci sequence generation using a while loop and multiple assignment
a, b = 0, 1
while a < 1000:
    print(a, end=" ")
    a, b = b, a + b
