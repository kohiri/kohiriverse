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
  },
  {
    id: 11,
    title: 'Friedrich Nietzsche: Genius, Existential Icon... and a Walking Red Flag?',
    image: '/assets/headspace/nietzsche_superman.png',
    featured: false,
    desc: 'An exploration of Friedrich Nietzsche\'s brilliant philosophy and his deeply flawed personal views, exploring the contradictions of a legendary thinker.',
    content: `I'll admit it—I first discovered Friedrich Nietzsche the same way most people probably do. Getting triggered!!! Also you know the dramatic social media content: cinematic music, black-and-white footage, a guy staring into the distance, and a Nietzsche quote about suffering or becoming stronger. Everyone in the comments is acting like they've just unlocked the secret to life, so naturally I thought, *"Okay... who is this man, and why does the internet worship him?"*

So, I did what any curious person would do.

I actually read Nietzsche.

And let me tell you... it was an emotional rollercoaster.

One moment I was highlighting every other sentence, convinced this man was centuries ahead of his time. The next moment, I was staring at the page thinking, *"Sir... what exactly do you have against women?"*

Welcome to the wonderfully confusing world of Friedrich Nietzsche.

Born in Germany in 1844, Nietzsche wasn't just intelligent, he was ridiculously intelligent. He became a university professor at the age of twenty four, which is honestly offensive considering what most of us were doing at twenty four. While everyone else was trying to figure out adulthood, Nietzsche was teaching ancient Greek texts and casually questioning the foundations of Western philosophy. Religion? Question it. Morality? Question it. Society? Absolutely question it. Truth itself? that too.

Honestly, the man woke up every morning and chose philosophical violence.

His biggest message was surprisingly simple: stop living the life everyone else expects you to live. Create your own values. Think for yourself. Stop following the crowd just because it's comfortable. He believed that life doesn't come with a built in meaning, you create that meaning yourself. His famous idea of the *Übermensch*, often translated as the "Overman," wasn't about becoming a superhero or being born superior to everyone else. It was about constantly becoming a better version of yourself, pushing past your limitations, and refusing to settle for mediocrity.

And honestly?

That part still holds up.

Even today.

But then...

He started talking about women.

Now here's where I had to keep putting the book down every few pages.

You're telling me the same man who encouraged humanity to question every belief society handed to them... never stopped to question his own beliefs about women?

That's almost impressive.

Nietzsche often described women as emotional, manipulative, irrational, and naturally suited for motherhood rather than intellectual life. Then there's his infamous line: *"Are you going to women? Do not forget the whip."*

Excuse me?

The Man who challenged god but couldn't challenge patriarchy....

Now, to be fair, and because history deserves fairness...that quote has been debated for decades. Some philosophers argue it's metaphorical. Others point out it's spoken by a fictional character in one of his books rather than Nietzsche directly. Context matters. But even after giving him every possible benefit of the doubt, many of his writings still reflect deeply sexist assumptions about women.

And that's what fascinated me the most.

How can someone be so revolutionary in one area of life and so conventional in another?

It just goes to show that intelligence doesn't magically erase bias. A person can completely redefine philosophy while still carrying the prejudices of the century they were born into.

Then I started looking into his life, and suddenly everything became... not clearer, exactly, but definitely more interesting.

Nietzsche wasn't some charismatic public intellectual surrounded by admirers. In reality, his life was surprisingly lonely. He suffered from chronic migraines, severe vision problems, and constant physical pain that eventually forced him to retire from teaching. He spent years travelling alone through Europe, writing books that almost nobody bought during his lifetime. Imagine pouring your soul into your work, convinced you've written something extraordinary, only for the world to collectively shrug.

That has to sting.

Then there's his love life, or rather, the lack of one.

His most famous romantic interest was Lou Andreas-Salomé, one of the most brilliant women of the nineteenth century. Independent, intellectual, ambitious; basically everything Nietzsche admired.

He proposed.

She said no.

He proposed again.

She... still said no.

Ouch.

Now, before anyone says, "See! That's why he hated women!"—no. Human beings are much more complicated than that. One rejection doesn't suddenly create an entire worldview. But it does make you wonder how much our personal disappointments quietly influence the stories we tell ourselves about other people.

One thing I found almost ironic was that Nietzsche spent so much time writing about strength, independence, and overcoming suffering, yet his own life was filled with illness, loneliness, broken friendships, and disappointment. Maybe that's exactly why those ideas mattered so much to him. Sometimes our philosophies aren't just theories, they're survival mechanisms.

And then, just when I thought Nietzsche's story couldn't get any more dramatic...

History entered the chat.

One of the biggest misconceptions about Nietzsche is that he was the philosopher behind Hitler and Nazi ideology.

Not exactly.

Here's what actually happened.

Nietzsche openly criticized antisemitism. He disliked aggressive nationalism. He distrusted governments that demanded blind obedience. Those aren't exactly ideas that fit comfortably with Nazism.

The problem is that Nietzsche never got the chance to defend his work.

In 1889, he suffered a devastating mental collapse after years of declining health. He never fully recovered and spent the last years of his life unable to write or explain his philosophy. After that, control of his unpublished writings largely passed to his sister, Elisabeth Förster-Nietzsche.

And let's just say...

She and her brother would not have gotten along politically.

Elisabeth admired German nationalism and held antisemitic views. She edited, rearranged, and selectively published many of Nietzsche's unpublished notes, presenting them in ways that made his philosophy appear much closer to nationalist and authoritarian thinking than it actually was.

Years later, Adolf Hitler and the Nazi Party embraced this version of Nietzsche. They took concepts like the *Übermensch* and the "will to power," stripped away all their philosophical context, and reshaped them into propaganda. Nietzsche's idea of the *Übermensch* was about personal growth and overcoming yourself, not about race. Yet the Nazis transformed it into the myth of the Aryan "master race." His idea of the "will to power" became military conquest and domination instead of personal transformation.

It's honestly one of history's greatest examples of taking someone's work completely out of context.

If there's one lesson to take from that, it's this: people don't always misuse ideas by inventing new ones. Sometimes they simply cherry pick the parts they like and ignore everything else.

Looking back, Nietzsche feels less like an untouchable genius and more like a fascinating contradiction. He challenged religion, morality, and society, yet often failed to challenge his own assumptions about women. He encouraged people to think independently, but after his death, his own ideas were manipulated by people who stood for everything he criticized. He spent his life writing about strength while privately battling illness and isolation. He wanted people to become extraordinary, yet he remained painfully human.

Maybe that's why people are still reading him over a century later.

Not because he was always right.

Definitely not because he was perfect.

But because the best philosophers aren't the ones who give us all the answers.

They're the ones who make us argue back.

And if Nietzsche were alive today, I have a feeling we'd have one very long conversation.

I'd thank him for teaching us to question everything.

Then I'd politely ask why he forgot to question himself...Axxhole\`
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
