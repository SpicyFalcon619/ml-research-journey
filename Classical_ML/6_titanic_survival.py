"""
Capstone Challenge: Titanic Survival Prediction (Kaggle Edition)
"""
import os
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

print("Loading Kaggle datasets...")

# STEP 1: LOAD THE DATA
# Make sure you have downloaded train.csv and test.csv from Kaggle 
# and placed them in this Classical_ML folder!
train_data = pd.read_csv("train.csv")
test_data = pd.read_csv("test.csv")

print("Training Data size:", train_data.shape)
print("Test Data size:", test_data.shape)

print("Tarining Data: \n", train_data.head)
print("Test Data: \n", test_data.head)

# STEP 2: DATA CLEANING (You have to clean BOTH datasets!)
# 2a. Fill missing 'Age' in both train_data and test_data with the mean age.
# 2b. Map 'Sex' to numbers (female: 1, male: 0) in BOTH datasets.
# 2c. test_data has one missing 'Fare'. Fill it with the mean fare!


train_data["Age"] = train_data["Age"].fillna(train_data["Age"].mean())
test_data["Age"] = test_data["Age"].fillna(test_data["Age"].mean())

train_data["Fare"] = train_data["Fare"].fillna(train_data["Fare"].mean())
test_data["Fare"] = test_data["Fare"].fillna(test_data["Fare"].mean())

train_data["Sex"] = train_data["Sex"].map({"female" : 1,
                                           "male" : 0})
test_data["Sex"] = test_data["Sex"].map({"female" : 1,
                                           "male" : 0})

# STEP 3: FEATURE SELECTION
# Create X_train from train_data using ["Pclass", "Sex", "Age", "Fare"]
# Create y_train from train_data using ["Survived"]
# Create X_test from test_data using ["Pclass", "Sex", "Age", "Fare"]
# (Notice we don't use train_test_split here, because Kaggle already split it for us!)

X_train = train_data[["Pclass", "Sex", "Age", "Fare"]]
y_train = train_data["Survived"]

X_test = test_data[["Pclass", "Sex", "Age", "Fare"]]

# STEP 4: TRAIN THE MODEL
# Initialize DecisionTreeClassifier and .fit() it using X_train and y_train

model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# STEP 5: PREDICT & SUBMIT
# Predict using X_test.
# Then, format the predictions exactly how Kaggle wants it and save it!

predictions = model.predict(X_test)

submission = pd.DataFrame({
    "PassengerId": test_data["PassengerId"],
    "Survived": predictions
})

submission.to_csv("submission.csv", index=False)
print("Saved submission.csv! Upload this file to Kaggle.")
