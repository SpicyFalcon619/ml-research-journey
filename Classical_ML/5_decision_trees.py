import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. THE DATA: Predicting if a patient is sick
# Here, we predict if a patient has a specific disease (1) or not (0)
# based on their Age and their Fever Temperature.
data = pd.DataFrame({
    "Age": [22, 65, 45, 80, 15, 55, 30, 75, 20, 60],
    "Fever": [98.6, 102.1, 99.0, 101.5, 98.4, 103.0, 98.8, 100.5, 99.1, 101.2],
    "Is_Sick": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1] 
})

X = data[["Age", "Fever"]]
y = data["Is_Sick"]

# Split the data so we can test it accurately!
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

### Topic 5: Decision Trees ###
# Linear and Logistic Regression try to draw a straight math line through the data.
# A Decision Tree plays the game "20 Questions". 
# It learns to ask things like: "Is Fever > 100?" -> "Is Age > 50?" to reach an answer.

# 1. Initialize the model! 
#    Create a variable called 'model', and set it to DecisionTreeClassifier()

model = DecisionTreeClassifier()

# 2. Train the model using ONLY the training data

model.fit(X_train, y_train)

# 3. Predict the answers for the test data

predictions = model.predict(X_test)
print(predictions)

# 4. Calculate the accuracy_score and print it out!

score = accuracy_score(y_test, predictions)
print(score)