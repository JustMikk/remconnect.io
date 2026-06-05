'use client'
import { useEffect } from 'react'

/**
 * Port of the prototype's landing.js. All interactions are wired by
 * querySelector after mount — mirroring the original vanilla script so the
 * markup components can stay static/server-rendered.
 */
export default function LandingScripts() {
  useEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cleanups: Array<() => void> = []

    /* ---- Nav scroll state ---- */
    const nav = document.getElementById('lpNav')
    const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    cleanups.push(() => window.removeEventListener('scroll', onScroll))

    /* ---- Mobile menu ---- */
    const mobile = document.getElementById('lpMobile')
    const closeMobile = () => {
      mobile?.classList.remove('open')
      document.body.style.overflow = ''
    }
    const openMobile = () => {
      mobile?.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
    const burger = document.getElementById('lpBurger')
    const mobileClose = document.getElementById('lpMobileClose')
    burger?.addEventListener('click', openMobile)
    mobileClose?.addEventListener('click', closeMobile)
    // Close (and restore body scroll) on any mobile nav tap — including the
    // /apply Link, so the overflow:hidden lock never carries into the next route.
    mobile?.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', closeMobile))
    cleanups.push(() => {
      burger?.removeEventListener('click', openMobile)
      mobileClose?.removeEventListener('click', closeMobile)
    })

    /* ---- Smooth anchor scroll ---- */
    const scrollHandlers: Array<{ el: Element; fn: (e: Event) => void }> = []
    document.querySelectorAll('[data-scroll]').forEach((a) => {
      const fn = (e: Event) => {
        const id = a.getAttribute('data-scroll')
        const t = id && document.getElementById(id)
        if (t) {
          e.preventDefault()
          window.scrollTo({ top: t.offsetTop - 90, behavior: 'smooth' })
        }
      }
      a.addEventListener('click', fn)
      scrollHandlers.push({ el: a, fn })
    })
    cleanups.push(() => scrollHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn)))

    /* ---- Count-up ---- */
    function countUp(el: HTMLElement) {
      const target = parseFloat(el.dataset.count || '0')
      const dur = 1500
      const start = performance.now()
      function frame(now: number) {
        const p = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.round(target * eased).toLocaleString()
        if (p < 1) requestAnimationFrame(frame)
        else el.textContent = target.toLocaleString()
      }
      requestAnimationFrame(frame)
    }

    /* ---- Reveal + count + bar fills ---- */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('in')
          el.querySelectorAll<HTMLElement>('[data-count]').forEach((c) => {
            if (!c.dataset.done) {
              c.dataset.done = '1'
              countUp(c)
            }
          })
          el.querySelectorAll<HTMLElement>('[data-fill]').forEach((b) => {
            const s = b.querySelector('span')
            if (s && !b.dataset.done) {
              b.dataset.done = '1'
              requestAnimationFrame(() => {
                s.style.width = b.dataset.fill + '%'
              })
            }
          })
          io.unobserve(el)
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal, [data-fill], [data-count]').forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())

    function revealInView() {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.95) el.classList.add('in')
      })
    }
    requestAnimationFrame(revealInView)
    const revealTimer = window.setTimeout(revealInView, 1400)
    cleanups.push(() => window.clearTimeout(revealTimer))

    /* ---- Timeline stagger + line fill ---- */
    const tio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('in')
          e.target.querySelectorAll('.lp-tstep').forEach((s, i) =>
            window.setTimeout(() => s.classList.add('in'), i * 240)
          )
          tio.unobserve(e.target)
        }),
      { threshold: 0.3 }
    )
    document.querySelectorAll('.lp-timeline').forEach((t) => tio.observe(t))
    cleanups.push(() => tio.disconnect())

    /* ---- Cohort capacity bar ---- */
    const cohortIo = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          const bar = e.target.querySelector<HTMLElement>('.lp-cohort-bar span')
          if (bar) requestAnimationFrame(() => { bar.style.width = bar.dataset.fill + '%' })
          cohortIo.unobserve(e.target)
        }),
      { threshold: 0.4 }
    )
    document.querySelectorAll('.lp-cohort').forEach((c) => cohortIo.observe(c))
    cleanups.push(() => cohortIo.disconnect())

    /* ---- Requirements checklist ---- */
    const rio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.querySelectorAll('.lp-req').forEach((r, i) =>
            window.setTimeout(() => r.classList.add('in'), 160 + i * 240)
          )
          rio.unobserve(e.target)
        }),
      { threshold: 0.22 }
    )
    document.querySelectorAll('.lp-req-list').forEach((l) => rio.observe(l))
    cleanups.push(() => rio.disconnect())

    /* ---- Profile skill bars ---- */
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.querySelectorAll<HTMLElement>('.lp-cs-bar').forEach((b, i) => {
            const s = b.querySelector('span')
            window.setTimeout(() => {
              if (s) s.style.width = b.dataset.skill + '%'
            }, 250 + i * 150)
          })
          cio.unobserve(e.target)
        }),
      { threshold: 0.4 }
    )
    document.querySelectorAll('.lp-profile-skills').forEach((s) => cio.observe(s))
    cleanups.push(() => cio.disconnect())

    /* ---- FAQ accordion ---- */
    const faqHandlers: Array<{ el: Element; fn: () => void }> = []
    document.querySelectorAll('.lp-faq-q').forEach((q) => {
      const fn = () => {
        const item = q.closest('.lp-faq-item') as HTMLElement
        const ans = item.querySelector('.lp-faq-a') as HTMLElement
        const open = item.classList.contains('open')
        item.parentElement?.querySelectorAll('.lp-faq-item.open').forEach((o) => {
          if (o !== item) {
            o.classList.remove('open')
            const oa = o.querySelector('.lp-faq-a') as HTMLElement
            if (oa) oa.style.maxHeight = ''
          }
        })
        if (open) {
          item.classList.remove('open')
          ans.style.maxHeight = ''
        } else {
          item.classList.add('open')
          ans.style.maxHeight = ans.scrollHeight + 'px'
        }
      }
      q.addEventListener('click', fn)
      faqHandlers.push({ el: q, fn })
    })
    cleanups.push(() => faqHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn)))

    /* ---- Success stories horizontal scroll ---- */
    const sc = document.getElementById('lpStoriesScroll')
    if (sc) {
      const step = 404
      const prev = document.getElementById('lpStoriesPrev')
      const next = document.getElementById('lpStoriesNext')
      const onPrev = () => sc.scrollBy({ left: -step, behavior: 'smooth' })
      const onNext = () => sc.scrollBy({ left: step, behavior: 'smooth' })
      prev?.addEventListener('click', onPrev)
      next?.addEventListener('click', onNext)
      cleanups.push(() => {
        prev?.removeEventListener('click', onPrev)
        next?.removeEventListener('click', onNext)
      })
    }

    /* ---- Video facade ---- */
    const vw = document.getElementById('lpVideo')
    const onVideo = () => {
      if (vw)
        vw.innerHTML =
          '<iframe src="https://www.youtube-nocookie.com/embed/' +
          vw.dataset.yt +
          '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'
    }
    vw?.addEventListener('click', onVideo)
    cleanups.push(() => vw?.removeEventListener('click', onVideo))

    /* ---- Stacked CTA reveal ---- */
    const stack = document.getElementById('lpStack')
    if (stack) {
      const sObs = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return
            stack.querySelectorAll<HTMLElement>('.lp-stack-layer').forEach((layer) => {
              const d = parseInt(layer.dataset.layer || '0', 10)
              layer.style.opacity = (1 - d * 0.18).toFixed(2)
              layer.style.transform = `translate(${d * -20}px, ${d * 16}px)`
            })
            sObs.unobserve(stack)
          }),
        { threshold: 0.25 }
      )
      sObs.observe(stack)
      cleanups.push(() => sObs.disconnect())
    }

    /* ---- Hero background subtle parallax ---- */
    const media = document.querySelector<HTMLImageElement>('.lp-hero-bg img')
    const heroEl = document.querySelector<HTMLElement>('.lp-hero')
    if (media && heroEl && !reduce) {
      const onMove = (ev: MouseEvent) => {
        const r = heroEl.getBoundingClientRect()
        const x = (ev.clientX - r.left) / r.width - 0.5
        const y = (ev.clientY - r.top) / r.height - 0.5
        media.style.transform = `scale(1.07) translate(${-x * 1.6}%, ${-y * 1.6}%)`
      }
      const onLeave = () => {
        media.style.transform = 'scale(1.04)'
      }
      heroEl.addEventListener('mousemove', onMove)
      heroEl.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        heroEl.removeEventListener('mousemove', onMove)
        heroEl.removeEventListener('mouseleave', onLeave)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return null
}
