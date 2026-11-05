"""
Classical ML Reference: Logistic regression
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Regression vs classification: predicting a NUMBER vs predicting a CATEGORY
#   - Why "logistic regression" is a classifier despite its name
#   - predict() gives the class, predict_proba() gives how sure the model is
#   - Where the 0 / 1 decision comes from (a probability and a 0.5 cut-off)
# =============================================================================

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression


### Topic 1: Numbers vs categories ###
# Linear regression predicts a NUMBER (a price like 419,000).
# Classification predicts a CATEGORY (spam or not spam, sick or healthy).
#
# Here we ask: is this email spam? We give the model two clues per email: how many
# links it has, and how many times the word "winner" appears. The answer is coded
# as a number: 1 = spam, 0 = not spam.

data = pd.DataFrame(
    {
        "Links": [0, 1, 5, 8, 0, 10],
        "Word_Winner": [0, 0, 2, 5, 0, 7],
        "Is_Spam": [0, 0, 1, 1, 0, 1],  # 0 = Not Spam, 1 = Spam
    }
)
print(data)

# Despite its name, LOGISTIC REGRESSION is a classifier. The name is historical.


### Topic 2: Features and target ###
# Same shape rules as before: X is a table (double brackets), y is one column.
X = data[["Links", "Word_Winner"]]
y = data["Is_Spam"]


### Topic 3: Create, fit, predict ###
# The code is identical to linear regression except for the model's name.
# Every scikit-learn model works through create -> fit -> predict.
model = LogisticRegression()
model.fit(X, y)

# Two new emails: one with 6 links and "winner" 3 times; one with 1 link, 2 winners.
new_X = pd.DataFrame({"Links": [6, 1], "Word_Winner": [3, 2]})
prediction = model.predict(new_X)

print(prediction)  # [1 0]: the first is spam, the second is not


### Topic 4: How sure is the model? ###
# predict() only gives the final answer. predict_proba() gives the probability of
# each class, which is far more useful: "51% spam" and "99% spam" both predict 1,
# but you would treat them very differently.
#
# Each row is one email. Column 0 is P(not spam), column 1 is P(spam). Each row adds up to 1.
probabilities = model.predict_proba(new_X)
print(pd.DataFrame(probabilities, columns=["P(not spam)", "P(spam)"]).round(3))

# The rule behind predict(): pick spam when P(spam) is above 0.5.


### Topic 5: Where the probability comes from ###
# Logistic regression first does the same sum as linear regression:
#       z = w1 * links + w2 * winners + b
# and then squashes z into a probability between 0 and 1 with the SIGMOID function:
#       probability = 1 / (1 + e^(-z))
# Large positive z -> close to 1. Large negative z -> close to 0. Zero -> 0.5.
#
# Proof: work it out by hand for the first email and compare.
w = model.coef_[0]
b = model.intercept_[0]
z = w[0] * 6 + w[1] * 3 + b
by_hand = 1 / (1 + np.exp(-z))
print(f"By hand: {by_hand:.3f}  |  predict_proba: {probabilities[0][1]:.3f}")


### Topic 6: Be careful with tiny data ###
# Six emails is only enough to learn the idea. Real spam filters learn from
# millions. The probabilities above are only as trustworthy as the data behind them.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Predict an email with 0 links and 0 "winner". What probability do you get?
#   2. Find an input where the model is almost exactly 50/50 unsure.
#   3. Print model.coef_. Which feature does the model rely on more? Does that
#      match what you would guess from the table?
#   4. Why is predict_proba more useful than predict when a mistake is costly?
# =============================================================================
