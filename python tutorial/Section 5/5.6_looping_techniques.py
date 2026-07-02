
# LOOPING TECHNIQUES

# 1. LOOPING THROUGH DICTIONARIES
# Use .items() to get the Key AND the Value at the same time
knights = {'gallahad': 'the pure', 'robin': 'the brave'}
print("--- Dictionary Looping ---")
for k, v in knights.items():
    print(k, v)
    
# 2. ENUMERATE (Getting the index and the value)
# Very useful when you need to know *where* you are in the list
a = ['tic', 'tac', 'toe']
print("\n--- Enumerate ---")
for i, v in enumerate(a):
    print(f"Index {i}: {v}")
    
# 3. ZIP (Looping through two lists at the same time)
questions = ['name', 'quest', 'favorite color']
answers = ['lancelot', 'the holy grail', 'blue']
print("\n--- Zip ---")
for q, ans in zip(questions, answers):
    print(f"What is your {q}?  It is {ans}.")
    
# 4. REVERSED (Looping backward)
print("\n--- Reversed ---")
for i in reversed(range(1, 10, 2)):
    print(i)
    
# 5. SORTED (Looping in sorted order without changing the original list)
basket = ['apple', 'orange', 'apple', 'pear', 'orange', 'banana']
print("\n--- Sorted ---")
for i in sorted(basket):
    print(i)
    
# Combining Sorted and Set! (Unique items, in alphabetical order)
print("\n--- Sorted Set ---")
for f in sorted(set(basket)):
    print(f)
    
# 6. FILTERING DATA
import math
raw_data = [56.2, float('NaN'), 51.7, 55.3, 52.5, float('NaN'), 47.8]
filtered_data = []
for value in raw_data:
    if not math.isnan(value):
        filtered_data.append(value)

print("\n--- Filtering NaN ---")
print("Original:", raw_data)
print("Filtered:", filtered_data)