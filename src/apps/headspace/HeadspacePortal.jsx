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
  },
  {
    id: 9,
    title: 'Non-Suicidal Self-Injury (NSSI)',
    image: '/assets/headspace/nssi1.jpeg',
    desc: 'Often misread as attention-seeking — but research tells a very different story about pain, numbness, and emotional survival.',
    content: `Non-Suicidal Self-Injury (NSSI) is often misunderstood as attention-seeking, but psychological research frames it as a maladaptive coping strategy used to manage overwhelming internal states. Defined within the Diagnostic and Statistical Manual of Mental Disorders (DSM-5-TR), NSSI involves deliberate harm to one's body without suicidal intent, serving functions that are deeply tied to emotional regulation rather than a desire to die.

One of the most consistent findings in research is the paradoxical role of pain. According to affect regulation models, individuals engage in NSSI to reduce intense negative emotions or to feel something in states of numbness. This is supported by experimental and self-report studies showing a temporary sense of relief or release following the act, reinforcing the behavior over time.

A more nuanced understanding comes from the biosocial framework developed by Marsha M. Linehan, which highlights the role of invalidating environments. When individuals grow up in contexts where their emotional experiences are minimized or dismissed, they may struggle to develop healthy regulation strategies. In such cases, self-injury can emerge as a private and embodied way of expressing distress—one that does not rely on being understood by others.

Although NSSI is distinct from suicidal behavior in intent, it remains clinically significant. Longitudinal research shows that it is a strong predictor of future suicidal ideation and attempts, emphasizing the need to view it as a meaningful psychological signal rather than an isolated behavior.

Ultimately, NSSI reflects not a desire to die, but a difficulty in finding safer ways to cope with emotional intensity. Understanding it through a research-informed lens allows for responses grounded in empathy, rather than misconception.

References:
Nock, M. K., & Prinstein, M. J. (2004). A functional approach to the assessment of self-mutilative behavior. Journal of Consulting and Clinical Psychology.
Klonsky, E. D. (2007). The functions of deliberate self-injury: A review of the evidence. Clinical Psychology Review.
Wilkinson, P., Kelvin, R., Roberts, C., Dubicka, B., & Goodyer, I. (2011). Clinical and psychosocial predictors of suicide attempts in adolescents. American Journal of Psychiatry.`
  },
  {
    id: 10,
    title: 'Need for Noise',
    image: '/assets/headspace/noise.jpeg',
    desc: 'Why silence feels unbearable for some — and what your need for background sound says about your inner world.',
    content: `In an increasingly connected world, many individuals find themselves unable to sit in silence. Whether it is the quiet hum of a television, the familiar rhythm of music, or the passive scrolling of a phone, background stimulation has become a subtle but powerful tool for emotional regulation. When this stimulation is absent, some individuals report feelings of restlessness, discomfort, or even anxiety—suggesting that the presence of "noise" is not merely a habit, but a psychological need.

From a research perspective, this pattern can be understood through the lens of self-regulation and attentional control. Continuous low-level stimulation helps occupy cognitive space, reducing the intensity of intrusive thoughts or uncomfortable emotions. In this sense, screens and background sounds act as a form of experiential avoidance, a concept explored in approaches like Acceptance and Commitment Therapy. Rather than directly confronting internal experiences, individuals may turn to external input to soften or distract from them.

Neuroscientific insights further deepen this understanding. The brain's Default Mode Network—active during rest and introspection—is closely linked to mind-wandering and self-referential thinking. For individuals prone to anxiety or overthinking, this network can become overactive in moments of silence. Background noise or screen engagement can temporarily suppress this activity, creating a sense of mental quiet through external stimulation rather than internal regulation.

There is also a behavioral reinforcement loop at play. Digital platforms, particularly those designed by companies like TikTok or YouTube, are structured around rapid, engaging content that delivers consistent dopamine-driven rewards. Over time, the brain begins to associate constant input with comfort and relief. Silence, by contrast, may feel unfamiliar or even distressing—not because it is inherently negative, but because it lacks the stimulation the brain has adapted to expect.

Importantly, this reliance on background stimulation is not inherently pathological. For many, it is a functional coping mechanism, especially in environments that demand constant productivity or where emotional processing has limited space. However, when the absence of stimulation leads to significant anxiety or an inability to self-soothe, it may indicate a deeper difficulty with emotional tolerance and internal regulation.

In this way, the need for screens or sound is less about distraction and more about regulation through external means. It reflects a shift in how individuals manage their inner worlds—outsourcing calm, focus, and comfort to the steady presence of digital or auditory input.

References:
Hayes, S. C., Wilson, K. G., Gifford, E. V., Follette, V. M., & Strosahl, K. (1996). Experiential avoidance and behavioral disorders: A functional dimensional approach. Journal of Consulting and Clinical Psychology.
Raichle, M. E. (2015). The brain's default mode network. Annual Review of Neuroscience.`
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
          <ArrowLeft size={14} /> BACK TO GALAXY
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
