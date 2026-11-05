"""
NumPy Reference: Numpy speed test
"""

import time
import numpy as np

# We are going to process 10 MILLION numbers!
size = 10_000_000

print("Creating the massive lists...")
# Standard Python List
python_list = list(range(size))

# NumPy Array
numpy_array = np.arange(size)
print("Done! Let's race.\n")

# -----------------------------------------------------
# 1. STANDARD PYTHON SPEED TEST
# -----------------------------------------------------
print("Starting Standard Python...")
start_time = time.time()

# Squaring every number in the list using a List Comprehension
python_result = [x**2 for x in python_list]

python_end_time = time.time() - start_time
print(f"Standard Python took: {python_end_time:.4f} seconds")


# -----------------------------------------------------
# 2. NUMPY SPEED TEST
# -----------------------------------------------------
print("\nStarting NumPy...")
start_time = time.time()

# Squaring every number in the array using NumPy (Look how clean this syntax is!)
numpy_result = numpy_array**2

numpy_end_time = time.time() - start_time
print(f"NumPy took: {numpy_end_time:.4f} seconds")

# -----------------------------------------------------
# THE RESULTS
# -----------------------------------------------------
print(f"\n--- NumPy was {python_end_time / numpy_end_time:.1f}x faster! ---")
