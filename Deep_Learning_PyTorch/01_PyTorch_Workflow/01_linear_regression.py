"""
PyTorch Workflow: Linear regression from scratch
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - The whole PyTorch workflow once: data, model, loss, optimizer, training loop
#   - Building your own model as a class that inherits from nn.Module
#   - What a loss function and an optimizer do, and why the loop has five steps
#   - Training vs testing: why we keep a test set the model never learns from
#   - Reading a loss curve, and plotting predictions against the truth
#
# You solved this exact problem in Classical_ML/1_linear_regression with one line
# of scikit-learn: model.fit(). Here we do the learning OURSELVES, step by step.
# That loop is what is hiding inside every deep learning library.
# =============================================================================

import matplotlib.pyplot as plt
import torch
import torch.nn as nn


### Topic 1: The problem ###
# We will invent data from a formula we know, then see whether the model can
# discover the formula without being told:
#
#       y = weight * X + bias       with weight = 0.7 and bias = 0.3
#
# If it ends up near 0.7 and 0.3, learning worked. (In real life you never know
# the true answer. We cheat here so we can check ourselves.)
weight = 0.7
bias = 0.3


### Topic 2: Prepare the data ###
# 50 evenly spaced values between 0 and 1 (the end, 1, is not included).
start = 0
end = 1
step = 0.02
X = torch.arange(start, end, step).unsqueeze(dim=1)  # (50,) -> (50, 1): a column of features
y = weight * X + bias

print("First five X:", X[:5].flatten())
print("First five y:", y[:5].flatten())
print("X shape:", X.shape)

# unsqueeze(dim=1) makes X a column, like scikit-learn's 2D X (Classical_ML lesson 1)
# and the unsqueeze you met in PyTorch Fundamentals lesson 5.


### Topic 3: Train / test split ###
# Same golden rule as Classical ML (4_train_test_split): the model must be judged on
# data it never learned from. Here we simply cut the data at 80%.
train_split = int(0.8 * len(X))
X_train, y_train = X[:train_split], y[:train_split]
X_test, y_test = X[train_split:], y[train_split:]

print("Total data points:", len(X))
print("Training data:", len(X_train))
print("Testing data:", len(X_test))

# We did not shuffle, because this data is a perfect line. For real data you would
# shuffle first, as train_test_split does.


### Topic 4: Build a model ###
# Everything in PyTorch is built from nn.Module. To make your own model you write
# a CLASS (see 4.8 for functions; a class is a blueprint for objects) with two parts:
#   __init__   creates the PARAMETERS: the numbers the model is allowed to learn
#   forward    describes what the model DOES to its input
#
# nn.Parameter marks a tensor as "learnable": PyTorch tracks it and the optimizer
# will adjust it. requires_grad=True (the default for a Parameter) means
# "record the maths so the gradients can be worked out later" (Topic 6).
class LinearRegressionModel(nn.Module):
    def __init__(self):
        super().__init__()  # always call this first: sets up the nn.Module machinery
        self.weights = nn.Parameter(torch.randn(1, dtype=torch.float))
        self.bias = nn.Parameter(torch.randn(1, dtype=torch.float))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # the same formula as the data: weight * x + bias
        return self.weights * x + self.bias


# The parameters start RANDOM. The seed (lesson 8) makes our random start repeatable.
torch.manual_seed(42)
model = LinearRegressionModel()

print("Initial parameters (random guesses):")
print(list(model.parameters()))
print("Named:", model.state_dict())

# Compare these to the true 0.7 and 0.3. The model is just guessing.


### Topic 5: Before training, predict ###
# torch.inference_mode() switches off the bookkeeping used for learning, which makes
# prediction faster. Use it whenever you only want answers, not learning.
with torch.inference_mode():
    y_preds_before = model(X_test)

print("Before training, first prediction:", y_preds_before[0].item())
print("The true value:", y_test[0].item())


### Topic 6: Loss function and optimizer ###
# To learn, the model needs two things:
#   LOSS FUNCTION  a score for "how wrong are the predictions?". Lower is better.
#                  L1Loss is the Mean Absolute Error: the average gap between
#                  predictions and truth.
#   OPTIMIZER      the rule that nudges the parameters to reduce the loss.
#                  SGD (Stochastic Gradient Descent) is the classic.
#
# lr is the LEARNING RATE: how big each nudge is.
#   too small: learning is painfully slow;  too big: it overshoots and bounces around
loss_fn = nn.L1Loss()
optimizer = torch.optim.SGD(params=model.parameters(), lr=0.01)


### Topic 7: The training loop ###
# One pass through the data is called an EPOCH. Each epoch does the same five steps.
# In order (the order matters!):
#   1. forward pass    the model makes predictions
#   2. loss            how wrong were they?
#   3. zero_grad       clear the previous epoch's gradients (they ADD UP otherwise)
#   4. backward        work out the GRADIENT: for each parameter, which way and
#                      how strongly does it change the loss?
#   5. step            the optimizer moves every parameter a little downhill
epochs = 200

for epoch in range(epochs):
    model.train()  # training mode

    y_pred = model(X_train)  # 1. forward pass
    loss = loss_fn(y_pred, y_train)  # 2. loss
    optimizer.zero_grad()  # 3. reset gradients
    loss.backward()  # 4. backpropagation
    optimizer.step()  # 5. update the parameters

    # Every 20 epochs, also measure the TEST loss (data it never trains on).
    if epoch % 20 == 0:
        model.eval()  # evaluation mode
        with torch.inference_mode():
            test_pred = model(X_test)
            test_loss = loss_fn(test_pred, y_test)
        print(f"Epoch: {epoch:3} | Train loss: {loss:.4f} | Test loss: {test_loss:.4f}")

# Watch the losses shrink. If the train loss falls but the test loss does not, the
# model is memorising (overfitting), as in Classical_ML/5_decision_trees.


### Topic 8: What did it learn? ###
print("Final parameters (learned):")
print(model.state_dict())
print("Target parameters were: weight =", weight, ", bias =", bias)

# It should land very close to 0.7 and 0.3. Nobody told it those numbers. It found
# them by repeating "predict, measure the error, nudge" 200 times.


### Topic 9: Seeing the result ###
# A picture is worth a thousand loss values. Plot the data and the model's predictions.
model.eval()
with torch.inference_mode():
    y_preds = model(X_test)

plt.figure(figsize=(8, 5))
plt.scatter(X_train, y_train, c="royalblue", s=20, label="Training data")
plt.scatter(X_test, y_test, c="seagreen", s=20, label="Testing data")
plt.scatter(X_test, y_preds, c="crimson", s=20, label="Predictions")
plt.title("Linear Regression: Learned Fit vs. Real Data")
plt.xlabel("X")
plt.ylabel("y")
plt.legend()
plt.savefig("regression_plot.png", dpi=150, bbox_inches="tight")

# If the red dots sit on top of the green ones, the model generalised to unseen data.


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Change lr to 0.1, then to 0.0001, and rerun. What happens to the loss in each case?
#   2. Train for 20 epochs, then for 1000. Does more training always help?
#   3. What goes wrong if you delete optimizer.zero_grad()? Predict it first.
#   4. Change the true weight and bias in Topic 1 to 2.0 and -1.0. Does the model
#      still find them, or does it need more epochs?
# =============================================================================
