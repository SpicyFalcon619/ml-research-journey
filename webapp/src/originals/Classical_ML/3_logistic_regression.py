import pandas as pd
from sklearn.linear_model import LogisticRegression

# 1. THE DATA: Predicting if an Email is Spam
# Linear Regression predicts a continuous NUMBER (like $419,000).
# Classification predicts a CATEGORY (like True/False, or 0/1).
# Here, we predict if an email is Spam (1) or Not Spam (0) based on 
# how many links it has, and how many times the word "winner" appears.
data = pd.DataFrame({
    "Links": [0, 1, 5, 8, 0, 10],
    "Word_Winner": [0, 0, 2, 5, 0, 7],
    "Is_Spam": [0, 0, 1, 1, 0, 1]  # 0 = Not Spam, 1 = Spam
})

# 1. Create your X (Features). It should contain BOTH 'Links' and 'Word_Winner'.
#    (Remember double brackets!)

X = data[["Links", "Word_Winner"]]

# 2. Create your y (Target). It should contain just the 'Is_Spam' column.

y = data["Is_Spam"]

### Topic 3: Classification (Logistic Regression) ###
# Despite the name, Logistic Regression is used for CLASSIFICATION (predicting 0 or 1).

# 3. Initialize the model! 
#    Instead of LinearRegression(), use LogisticRegression()

model = LogisticRegression()

# 4. Train the model

model.fit(X, y)

# 5. Let's predict! We just received a new email with 6 links and the word "winner" appears 3 times.
#    Will it go to the Spam folder (1) or the Inbox (0)?
#    Create a new_X DataFrame, predict it, and print the result!

new_X = pd.DataFrame({
    "Links": [6, 1],
    "Word_Winner": [3, 2]
})
prediction = model.predict(new_X)

print(prediction)