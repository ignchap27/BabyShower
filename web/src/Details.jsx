import { useEffect, useRef } from 'react'

const A = '/assets'
const MAPS = 'https://maps.app.goo.gl/ZL4jQzrY2Qaqd6jg9'

// Aparece suavemente al entrar en pantalla.
function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add('visible')
        io.disconnect()
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <section ref={ref} className={`reveal ${className}`}>{children}</section>
}

export default function Details({ onRsvp }) {
  return (
    <main className="page page--detalles">
      <Reveal className="cabecera">
        <img className="jengibre" src={`${A}/personajes/jengibre-chupeta.png`} alt="Jengibre" />
        <img className="cuerda" src={`${A}/personajes/shrek-burro-gato-cuerda.png`} alt="Shrek, Burro y el Gato" />
      </Reveal>

      <Reveal>
        <p className="gotica gotica--md">Un pequeño</p>
        <h1 className="titulo titulo--xl">Ogro</h1>
        <p className="gotica gotica--md">está en camino</p>
      </Reveal>

      <Reveal className="bebe-nube">
        <img className="bebe" src={`${A}/personajes/bebe-ogro.png`} alt="Bebé ogro" />
        <img className="nube" src={`${A}/decoracion/nube.png`} alt="" />
      </Reveal>

      <Reveal>
        <p className="gotica gotica--md">Acompáñanos a celebrar a:</p>
        <h2 className="titulo titulo--xl">Jerónimo</h2>
        <p className="gotica gotica--lg">Diciembre</p>
        <div className="fecha">
          <span className="gotica gotica--lg">Sábado</span>
          <span className="fecha__dia">12</span>
          <span className="gotica gotica--lg">3:00 pm</span>
        </div>
      </Reveal>

      <Reveal>
        <h2 className="titulo">¿Ubicación?</h2>
        <p className="gotica direccion">
          Calle 119a # 57-60<br />Parques de Provenza A<br />Salón comunal
        </p>
        <a className="boton" href={MAPS} target="_blank" rel="noreferrer">Google Maps</a>
      </Reveal>

      <Reveal className="escena">
        <img src={`${A}/personajes/shrek-burro-gato-fiona.png`} alt="Shrek, Fiona, Burro y el Gato" />
        <img className="escena__suelo escena__suelo--pantano" src={`${A}/decoracion/pantano.png`} alt="" />
        <p className="gotica gotica--lg">¡Te esperamos!</p>
      </Reveal>

      <Reveal>
        <h2 className="titulo">Confirma tu Asistencia</h2>
        <button type="button" className="boton" onClick={onRsvp}>¡Asistiré!</button>
      </Reveal>

      <Reveal className="escena">
        <img src={`${A}/personajes/familia-con-bebes.png`} alt="La familia de Shrek con los bebés" />
        <img className="escena__suelo" src={`${A}/decoracion/cesped-1.png`} alt="" />
      </Reveal>

      <Reveal>
        <h2 className="titulo">No lo Olvides</h2>
      </Reveal>

      <Reveal className="escena">
        <img src={`${A}/personajes/shrek-burro-acostados.png`} alt="Shrek y Burro" />
        <img className="escena__suelo" src={`${A}/decoracion/cesped-2.png`} alt="" />
      </Reveal>

      <Reveal className="pd">
        <Posdata />
      </Reveal>
    </main>
  )
}

export function Posdata() {
  return (
    <>
      <img src={`${A}/personajes/hada-madrina.png`} alt="Hada madrina" />
      <div>
        <h2 className="titulo">P.D.</h2>
        <p className="gotica">Trae tu propia poción<br />Felices por Siempre</p>
      </div>
      <div className="pociones">
        <img src={`${A}/decoracion/pocion-felices-por-siempre.png`} alt="" />
        <img src={`${A}/decoracion/pocion-felices-por-siempre.png`} alt="Poción Felices por Siempre" />
        <img src={`${A}/decoracion/pocion-felices-por-siempre.png`} alt="" />
      </div>
    </>
  )
}
