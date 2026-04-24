import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Cpu,
  ExternalLink,
  Mail,
  Menu,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { certifications, labels, references, type Label, type LabelAccent, type LabelIcon } from './site-data'

const logo = '/LHA-ENGINEERING Binary.png'

const iconMap = {
  shield: ShieldCheck,
  compass: Compass,
  cpu: Cpu,
} satisfies Record<LabelIcon, typeof ShieldCheck>

const accentStyles: Record<
  LabelAccent,
  {
    border: string
    text: string
    badge: string
    button: string
    iconBox: string
    ring: string
  }
> = {
  amber: {
    border: 'border-amber-400/40 hover:border-amber-300/80',
    text: 'text-amber-300',
    badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    button: 'border-amber-400/40 text-amber-300 hover:border-amber-300 hover:bg-amber-400/10',
    iconBox: 'bg-amber-400/15 text-amber-400',
    ring: 'ring-amber-400/20',
  },
  blue: {
    border: 'border-blue-500/25 hover:border-blue-400/70',
    text: 'text-blue-300',
    badge: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    button: 'border-blue-500/30 text-blue-300 hover:border-blue-400 hover:bg-blue-500/10',
    iconBox: 'bg-blue-500/15 text-blue-400',
    ring: 'ring-blue-500/20',
  },
}

type ContactFormValues = {
  name: string
  email: string
  company: string
  subject: string
  message: string
  website: string
}

const initialContactForm: ContactFormValues = {
  name: '',
  email: '',
  company: '',
  subject: '',
  message: '',
  website: '',
}

function App() {
  return (
    <>
      <ScrollManager />
      <div className="min-h-screen bg-slate-950 font-['Inter',sans-serif] text-slate-300 selection:bg-amber-400/20 selection:text-amber-100">
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_18%_22%,_rgba(245,158,11,0.14),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#020617_35%,_#0b1120_100%)]" />
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />
        <SiteHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/labels/:labelId" element={<LabelPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </>
  )
}

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1))

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }

      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname, location.hash])

  return null
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="shrink-0 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-2 shadow-[0_18px_60px_rgba(2,6,23,0.35)]"
        >
          <img src={logo} alt="LHA Engineering" className="h-9 w-auto object-contain sm:h-10" />
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          <li>
            <SectionLink toHash="#expertise">Expertise</SectionLink>
          </li>
          <li>
            <SectionLink toHash="#labels">Nos Labels</SectionLink>
          </li>
          <li>
            <SectionLink
              toHash="#contact"
              className="rounded-lg border border-amber-400 px-4 py-2 font-semibold text-amber-400 transition-all hover:bg-amber-400 hover:text-slate-950"
            >
              Contact
            </SectionLink>
          </li>
        </ul>

        <button
          type="button"
          className="text-slate-300 transition-colors hover:text-white md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-slate-800 bg-slate-950 px-6 py-4 text-sm font-medium md:hidden">
          <SectionLink toHash="#expertise" onNavigate={() => setMenuOpen(false)}>
            Expertise
          </SectionLink>
          <SectionLink toHash="#labels" onNavigate={() => setMenuOpen(false)}>
            Nos Labels
          </SectionLink>
          <SectionLink toHash="#contact" onNavigate={() => setMenuOpen(false)} className="font-semibold text-amber-400">
            Contact
          </SectionLink>
        </div>
      )}
    </header>
  )
}

function SectionLink({
  toHash,
  children,
  className,
  onNavigate,
}: {
  toHash: `#${string}`
  children: string
  className?: string
  onNavigate?: () => void
}) {
  return (
    <Link
      to={`/${toHash}`}
      onClick={onNavigate}
      className={className ?? 'transition-colors hover:text-amber-400'}
    >
      {children}
    </Link>
  )
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <LabelsPreview />
      <TrustSection />
      <ContactSection />
    </>
  )
}

function HeroSection() {
  return (
    <section id="expertise" className="relative overflow-hidden px-4 pb-28 pt-36 sm:px-6 sm:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="text-center lg:text-left">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
            Systèmes critiques · DO-178 · Safety
          </span>

          <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            L'Ingénierie des Systèmes Critiques&nbsp;:&nbsp;
            <span className="text-amber-400">Rigueur</span>,{' '}
            <span className="text-amber-400">Certification</span> &amp; <span className="text-blue-400">Innovation</span>.
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
            Expert des environnements critiques depuis plus de 20 ans (A380, Rafale, Egnos), je sécurise le cycle de vie de vos logiciels de haute intégrité. Avec LHA Engineering,
            j'accompagne vos ambitions industrielles sur trois piliers&nbsp;: la <span className="font-medium text-amber-400">garantie de certification (DO-178)</span>,
            l'excellence technique par le coaching <span className="font-medium text-blue-400">(Software Craftsmanship &amp; IA)</span> et le développement de solutions sur-mesure,
            du bas-niveau à la mobilité. Mon engagement&nbsp;: transformer la contrainte normative en un levier de performance et d'innovation.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <SectionLink
              toHash="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition-colors hover:bg-amber-300"
            >
              Discuter de votre projet
            </SectionLink>
            <SectionLink
              toHash="#labels"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-slate-200 transition-colors hover:border-blue-500/60 hover:text-blue-300"
            >
              Découvrir les labels
            </SectionLink>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            <StatCard title="20+ ans" text="d'expérience dans les environnements critiques" />
            <StatCard title="3 labels" text="pour certification, coaching et delivery" />
            <StatCard title="A à D" text="couverture des niveaux d'intégrité DAL" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_46%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),_transparent_38%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">LHA Engineering</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">Consulting high-integrity software</p>
              </div>
              <img src={logo} alt="LHA Engineering" className="h-12 w-auto object-contain" />
            </div>

            <div className="grid gap-4">
              {certifications.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-white/[0.03] px-4 py-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pilier {index + 1}</p>
                    <p className="mt-1 text-base font-semibold text-slate-100">{item}</p>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-amber-400 to-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.55)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-4 text-left backdrop-blur-sm">
      <p className="text-2xl font-bold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{text}</p>
    </div>
  )
}

