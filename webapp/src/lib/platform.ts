// navigator.platform is deprecated but still the simplest reliable way to
// pick "⌘K" vs "Ctrl+K" for a shortcut hint — same approach cmdk/Linear/VS
// Code for Web use, since userAgentData platform isn't supported everywhere yet.
export const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
