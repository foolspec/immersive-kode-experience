import RevealBlock from './RevealBlock'

export default function StorySection({
  id,
  index,
  kicker,
  lines,
  body,
  overlap,
  align = 'left',
}) {
  return (
    <section id={id} className={`section story-section align-${align}`}>
      <RevealBlock className="story-grid">
        <div className="story-meta">
          <p className="section-index">[{index}]</p>
          <p className="story-kicker">{kicker}</p>
        </div>

        <h2 className="story-title distorted" data-text={lines.join(' ')}>
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <p className="story-body">{body}</p>

        <p className="story-overlap" aria-hidden="true">
          {overlap}
        </p>
      </RevealBlock>
    </section>
  )
}
