"""
Classical ML Reference: Decision trees
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - How a decision tree works: a game of "20 questions"
#   - Training one, then PRINTING the questions it learned
#   - Which features it found most useful (feature importance)
#   - Overfitting: why an unlimited tree memorises, and how max_depth helps
# =============================================================================

import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text


### Topic 1: The idea ###
# Linear and logistic regression draw a smooth line through the data.
# A DECISION TREE plays "20 Questions". It learns a chain of yes/no questions
# about the features, like:
#       "Is the fever above 100?"  ->  "Is the age above 50?"  ->  "Sick."
#
# The big advantage: you can READ the tree and see exactly why it decided,
# something that is not true of most models.

data = pd.DataFrame(
    {
        "Age": [22, 65, 45, 80, 15, 55, 30, 75, 20, 60, 38, 70, 50, 28, 62, 35, 48, 58, 25, 72],
        "Fever": [98.6, 102.1, 99.0, 101.5, 98.4, 103.0, 98.8, 100.5, 99.1, 101.2, 102.4, 98.7, 101.8, 100.9, 99.2, 99.4, 100.2, 98.5, 99.0, 99.3],
        "Is_Sick": [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
    }
)
X = data[["Age", "Fever"]]
y = data["Is_Sick"]

# Split first, so we can test honestly (4_train_test_split explains why).
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


### Topic 2: Train it ###
# Same create -> fit -> predict pattern. random_state=42 matters here: when two
# questions are equally good the tree picks one at random, so a seed keeps results repeatable.
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)


### Topic 3: Read the questions it learned ###
# export_text draws the tree as indented questions. Each level is one question;
# the "class" lines are the final answers (0 = healthy, 1 = sick).
print(export_text(model, feature_names=list(X.columns)))


### Topic 4: Predict and score ###
predictions = model.predict(X_test)
print("Predictions:", predictions)

score = accuracy_score(y_test, predictions)
print("Accuracy:", score)


### Topic 5: Which features mattered? ###
# feature_importances_ shows how much each feature was used to split. They add up to 1.
for name, importance in zip(X.columns, model.feature_importances_):
    print(f"{name}: {importance:.2f}")


### Topic 6: Overfitting ###
# By default a tree keeps asking questions until it gets every training example
# right. That sounds great, but it can mean memorising noise. Compare:
#   - an unlimited tree:   perfect on training data, maybe worse on new data
#   - a shallow tree (max_depth=1): one question only, simple and steadier
for depth in (None, 1):
    tree = DecisionTreeClassifier(max_depth=depth, random_state=42).fit(X_train, y_train)
    train_acc = accuracy_score(y_train, tree.predict(X_train))
    test_acc = accuracy_score(y_test, tree.predict(X_test))
    print(f"max_depth={depth}: train accuracy {train_acc:.2f}, test accuracy {test_acc:.2f}")

# max_depth is called a HYPERPARAMETER: a setting YOU choose, not something the
# model learns. Choosing these well is a big part of real ML work.
# Look at the numbers: the unlimited tree is perfect on the training rows, the
# one-question tree is not, yet on the unseen rows they tie. With only 4 test rows
# this is a demonstration, not a conclusion. On big data the gap is far clearer.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Change max_depth to 2 and print the tree again. How do the questions change?
#   2. Predict a 70-year-old with a fever of 101.0, and read the tree to explain why.
#   3. Remove random_state and refit 5 times. Does the printed tree ever change?
#   4. Why can a perfect training score be a warning sign rather than good news?
# =============================================================================
