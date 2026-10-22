// Plain-language description of each track, shown on the home page and at the top
// of the track page. Keyed by the category slug (the folder name, slugified).
// A track with no entry here simply shows without a description, so a brand-new
// folder still appears in the guide without touching this file.
export const CATEGORY_INFO: Record<string, string> = {
  'python-tutorial':
    'Worked examples from the official Python tutorial: control flow, functions and their argument types, data structures, errors and classes.',
  'numpy-basics':
    'Arrays, indexing, reshaping, boolean masking, stacking and random numbers: the numerical base everything after this builds on.',
  'pandas-basics':
    'Loading and inspecting data in DataFrames, selecting rows and columns, then missing values, grouping and encoding.',
  'classical-ml':
    'Linear, multiple and logistic regression, train/test splits and decision trees, ending in a Titanic survival model for Kaggle.',
  'deep-learning-pytorch':
    "PyTorch fundamentals (tensors, operations, the GPU) following Daniel Bourke's course, and the start of the training workflow. In progress.",
}
