const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealRoots = document.querySelectorAll('body > header, body > main, body > footer')

if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('scroll-reveal-enabled')

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      } else {
        entry.target.classList.remove('is-visible')
      }
    }
  }, { threshold: 0.05 })

  function observeTree(root) {
    root.setAttribute('data-scroll-reveal', '')
    observer.observe(root)

    for (const element of root.querySelectorAll('*')) {
      element.setAttribute('data-scroll-reveal', '')
      observer.observe(element)
    }
  }

  for (const root of revealRoots) {
    observeTree(root)
  }

  const main = document.querySelector('main')
  const additionsObserver = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element) {
          observeTree(node)
        }
      }
    }
  })

  additionsObserver.observe(main, { childList: true, subtree: true })
}
