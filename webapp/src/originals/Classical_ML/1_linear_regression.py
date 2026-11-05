import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# 1. THE DATA: Years of Experience vs. Salary
# X is our "feature" (input). y is our "target" (output).
# Notice X is a 2D DataFrame, and y is a 1D Series. scikit-learn expects this!
data = pd.DataFrame({
    "Years_Experience": [1, 2, 3, 4, 5],
    "Salary": [40000, 50000, 60000, 70000, 80000]
})

X = data[["Years_Experience"]]
y = data["Salary"]

### Topic 1: Your First Machine Learning Model (Linear Regression) ###
# 1. Initialize the model. Create a variable called 'model' and set it to LinearRegression()
# 2. Train the model! Use model.fit(X, y). This is where the actual "learning" happens.
# 
# 3. Now let's predict the future. We have a new employee with 6 years of experience.
#    Create a DataFrame for the new input: new_X = pd.DataFrame({"Years_Experience": [6]})
# 4. Use model.predict(new_X) to predict their salary! 
#    Variable: 'prediction', and print it out.

model = LinearRegression()
model.fit(X, y)

new_X = pd.DataFrame({"Years_Experience": [6, 7]})
prediction = model.predict(new_X)

print(prediction)