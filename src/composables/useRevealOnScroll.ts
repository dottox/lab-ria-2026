import { onBeforeUnmount, onMounted } from 'vue'

interface RevealOnScrollOptions {
  threshold?: number
  rootMargin?: string
}

export function useRevealOnScroll(
  selector = '.reveal-on-scroll',
  options: RevealOnScrollOptions = {},
) {
  let observer: IntersectionObserver | null = null

  const observeElements = () => {
    observer?.disconnect()

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter(element => !element.classList.contains('is-visible'))

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(element => element.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -80px 0px',
      },
    )

    elements.forEach(element => observer?.observe(element))
  }

  onMounted(observeElements)

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    refreshRevealElements: observeElements,
  }
}
