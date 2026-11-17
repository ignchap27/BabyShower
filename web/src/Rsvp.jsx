import { useState } from 'react'
import { supabase } from './supabase.js'
import Regalos from './Regalos.jsx'

const A = '/assets'
const AMAZON = 'https://www.amazon.com/baby-reg/homepage'
const SENT_KEY = 'rsvp-enviado'

// Guarda { attending, gift }; versiones viejas guardaban 'si' / 'no'.
const readSent = () => {
  try {
    const raw = localStorage.getItem(SENT_KEY)
    if (!raw) return null
    if (raw === 'si' || raw === 'no') return { attending: raw === 'si', gift: null }
    return JSON.parse(raw)
  } catch { return null }
}

export default function Rsvp({ onBack }) {
  const [sent, setSent] = useState(readSent)
  const [step, setStep] = useState('form')
  const [draft, setDraft] = useState({ name: '', song: '' })
  const [attending, setAttending] = useState(null)
  const [gift, setGift] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function save(row) {
    setStatus('sending')
    setError('')
    const { error: dbError } = supabase
      ? await supabase.from('rsvps').insert(row)
      : { error: new Error('Supabase no configurado') }
    setStatus('idle')
    if (dbError) {
      setError('No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo otra vez.')
      return
    }
    const result = { attending: row.attending, gift: row.gift_category }
    try { localStorage.setItem(SENT_KEY, JSON.stringify(result)) } catch { /* modo privado */ }
    setSent(result)
    window.scrollTo(0, 0)
  }

  function submitForm(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const next = { name: form.get('name').trim(), song: form.get('song').trim() }
    if (!next.name) return setError('Escribe tu nombre.')
    setDraft(next)
    if (attending) {
      setError('')
      setStep('regalos')
      window.scrollTo(0, 0)
      return
    }
    save({ name: next.name, attending: false, song: next.song || null, gift_category: null })
  }

  function submitGift(e) {
    e.preventDefault()
    save({ name: draft.name, attending: true, song: draft.song || null, gift_category: gift })
  }

  if (sent) {
    return (
      <main className="page page--rsvp">
        <section className="tarjeta tarjeta--gracias">
          <h1 className="titulo">¡Gracias!</h1>
          <p className="gotica gotica--md">
            {sent.attending
              ? '¡Nos vemos en el pantano el sábado 12 de diciembre!'
              : 'Te vamos a extrañar. ¡Gracias por tus buenos deseos!'}
          </p>
          {sent.attending && (
            <>
              <h2 className="subtitulo">Así va la lista de regalos</h2>
              <Regalos selected={sent.gift} readOnly />
            </>
          )}
          <button type="button" className="boton" onClick={onBack}>Ver la invitación</button>
        </section>
        <img className="rsvp-escena" src={`${A}/personajes/lobo-pinocho-cerditos.png`} alt="" />
      </main>
    )
  }

  if (step === 'regalos') {
    return (
      <main className="page page--rsvp">
        <form className="tarjeta" onSubmit={submitGift}>
          <h1 className="titulo">Elige tu regalo</h1>
          <p className="intro">
            Mira qué categorías tienen menos regalos y elige una para ayudar a completar la lista.
          </p>

          <fieldset className="campo">
            <legend className="sr-only">Categoría de regalo</legend>
            <Regalos selected={gift} onSelect={setGift} />
          </fieldset>

          <p className="nota">
            Si deseas más inspiración,{' '}
            <a href={AMAZON} target="_blank" rel="noreferrer">acá hay muchas opciones</a>.
          </p>

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit" className="boton boton--ancho" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Confirmar'}
          </button>
          <button type="button" className="volver" onClick={() => { setError(''); setStep('form') }}>← Atrás</button>
        </form>

        <img className="rsvp-escena" src={`${A}/personajes/ratones-ciegos.png`} alt="" />
      </main>
    )
  }

  return (
    <main className="page page--rsvp">
      <form className="tarjeta" onSubmit={submitForm}>
        <h1 className="titulo">Asistencia</h1>

        <label className="campo">
          <span>Tu nombre</span>
          <input name="name" required maxLength={80} autoComplete="name" defaultValue={draft.name} />
        </label>

        <fieldset className="campo">
          <legend>¿Vas a venir?</legend>
          <label className="opcion">
            <input type="radio" name="attending" value="si" required checked={attending === true} onChange={() => setAttending(true)} />
            <span>¡Completamente, no me lo perdería!</span>
          </label>
          <label className="opcion">
            <input type="radio" name="attending" value="no" checked={attending === false} onChange={() => setAttending(false)} />
            <span>Esta vez no puedo, pero les deseo lo mejor.</span>
          </label>
        </fieldset>

        <label className="campo">
          <span>¡Sugiere una canción!</span>
          <input name="song" maxLength={120} placeholder="Opcional" defaultValue={draft.song} />
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" className="boton boton--ancho" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : attending ? 'Continuar' : 'Enviar'}
        </button>
        <button type="button" className="volver" onClick={onBack}>← Volver a la invitación</button>
      </form>

      <img className="rsvp-escena" src={`${A}/personajes/${attending ? 'ratones-ciegos' : 'lobo-pinocho-cerditos'}.png`} alt="" />
    </main>
  )
}
