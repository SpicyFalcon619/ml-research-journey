// Suggestions for the Python editor: keywords and built-ins, ready-made snippets (type "for" and
// press Tab), members after a dot (np., pd., plt., string and list methods), and your own words.
import { completeAnyWord, snippetCompletion, type Completion, type CompletionContext, type CompletionResult, type CompletionSource } from '@codemirror/autocomplete'

const words = (list: string, type: Completion['type'], detail?: string): Completion[] =>
  list.split(/\s+/).filter(Boolean).map((label) => ({ label, type, detail }))

const KEYWORDS = words(
  'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield',
  'keyword',
)

const BUILTINS = words(
  'print len range int float str bool list dict set tuple input type isinstance sum min max abs round sorted reversed enumerate zip map filter any all open id help dir vars format repr ord chr hex bin oct pow divmod iter next slice object super property staticmethod classmethod callable getattr setattr hasattr delattr',
  'function',
  'built-in',
)

// Snippets: the label is what you type; Tab jumps between the filled-in fields.
const SNIPPETS: Completion[] = [
  snippetCompletion('for ${item} in ${items}:\n\t${}', { label: 'for', detail: 'for loop over items', type: 'keyword', boost: 2 }),
  snippetCompletion('for ${i} in range(${count}):\n\t${}', { label: 'forr', detail: 'for loop with range()', type: 'keyword', boost: 2 }),
  snippetCompletion('for ${i}, ${item} in enumerate(${items}):\n\t${}', { label: 'fore', detail: 'for loop with enumerate()', type: 'keyword', boost: 2 }),
  snippetCompletion('while ${condition}:\n\t${}', { label: 'while', detail: 'while loop', type: 'keyword', boost: 2 }),
  snippetCompletion('if ${condition}:\n\t${}', { label: 'if', detail: 'if statement', type: 'keyword', boost: 2 }),
  snippetCompletion('if ${condition}:\n\t${}\nelse:\n\t${}', { label: 'ifelse', detail: 'if / else', type: 'keyword', boost: 2 }),
  snippetCompletion('if ${condition}:\n\t${}\nelif ${other}:\n\t${}\nelse:\n\t${}', { label: 'ifelif', detail: 'if / elif / else', type: 'keyword', boost: 2 }),
  snippetCompletion('def ${name}(${args}):\n\t${}', { label: 'def', detail: 'function', type: 'keyword', boost: 2 }),
  snippetCompletion('def ${name}(${args}):\n\t"""${What it does}"""\n\treturn ${result}', { label: 'defr', detail: 'function with docstring and return', type: 'keyword', boost: 2 }),
  snippetCompletion('class ${Name}:\n\tdef __init__(self, ${args}):\n\t\t${}', { label: 'class', detail: 'class with __init__', type: 'keyword', boost: 2 }),
  snippetCompletion('try:\n\t${}\nexcept ${Exception} as ${error}:\n\t${print(error)}', { label: 'try', detail: 'try / except', type: 'keyword', boost: 2 }),
  snippetCompletion('try:\n\t${}\nexcept ${Exception}:\n\t${pass}\nelse:\n\t${}\nfinally:\n\t${}', { label: 'tryf', detail: 'try / except / else / finally', type: 'keyword', boost: 2 }),
  snippetCompletion('with open(${"file.txt"}, ${"r"}) as ${f}:\n\t${}', { label: 'with', detail: 'open a file safely', type: 'keyword', boost: 2 }),
  snippetCompletion('[${x} for ${x} in ${items}]', { label: 'lc', detail: 'list comprehension', type: 'keyword', boost: 2 }),
  snippetCompletion('[${x} for ${x} in ${items} if ${condition}]', { label: 'lcif', detail: 'list comprehension with a filter', type: 'keyword', boost: 2 }),
  snippetCompletion('{${k}: ${v} for ${k}, ${v} in ${pairs}}', { label: 'dc', detail: 'dictionary comprehension', type: 'keyword', boost: 2 }),
  snippetCompletion('lambda ${x}: ${x}', { label: 'lambda', detail: 'small anonymous function', type: 'keyword', boost: 2 }),
  snippetCompletion('if __name__ == "__main__":\n\t${main()}', { label: 'main', detail: 'run only when executed directly', type: 'keyword', boost: 2 }),
  snippetCompletion('print(f"${text} {${value}}")', { label: 'pf', detail: 'print an f-string', type: 'function', boost: 2 }),
  snippetCompletion('${name} = input("${Enter a value: }")', { label: 'inp', detail: 'ask the user for text', type: 'function', boost: 2 }),
  snippetCompletion('${n} = int(input("${Enter a number: }"))', { label: 'inpi', detail: 'ask the user for a whole number', type: 'function', boost: 2 }),
  snippetCompletion('import numpy as np', { label: 'impnp', detail: 'import NumPy', type: 'keyword' }),
  snippetCompletion('import pandas as pd', { label: 'imppd', detail: 'import pandas', type: 'keyword' }),
  snippetCompletion('import matplotlib.pyplot as plt', { label: 'impplt', detail: 'import matplotlib', type: 'keyword' }),
  snippetCompletion('plt.figure(figsize=(${width}, ${height}))\nplt.plot(${x}, ${y})\nplt.title("${Title}")\nplt.xlabel("${x}")\nplt.ylabel("${y}")\nplt.show()', { label: 'plot', detail: 'a simple line graph', type: 'function', boost: 2 }),
  snippetCompletion('from sklearn.model_selection import train_test_split\n${X_train}, ${X_test}, ${y_train}, ${y_test} = train_test_split(${X}, ${y}, test_size=${test_size}, random_state=${seed})', { label: 'tts', detail: 'split data into train and test', type: 'function', boost: 2 }),
]

