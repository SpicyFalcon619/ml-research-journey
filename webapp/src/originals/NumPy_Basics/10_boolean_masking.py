"""
NumPy Reference: Boolean masking
"""

import numpy as np

arr = np.array([10, 25, 5, 40, 15])

mask = arr > 15

print(arr[mask])

print(arr[arr>15])

### Topic: Boolean Masking ###
# Here are the temperatures (in Celsius) recorded over 10 days:
temps = np.array([22, 35, 18, 40, 28, 15, 33, 26, 41, 19])

# 1. Create a boolean mask called 'hot_mask' for days where temp > 30.
#    Print the mask itself — you should see True/False values.
# 2. Use that mask to print only the hot temperatures.
# 3. In ONE line (no separate mask variable), print temperatures that are below 20.
# 4. Count how many days were above 30 degrees.
#    Hint: True counts as 1 and False as 0, so np.sum() on a boolean array counts the Trues!

hot_mask = temps > 30

print(hot_mask)

print(temps[hot_mask])

print(temps[temps < 20])

print(np.sum(temps > 30))
