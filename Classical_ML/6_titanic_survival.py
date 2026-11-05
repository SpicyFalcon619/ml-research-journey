"""
Classical ML Reference: Titanic survival
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a Kaggle competition gives you (train.csv, test.csv) and expects back
#   - A whole ML project in order: load, look, clean, choose features, train, predict, submit
#   - Cleaning BOTH files the same way, and why the test file must borrow the TRAIN average
#   - Writing a submission file in exactly the format Kaggle wants
#
# This is the capstone of Basecamp 1: everything from 1_linear_regression to
# 5_decision_trees, applied to a real dataset.
# =============================================================================

import os

import pandas as pd
from sklearn.tree import DecisionTreeClassifier


### Topic 1: The problem ###
# The Titanic sank in 1912. The challenge on Kaggle: given facts about a passenger
# (class, sex, age, fare), predict whether they survived. You get two files:
#   train.csv   891 passengers WITH the answer (a Survived column: 1 = lived)
#   test.csv    418 passengers WITHOUT the answer. You predict it, Kaggle marks you.
#
# Kaggle already split the data for you, so no train_test_split is needed here.


### Topic 2: Load the data ###
# os.path finds the CSV files that sit next to THIS script, so it works wherever
# you run it from. (A plain "train.csv" only works from the right folder.)
here = os.path.dirname(os.path.abspath(__file__))
train_data = pd.read_csv(os.path.join(here, "train.csv"))
test_data = pd.read_csv(os.path.join(here, "test.csv"))

print("Training data size:", train_data.shape)  # (891, 12)
print("Test data size:", test_data.shape)  # (418, 11): no Survived column

# Always LOOK at the data before touching it. head() shows the first rows.
print(train_data[["Survived", "Pclass", "Sex", "Age", "Fare"]].head())


### Topic 3: What is missing? ###
# Models crash on missing values (see Pandas_Basics, missing data). Count them:
print("Missing in train:")
print(train_data[["Age", "Fare"]].isna().sum())
print("Missing in test:")
print(test_data[["Age", "Fare"]].isna().sum())


### Topic 4: Clean BOTH files the same way ###
# 4a. Fill missing ages and fares with the average. One rule matters a lot here:
#     work the average out from the TRAIN data only, and use that SAME number for
#     the test file too. If the test data helped decide the number, information
#     from the test set would leak into your training, and your score would lie.
#     (That is the "leakage rule" from the missing-data lesson.)
mean_age = train_data["Age"].mean()
mean_fare = train_data["Fare"].mean()

for table in (train_data, test_data):
    table["Age"] = table["Age"].fillna(mean_age)
    table["Fare"] = table["Fare"].fillna(mean_fare)

# 4b. Models only understand numbers, so turn the text in Sex into 0 and 1.
for table in (train_data, test_data):
    table["Sex"] = table["Sex"].map({"female": 1, "male": 0})

print("Missing after cleaning:", train_data[["Age", "Fare", "Sex"]].isna().sum().sum())


### Topic 5: Choose features ###
# Keep it simple: four columns that should plausibly matter.
features = ["Pclass", "Sex", "Age", "Fare"]

X_train = train_data[features]
y_train = train_data["Survived"]
X_test = test_data[features]  # note: no y_test, Kaggle keeps those answers secret


### Topic 6: Train ###
# A decision tree (5_decision_trees). random_state keeps the result repeatable.
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Without answers for the test set we cannot score it ourselves. The score on the
# training data is ONLY a sanity check, and an over-optimistic one (see 4_train_test_split).
print("Training accuracy:", round(model.score(X_train, y_train), 3))


### Topic 7: Predict and write the submission ###
# Kaggle wants a CSV with exactly two columns: PassengerId and Survived.
predictions = model.predict(X_test)

submission = pd.DataFrame({"PassengerId": test_data["PassengerId"], "Survived": predictions})
print(submission.head())
print("Predicted survivors:", int(predictions.sum()), "of", len(predictions))

# index=False stops pandas adding its own row-number column, which Kaggle would reject.
# The file lands in the folder you run Python from.
submission.to_csv("submission.csv", index=False)
print("Saved submission.csv! Upload this file to Kaggle.")


### Topic 8: How it scored, and what comes next ###
# My first real submission, made with an earlier version of this same idea, scored
# 0.74641 on Kaggle (about 75% of the passengers predicted correctly).
#
# Ideas to beat it (all on the roadmap): use more features (age groups, titles in
# names, where they boarded), try a Random Forest (many trees voting), and judge
# models with cross-validation instead of one lucky split.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Add the SibSp and Parch columns (family on board) to the features. Does the
#      training accuracy change? Why is that NOT enough to say the model is better?
#   2. Set max_depth=3 on the tree and compare. Which is likelier to do well on new data?
#   3. Why did we fill the test file's ages with the TRAIN average?
#   4. Open submission.csv. Does it have exactly the columns Kaggle asks for?
# =============================================================================
