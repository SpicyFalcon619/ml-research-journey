"""
Python Reference: Classes and Object-Oriented Programming (OOP)
"""

### Topic 1: What is a Class? ###
# A Class is simply a blueprint for creating objects.
# Think of it like a character creator in a video game. Instead of writing
# the code for an enemy from scratch every single time, we create a blueprint.

class BasicEnemy:
    # __init__ is the setup function (the "constructor"). 
    # It runs instantly the moment you spawn a new enemy.
    # 'self' is just the object talking about itself (e.g. "MY health")
    def __init__(self, name, health):
        self.name = name
        self.health = health
        self.is_alive = True
    
    # A function inside a class is called a method. It defines what the object can DO.
    def take_damage(self, amount):
        self.health -= amount
        print(f"{self.name} took {amount} damage! Health is now {self.health}.")
        if self.health <= 0:
            self.is_alive = False
            print(f"{self.name} has been defeated!")

# Now we use the blueprint to spawn two unique enemies!
goblin = BasicEnemy(name="Goblin Scout", health=30)
orc = BasicEnemy(name="Orc Warrior", health=100)

print("--- Topic 1: Basic Classes ---")
print(f"Spawned: {goblin.name} with {goblin.health} HP")
print(f"Spawned: {orc.name} with {orc.health} HP")

goblin.take_damage(15)
goblin.take_damage(20)


### Topic 2: Inheritance and super() ###
# This is the most important concept for PyTorch!
# Inheritance lets us create a NEW blueprint that copies everything from an OLD blueprint,
# but lets us add new superpowers.

class BossEnemy(BasicEnemy):
    # BossEnemy inherits from BasicEnemy!
    
    def __init__(self, name, health, special_attack):
        # Because we inherited from BasicEnemy, we MUST let BasicEnemy do its own setup first.
        # super().__init__() means "Hey parent class, run your setup stuff before I do mine."
        # If we skip this line, the Boss wouldn't have 'self.name' or 'self.is_alive'!
        super().__init__(name, health)
        
        # Now we add the Boss's unique setup
        self.special_attack = special_attack
        
    def use_special(self):
        print(f"{self.name} unleashes {self.special_attack}!!!")

print("\n--- Topic 2: Inheritance & super() ---")
dragon = BossEnemy(name="Ancient Dragon", health=5000, special_attack="Hellfire Breath")

# The dragon can use methods from the parent class (take_damage) AND its own methods (use_special)
dragon.take_damage(500)
dragon.use_special()

### Why does this matter for PyTorch? ###
# In PyTorch, almost every neural network you write will look like this:
#
# import torch.nn as nn
# class MyNeuralNetwork(nn.Module):
#     def __init__(self):
#         super().__init__()
#         self.weights = ...
#
# By inheriting from 'nn.Module', your network instantly gains the ability to track gradients,
# move to GPUs, and save/load its weights. But it ONLY gets those superpowers if you 
# remember to call super().__init__() so PyTorch can do its behind-the-scenes setup!
