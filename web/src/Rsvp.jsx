import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const A = '/assets'
const AMAZON = 'https://www.amazon.com/baby-reg/homepage'
const SENT_KEY = 'rsvp-enviado'

const GIFTS = [
  'Esterilizadores, Biberones, Fabricantes de alimentos',
  'Contenedores de pañales, Cambiadores, Organizadores',
  'Carriolas y Asientos para Auto',
  'Centros de actividades, Columpios, Gimnasio, Portabebés, Mecedoras',
  'Asientos y tinas de baño, Juguetes de baño, Herramientas de aseo',
  'Seguridad y cuidado del bebé',
  'Juguetes, Mordedores, Libros',
  'Ropa de bebé (+3M) y accesorios',
  'Libre elección',
]

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = url && key ? createClient(url, key) : null

const readSent = () => {
  try { return localStorage.getItem(SENT_KEY) } catch { return null }
}

export default function Rsvp({ onBack }) {
  const [sent, setSent] = useState(readSent)
  const [attending, setAttending] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const row = {
      name: form.get('name').trim(),
      attending: form.get('attending') === 'si',
      song: form.get('song')?.trim() || null,
      gift_category: form.get('attending') === 'si' ? form.get('gift') : null,
    }
    if (!row.name) return setError('Escribe tu nombre.')

    setStatus('sending')
    setError('')
    const { error: dbError } = supabase
      ? await supabase.from('rsvps').insert(row)
      : { error: new Error('Supabase no configurado') }

    if (dbError) {
      setStatus('idle')
      setError('No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo otra vez.')
      return
    }
    const result = row.attending ? 'si' : 'no'
    try { localStorage.setItem(SENT_KEY, result) } catch { /* modo privado */ }
    setSent(result)
  }

  if (sent) {
    return (
      <main className="page page--rsvp">
        <section className="tarjeta tarjeta--gracias">
          <h1 className="titulo">¡Gracias!</h1>
          <p className="gotica gotica--md">
            {sent === 'si'
              ? '¡Nos vemos en el pantano el sábado 12 de diciembre!'
              : 'Te vamos a extrañar. ¡Gracias por tus buenos deseos!'}
          </p>
          <button type="button" className="boton" onClick={onBack}>Ver la invitación</button>
        </section>
        <img className="rsvp-escena" src={`${A}/personajes/lobo-pinocho-cerditos.png`} alt="" />
      </main>
    )
  }

  return (
    <main className="page page--rsvp">
      <form className="tarjeta" onSubmit={submit}>
        <h1 className="titulo">Asistencia</h1>

        <label className="campo">
          <span>Tu nombre</span>
          <input name="name" required maxLength={80} autoComplete="name" />
        </label>

        <fieldset className="campo">
          <legend>¿Vas a venir?</legend>
          <label className="opcion">
            <input type="radio" name="attending" value="si" required onChange={() => setAttending(true)} />
            <span>¡Completamente, no me lo perdería!</span>
          </label>
          <label className="opcion">
            <input type="radio" name="attending" value="no" onChange={() => setAttending(false)} />
            <span>Esta vez no puedo, pero les deseo lo mejor.</span>
          </label>
        </fieldset>

        <label className="campo">
          <span>¡Sugiere una canción!</span>
          <input name="song" maxLength={120} placeholder="Opcional" />
        </label>

        {attending && (
          <fieldset className="campo">
            <legend>Lista de regalos: ¿qué categoría te gustaría regalar?</legend>
            {GIFTS.map((g) => (
              <label className="opcion" key={g}>
                <input type="radio" name="gift" value={g} required />
                <span>{g}</span>
              </label>
            ))}
            <p className="nota">
              Si deseas más inspiración,{' '}
              <a href={AMAZON} target="_blank" rel="noreferrer">acá hay muchas opciones</a>.
            </p>
          </fieldset>
        )}

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" className="boton boton--ancho" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar'}
        </button>
        <button type="button" className="volver" onClick={onBack}>← Volver a la invitación</button>
      </form>

      <img className="rsvp-escena" src={`${A}/personajes/${attending ? 'ratones-ciegos' : 'lobo-pinocho-cerditos'}.png`} alt="" />
    </main>
  )
}
