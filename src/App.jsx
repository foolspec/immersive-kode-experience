import { lazy, Suspense } from 'react'
import Atmosphere from './components/Atmosphere'
import CursorHalo from './components/CursorHalo'
import FloatingUI from './components/FloatingUI'
import HorizontalGallery from './components/HorizontalGallery'
import RevealBlock from './components/RevealBlock'
import StorySection from './components/StorySection'
import { galleryEntries, navItems, storySections } from './data/storyData'
import { useAmbientSound } from './hooks/useAmbientSound'
import { useCursorField } from './hooks/useCursorField'

const SculptureScene = lazy(() => import('./components/SculptureScene'))

function App() {
  useCursorField()
  const { enabled: soundEnabled, supported: soundSupported, toggle: toggleSound } =
    useAmbientSound()

  return (
    <div className="app-shell">
      <Atmosphere />
      <CursorHalo />

      <FloatingUI
        navItems={navItems}
        soundEnabled={soundEnabled}
        soundSupported={soundSupported}
        onToggleSound={toggleSound}
      />

      <main>
        <section id="entry" className="section hero-section">
          <RevealBlock className="hero-copy" once={false}>
            <p className="section-index">[000]</p>
            <p className="hero-kicker">IMMERSIVE INDEX / ORANGE SPECTRUM</p>

            <h1 className="hero-title distorted" data-text="WE TUNE THE FUTURE IN LIGHT.">
              <span className="hero-line">WE TUNE</span>
              <span className="hero-line">THE FUTURE</span>
              <span className="hero-line">IN LIGHT.</span>
            </h1>

            <p className="hero-abstract">
              A digital installation where code moves like fabric and hardware dreams
              like cinema.
            </p>
          </RevealBlock>

          <div className="hero-scene-wrap parallax-layer" aria-hidden="true">
            <Suspense
              fallback={
                <div className="scene-fallback">
                  <span className="scene-fallback-core" />
                </div>
              }
            >
              <SculptureScene />
            </Suspense>
          </div>

          <div className="hero-fragments" aria-hidden="true">
            <span>VOLUME</span>
            <span>MATTER</span>
            <span>INDEX</span>
          </div>
        </section>

        {storySections.map((section) => (
          <StorySection key={section.id} {...section} />
        ))}

        <HorizontalGallery id="index" entries={galleryEntries} />

        <section id="future" className="section closing-section">
          <RevealBlock className="closing-stack">
            <p className="section-index">[999]</p>
            <h2 className="closing-title distorted" data-text="NEXT PROTOTYPE: HUMAN SENSING SPACE.">
              <span>NEXT</span>
              <span>PROTOTYPE:</span>
              <span>HUMAN</span>
              <span>SENSING</span>
              <span>SPACE.</span>
            </h2>
            <p className="closing-copy">
              Not a website. A rehearsal for environments that respond before we ask.
            </p>
          </RevealBlock>
        </section>
      </main>
    </div>
  )
}

export default App
