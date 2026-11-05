"""
Classical ML Reference: Linear regression
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What "machine learning" means in practice: learn from examples, then predict
#   - Features (X) and target (y), and the exact shapes scikit-learn expects
#   - The three-step pattern used by every scikit-learn model: create, fit, predict
#   - How to read what the model learned: a slope and an intercept
#
# Before you start: you should be comfortable with Pandas DataFrames
# (Pandas_Basics) and with how a straight line works (y = slope * x + start).
# =============================================================================

import pandas as pd
from sklearn.linear_model import LinearRegression


### Topic 1: The idea ###
# Normal programming: YOU write the rule, the computer applies it.
# Machine learning: you show the computer EXAMPLES, and it works out the rule.
#
# Here the examples are five employees: how many years each has worked, and what
# they earn. Look at the numbers: every extra year adds 10,000. We never tell the
# model that. We only show it the examples, and let it discover the pattern.

data = pd.DataFrame(
    {
        "Years_Experience": [1, 2, 3, 4, 5],
        "Salary": [40000, 50000, 60000, 70000, 80000],
    }
)
print(data)

# LINEAR REGRESSION finds the straight line that fits the examples best:
#
#       salary  =  slope * years  +  intercept
#
# "Regression" just means "predicting a number". (Predicting a category is
# "classification", see 3_logistic_regression.)


### Topic 2: Features and target ###
# Two words you will hear in every ML course:
#   FEATURES (written X): the inputs the model looks at. Here: years of experience.
#   TARGET   (written y): the answer you want it to predict. Here: salary.
#
# scikit-learn is strict about their shapes:
#   X must be a 2D table, even when it has a single column
#   y must be a 1D column of answers

X = data[["Years_Experience"]]  # DOUBLE brackets: a list of column names -> a table
y = data["Salary"]  # single brackets: one column -> a Series

print("X is a", type(X).__name__, "with shape", X.shape)  # (5, 1): 5 rows, 1 column
print("y is a", type(y).__name__, "with shape", y.shape)  # (5,): just 5 values

# Why must X be 2D? Because a real problem has MANY features (Topic 7 of
# 2_multiple_regression). One feature is simply a table with one column.


### Topic 3: Create and fit ###
# Step 1, CREATE the model. It is an empty learner that knows nothing yet.
model = LinearRegression()

# Step 2, FIT it. This one line is the "learning": the model looks at every
# example and finds the line that is closest to all of them.
model.fit(X, y)


### Topic 4: What did it learn? ###
# A fitted model keeps what it learned in attributes whose names end in _
#   model.coef_       the slope(s), one per feature
#   model.intercept_  where the line starts when the feature is 0

print(f"Slope: {model.coef_[0]:.1f}")  # about 10000: each year adds 10,000
print(f"Intercept: {model.intercept_:.1f}")  # about 30000: pay with 0 years

# So the rule it discovered is:  salary = 10000 * years + 30000.
# Nobody typed that in. It came from the five examples.


### Topic 5: Predict ###
# Step 3, PREDICT. Give it new inputs the model has never seen: employees with 6
# and 7 years. The new table needs the SAME column name as the one used to fit.
new_X = pd.DataFrame({"Years_Experience": [6, 7]})
prediction = model.predict(new_X)

print(prediction)  # a NumPy array, one answer per row

# Check it by hand, like a detective:  10000 * 6 + 30000 = 90000.
print("By hand:", 10000 * 6 + 30000)


### Topic 6: Reading the result honestly ###
# The model did not "know" salaries. It extended a straight line. That works here
# because the example data really is a perfect line. Real data is messy, and a
# model can only be as good as its examples. Also be careful far outside what it
# saw: predicting the salary of someone with 60 years of experience is a guess.


### Topic 7: A very common mistake ###
# Passing X with SINGLE brackets (a 1D Series) is the error beginners hit most.
# Here we catch it so you can read the message scikit-learn gives:
try:
    LinearRegression().fit(data["Years_Experience"], y)
except ValueError as error:
    print("ValueError:", str(error).splitlines()[0])
# The fix is the double brackets from Topic 2.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Predict the salary of someone with 10 years of experience. Check by hand.
#   2. Change one salary to 45000 so the points are no longer a perfect line, refit,
#      and print the slope and intercept again. How much do they move?
#   3. Add a second employee list with 0 years. Does the intercept still make sense?
#   4. Why is data[["Years_Experience"]] a DataFrame but data["Years_Experience"]
#      a Series? What shape does each have?
# =============================================================================
