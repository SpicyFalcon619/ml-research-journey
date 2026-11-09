// The field guides are separate sites that point at each other: the navbar, the home page and the phone menu all
// read this one list. Each site keeps the same list; THIS_GUIDE says which one the current site is, so it is left out.
export interface Guide {
  id: 'ai' | 'ml' | 'java'
  /** The full name, for headings. */
  name: string
  /** A short name, for the navbar. */
  short: string
  url: string
  blurb: string
}

export const GUIDES: Guide[] = [
  {
    id: 'ai',
    name: 'AI Engineering Field Guide',
    short: 'AI Engineering',
    url: 'https://spicyfalcon619.github.io/ai-engineering-journey/',
    blurb: 'JavaScript first, then React, FastAPI and a machine learning model behind one app.',
  },
  {
    id: 'ml',
    name: 'ML Field Guide',
    short: 'ML',
    url: 'https://spicyfalcon619.github.io/ml-research-journey/',
    blurb: 'Python, data science and machine learning, one stop at a time, with a Playground that runs Python in the page.',
  },
  {
    id: 'java',
    name: 'Java Field Guide',
    short: 'Java',
    url: 'https://spicyfalcon619.github.io/java-field-guide/',
    blurb: 'Java and object oriented programming, from the first Hello World to threads.',
  },
]

export const THIS_GUIDE: Guide['id'] = 'ml'
export const otherGuides: Guide[] = GUIDES.filter((guide) => guide.id !== THIS_GUIDE)
