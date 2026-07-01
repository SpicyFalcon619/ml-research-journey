# 8.8 Predefined Clean-up Actions
# The 'with' statement is super important for opening files!
# It automatically closes the file for you when the block finishes, even if an error occurs.

with open('dummy.txt', 'w') as f:
    f.write('Hello, world!')
    
# The file is automatically closed here! We don't have to manually call f.close()
