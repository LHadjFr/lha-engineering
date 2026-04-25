import express from 'express'
import { Resend } from 'resend'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRootDir = path.resolve(__dirname, '..')
const submissionsDir = path.join(__dirname, 'submissions')
const distDir = path.join(projectRootDir, 'dist')
const distIndexPath = path.join(distDir, 'index.html')
const canServeFrontend = existsSync(distIndexPath)
const app = express()
const port = Number(process.env.PORT || process.env.API_PORT || 8787)
const minSubmitTimeMs = Number(process.env.CONTACT_MIN_SUBMIT_TIME_MS || 4000)
const rateLimitWindowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000)
const rateLimitMax = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5)
const rateLimitStore = new Map()

app.set('trust proxy', true)

app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/contact', async (req, res) => {
  const { name, email, company, subject, message, website, formStartedAt } = req.body ?? {}
  const requesterIp = getRequesterIp(req)

  if (!passesRateLimit(requesterIp)) {
    return res.status(429).json({
      ok: false,
      error: 'Trop de tentatives détectées. Merci de patienter quelques minutes avant de réessayer.',
    })
  }

  if (typeof website === 'string' && website.trim() !== '') {
    return res.status(400).json({
      ok: false,
      error: 'Soumission rejetée par la protection anti-spam.',
    })
  }

  const startedAt = Number(formStartedAt)

  if (!Number.isFinite(startedAt) || Date.now() - startedAt < minSubmitTimeMs) {
    return res.status(400).json({
      ok: false,
      error: 'Soumission trop rapide détectée. Merci de reprendre le formulaire.',
    })
  }

  if (!isNonEmptyString(name) || !isEmail(email) || !isNonEmptyString(subject) || !isNonEmptyString(message)) {
    return res.status(400).json({
      ok: false,
      error: 'Merci de renseigner un nom, un email valide, un sujet et un message.',
    })
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    company: typeof company === 'string' ? company.trim() : '',
    subject: subject.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
    requesterIp,
  }

  try {
    if (isMailTransportConfigured()) {
      try {
        await sendEmail(payload)
        return res.json({ ok: true, mode: 'email' })
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.error('Email send failed, falling back to local storage:', errorMessage)

        if (errorMessage.includes('domain is not verified')) {
          console.error('Resend domain is not verified. Verify DNS records in Resend before using a custom sender domain.')
        }

        await saveSubmission({
          ...payload,
          deliveryFallback: true,
          deliveryError: errorMessage,
        })

        return res.json({
          ok: true,
          mode: 'stored',
          warning: 'Envoi email temporairement indisponible. Message enregistré côté serveur.',
        })
      }
    }

    await saveSubmission(payload)
    return res.json({ ok: true, mode: 'stored' })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({
      ok: false,
      error: 'Une erreur est survenue lors de l\'envoi. Merci de réessayer plus tard.',
    })
  }
})

if (canServeFrontend) {
  app.use(express.static(distDir))

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next()
    }

    return res.sendFile(distIndexPath)
  })
}

app.listen(port, '0.0.0.0', () => {
  console.log(`LHA contact API listening on http://0.0.0.0:${port}`)

  if (isMailTransportConfigured()) {
    console.log('Email transport configured (Resend API): contact messages will be sent by email.')
  } else {
    console.log('Email transport not configured: contact messages will be stored on disk.')
  }
})

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isMailTransportConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.SMTP_FROM &&
      process.env.CONTACT_TO,
  )
}

function getRequesterIp(req) {
  const forwarded = req.headers['x-forwarded-for']

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }

  return req.ip || req.socket.remoteAddress || 'unknown'
}

function passesRateLimit(ipAddress) {
  const now = Date.now()
  const timestamps = rateLimitStore.get(ipAddress) ?? []
  const freshTimestamps = timestamps.filter((timestamp) => now - timestamp <= rateLimitWindowMs)

  if (freshTimestamps.length >= rateLimitMax) {
    rateLimitStore.set(ipAddress, freshTimestamps)
    return false
  }

  freshTimestamps.push(now)
  rateLimitStore.set(ipAddress, freshTimestamps)
  return true
}

async function sendEmail(payload) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_TO,
    reply_to: payload.email,
    subject: `[LHA Engineering] ${payload.subject}`,
    text: [
      `Nom: ${payload.name}`,
      `Email: ${payload.email}`,
      `Société: ${payload.company || 'Non renseignée'}`,
      '',
      payload.message,
    ].join('\n'),
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}

async function saveSubmission(payload) {
  await mkdir(submissionsDir, { recursive: true })
  const fileName = `${Date.now()}-${slugify(payload.name)}.json`
  await writeFile(path.join(submissionsDir, fileName), `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}
