import { useState } from 'react'

const A = '/assets'

export default function Envelope({ onOpen }) {
  const [opening, setOpening] = useState(false)

  const open = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onOpen, 900)
  }

  return (
    <main className="page page--sobre">
      <img className="rana rana--1" src={`${A}/decoracion/rana-globo.png`} alt="" />
      <img className="rana rana--2" src={`${A}/decoracion/rana-globo.png`} alt="" />
      <img className="rana rana--3" src={`${A}/decoracion/rana-globo.png`} alt="" />

      <h1 className="titulo">Presiona el Sobre</h1>

      <div className="invitado">
        <img src={`${A}/personajes/shrek-garras.png`} alt="Shrek" />
        <p className="gotica">¡Estás invitado!</p>
        <img src={`${A}/personajes/fiona-pelea.png`} alt="Fiona" />
      </div>

      <button
        type="button"
        className={`sobre ${opening ? 'sobre--abriendo' : ''}`}
        onClick={open}
        aria-label="Abrir la invitación"
      >
        <img className="sobre__papel" src={`${A}/decoracion/sobre.png`} alt="" />
        <img className="sobre__sello" src={`${A}/decoracion/sello-beware-ogre.png`} alt="" />
      </button>
      <img className="sobre-sombra" src={`${A}/decoracion/sombra-sobre.png`} alt="" />

      <img className="bebes" src={`${A}/personajes/bebes-ogro-trio.png`} alt="Bebés ogro" />

      <div className="esquinas">
        <img src={`${A}/personajes/shrek-fiona-abrazo.png`} alt="" />
        <img src={`${A}/personajes/hada-madrina.png`} alt="" />
      </div>
    </main>
  )
}
