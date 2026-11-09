# ML Research Journey

My path into machine learning and AI research, from the first line of Python up to deep learning. Everything is written for a beginner and followed in order, with real code and the real output it printed.

**[Read it as a site: the ML Field Guide](https://SpicyFalcon619.github.io/ml-research-journey/)**

It is one of three guides built on the same app. The others are the [AI Engineering Field Guide](https://spicyfalcon619.github.io/ai-engineering-journey/) (JavaScript to a full AI app) and the [Java Field Guide](https://spicyfalcon619.github.io/java-field-guide/) (object oriented programming). They link to each other from the top bar.

## The roadmap

| Basecamp | What it covers | Status |
|---|---|---|
| 0. Python for someone who already codes | The Python tutorial, NumPy, pandas | Done |
| Supply line: math | Linear algebra, calculus, statistics, picked up when a concept needs them | Ongoing |
| 1. Classical machine learning | Regression, classification, train/test splits, decision trees with scikit-learn | Basics done; regularization, cross-validation and ensembles come later |
| 2. Deep learning | Tensors and the PyTorch training workflow; then fast.ai, Andrew Ng, Karpathy | PyTorch done; the rest to do |
| 3. ML engineering and MLOps | Taking models out of notebooks; experiment tracking | Not started |
| The fork | Vision, language, generative models, reinforcement learning, or core research | Not chosen yet |

The full checklist, with the courses and books behind each stage, is [ROADMAP.md](ROADMAP.md). The original interactive version is [ml-research-roadmap.html](https://SpicyFalcon619.github.io/ml-research-journey/ml-research-roadmap.html), also linked from the site's home page.

## What the site gives you

- **A rail map.** Every track is a coloured line and every lesson a stop.
- **Code beside its real output.** Each lesson file was actually run; the output on the page is what it printed.
- **Edit and run Python in the page.** Blocks can be changed and run in your browser, and the Sandbox keeps variables between runs, like a notebook.
- **A glossary.** Words such as *overfitting* and *tensor* are underlined where they first appear; hover or tap for the meaning.
- **Search** (`Ctrl+K`, for example "linear regression" or "pandas dropna"), **progress** you can tick off, and several themes. Progress stays in your own browser; nothing is sent anywhere.

It is built from the `.py` files in this repo, so it always matches what is here.

## What's in the repo

| Folder | What it holds |
|---|---|
| `python tutorial/` | Python from scratch: variables, control flow, data structures, functions, errors and classes |
| `NumPy_Basics/` | Arrays, indexing, reshaping, boolean masking, stacking and random numbers |
| `Pandas_Basics/` | Series and DataFrames, loading and inspecting data, selecting, missing data, grouping and encoding |
| `Classical_ML/` | Regression, classification, train/test splits and decision trees with scikit-learn |
| `Deep_Learning_PyTorch/` | Tensors and the PyTorch training workflow |
| `webapp/` | The ML Field Guide site |
| `ROADMAP.md`, `ml-research-roadmap.html` | The roadmap, as a checklist and as an interactive page |
| `PRODUCT.md`, `DESIGN.md` | Who the site is for, and its visual system |

## Running the site locally

```bash
cd webapp
npm install
npm run dev
```

Nothing in `webapp/` needs editing when a `.py` file is added or changed: the rail, map, track pages and search are built from each file's path, name and content. [webapp/README.md](webapp/README.md) explains how lessons are found, titled and ordered.

## Built with

Python 3 (NumPy, pandas, scikit-learn, PyTorch) for the lessons. The site is Vite, React, TypeScript, Tailwind CSS and Shiki, deployed to GitHub Pages by GitHub Actions.
