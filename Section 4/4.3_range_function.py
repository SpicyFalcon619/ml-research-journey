# Basic range loop (0 to 4)
for i in range(5):
    print(i, end=' ')

# Empty print() outputs a newline
print()

wrestlers = {"John Cena" : "Retired",
         "Dean Ambrose" : "AEW",
         "Rey Mysterio" : "Midget",
         "Seth Rollins" : "Weird",
         }

# Iterating over dictionary items, keys, and values
for i in wrestlers.items():
    print(i)

for i in wrestlers.keys():
    print(i)

for i in wrestlers.values():
    print(i)

print()

# Generating lists from ranges (start, stop, step)
print(list(range(5, 10)))

print(list(range(0, 10, 3)))

print(list(range(-10, -100, -20)))

# Using range() with len() to iterate over indices, and summing a range
a = ["Rahim", "had", "a", "little", "lamb"]

for i in range(len(a)):
    print(i, a[i])

# Note: range() doesn't return a list. It returns an iterable object that generates items as needed, saving memory!
print(range(10))
a = sum(range(10))
print(a)