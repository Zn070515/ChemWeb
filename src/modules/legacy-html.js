const ROUTE_MAP = [
  { match: /\/index\.html$/i, replace: '/' },
  { match: /\/knowledge\.html$/i, replace: '/knowledge' },
  { match: /\/knowledge\/knowledge\.html$/i, replace: '/knowledge' },
  { match: /\/elements\.html$/i, replace: '/elements' },
  { match: /\/elements\/elements\.html$/i, replace: '/elements' },
  { match: /\/elements\/detail\.html$/i, replace: '/elements/detail' },
  { match: /\/calculation\.html$/i, replace: '/calculation' },
  { match: /\/calculation\/calculation\.html$/i, replace: '/calculation' },
  { match: /\/calculation\/balancing\.html$/i, replace: '/calculation/balancing' },
  { match: /\/extension\.html$/i, replace: '/extension' },
  { match: /\/extension\/extension\.html$/i, replace: '/extension' },
  { match: /\/extension\/extension-reading\.html$/i, replace: '/extension/reading' },
  { match: /\/ketcher\/ketcher\.html$/i, replace: '/ketcher' }
]

const normalizeRouteLink = (href) => {
  if (!href || href.startsWith('#') || href.startsWith('mailto:')) {
    return href
  }

  try {
    const url = new URL(href, 'https://local.base')
    if (url.origin !== 'https://local.base') {
      return href
    }
    const pathname = url.pathname
    for (const rule of ROUTE_MAP) {
      if (rule.match.test(pathname)) {
        return rule.replace
      }
    }
    return href
  } catch (error) {
    return href
  }
}

const sanitizeDocument = (doc) => {
  doc.querySelectorAll('nav.site-nav, footer.site-footer').forEach((el) => el.remove())
  doc.querySelectorAll('script').forEach((el) => el.remove())

  doc.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href')
    const normalized = normalizeRouteLink(href)
    if (normalized && normalized !== href) {
      anchor.setAttribute('href', normalized)
    }
  })
}

export const loadLegacyHtml = async (path) => {
  const response = await fetch(path, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to load legacy content: ${response.status}`)
  }

  const html = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  sanitizeDocument(doc)

  return doc.body.innerHTML
}
