const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

for (const item of document.querySelectorAll('.faq-item')) {
  const summary = item.querySelector('summary')

  // Wrap everything after the question in a container we can animate.
  const answer = document.createElement('div')
  answer.className = 'faq-answer'
  const inner = document.createElement('div')
  inner.className = 'faq-answer-inner'
  while (summary.nextSibling) inner.append(summary.nextSibling)
  answer.append(inner)
  item.append(answer)

  if (item.open) item.classList.add('expanded')

  summary.addEventListener('click', (event) => {
    event.preventDefault()

    if (reduceMotion.matches) {
      item.open = !item.open
      item.classList.toggle('expanded', item.open)
      return
    }

    if (item.classList.contains('expanded')) {
      item.classList.remove('expanded')   // slide shut; closed for real in transitionend
    } else {
      item.open = true
      answer.offsetHeight                 // lets the browser register the 0 height first
      item.classList.add('expanded')
    }
  })

  // Once the slide-shut finishes, actually close the <details>.
  answer.addEventListener('transitionend', (event) => {
    if (event.target === answer && !item.classList.contains('expanded')) {
      item.open = false
    }
  })

  // Covers other ways of opening, like clicking a search result.
  item.addEventListener('toggle', () => {
    if (item.open) item.classList.add('expanded')
  })
}