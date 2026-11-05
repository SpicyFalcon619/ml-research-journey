"""
Python Reference: Classes and Object-Oriented Programming (OOP)
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a class is (a blueprint) and what an object is (one thing built from it)
#   - __init__, self, attributes (data) and methods (actions)
#   - Inheritance and super(): building a new class on top of an old one
#   - Why all of this is the key to writing neural networks in PyTorch
#
# Words you will see:
#   class      the blueprint            object / instance   one thing made from it
#   attribute  a variable on an object  method             a function on an object
# =============================================================================

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

# isinstance(obj, Class) asks "is this object an instance of that class?"
# A dragon IS a BossEnemy, and (because of inheritance) it is also a BasicEnemy.
print(isinstance(dragon, BossEnemy), isinstance(dragon, BasicEnemy))
print(isinstance(goblin, BossEnemy))  # a goblin is not a boss


### Topic 3: Each object has its own data ###
# The blueprint is shared, but every object gets its OWN copy of the attributes.
# Changing the goblin's health leaves the orc untouched.
print("\n--- Topic 3: Objects are independent ---")
print(f"Goblin HP: {goblin.health}, Orc HP: {orc.health}")
orc.take_damage(40)
print(f"Goblin HP: {goblin.health}, Orc HP: {orc.health}")

# Reading/writing attributes uses a dot, exactly like calling methods:
orc.health = 100  # you can set an attribute directly too
print("Orc healed back to", orc.health)


### Topic 4: Making objects printable with __str__ ###
# print(goblin) normally shows something unhelpful like <__main__.BasicEnemy object at 0x...>.
# Methods named with double underscores ("dunder" methods) are hooks that Python
# calls for you. __str__ decides what print() shows.

class Potion:
    def __init__(self, name, heal):
        self.name = name
        self.heal = heal

    def __str__(self):
        return f"{self.name} (heals {self.heal})"

print("\n--- Topic 4: __str__ ---")
print(Potion("Small Potion", 25))

# __init__ and __str__ are just two of many. In PyTorch you will meet
# __call__ (lets you use an object like a function: model(x)) and
# __len__ / __getitem__ (how a Dataset works).


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


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make a Player class with name and score attributes and an add_points
#      method. Create two players and give them different scores.
#   2. Create a Healer(BasicEnemy) that adds a heal(amount) method and calls
#      super().__init__() properly. What breaks if you leave super() out?
#   3. Add a __str__ to BasicEnemy so print(goblin) shows its name and health.
# =============================================================================
