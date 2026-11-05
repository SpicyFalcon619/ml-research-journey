"""
Classical ML Reference: Train/test split
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The golden rule of ML: never test a model on the data it learned from
#   - Splitting data with train_test_split (and what random_state does)
#   - Measuring a classifier with accuracy_score
#   - Why a result on a tiny dataset can swing wildly
# =============================================================================

import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


### Topic 1: Why we split ###
# Imagine a student who gets the exam questions in advance and memorises the
# answers. A perfect score proves nothing: they may not understand anything.
#
# A model is the same. If you test it on the exact data it trained on, it can
# score perfectly just by memorising. That tells you nothing about new data, and
# new data is the whole point.
#
# THE GOLDEN RULE: NEVER TEST YOUR MODEL ON THE SAME DATA YOU TRAINED IT ON.
#
# So we hide some data. Train on most of it (say 80%), then test on the rest (20%),
# which the model has never seen.

data = pd.DataFrame(
    {
        "Links": [0, 1, 5, 8, 0, 10, 2, 7, 0, 12, 1, 6, 5, 3, 9, 2, 5, 0, 7, 3],
        "Word_Winner": [0, 0, 2, 5, 0, 7, 1, 4, 0, 8, 0, 3, 1, 3, 4, 0, 3, 0, 4, 1],
        "Is_Spam": [0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
    }
)
X = data[["Links", "Word_Winner"]]
y = data["Is_Spam"]


### Topic 2: Splitting ###
# One call cuts X and y into FOUR pieces. The order is always the same, so learn it:
#       X_train, X_test, y_train, y_test = train_test_split(X, y, ...)
#
#   test_size=0.2     keep 20% for testing
#   random_state=42   the split is shuffled at random first; this fixed number makes
#                     the shuffle repeatable, so you (and I) get the same split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training rows:", len(X_train))
print("Testing rows:", len(X_test))


### Topic 3: Train on the training part only ###
# The model never sees X_test or y_test while learning.
model = LogisticRegression()
model.fit(X_train, y_train)


### Topic 4: Predict the hidden part ###
# Ask for predictions on X_test. We do NOT hand over y_test: the model must guess
# blind, and then we mark its answers.
predictions = model.predict(X_test)

# Line up the guesses next to the real answers to see them:
results = pd.DataFrame({"Actual": y_test.values, "Predicted": predictions}, index=y_test.index)
print(results)


### Topic 5: Accuracy ###
# accuracy_score = the fraction of predictions that were right.
score = accuracy_score(y_test, predictions)
print("Accuracy:", score)

# It is just this, written by hand: how often do prediction and answer agree?
print("By hand:", (predictions == y_test.values).mean())


### Topic 6: The training score flatters the model ###
# Scoring on the training data (which the model has seen) is usually the same or
# higher than on new data. A big gap between the two numbers is how you spot a
# model that has memorised. Here this toy data is simple, so both are close.
print("Accuracy on data it trained on:", accuracy_score(y_train, model.predict(X_train)))


### Topic 7: Tiny test sets are noisy ###
# With 20 rows the test set is only 4 or 5 emails, so ONE mistake moves accuracy by
# 20 to 25 points. Watch what a different shuffle (a different seed) does:
for seed in range(5):
    Xa, Xb, ya, yb = train_test_split(X, y, test_size=0.25, random_state=seed)
    acc = accuracy_score(yb, LogisticRegression().fit(Xa, ya).predict(Xb))
    print(f"random_state={seed}: accuracy {acc:.2f}")

# That is why real projects use hundreds or thousands of rows, and why you should
# never trust a single lucky score. (Cross-validation, which repeats the split
# many times, is the proper fix. It is on the roadmap for later.)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Change test_size to 0.5 and then 0.1. What happens to the accuracy, and why
#      is a very small test set not trustworthy?
#   2. Remove random_state and run the file three times. Do you get the same split?
#   3. Why do we call model.fit on X_train only, never on all of X?
#   4. Write accuracy by hand for 10 predictions where 8 are right.
# =============================================================================
