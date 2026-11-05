"""
Python Reference: Text and strings
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a string is and the different ways to write one
#   - Joining strings, measuring them, and picking out single characters
#   - Slicing: cutting a piece out of a string
#   - Useful string methods (upper, strip, split, join, replace, ...)
#   - f-strings: the clean way to put variables inside text
# =============================================================================


### Topic 1: Creating strings ###
# A STRING (type: str) is a piece of text. Wrap it in quotes so Python can tell
# it apart from variable names and numbers. Single or double quotes both work.

greeting = "Hello"
also_greeting = "Hello"
print(greeting == also_greeting)  # True: the two kinds of quote make the same string

# Why two kinds? So you can put one kind of quote INSIDE the other.
print("It's easy")
print('She said "hi"')

# A backslash \ starts an ESCAPE SEQUENCE: a special character typed with two keys.
print("Line one\nLine two")  # \n = new line
print("Column A\tColumn B")  # \t = tab
print("It\'s also easy")  # \' = a plain quote that cannot end the string

# Raw strings: put r in front and backslashes stay as normal characters.
# Handy for Windows file paths.
print("C:\new_folder")  # oops: \n turned into a new line
print(r"C:\new_folder")  # r"..." keeps the text exactly as typed

# Triple quotes let a string span several lines.
poem = """Roses are red,
Violets are blue."""
print(poem)


### Topic 2: Joining and repeating ###
first = "Ada"
last = "Lovelace"

print(first + " " + last)  # + glues strings together (concatenation)
print("ha" * 3)  # * repeats a string -> hahaha
print("-" * 30)  # a quick way to draw a divider line

# You can only glue a string to ANOTHER string. Mixing types is an error:
#   print("Age: " + 30)      <- TypeError: can only concatenate str to str
# Convert the number with str() first:
print("Age: " + str(30))
# (f-strings in Topic 6 are an even nicer way to do this.)


### Topic 3: Length and indexing ###
# len() counts the characters (letters, spaces and punctuation all count).
word = "Python"
print(len(word))  # 6

# A string is an ordered row of characters, and every character has a position
# called an INDEX. Python counts from ZERO, not from 1.
#
#    +---+---+---+---+---+---+
#    | P | y | t | h | o | n |
#    +---+---+---+---+---+---+
#      0   1   2   3   4   5        <- counting from the front
#     -6  -5  -4  -3  -2  -1        <- counting from the back

print(word[0])  # P  (the FIRST character is index 0)
print(word[5])  # n
print(word[-1])  # n  (negative numbers count from the end: -1 is the last)
print(word[-2])  # o

# Asking for a position that does not exist is an IndexError:
#   word[6]      <- IndexError: string index out of range
# The last valid index is always len(word) - 1.


### Topic 4: Slicing ###
# A SLICE copies a piece of a sequence:   text[start:stop]
# It includes 'start' but stops BEFORE 'stop' (the stop is exclusive).
# Picture the numbers sitting between the letters:  P0y1t2h3o4n5

print(word[0:2])  # Py       (characters 0 and 1)
print(word[2:5])  # tho      (characters 2, 3 and 4)

# Leave out start -> from the beginning. Leave out stop -> to the end.
print(word[:2])  # Py
print(word[2:])  # thon
print(word[:])  # Python (a full copy)

# A third number is the STEP: take every n-th character.
print(word[::2])  # Pto    (every second character)
print(word[::-1])  # nohtyP (a step of -1 walks backwards: instant reverse!)

# Slices are forgiving: out-of-range slices do not crash, they just return less.
print(word[4:100])  # on
print(repr(word[10:]))  # '' (an empty string; repr() shows the quotes)

# Strings are IMMUTABLE: you cannot change a character in place.
#   word[0] = "J"     <- TypeError: 'str' object does not support item assignment
# Instead, build a NEW string from pieces.
print("J" + word[1:])  # Jython

# Everything in this topic (indexing, slicing, len) works the same way on
# lists (see 3.1.3), tuples and arrays. Learn it once, use it everywhere.


### Topic 5: String methods ###
# A METHOD is a function that belongs to a value. You call it with a dot:
#   value.method(arguments)
# Strings come with dozens of them. Remember: strings never change in place,
# so every method RETURNS A NEW STRING and the original stays as it was.

text = "  Machine Learning is fun  "

print(text.upper())  # "  MACHINE LEARNING IS FUN  "
print(text.lower())  # "  machine learning is fun  "
print(text.strip())  # removes spaces from both ends -> "Machine Learning is fun"
print(text)  # unchanged! The original is still the same

clean = text.strip()  # to keep a result, store it in a variable
print(clean.replace("fun", "powerful"))  # swap one piece of text for another
print(clean.startswith("Machine"))  # True
print(clean.endswith("fun"))  # True
print(clean.find("Learning"))  # 8  (index where it starts, -1 if not found)
print(clean.count("n"))  # how many times "n" appears
print("Learning" in clean)  # True  (the 'in' keyword tests "is this inside?")

# split() chops a string into a LIST of pieces; join() glues a list back together.
# Real-life use: reading one line of a CSV file.
row = "Alice,34,London"
fields = row.split(",")  # split wherever there is a comma
print(fields)  # ['Alice', '34', 'London']

words = clean.split()  # with no argument it splits on any whitespace
print(words)  # ['Machine', 'Learning', 'is', 'fun']
print("-".join(words))  # Machine-Learning-is-fun  (the string BEFORE .join is the glue)


### Topic 6: f-strings (putting variables inside text) ###
# Put an f before the opening quote and write variables inside { }.
# Python replaces each { } with the value. This is the modern way to build text.

name = "Ada"
age = 36
print(f"{name} is {age} years old.")

# Anything that produces a value works inside the braces, even maths.
price, quantity = 4.5, 3
print(f"{quantity} items cost {price * quantity}")

# After a colon you can control HOW the value is displayed:
pi = 3.14159265
print(f"{pi:.2f}")  # 3.14      .2f = 2 digits after the decimal point
print(f"{1234567:,}")  # 1,234,567 , = thousands separator
print(f"{0.256:.1%}")  # 25.6%     .1% = show as a percentage
print(f"[{name:>8}]")  # [     Ada]   >8 = right-align in 8 characters
print(f"[{name:<8}]")  # [Ada     ]   <8 = left-align

# Debugging trick: put = after the name to print "name=value".
accuracy = 0.9231
print(f"{accuracy=}")

# You will use f-strings constantly to print training progress, e.g.
#   print(f"Epoch {epoch}: loss={loss:.4f}")


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Store your full name in a variable and print it in UPPER case, then print
#      only your first letter, then print it backwards.
#   2. A filename is "photo_2024_final.jpg". Use split("_") and slicing to get
#      the year as a string.
#   3. Use an f-string to print:  "Total: 1,234.50 BDT"  from the number 1234.5.
#   4. Explain why  "5" + "5"  gives "55" but  5 + 5  gives 10.
# =============================================================================
