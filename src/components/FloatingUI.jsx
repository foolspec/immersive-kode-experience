import { useState } from 'react'

export default function FloatingUI({
  navItems,
  soundEnabled,
  soundSupported,
  onToggleSound,
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`floating-ui ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="floating-control menu-control"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="immersive-menu"
      >
        MENU
      </button>

      <p className="floating-index">[047]</p>

      <button
        type="button"
        className="floating-control sound-control"
        onClick={onToggleSound}
        disabled={!soundSupported}
      >
        SOUND {soundEnabled ? 'ON' : 'OFF'}
      </button>

      <nav
        id="immersive-menu"
        className="floating-nav"
        aria-label="Immersive sections"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="floating-link"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
