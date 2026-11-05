import pandas as pd
from sklearn.linear_model import LinearRegression

# 1. THE DATA: Predicting House Prices
# In the real world, you never predict based on just ONE feature. 
# Here, we predict the price based on BOTH the Size (sq ft) AND the Number of Bedrooms.
data = pd.DataFrame({
    "Size_SqFt": [1000, 1500, 2000, 2500, 3000],
    "Bedrooms": [2, 3, 3, 4, 4],
    "Price": [200000, 300000, 380000, 500000, 580000]
})

# 1. Create your X (Features). It should contain BOTH 'Size_SqFt' and 'Bedrooms'.
#    Remember the double brackets rule for X!

X = data[["Size_SqFt", "Bedrooms"]]

# 2. Create your y (Target). It should contain just the 'Price'.

y = data["Price"]

### Topic 2: Multiple Linear Regression ###
# The math is the same (y = w1*X1 + w2*X2 + b), but scikit-learn handles it automatically!

# 3. Initialize the model

model = LinearRegression()

# 4. Train the model

model.fit(X, y)

# 5. Predict the price of a house that is 2200 SqFt and has 3 Bedrooms.
#    (Hint: When creating new_X, make sure you provide BOTH columns in the exact same order)

new_X = pd.DataFrame({
    "Size_SqFt": [2200],
    "Bedrooms": [3]
})
prediction = model.predict(new_X)

print(prediction)