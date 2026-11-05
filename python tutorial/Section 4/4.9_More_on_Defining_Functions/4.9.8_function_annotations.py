"""
Python Reference: Function annotations
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - Type hints: labelling what kind of data a function expects and returns
#   - The key fact: Python does NOT enforce them (they are for humans and tools)
#   - Where the hints are stored (__annotations__)
#   - A few common hint shapes: list[int], dict[str, float], optional values
# =============================================================================


### Topic 1: Writing annotations ###
# After a parameter, write a colon and a type:     ham: str
# After the parameter list, write -> and the return type:    -> str
# Default values still work:    eggs: str = "eggs"


def f(ham: str, eggs: str = "eggs") -> str:
    # All those hints are automatically stored in a dictionary called .__annotations__
    print("Annotations:", f.__annotations__)
    print("Arguments:", ham, eggs)
    return ham + " and " + eggs


print(f("spam"))


### Topic 2: Python does NOT enforce them ###
# Annotations are PURELY INFORMATIONAL. If you break the promise, Python won't
# care. Here a function says it wants an int, and we give it text:


def double(x: int) -> int:
    return x * 2


print(double(21))  # 42, as intended
print(double("ab"))  # abab: works fine, even though "ab" is not an int!

# So what are they for?
#   1. Readers: the signature documents itself.
#   2. Editors: VS Code shows hints and underlines mismatches as you type.
#   3. Checkers: tools such as mypy can scan your code for type mistakes.
# Treat them as documentation that a machine can check, not as a safety net.


### Topic 3: Common hint shapes ###
# Collections can say what they hold:
#   list[int]            a list of ints
#   dict[str, float]     a dictionary with str keys and float values
#   tuple[int, int]      a tuple of exactly two ints
#   int | None           either an int, or None ("optional")


def average(values: list[float]) -> float:
    return sum(values) / len(values)


def find_index(items: list[str], target: str) -> int | None:
    """Return the position of target, or None if it is missing."""
    if target in items:
        return items.index(target)
    return None


print(average([1.0, 2.0, 6.0]))
print(find_index(["a", "b", "c"], "b"))
print(find_index(["a", "b", "c"], "z"))

# You will meet hints constantly in ML code, for example
#   def forward(self, x: torch.Tensor) -> torch.Tensor:
print("Hints stored on find_index:", find_index.__annotations__)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Add type hints to a function you wrote earlier (e.g. is_even).
#   2. Write square(n: int) -> int and call it with 2.5. Does Python complain?
#      What would a type checker say?
#   3. What would the hint be for a function that takes a dictionary of
#      student names to lists of grades?
# =============================================================================
