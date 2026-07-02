import numpy as np

my_array = np.array([1, 2, 3]) + 3

print(my_array)

# Challenge 4:
# NumPy arrays allow you to do math on every single item in the array at once!
prices = np.array([10, 20, 30, 40, 50])

# 1. Everything is on sale for 50% off! 
#    Create a new array called 'sale_prices' by dividing the 'prices' array by 2.
# 2. Print 'sale_prices'.
#
# 3. An evil wizard cursed the store and increased all original prices by $100! 
#    Create a new array called 'cursed_prices' by adding 100 to the 'prices' array.
# 4. Print 'cursed_prices'.


sale_prices = prices / 2
cursed_prices = prices + 100

print(f"Sale Prices: {sale_prices}")
print(f"Cursed Prices: {cursed_prices}")