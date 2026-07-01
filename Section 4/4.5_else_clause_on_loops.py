# Using a break statement and an else clause on a loop to find prime numbers
for n in range(2, 20):
    for x in range (2, n):
        if n%x == 0:
            print(f"{x} * {n//x} = {n}")
            break
    else:
        print(f"{n} is a prime number")