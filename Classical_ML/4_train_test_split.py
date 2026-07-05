import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. THE DATA: Predicting Spam
# Let's use a slightly larger dataset for this one.
data = pd.DataFrame({
    "Links": [0, 1, 5, 8, 0, 10, 2, 7, 0, 12, 1, 6],
    "Word_Winner": [0, 0, 2, 5, 0, 7, 1, 4, 0, 8, 0, 3],
    "Is_Spam": [0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1] 
})

X = data[["Links", "Word_Winner"]]
y = data["Is_Spam"]

### Topic 4: Train/Test Split & Accuracy ###
# Up until now, we've tested our models on fake, made-up data. 
# But how do we scientifically prove that our model is actually good?
# 
# The golden rule of Machine Learning: 
# NEVER TEST YOUR MODEL ON THE SAME DATA YOU TRAINED IT ON!
# If you do, the model might just memorize the answers instead of actually learning the pattern.
#
# So, we take our data and split it: 80% for training, 20% for testing.

# 1. Use the train_test_split function to slice our data into 4 pieces.
#    I've written this line for you since the syntax is a bit tricky to memorize at first!
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Initialize your LogisticRegression model

model = LogisticRegression()

# 3. Train the model using ONLY the training data (X_train, y_train)

model.fit(X_train, y_train)

# 4. Now, make the model predict the answers for the test data (X_test).
#    Do NOT give it y_test! We want it to guess blindly.
#    Variable: 'predictions'

predictions = model.predict(X_test)
print(predictions)

# 5. Let's see how well it did! We use accuracy_score to compare its guesses 
#    against the actual correct answers (y_test).
#    Variable: 'score' = accuracy_score(y_test, predictions)
#    Print out the score!

score = accuracy_score(y_test, predictions)

print(score)