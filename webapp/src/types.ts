export interface Topic {
  label: string
  line: number
}

export interface Snippet {
  id: string
  path: string
  filename: string
  title: string
  categoryLabel: string
  categorySlug: string
  subSegments: string[]
  orderKey: number[]
  tags: string[]
  topics: Topic[]
  code: string
  lineCount: number
}

export interface NavItem {
  label: string
  slug: string
  snippets: Snippet[]
  children: NavItem[]
  /** Position among its siblings, from the folder's numeric prefix (e.g. 4.9). */
  orderKey?: number[]
}

export interface NavGroup {
  label: string
  slug: string
  categories: NavItem[]
}
