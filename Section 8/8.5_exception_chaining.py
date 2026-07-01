# 8.5 Exception Chaining
# You won't use this much in basic ML. It links an unhandled exception to a new one.

# def func():
#     raise ConnectionError
#
# try:
#     func()
# except ConnectionError as exc:
#     raise RuntimeError('Failed to open database') from exc
