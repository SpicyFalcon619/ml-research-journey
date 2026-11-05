// Your first version of each lesson, kept as it was before the guided rewrite.
// They live in src/originals/ (same folder layout as the repo) rather than next to
// the lessons, so the site does not list them as separate lessons.

const rawOriginals = import.meta.glob('../originals/**/*.py', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const originalsByPath = new Map(
  Object.entries(rawOriginals).map(([modulePath, code]) => [modulePath.replace(/^\.\.\/originals\//, ''), code]),
)

/** The original code for a lesson path like "NumPy_Basics/2_creating_arrays.py", if one was kept. */
export function getOriginal(path: string): string | undefined {
  return originalsByPath.get(path)
}