function LabelsPreview() {
  return (
    <section id="labels" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Nos 3 Labels</h2>
          <p className="mx-auto max-w-xl text-slate-400">
            Trois offres complémentaires pour couvrir l'intégralité de vos besoins en ingénierie logicielle critique.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {labels.map((label) => (
            <LabelCard key={label.id} label={label} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LabelCard({ label }: { label: Label }) {
  const Icon = iconMap[label.icon]
  const styles = accentStyles[label.accent]

  return (
    <article
      className={[
        'group relative flex flex-col gap-4 overflow-hidden rounded-[1.75rem] border bg-white/5 p-8 backdrop-blur-sm transition-colors',
        styles.border,
      ].join(' ')}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
      <div className={['flex h-12 w-12 items-center justify-center rounded-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]', styles.iconBox].join(' ')}>
        <Icon size={26} />
      </div>
      <h3 className="text-lg font-bold text-white">{label.title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{label.summary}</p>
      <p className={['inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider', styles.text].join(' ')}>
        {label.subtitle}
      </p>
      <div className="mt-auto pt-4">
        <Link
          to={`/labels/${label.id}`}
          className={['inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors', styles.button].join(' ')}
        >
          Voir les détails
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

function LabelPage() {
  const { labelId } = useParams()
  const label = labels.find((entry) => entry.id === labelId)

  if (!label) {
    return <NotFoundPage />
  }

  const Icon = iconMap[label.icon]
  const styles = accentStyles[label.accent]
  const relatedLabels = labels.filter((entry) => entry.id !== label.id)

  return (
    <>
      <section className="px-4 pb-18 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <Link to="/#labels" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white">
            <ArrowLeft size={16} />
            Retour aux labels
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_340px]">
            <article className="overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/75 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.4)] backdrop-blur-xl sm:p-10">
              <span className={['inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]', styles.badge].join(' ')}>
                <Icon size={16} />
                Label dédié
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{label.title}</h1>
              <p className={['mt-4 text-lg font-semibold', styles.text].join(' ')}>{label.subtitle}</p>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400">{label.intro}</p>

              <div className="mt-10 grid gap-4">
                {label.details.map((detail) => (
                  <div key={detail.title} className="rounded-[1.5rem] border border-slate-800/80 bg-white/[0.03] p-5 transition-colors hover:border-slate-700">
                    <h2 className="text-base font-semibold text-white">{detail.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{detail.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <SectionLink
                  toHash="#contact"
                  className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300"
                >
                  Prendre contact pour ce label
                </SectionLink>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-blue-500/60 hover:text-blue-300"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </article>

            <aside className="space-y-5">
              <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/75 p-6 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Autres labels</p>
                <div className="mt-5 grid gap-4">
                  {relatedLabels.map((entry) => {
                    const RelatedIcon = iconMap[entry.icon]
                    const relatedStyles = accentStyles[entry.accent]

                    return (
                      <Link
                        key={entry.id}
                        to={`/labels/${entry.id}`}
                        className={['block rounded-[1.5rem] border p-4 transition-colors', relatedStyles.border, relatedStyles.ring].join(' ')}
                      >
                        <div className="flex items-start gap-3">
                          <div className={['mt-1 flex h-10 w-10 items-center justify-center rounded-xl', relatedStyles.iconBox].join(' ')}>
                            <RelatedIcon size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{entry.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-400">{entry.subtitle}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/70 p-6 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Références</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {references.map((ref) => (
                    <span key={ref} className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold tracking-wide text-slate-300">
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}

function TrustSection() {
  return (
    <section className="border-t border-slate-800/80 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Références &amp; Domaines d'intervention</p>
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {references.map((ref) => (
            <span key={ref} className="rounded-full border border-slate-700 bg-slate-800/60 px-5 py-2 text-sm font-semibold tracking-wide text-slate-300">
              {ref}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <p className="mb-3 w-full text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Agilité à l'échelle</p>
          {['SAFe', 'PSM I'].map((label) => (
            <span key={label} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="border-t border-slate-800/80 px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_minmax(0,1.1fr)]">
        <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/70 p-8 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Contact</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Parlons de votre projet</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            Utilisez ce formulaire pour décrire votre besoin. Le message est transmis via l'API de contact et peut être relayé par SMTP en production ou enregistré localement en environnement de travail.
          </p>

          <div className="mt-8 space-y-4 text-sm text-slate-400">
            <a href="mailto:contact@lha-engineering.fr" className="flex items-center gap-3 transition-colors hover:text-amber-400">
              <Mail size={18} />
              contact@lha-engineering.fr
            </a>
            <a href="https://www.lha-engineering.fr" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors hover:text-white">
              <ExternalLink size={18} />
              lha-engineering.fr
            </a>
            <a href="https://www.lha-engineering.fr" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors hover:text-blue-300">
              <ExternalLink size={18} />
              lha-engineering.fr
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}

function ContactForm() {
  const [values, setValues] = useState(initialContactForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now())

  useEffect(() => {
    setFormStartedAt(Date.now())
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setFeedback('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          formStartedAt,
        }),
      })

      const contentType = response.headers.get('content-type') ?? ''
      const rawPayload = await response.text()
      let payload: { ok: boolean; mode?: string; error?: string } | null = null

      if (rawPayload.trim().length > 0) {
        try {
          payload = JSON.parse(rawPayload) as { ok: boolean; mode?: string; error?: string }
        } catch {
          if (contentType.includes('text/html')) {
            throw new Error('L\'API de contact n\'est pas disponible sur ce déploiement.')
          }

          throw new Error('La reponse du serveur est invalide. Merci de reessayer.')
        }
      }

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'Impossible d\'envoyer votre message pour le moment.')
      }

      setValues(initialContactForm)
      setFormStartedAt(Date.now())
      setStatus('success')
      setFeedback(
        payload.mode === 'email'
          ? 'Votre message a bien été envoyé.'
          : 'Votre message a bien été enregistré. Configurez SMTP en production pour l’envoi email.',
      )
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Une erreur inattendue est survenue.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-800/80 bg-slate-950/75 p-8 shadow-[0_28px_60px_rgba(2,6,23,0.32)] backdrop-blur-xl">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => setValues((current) => ({ ...current, website: event.target.value }))}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nom" htmlFor="name">
          <input
            id="name"
            required
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-amber-400/60"
            placeholder="Votre nom"
          />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-amber-400/60"
            placeholder="vous@entreprise.fr"
          />
        </FormField>

        <FormField label="Société" htmlFor="company">
          <input
            id="company"
            value={values.company}
            onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-amber-400/60"
            placeholder="Nom de votre société"
          />
        </FormField>

        <FormField label="Sujet" htmlFor="subject">
          <input
            id="subject"
            required
            value={values.subject}
            onChange={(event) => setValues((current) => ({ ...current, subject: event.target.value }))}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-amber-400/60"
            placeholder="Certification, coaching, développement..."
          />
        </FormField>

        <FormField label="Message" htmlFor="message" className="sm:col-span-2">
          <textarea
            id="message"
            required
            rows={6}
            value={values.message}
            onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-amber-400/60"
            placeholder="Décrivez votre besoin, vos contraintes, votre contexte et le niveau d'intégrité attendu."
          />
        </FormField>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-6 text-sm">
          {feedback && (
            <p className={status === 'error' ? 'text-rose-300' : 'text-emerald-300'}>{feedback}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send size={16} />
          {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </div>
    </form>
  )
}

function FormField({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  className?: string
}) {
  return (
    <label htmlFor={htmlFor} className={className}>
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-slate-800/80 bg-slate-950/75 p-8 text-sm text-slate-500 shadow-[0_28px_60px_rgba(2,6,23,0.32)] backdrop-blur-xl lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <img src={logo} alt="LHA Engineering" className="h-14 w-auto object-contain" />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
          <a href="mailto:contact@lha-engineering.fr" className="flex items-center gap-2 transition-colors hover:text-amber-400">
            <Mail size={15} />
            contact@lha-engineering.fr
          </a>
          <a href="https://www.lha-engineering.fr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition-colors hover:text-slate-300">
            lha-engineering.fr <ExternalLink size={12} />
          </a>
          <a href="https://www.lha-engineering.fr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition-colors hover:text-blue-400">
            lha-engineering.fr <ExternalLink size={12} />
          </a>
        </div>

        <span className="text-xs text-slate-600">© {new Date().getFullYear()} LHA Engineering</span>
      </div>
    </footer>
  )
}

function NotFoundPage() {
  return (
    <section className="px-4 pb-24 pt-36 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800/80 bg-slate-900/75 p-10 text-center backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">404</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Page introuvable</h1>
        <p className="mt-4 text-slate-400">La page demandée n'existe pas ou n'est plus disponible.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-blue-500/40 px-5 py-3 font-semibold text-blue-300 transition-colors hover:border-blue-400 hover:bg-blue-500/10">
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>
      </div>
    </section>
  )
}

export default App
