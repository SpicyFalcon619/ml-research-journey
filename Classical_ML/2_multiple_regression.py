"""
Classical ML Reference: Multiple regression
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Why real predictions use several features at once
#   - How one model weighs each feature (one slope per feature)
#   - Reading coefficients: what "each extra bedroom adds" means
#   - Column order matters, and scikit-learn checks it for you
#   - score(): one number for "how well does the line fit?"
#
# This builds directly on 1_linear_regression. Do that one first.
# =============================================================================

import pandas as pd
from sklearn.linear_model import LinearRegression


### Topic 1: Why more than one feature? ###
# In the real world you never predict from a single number. A house price depends
# on size AND bedrooms AND location AND age... Each extra feature gives the model
# another clue.
#
# With one feature the model learned a line:   y = w * x + b
# With two it learns a flat sheet:             y = w1 * x1 + w2 * x2 + b
# With a hundred it learns the same thing in 100 dimensions. Code and idea stay
# identical. Only X gets more columns.

data = pd.DataFrame(
    {
        "Size_SqFt": [1000, 1500, 2000, 2500, 3000],
        "Bedrooms": [2, 3, 3, 4, 4],
        "Price": [200000, 300000, 380000, 500000, 580000],
    }
)
print(data)


### Topic 2: Several features, still one target ###
# X holds all the features (a table with two columns); y is still one column.
X = data[["Size_SqFt", "Bedrooms"]]  # double brackets, now with TWO names inside
y = data["Price"]
print("X shape:", X.shape)  # (5, 2): 5 houses, 2 features


### Topic 3: Create and fit ###
# Exactly the same three steps as before. Only the data got wider.
model = LinearRegression()
model.fit(X, y)


### Topic 4: One slope per feature ###
# model.coef_ now has two numbers, in the same order as the columns of X.
# zip() pairs each column name with its slope (see 5.6) so you can read them.
for name, slope in zip(X.columns, model.coef_):
    print(f"{name}: {slope:.2f}")
print(f"Intercept: {model.intercept_:.2f}")

# How to read it: "holding the other feature fixed, one extra square foot adds
# about this much to the price, and one extra bedroom adds about that much."
# Careful: features that move together (bigger houses have more bedrooms) can
# share credit between them, so do not over-read a single coefficient.


### Topic 5: Predict ###
# A house of 2200 square feet with 3 bedrooms. The new table needs BOTH columns
# with the SAME names. Scikit-learn also remembers the order they were in at fit time.
new_X = pd.DataFrame({"Size_SqFt": [2200], "Bedrooms": [3]})
prediction = model.predict(new_X)
print(prediction)


### Topic 6: Column order and names matter ###
# Swap the columns and scikit-learn refuses, instead of quietly giving a wrong
# answer. (Silent mix-ups like this are the scariest bug in ML.)
swapped = new_X[["Bedrooms", "Size_SqFt"]]
try:
    model.predict(swapped)
except ValueError as error:
    print("ValueError:", str(error).splitlines()[0])


### Topic 7: How good is the fit? ###
# model.score(X, y) returns R-squared, a number up to 1.0:
#   1.0  the line passes through every example perfectly
#   0.0  no better than always guessing the average price
# Here it is high because the data was made up to be nearly a clean pattern.
print(f"R-squared on the training data: {model.score(X, y):.3f}")

# One warning: this score is measured on the SAME data the model learned from, so
# it flatters the model. 4_train_test_split shows the honest way to measure.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Predict the price of a 1800 sq ft house with 2 bedrooms, and 1200 with 1.
#   2. Drop the Bedrooms feature, refit, and compare the R-squared. Did it matter?
#   3. Add a made-up third feature, Age_Years, and watch a third coefficient appear.
#   4. Why does predicting with the columns swapped raise an error, and why is that
#      the safer behaviour?
# =============================================================================
