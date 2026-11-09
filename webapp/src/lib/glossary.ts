// Plain-language meanings of the words that make beginners stop reading: Python, NumPy, pandas, machine
// learning and PyTorch. The Glossary page lists them all; the lookup helpers at the bottom let a lesson's
// explanation underline a word and show its short meaning (the other field guides do this).
//
// To add a word: give it an id (lowercase, dashes), the term as written, any other spellings that should
// be recognised (plural, abbreviation), a `short` meaning that fits in one sentence, and a `long` one
// with an everyday comparison where it helps. `lesson` names the lesson (by its title) to read next.

export interface GlossaryEntry {
  id: string
  term: string
  aliases?: string[]
  short: string
  long: string
  /** Title of the lesson that teaches it properly. */
  lesson?: string
  /**
   * False for words that are also everyday English (model, loop, label): they are explained on the glossary
   * page, but never underlined automatically in a lesson, where that would only get in the way.
   */
  auto?: boolean
}

export const GLOSSARY: GlossaryEntry[] = [
  // ------------------------------------------------------------------ Python
  {
    id: 'variable',
    term: 'variable',
    aliases: ['variables'],
    short: 'A name that points to a value, so the program can use it again later.',
    long: 'A variable is a labelled box. You put a value in (age = 22), and wherever you write the label, Python uses what is in the box. Python works out the type from the value, so you never declare it.',
  },
  {
    id: 'data-type',
    term: 'data type',
    aliases: ['data types', 'type', 'types'],
    short: 'What kind of value something is: a whole number, a decimal, text, True or False.',
    long: 'The basic types are int (whole numbers), float (decimals), str (text) and bool (True or False). type(x) tells you which one you have. Mixing them wrongly is a common source of errors, for example adding a number to text.',
    auto: false,
  },
  {
    id: 'f-string',
    term: 'f-string',
    aliases: ['f-strings'],
    short: 'A string starting with f that puts values inside curly braces: f"Hello {name}".',
    long: 'Whatever is inside { } is worked out and placed into the text, so you do not have to join pieces with +. You can even calculate inside the braces, for example f"{score + 5}".',
  },
  {
    id: 'list',
    term: 'list',
    aliases: ['lists'],
    short: 'An ordered collection of values that you can change, written with square brackets.',
    long: 'A list like [82, 45, 91] keeps its order and can grow or shrink with append and remove. You reach an item by its position, counted from 0: scores[0] is the first one. A slice such as scores[1:3] gives a part of it.',
    auto: false,
  },
  {
    id: 'tuple',
    term: 'tuple',
    aliases: ['tuples'],
    short: 'Like a list, but fixed: once made it cannot be changed.',
    long: 'A tuple is written with round brackets, (3, 4). Use one when the values belong together and should not change, such as the shape of an array.',
  },
  {
    id: 'dictionary',
    term: 'dictionary',
    aliases: ['dictionaries', 'dict', 'dicts'],
    short: 'A collection of key and value pairs: you look something up by its name, not its position.',
    long: 'student = {"name": "Aisha", "score": 82} stores two facts under two keys, and student["name"] gives "Aisha". It is Python\'s version of a phone book, and the same idea as JSON.',
  },
  {
    id: 'function',
    term: 'function',
    aliases: ['functions'],
    short: 'A named recipe: code you write once (with def) and can run whenever you need it.',
    long: 'Defining a function only writes the recipe down; calling it, with brackets, is what runs it. A function can take inputs (parameters) and hand back a result with return. Functions are how you avoid copying the same code.',
  },
  {
    id: 'loop',
    term: 'loop',
    aliases: ['loops', 'for loop', 'while loop'],
    short: 'Code that repeats: for goes through a collection, while repeats until a condition fails.',
    long: 'for score in scores: runs the indented lines once for each item. while keeps going as long as its condition stays true, so something inside it must eventually make it false, or it never ends.',
    auto: false,
  },
  {
    id: 'list-comprehension',
    term: 'list comprehension',
    aliases: ['list comprehensions'],
    short: 'A one-line way to build a new list from another: [s + 5 for s in scores].',
    long: 'It reads as "give me s + 5 for each s in scores", and an if at the end keeps only some items: [s for s in scores if s >= 60]. It replaces the loop-plus-append pattern.',
  },
  {
    id: 'module',
    term: 'module',
    aliases: ['modules', 'import', 'library', 'libraries', 'package', 'packages'],
    short: 'A file of ready-made code that you bring in with import.',
    long: 'Python ships with many modules (math, random) and you can install more, such as NumPy and pandas. import numpy as np makes its tools available as np.something.',
  },
  {
    id: 'exception',
    term: 'exception',
    aliases: ['exceptions', 'error handling', 'try except'],
    short: 'An error that stops the program, unless you catch it with try and except.',
    long: 'Dividing by zero or opening a missing file raises an exception. Code inside try: runs normally, and if it fails, the except: block runs instead of the program crashing.',
  },
  {
    id: 'class',
    term: 'class',
    aliases: ['classes', 'object', 'objects'],
    short: 'A blueprint for making objects that bundle data with the functions that use it.',
    long: 'A class describes what something has and can do. Each object made from it holds its own data. Almost everything in Python is an object, including lists and the models in scikit-learn.',
    auto: false,
  },
  // ------------------------------------------------------------------ NumPy
  {
    id: 'numpy',
    term: 'NumPy',
    short: 'The Python library for fast arithmetic on whole arrays of numbers.',
    long: 'NumPy is the base that pandas, scikit-learn and PyTorch are built on. It stores numbers compactly and does maths on thousands of them at once, which is far faster than a Python loop.',
  },
  {
    id: 'array',
    term: 'array',
    aliases: ['arrays', 'ndarray'],
    short: 'A grid of numbers of one type, the basic object in NumPy.',
    long: 'A NumPy array can have one dimension (a row), two (a table) or more. Unlike a list it holds a single type and supports arithmetic on the whole thing: arr * 2 doubles every item.',
  },
  {
    id: 'vectorization',
    term: 'vectorization',
    aliases: ['vectorized', 'vectorised'],
    short: 'Doing an operation on a whole array at once instead of looping over its items.',
    long: 'scores + 5 adds 5 to every score with no loop. It is shorter to write and much faster to run, because the loop happens inside NumPy\'s optimised code. Machine learning relies on this.',
  },
  {
    id: 'broadcasting',
    term: 'broadcasting',
    short: 'The rule that lets NumPy combine arrays of different shapes by stretching the smaller one.',
    long: 'Adding a single number to a whole array, or a row to every row of a table, works because the smaller value is repeated to fit. When the shapes cannot be matched, NumPy raises an error.',
  },
  {
    id: 'shape',
    term: 'shape',
    aliases: ['dimension', 'dimensions'],
    short: 'The size of an array along each direction, for example (3, 4) for 3 rows and 4 columns.',
    long: 'arr.shape tells you the rows and columns. Many errors in machine learning are shape mismatches, so printing the shape is the first thing to check.',
  },
  {
    id: 'axis',
    term: 'axis',
    aliases: ['axes'],
    short: 'A direction of an array: axis 0 runs down the rows, axis 1 runs across the columns.',
    long: 'arr.sum(axis=0) adds down each column and gives one total per column; axis=1 gives one total per row. The same idea appears in pandas.',
  },
  {
    id: 'boolean-mask',
    term: 'boolean mask',
    aliases: ['boolean masking', 'masking', 'mask'],
    short: 'A True/False array used to pick out only the items that pass a test.',
    long: 'scores[scores >= 60] first builds an array of True and False, then keeps the items where it is True. It is the NumPy way of filtering, and pandas uses the same trick on tables.',
  },
  {
    id: 'random-seed',
    term: 'random seed',
    aliases: ['seed'],
    short: 'A starting number that makes "random" results repeat exactly.',
    long: 'Computers produce pseudo-random numbers from a formula. Fixing the seed (np.random.seed(42)) gives the same numbers every run, so experiments can be repeated and compared.',
  },
  // ------------------------------------------------------------------ pandas
  {
    id: 'pandas',
    term: 'pandas',
    short: 'The Python library for working with tables of data.',
    long: 'pandas reads files such as CSVs into a DataFrame and gives you tools to clean, select, group and summarise the data. Most real machine learning starts with a pandas step.',
  },
  {
    id: 'dataframe',
    term: 'DataFrame',
    aliases: ['DataFrames', 'dataframe'],
    short: 'A table of data with named columns, the main object in pandas.',
    long: 'Think of a spreadsheet: rows are records (one passenger, one house), columns are facts about them (age, price). df["age"] picks a column, and df.head() shows the first rows.',
  },
  {
    id: 'series',
    term: 'Series',
    short: 'One column of a DataFrame: a list of values with an index.',
    long: 'df["age"] is a Series. It supports the same whole-column arithmetic as a NumPy array, plus methods such as mean() and value_counts().',
  },
  {
    id: 'index',
    term: 'index',
    aliases: ['indexing'],
    short: 'The labels of the rows of a table, or the position of an item in a list.',
    long: 'In a list, the index is the position, counted from 0. In pandas it is the row label, usually 0, 1, 2 and so on. loc picks by label and iloc picks by position.',
    auto: false,
  },
  {
    id: 'missing-value',
    term: 'missing value',
    aliases: ['missing values', 'NaN', 'null', 'missing data'],
    short: 'A gap in the data, shown in pandas as NaN ("not a number").',
    long: 'Real data has blanks. isna() finds them, dropna() removes the rows that have them, and fillna() fills them in, for example with the average. Most models cannot accept missing values, so you must deal with them first.',
  },
  {
    id: 'groupby',
    term: 'groupby',
    aliases: ['group by'],
    short: 'Splitting a table into groups, then summarising each group.',
    long: 'df.groupby("class")["fare"].mean() gives the average fare for each class. It is the pandas version of a pivot table.',
  },
  {
    id: 'one-hot-encoding',
    term: 'one-hot encoding',
    aliases: ['one hot encoding', 'get_dummies', 'encoding'],
    short: 'Turning a text category into columns of 0 and 1, because models only understand numbers.',
    long: 'A column "port" with values S, C and Q becomes three columns, port_S, port_C and port_Q, with a 1 where it applies. pd.get_dummies does it in one line.',
  },
  {
    id: 'csv',
    term: 'CSV',
    aliases: ['csv file'],
    short: 'A plain text file where each line is a row and commas separate the columns.',
    long: 'CSV (comma-separated values) is the most common way to share a table. pd.read_csv("train.csv") loads one into a DataFrame.',
  },
  // ------------------------------------------------------------------ machine learning
  {
    id: 'machine-learning',
    term: 'machine learning',
    aliases: ['ML'],
    short: 'Getting a computer to find patterns in examples instead of writing the rules by hand.',
    long: 'Rather than telling the computer how to decide whether an email is spam, you show it thousands of labelled emails and let an algorithm work out the pattern. The result is a model you can use on new emails.',
  },
  {
    id: 'supervised-learning',
    term: 'supervised learning',
    short: 'Learning from examples where the right answer is already known.',
    long: 'Each training example comes with its correct answer (the label), and the model learns to predict it. Regression and classification are the two kinds.',
  },
  {
    id: 'feature',
    term: 'feature',
    aliases: ['features', 'input features'],
    short: 'One measurable fact about an example that the model may use, such as age or size.',
    long: 'A house described by its area, bedrooms and age has three features. They form the input X. Choosing and cleaning features is a large part of the work.',
  },
  {
    id: 'label',
    term: 'label',
    aliases: ['labels', 'target'],
    short: 'The correct answer for an example, which the model learns to predict.',
    long: 'For house prices the label is the price; for spam detection it is "spam" or "not spam". It is usually called y, with the features called X.',
    auto: false,
  },
  {
    id: 'training-set',
    term: 'training set',
    aliases: ['training data', 'test set', 'test data'],
    short: 'The examples a model learns from, kept apart from the examples used to check it.',
    long: 'The data is split in two. The model learns from the training set only, and the test set, which it has never seen, tells you honestly how well it will do on new data. train_test_split does the split.',
  },
  {
    id: 'model',
    term: 'model',
    aliases: ['models'],
    short: 'The thing that has learned from the data and can now make predictions.',
    long: 'In scikit-learn a model is an object: you create it, call fit(X, y) to train it, then predict(X_new) to use it. Once trained, it can be saved and loaded again.',
    auto: false,
  },
  {
    id: 'fit-predict',
    term: 'fit',
    aliases: ['predict', 'training', 'inference'],
    short: 'fit trains a model on data; predict uses the trained model on new data.',
    long: 'These two calls are the heart of scikit-learn. Training is slow and happens once; predicting is fast and happens every time you need an answer.',
    auto: false,
  },
  {
    id: 'regression',
    term: 'regression',
    aliases: ['linear regression'],
    short: 'Predicting a number, such as a price or a temperature.',
    long: 'Linear regression draws the best straight line (or plane) through the examples. The model\'s answer is a continuous value, not a category.',
  },
  {
    id: 'classification',
    term: 'classification',
    aliases: ['logistic regression', 'classifier'],
    short: 'Predicting which category something belongs to, such as survived or not.',
    long: 'Logistic regression, despite its name, is a classification method: it gives a probability between 0 and 1, and a threshold turns that into a yes or a no.',
  },
  {
    id: 'decision-tree',
    term: 'decision tree',
    aliases: ['decision trees'],
    short: 'A model that decides by asking a chain of yes/no questions about the features.',
    long: 'Like a flowchart: "Is the passenger female? Is the fare above 50?" Each answer leads to another question or a final prediction. Trees are easy to read but easy to overfit.',
  },
  {
    id: 'overfitting',
    term: 'overfitting',
    aliases: ['overfit', 'underfitting', 'underfit'],
    short: 'When a model memorises the training data and does badly on new data.',
    long: 'A student who memorises last year\'s exam answers does well on that exam and badly on a new one. A model does the same if it is too complex. The fix starts with checking it on a test set. Underfitting is the opposite: too simple to capture the pattern at all.',
  },
  {
    id: 'loss',
    term: 'loss function',
    aliases: ['loss', 'cost function', 'cost'],
    short: 'A number that says how wrong the model\'s predictions are. Training tries to make it small.',
    long: 'For regression it is often the average squared error. Every training step adjusts the model slightly so the loss goes down. Watching the loss fall is how you know learning is happening.',
  },
  {
    id: 'gradient-descent',
    term: 'gradient descent',
    short: 'The method that improves a model by repeatedly stepping in the direction that lowers the loss.',
    long: 'Imagine walking downhill in fog: at each step you feel which way slopes down and move that way. The slope is the gradient, and the size of the step is the learning rate.',
  },
  {
    id: 'learning-rate',
    term: 'learning rate',
    short: 'How big each step of gradient descent is.',
    long: 'Too large and the model overshoots and never settles; too small and training takes forever. It is one of the first things to adjust when a model will not learn.',
  },
  {
    id: 'hyperparameter',
    term: 'hyperparameter',
    aliases: ['hyperparameters'],
    short: 'A setting you choose before training, such as the learning rate or the depth of a tree.',
    long: 'Parameters are learned by the model from the data; hyperparameters are set by you. You try several values and keep the one that does best on held-back data.',
  },
  {
    id: 'accuracy',
    term: 'accuracy',
    short: 'The share of predictions that were correct.',
    long: 'If a model is right on 90 of 100 test examples, its accuracy is 0.9. It can mislead when one outcome is much rarer than the other, so it is often read together with other measures.',
  },
  {
    id: 'scikit-learn',
    term: 'scikit-learn',
    aliases: ['sklearn'],
    short: 'The Python library of ready-made machine learning models and tools.',
    long: 'It gives every model the same interface (fit and predict) plus helpers such as train_test_split. It covers regression, classification and clustering, but not deep learning.',
  },
  // ------------------------------------------------------------------ deep learning with PyTorch
  {
    id: 'tensor',
    term: 'tensor',
    aliases: ['tensors'],
    short: 'PyTorch\'s version of an array of numbers, which can also run on a GPU.',
    long: 'A tensor looks and behaves like a NumPy array and can be converted to one. The difference is that PyTorch can track the maths done on it to work out gradients, and run it on faster hardware.',
  },
  {
    id: 'neural-network',
    term: 'neural network',
    aliases: ['neural networks', 'deep learning'],
    short: 'A model made of layers of simple units whose connections are adjusted during training.',
    long: 'Each layer takes numbers in, mixes them with learned weights and passes the result on. With many layers it is called deep learning, and it can learn patterns that simpler models cannot.',
  },
  {
    id: 'weights',
    term: 'weights',
    aliases: ['weight', 'parameters', 'bias'],
    short: 'The numbers inside a model that are adjusted during training.',
    long: 'A linear model\'s weights say how much each feature matters. Training means finding the weights that make the loss as small as possible.',
    auto: false,
  },
  {
    id: 'epoch',
    term: 'epoch',
    aliases: ['epochs'],
    short: 'One full pass through the whole training set.',
    long: 'Training usually repeats for many epochs. After each one the model has seen every example once more and should be slightly better.',
  },
  {
    id: 'batch',
    term: 'batch',
    aliases: ['batches', 'batch size'],
    short: 'A small group of examples processed together in one training step.',
    long: 'Using the whole dataset for every step is slow, and one example at a time is noisy, so training takes batches, for example 32 examples at once.',
    auto: false,
  },
  {
    id: 'optimizer',
    term: 'optimizer',
    aliases: ['optimiser'],
    short: 'The part that updates the weights after each step, for example SGD or Adam.',
    long: 'After the loss is worked out, the optimizer moves every weight a little in the direction that lowers it. optimizer.zero_grad() clears the old gradients first so they do not pile up.',
  },
  {
    id: 'backpropagation',
    term: 'backpropagation',
    aliases: ['backward pass', 'autograd', 'gradient'],
    short: 'How a network works out which way to change each weight, by passing the error backwards.',
    long: 'PyTorch does it for you: loss.backward() calculates the gradient of the loss for every weight. The optimizer then uses those gradients to take a step.',
  },
  {
    id: 'gpu',
    term: 'GPU',
    aliases: ['CUDA', 'device'],
    short: 'A graphics processor, much faster than a normal processor at the maths neural networks need.',
    long: 'PyTorch can move tensors and models to the GPU with .to("cuda") when one is available. Your lessons run on the CPU by default, which is fine for small examples.',
  },
]

const byId = new Map(GLOSSARY.map((entry) => [entry.id, entry]))
export const getTerm = (id: string) => byId.get(id)

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Every spelling that should be recognised, longest first so "decision tree" wins over "tree". */
const spellings = GLOSSARY.filter((entry) => entry.auto !== false).flatMap((entry) => [entry.term, ...(entry.aliases ?? [])].map((spelling) => ({ spelling, id: entry.id })))
  .sort((a, b) => b.spelling.length - a.spelling.length)

const lookup = new Map(spellings.map((s) => [s.spelling.toLowerCase(), s.id]))

/** One pattern that matches any spelling as a whole word, case-insensitively. */
export const TERM_PATTERN = new RegExp(`(?<![\\w.])(${spellings.map((s) => escape(s.spelling)).join('|')})(?![\\w(])`, 'gi')

export function termIdOf(spelling: string): string | undefined {
  return lookup.get(spelling.toLowerCase())
}

/** The ids of the glossary terms mentioned in a piece of plain text, in order of appearance. */
export function termsIn(text: string): string[] {
  const found: string[] = []
  for (const match of text.matchAll(TERM_PATTERN)) {
    const id = termIdOf(match[1])
    if (id && !found.includes(id)) found.push(id)
  }
  return found
}
