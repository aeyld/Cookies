const toggle = document.querySelector('#search-toggle')
const panel = document.querySelector('#search-panel')
const input = document.querySelector('#site-search')
const results = document.querySelector('#search-results')

// Collect everything searchable. Runs on each search so that
// content added by recipe.js is included too.
function buildIndex() {
  const entries = []

  for (const section of document.querySelectorAll('main > section.card')) {
    const heading = section.querySelector('h2')
    if (!heading) continue
    entries.push({
      label: heading.textContent.trim(),
      type: 'Section',
      text: section.textContent,
      target: section,
    })
  }

  for (const item of document.querySelectorAll('.faq-item')) {
    const question = item.querySelector('summary')
    entries.push({
      label: question.textContent.trim(),
      type: 'FAQ',
      text: item.textContent,
      target: item,
    })
  }

  for (const li of document.querySelectorAll('#items-list > li')) {
    const name = li.querySelector('strong')
    entries.push({
      label: name ? name.textContent.trim() : li.textContent.trim(),
      type: 'Ingredient',
      text: li.textContent,
      target: li,
    })
  }

  for (const card of document.querySelectorAll('.popular-card')) {
    const title = card.querySelector('.popular-title')
    entries.push({
      label: title.textContent.trim(),
      type: 'Popular cookie',
      text: card.textContent,
      target: card,
    })
  }

  return entries
}

function search(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  return buildIndex()
    .filter((entry) => {
      const haystack = `${entry.label} ${entry.text}`.toLowerCase()
      return words.every((word) => haystack.includes(word))
    })
    .map((entry) => ({
      ...entry,
      // Matches in the title rank above matches in the body text
      score: words.every((w) => entry.label.toLowerCase().includes(w)) ? 0 : 1,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)
}

function showResults() {
  const query = input.value.trim()
  results.replaceChildren()
  if (!query) return

  const matches = search(query)

  if (matches.length === 0) {
    const empty = document.createElement('li')
    empty.className = 'search-empty'
    empty.textContent = `No matches for "${query}".`
    results.append(empty)
    return
  }

  for (const match of matches) {
    const li = document.createElement('li')
    const link = document.createElement('a')
    link.href = '#'
    const label = document.createElement('span')
    label.textContent = match.label
    const type = document.createElement('span')
    type.className = 'search-type'
    type.textContent = match.type
    link.append(label, type)

    link.addEventListener('click', (event) => {
      event.preventDefault()
      goTo(match.target)
    })

    li.append(link)
    results.append(li)
  }
}

function goTo(target) {
  closeSearch()
  if (target.tagName === 'DETAILS') target.open = true

  const isSection = target.matches('section')
  target.scrollIntoView({
    behavior: 'smooth',
    block: isSection ? 'start' : 'center',
  })

  target.classList.add('search-hit')
  setTimeout(() => target.classList.remove('search-hit'), 2000)
}

function openSearch() {
  panel.classList.add('open')
  toggle.setAttribute('aria-expanded', 'true')
  setTimeout(() => input.focus(), 50)
}

function closeSearch() {
  panel.classList.remove('open')
  toggle.setAttribute('aria-expanded', 'false')
  toggle.focus()
}

toggle.addEventListener('click', () => {
  panel.classList.contains('open') ? closeSearch() : openSearch()
})

input.addEventListener('input', showResults)

input.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeSearch()
  if (event.key === 'Enter') {
    const first = results.querySelector('a')
    if (first) first.click()
  }
})