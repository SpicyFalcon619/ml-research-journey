# 8.4 Raising Exceptions
# The raise statement allows you to force a specified exception to occur.

try:
    raise NameError('HiThere')
except NameError:
    print('An exception flew by! (We caught the custom error we just raised)')
