# Function that prints the Fibonacci series up to n
def fib(n):
    a, b = 0 , 1
    while a <= n:
        print(a, end=' ')
        a, b = b, a+b
    print()
    
fib(200)

# In Python, functions are objects! You can assign them to variables.
f = fib
f(200)

# A function without a 'return' statement implicitly returns None
print(fib(0))

# Function that returns a list of the Fibonacci series up to n, instead of printing it
def fib2(n):
    result = []
    a, b = 0, 1
    while a <= n:
        result.append(a)
        a, b = b, a+b
    return result

fib100 = fib2(200)

print(fib100)