const STR = 'upper lower strip lstrip rstrip split join replace find startswith endswith format count title capitalize isdigit isalpha isalnum center zfill splitlines index swapcase casefold partition encode'
const LIST = 'append extend insert remove pop clear index count sort reverse copy'
const DICT = 'keys values items get update pop setdefault clear copy fromkeys popitem'
const SET = 'add remove discard union intersection difference update issubset issuperset symmetric_difference'
const FRAME =
  'head tail info describe shape columns dtypes isna sum mean median std min max groupby sort_values sort_index drop dropna fillna merge join apply map plot loc iloc value_counts unique nunique to_csv rename query astype reset_index set_index copy corr agg pivot_table'
const ARRAY = 'shape dtype ndim size reshape flatten ravel mean sum min max std argmax argmin sort astype copy tolist T dot transpose cumsum round clip'

// What follows a dot, by the name before it. Unknown names fall back to the common methods of strings, lists, dictionaries and tables.
const MEMBERS: Record<string, Completion[]> = {
  np: words(
    'array arange linspace zeros ones full eye empty random reshape mean median std var sum prod min max argmin argmax sqrt exp log log10 sin cos tan dot matmul transpose concatenate stack vstack hstack where unique sort argsort cumsum round floor ceil clip isnan abs power pi e nan inf zeros_like ones_like',
    'function',
    'numpy',
  ),
  'np.random': words('rand randn randint choice seed shuffle normal uniform permutation random', 'function', 'numpy.random'),
  pd: words(
    'DataFrame Series read_csv read_excel read_json concat merge to_datetime date_range get_dummies isna notna cut qcut pivot_table unique NA options',
    'function',
    'pandas',
  ),
  plt: words(
    'plot scatter bar barh hist boxplot pie figure subplots title xlabel ylabel legend grid show savefig xlim ylim tight_layout axhline axvline imshow colorbar text annotate close xticks yticks',
    'function',
    'matplotlib',
  ),
  math: words('sqrt pow floor ceil factorial pi e sin cos tan log log10 exp gcd isclose radians degrees fabs inf nan comb perm hypot', 'function', 'math'),
  random: words('random randint choice choices shuffle sample seed uniform randrange gauss', 'function', 'random'),
  os: words('getcwd listdir path mkdir remove rename environ sep walk', 'function', 'os'),
  json: words('dumps loads dump load', 'function', 'json'),
  time: words('time sleep perf_counter strftime', 'function', 'time'),
}
const ALIASES: Record<string, string> = { numpy: 'np', pandas: 'pd', 'matplotlib.pyplot': 'plt', 'numpy.random': 'np.random' }

const generic = [
  ...words(STR, 'method', 'str'),
  ...words(LIST, 'method', 'list'),
  ...words(DICT, 'method', 'dict'),
  ...words(SET, 'method', 'set'),
  ...words(FRAME, 'method', 'DataFrame'),
  ...words(ARRAY, 'method', 'array'),
]
// The same name can belong to several kinds (sort, copy, pop). Show each once.
const GENERIC = generic.filter((item, index) => generic.findIndex((other) => other.label === item.label) === index)

const memberSource: CompletionSource = (context: CompletionContext): CompletionResult | null => {
  const before = context.matchBefore(/[A-Za-z_][\w.]*\.\w*/)
  if (!before) return null
  const dot = before.text.lastIndexOf('.')
  const owner = before.text.slice(0, dot)
  const key = ALIASES[owner] ?? owner
  return { from: before.from + dot + 1, options: MEMBERS[key] ?? GENERIC, validFor: /^\w*$/ }
}

const baseSource: CompletionSource = (context) => {
  const before = context.matchBefore(/\w+/)
  if (!before || (before.from === before.to && !context.explicit)) return null
  // Right after a dot the member list takes over.
  if (before.from > 0 && context.state.sliceDoc(before.from - 1, before.from) === '.') return null
  return { from: before.from, options: [...SNIPPETS, ...KEYWORDS, ...BUILTINS], validFor: /^\w*$/ }
}

// Words from your own code, minus the ones already offered above (so print is not listed twice).
const known = new Set([...SNIPPETS, ...KEYWORDS, ...BUILTINS].map((item) => item.label))
const ownWords: CompletionSource = async (context) => {
  const result = await completeAnyWord(context)
  if (!result) return null
  return { ...result, options: result.options.filter((item) => !known.has(item.label)) }
}

export const pythonCompletions: CompletionSource[] = [memberSource, baseSource, ownWords]
