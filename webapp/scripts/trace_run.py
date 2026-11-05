"""Runs one lesson exactly as `python lesson.py` would, and records WHICH LINE of the
lesson produced each piece of output. The capture script uses that to give every code
block in the Guided view its own output.

Usage: trace_run.py <lesson.py>      (set MLFG_SEGMENTS to the file to write the record to)

The record is a JSON list of [line, text] pairs, in the order they were printed.
A print made inside a function is credited to the line that CALLED it at the top
level of the lesson, because that is the block the reader is looking at.
"""

import json
import os
import runpy
import sys

lesson = sys.argv[1]
lesson_key = os.path.normcase(os.path.abspath(lesson))
record_path = os.environ["MLFG_SEGMENTS"]
segments = []


def calling_lesson_line():
    frame = sys._getframe(2)  # skip this helper and write()
    line = None
    while frame is not None:
        if os.path.normcase(os.path.abspath(frame.f_code.co_filename)) == lesson_key:
            line = frame.f_lineno  # keep walking up: the outermost one wins
        frame = frame.f_back
    return line


class Recorder:
    def __init__(self, real):
        self._real = real

    def write(self, text):
        line = calling_lesson_line()
        if line is not None and text:
            if segments and segments[-1][0] == line:
                segments[-1][1] += text
            else:
                segments.append([line, text])
        return self._real.write(text)

    def __getattr__(self, name):
        return getattr(self._real, name)


sys.stdout = Recorder(sys.stdout)
sys.argv = [lesson]
try:
    runpy.run_path(lesson, run_name="__main__")
finally:
    sys.stdout = sys.stdout._real
    with open(record_path, "w", encoding="utf-8") as handle:
        json.dump(segments, handle)
