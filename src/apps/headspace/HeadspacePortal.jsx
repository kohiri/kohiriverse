import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Questionnaire from './Questionnaire'
import './headspace.css'

const RESEARCH_TOPICS = [
  {
    id: 7,
    title: 'The Madonna Whore Complex',
    image: '/assets/headspace/madonna whore.jpeg',
    featured: false,
    desc: 'A mental split where respect and desire can\'t coexist. Why people get placed into rigid "good" vs "desirable" boxes.',
    content: `The Madonna Whore Complex sounds dramatic, but the idea behind it is surprisingly common and honestly, a little frustrating once you start noticing it.

At its core, it's this mental split where someone (mostly dudes) struggles to see a woman as both emotionally meaningful and sexually desirable at the same time. Instead, she gets placed into one of two boxes: either she's the "good, respectable, long term partner" type, or she's the "fun, attractive, but not taken seriously" type. The problem? Real people don't work like that. Most women are, very obviously, both.

What makes this interesting (and a bit messy) is that it's not always conscious. It often comes from deeper conditioning, ideas picked up from culture, upbringing, or even subtle messages about what makes someone "worthy" versus "desirable." Over time, the brain simplifies this into a kind of shortcut: respect and desire don't comfortably coexist.

And it doesn't just affect how women are seen—it can shape how women see themselves too. You might catch this in moments of overthinking: "Am I being taken seriously?" vs "Am I being attractive?" as if those are competing goals instead of coexisting traits.

In relationships, this split can create confusion. Someone might deeply care for their partner but struggle to maintain attraction, or feel strong attraction but avoid emotional closeness. It's less about intention and more about an internal mismatch that hasn't been questioned yet.

The good news is that once you notice this pattern, it becomes a lot easier to challenge. Because the reality is pretty simple: people are complex, and attraction isn't supposed to come at the cost of respect.

Reference:
1. Sigmund Freud (1912). On the Universal Tendency to Debasement in the Sphere of Love.
2. D. W. Winnicott (1965). The Family and Individual Development.`
  },
  {
    id: 8,
    title: 'The Bobo Doll Experiment',
    image: '/assets/headspace/bobodoll.png',
    desc: 'How kids learn behavior by watching others. The foundation of Social Learning Theory.',
    content: `The Bobo Doll Experiment is one of those psychology studies that sounds almost funny at first—kids hitting a blow-up toy—but it quietly explains a lot about how we pick up behavior.

In the 1960s, Albert Bandura showed children videos of an adult either behaving aggressively or calmly toward a toy called a Bobo doll. Later, when the kids were left alone with the same toy, the ones who had watched the aggressive adult didn't just copy the behavior—they got creative with it. Kicking, hitting, even inventing new ways to act aggressive. Basically, they understood the assignment.

The takeaway isn't just "kids imitate things." It's that we learn by watching, even without being directly taught or rewarded. The brain is constantly observing and storing little notes like, "Oh, this is how people act in this situation." That idea became the foundation of the Social Learning Theory.

What makes this study more interesting is a slightly underrated angle: it's not always about learning something new—it can also be about feeling allowed to do something. The kids may not have learned aggression from scratch; they may have just seen an adult do it and thought, "Okay, so this is acceptable here." Which, if you think about it, explains a lot about how behavior spreads in real life—far beyond childhood.

And it's not just about kids either. We all do this, just in more subtle ways. We pick up how to react, speak, even argue, by watching people around us—friends, partners, the internet, literally everything. So the next time you catch yourself copying someone's tone or habit, just know… your brain has been quietly taking notes the whole time.

Reference:
Albert Bandura, Ross, D., & Ross, S. A. (1961). Transmission of aggression through imitation of aggressive models. Journal of Abnormal and Social Psychology.`
  }
];

function ResearchCard({ topic, onOpen }) {
  return (
    <div className={`research-card ${topic.featured ? 'featured-card' : ''}`} onClick={() => onOpen(topic)}>
      <h3 className="rc-title" style={{ marginBottom: '1rem' }}>{topic.title}</h3>
      <p className="rc-desc" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>{topic.desc}</p>
      <div className="rc-footer">
        <button className="cta-primary" style={{ padding: '10px 28px', fontSize: '0.85rem' }}>
          READ RESEARCH ✦
        </button>
      </div>
    </div>
  );
}

export default function HeadspacePortal() {
  const navigate = useNavigate()
  const [orbScore, setOrbScore] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleComplete = ({ score }) => {
    setOrbScore(score)
  }

  return (
    <div id="headspace-portal" className="headspace-theme">
      {/* ── Retro Ticker ── */}
      <div className="ticker">
        <div className="ticker-track">
          <span>✦ I study psychology and love reading niche topics this is a place where I share interesting research about brain and mental health. Also I developed a scale backed by statistical data. Enjoy hahaha ✦</span>
          <span>✦ I study psychology and love reading niche topics this is a place where I share interesting research about brain and mental health. Also I developed a scale backed by statistical data. Enjoy hahaha ✦</span>
        </div>
      </div>

      {/* ── Background Elements ── */}
      <div className="app-bg" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      {/* ── UI Layer ── */}
      <main className="ui-layer">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> BACK TO GALAXY
        </button>
        
        <header className="portal-header">
          <h1 className="display-title">
            HEAD<span className="outline-text">SPACE</span>
          </h1>
          <p className="lead-text" style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--off-white)', fontWeight: 600 }}>
            Here are some interesting niche topics that I find fun to read and there is also a scale I developed which is pretty interesting.
          </p>
        </header>

        <div className="bento-grid">
          <div className="scale-column">
            <Questionnaire onComplete={handleComplete} />
          </div>
          <div className="research-column">
            {RESEARCH_TOPICS.map(topic => (
              <ResearchCard key={topic.id} topic={topic} onOpen={setActiveTopic} />
            ))}
          </div>
        </div>
      </main>

      {/* ── Research Modal ── */}
      {activeTopic && (
        <div className="modal-overlay" onClick={() => setActiveTopic(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveTopic(null)}>✕</button>
            <div className="modal-inner">
              <h2 className="display-title" style={{ 
                textAlign: 'left', 
                fontSize: '2.5rem', 
                marginBottom: '1.5rem', 
                fontFamily: 'var(--font-body)',
                textTransform: 'none',
                WebkitTextStroke: '0' 
              }}>
                {activeTopic.title}
              </h2>
              
              {activeTopic.image && (
                <div className="modal-image-container">
                  <img src={activeTopic.image} alt={activeTopic.title} className="modal-image" />
                </div>
              )}

              <div className="modal-body-text">
                {activeTopic.content ? (
                  activeTopic.content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>{activeTopic.desc}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
