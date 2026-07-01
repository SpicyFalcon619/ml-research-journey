# Fibonacci sequence generation using a while loop
a, b = 0, 1
while a < 10:
    print(a , end=',')
    a, b = b, a+b