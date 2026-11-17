import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'

export const LIBRE = 'Libre elección'

export const GIFTS = [
  'Esterilizadores, Biberones, Fabricantes de alimentos',
  'Contenedores de pañales, Cambiadores, Organizadores',
  'Carriolas y Asientos para Auto',
  'Centros de actividades, Columpios, Gimnasio, Portabebés, Mecedoras',
  'Asientos y tinas de baño, Juguetes de baño, Herramientas de aseo',
  'Seguridad y cuidado del bebé',
  'Juguetes, Mordedores, Libros',
  'Ropa de bebé (+3M) y accesorios',
  LIBRE,
]

// undefined = cargando, null = error, objeto = { categoría: total }
function useGiftCounts() {
  const [counts, setCounts] = useState()
  useEffect(() => {
    let alive = true
    const load = supabase ? supabase.rpc('gift_counts') : Promise.resolve({ error: true })
    load.then(({ data, error }) => {
      if (!alive) return
      setCounts(error ? null : Object.fromEntries(data.map((r) => [r.gift_category, Number(r.total)])))
    })
    return () => { alive = false }
  }, [])
  return counts
}

// Agrupa por lo que se ve en la base (no por la selección actual) para que
// la opción no salte de grupo al tocarla.
function groups(counts) {
  const concrete = GIFTS.filter((g) => g !== LIBRE)
    .map((g) => ({ g, n: counts[g] ?? 0 }))
    .sort((a, b) => a.n - b.n)
  const avg = concrete.reduce((s, c) => s + c.n, 0) / concrete.length
  let needed = concrete.filter((c) => c.n < avg)
  if (!needed.length) needed = concrete // todas iguales: todas hacen falta
  const covered = concrete.filter((c) => !needed.includes(c))
  return { needed, covered }
}

const personas = (n) => (n === 0 ? 'Nadie aún' : `${n} ${n === 1 ? 'persona' : 'personas'}`)

export default function Regalos({ selected, onSelect, readOnly }) {
  const counts = useGiftCounts()
  const known = counts != null
  const shown = (g) => (known ? (counts[g] ?? 0) + (!readOnly && g === selected ? 1 : 0) : 0)
  const max = Math.max(1, ...GIFTS.map(shown))
  const total = known ? Object.values(counts).reduce((s, n) => s + n, 0) : 0

  const { needed, covered } = known ? groups(counts) : { needed: [], covered: GIFTS.filter((g) => g !== LIBRE).map((g) => ({ g })) }

  const item = (g, suggested) => {
    const n = shown(g)
    const body = (
      <span className="regalo__cuerpo">
        <span className="regalo__texto">
          <span>{g}</span>
          {suggested && <span className="badge">Sugerido</span>}
          {readOnly && g === selected && <span className="badge badge--tuya">Tu elección</span>}
        </span>
        <span className="regalo__fila">
          <span className="barra" aria-hidden="true">
            <span className="barra__relleno" style={{ transform: `scaleX(${n / max})` }} />
          </span>
          <span className="regalo__conteo">{known ? personas(n) : ' '}</span>
        </span>
      </span>
    )
    if (readOnly) {
      return (
        <div key={g} className={`opcion regalo${g === selected ? ' regalo--tuya' : ''}`}>{body}</div>
      )
    }
    return (
      <label key={g} className="opcion regalo">
        <input type="radio" name="gift" value={g} required checked={g === selected} onChange={() => onSelect(g)} />
        {body}
      </label>
    )
  }

  return (
    <div className="regalos" aria-busy={counts === undefined}>
      {known && (
        <p className="regalos__resumen">
          {total === 0
            ? '¡Aún nadie ha elegido, estrena la lista!'
            : `${total} ${total === 1 ? 'invitado ya eligió' : 'invitados ya eligieron'} regalo.`}
        </p>
      )}
      {counts === null && (
        <p className="nota">No pudimos cargar cómo va la lista, pero igual puedes elegir.</p>
      )}

      {needed.length > 0 && <h2 className="grupo-titulo">Hacen falta</h2>}
      {needed.map((c, i) => item(c.g, !readOnly && i === 0))}

      {known && covered.length > 0 && <h2 className="grupo-titulo">Ya tienen regalos</h2>}
      {covered.map((c) => item(c.g, false))}

      {item(LIBRE, false)}
    </div>
  )
}
