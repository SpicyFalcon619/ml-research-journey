# -----------------------------------------------------
# MORE ON CONDITIONS
# -----------------------------------------------------
# The 'or' operator short-circuits and returns the FIRST truthy value it finds!
# Empty strings ('') are considered "falsy".

string1, string2, string3 = '', 'Trondheim', 'Hammer Dance'

# It checks string1 (empty, so false). 
# Then it checks string2 ('Trondheim', so true!). 
# It stops checking and assigns 'Trondheim' to the variable.
non_null = string1 or string2 or string3

print(f"The first non-empty string is: {non_null}")