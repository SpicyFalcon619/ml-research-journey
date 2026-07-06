"""
PyTorch Workflow: Linear Regression from Scratch
"""
import torch
import torch.nn as nn
import matplotlib.pyplot as plt

# We are going to build a simple Neural Network to solve a problem we already know: Linear Regression!
# Our formula is: y = weight * X + bias
# We will create some fake data, and see if PyTorch can "learn" the weight and bias on its own.

### Topic 1: Preparing Data ###
# 1. Set known parameters
weight = 0.7
bias = 0.3

# 2. Create some data
start = 0
end = 1
step = 0.02
X = torch.arange(start, end, step).unsqueeze(dim=1) # Adds an extra dimension so it's a matrix, not a vector
y = weight * X + bias

# 3. Split into training and testing sets (just like we did in Classical ML!)
train_split = int(0.8 * len(X))
X_train, y_train = X[:train_split], y[:train_split]
X_test, y_test = X[train_split:], y[train_split:]

print(f"Total data points: {len(X)}")
print(f"Training data: {len(X_train)}")
print(f"Testing data: {len(X_test)}\n")


### Topic 2: Building a PyTorch Model ###
# Almost everything in PyTorch inherits from nn.Module
class LinearRegressionModel(nn.Module):
    def __init__(self):
        super().__init__()
        # Initialize our model parameters randomly
        # requires_grad=True means PyTorch will automatically calculate the gradients for us!
        self.weights = nn.Parameter(torch.randn(1, requires_grad=True, dtype=torch.float))
        self.bias = nn.Parameter(torch.randn(1, requires_grad=True, dtype=torch.float))

    # The forward method defines the computation performed at every call
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.weights * x + self.bias

# Create an instance of our model
torch.manual_seed(42) # Set a random seed so the results are reproducible
model = LinearRegressionModel()

print("Initial model parameters (randomly guessed):")
print(list(model.parameters()))


### Topic 3: The Training Loop ###
# 1. Setup a Loss Function (Mean Absolute Error - L1Loss)
loss_fn = nn.L1Loss()

# 2. Setup an Optimizer (Stochastic Gradient Descent)
# This is the algorithm that will update the weights to minimize the loss
optimizer = torch.optim.SGD(params=model.parameters(), lr=0.01)

# 3. Write the training loop
epochs = 200

for epoch in range(epochs):
    # Put the model in training mode
    model.train()

    # Step 1: Forward Pass (Have the model make predictions)
    y_pred = model(X_train)

    # Step 2: Calculate the loss (How wrong were the predictions?)
    loss = loss_fn(y_pred, y_train)

    # Step 3: Optimizer Zero Grad (Reset the gradients to zero for the next step)
    optimizer.zero_grad()

    # Step 4: Perform Backpropagation (Calculate the gradients)
    loss.backward()

    # Step 5: Optimizer Step (Update the weights and bias based on the gradients)
    optimizer.step()

    # Print out what's happening every 20 epochs
    if epoch % 20 == 0:
        model.eval() # Put model in evaluation mode
        with torch.inference_mode(): # Turn off gradient tracking for testing
            test_pred = model(X_test)
            test_loss = loss_fn(test_pred, y_test)
        print(f"Epoch: {epoch:3} | Train loss: {loss:.4f} | Test loss: {test_loss:.4f}")

print("\n--- Training Complete ---")
print("Final model parameters (learned):")
print(list(model.parameters()))
print(f"\nTarget parameters were: weight={weight}, bias={bias}")
print("The machine learned the parameters almost perfectly!")
