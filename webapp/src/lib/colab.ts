// PyTorch cannot run in the browser, so those lessons open as notebooks in Google Colab instead
// (free, and PyTorch and a GPU are already there). Colab reads notebooks straight from GitHub, so
// `npm run build-notebooks` writes one per lesson into webapp/public/notebooks, and they are committed.

const REPO = 'SpicyFalcon619/ml-research-journey'

/** True when the lesson needs something the in-browser Python does not have (PyTorch). */
export function needsColab(code: string): boolean {
  return /^\s*(import torch|from torch)/m.test(code)
}

export function colabUrl(lessonPath: string): string {
  const notebook = `webapp/public/notebooks/${lessonPath.replace(/\.py$/, '.ipynb')}`
  return `https://colab.research.google.com/github/${REPO}/blob/master/${encodeURI(notebook)}`
}
