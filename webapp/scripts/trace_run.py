"""Runs one lesson exactly as `python lesson.py` would, and records WHICH LINE of the
lesson produced each piece of output (printed text, and saved or shown figures). The
capture script uses that to give every code block in the Guided view its own output.

Usage: trace_run.py <lesson.py>      (set MLFG_SEGMENTS to the file to write the record to)

The record is JSON: {"segments": [[line, text], ...], "figures": [[line, filename], ...]}
in the order they happened. Output made inside a function is credited to the line that
CALLED it at the top level of the lesson, because that is the block the reader is looking at.
"""

import json
import os
import runpy
import sys

lesson = sys.argv[1]
lesson_key = os.path.normcase(os.path.abspath(lesson))
record_path = os.environ["MLFG_SEGMENTS"]
segments = []
figures = []


def lesson_line(frame):
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
        line = lesson_line(sys._getframe(1))
        if line is not None and text:
            if segments and segments[-1][0] == line:
                segments[-1][1] += text
            else:
                segments.append([line, text])
        return self._real.write(text)

    def __getattr__(self, name):
        return getattr(self._real, name)


def watch_matplotlib():
    """Note which line saves a figure, and turn plt.show() into a saved figure (there is no screen)."""
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.figure import Figure

    original_savefig = Figure.savefig
    shown = [0]

    def savefig(self, fname, *args, **kwargs):
        result = original_savefig(self, fname, *args, **kwargs)
        if isinstance(fname, (str, os.PathLike)):
            figures.append([lesson_line(sys._getframe(1)), os.path.basename(os.fspath(fname))])
        return result

    def show(*args, **kwargs):
        line = lesson_line(sys._getframe(1))
        for number in plt.get_fignums():
            shown[0] += 1
            name = f"figure_{shown[0]}.png"
            original_savefig(plt.figure(number), name, dpi=150, bbox_inches="tight")
            figures.append([line, name])
        plt.close("all")

    Figure.savefig = savefig
    plt.show = show


with open(lesson, encoding="utf-8") as handle:
    if "matplotlib" in handle.read():
        watch_matplotlib()

sys.stdout = Recorder(sys.stdout)
sys.argv = [lesson]
try:
    runpy.run_path(lesson, run_name="__main__")
finally:
    sys.stdout = sys.stdout._real
    with open(record_path, "w", encoding="utf-8") as handle:
        json.dump({"segments": segments, "figures": figures}, handle)
