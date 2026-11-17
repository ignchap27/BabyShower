import { useEffect, useRef, useState } from 'react'
import Envelope from './Envelope.jsx'
import Details from './Details.jsx'
import Rsvp from './Rsvp.jsx'

export default function App() {
  const [screen, setScreen] = useState('sobre')
  const audio = useRef(null)

  // Música continua: los navegadores bloquean audio hasta el primer gesto,
  // así que se intenta al cargar y otra vez en el primer toque.
  useEffect(() => {
    const play = () => audio.current?.play().catch(() => {})
    play()
    const onVisibility = () => (document.hidden ? audio.current?.pause() : play())
    document.addEventListener('pointerdown', play, { once: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('pointerdown', play)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const go = (next) => {
    setScreen(next)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <audio ref={audio} src="/assets/audio/musica.mp3" loop preload="auto" />
      {screen === 'sobre' && <Envelope onOpen={() => { audio.current?.play().catch(() => {}); go('detalles') }} />}
      {screen === 'detalles' && <Details onRsvp={() => go('rsvp')} />}
      {screen === 'rsvp' && <Rsvp onBack={() => go('detalles')} />}
    </>
  )
}
