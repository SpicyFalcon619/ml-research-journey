# Iterating over a list
words = ["Cat", "Watermelon", "Xong Xina"]

for w in words:
    print(w, len(w))

# Method 1 : Iterate over a copy to safely modify the original dictionary
users1 = {'Hans': 'active', 'Éléonore': 'inactive', '景太郎': 'active'}

for user, status in users1.copy().items():
    if status == 'inactive':
        del users1[user]
        
print(users1)

# Method 2 : Create a new collection instead of modifying the original
users2 = {'Hans': 'active', 'Éléonore': 'inactive', '景太郎': 'active'}

active_users = {}

for user, status in users2.items():
    if status == 'active':
        active_users[user] = status

print(active_users)