// ─────────────────────────────────────────────────────────────────
// Internal Conflict Fatigue Scale (ICFS) — Complete Data
// ─────────────────────────────────────────────────────────────────

export const SCALE_META = {
  name: "Internal Conflict Fatigue Scale",
  abbreviation: "ICFS",
  construct: "Psychological fatigue resulting from persistent internal conflict",
  items: 19,
  responseScale: "4-point Likert",
  reliability: { cronbachAlpha: 0.90, mean: 49.01, sd: 9.61, sem: 3.02 },
}

export const INSTRUCTIONS = `Please read the following statements carefully and indicate the extent to which you agree or disagree with the statements. Please answer each statement honestly. There is no right or wrong answer.`

export const SUBSCALES = {
  cognitiveDissonanceFatigue: {
    label: "Cognitive Dissonance Fatigue",
    color: "#c4b7d4",
    items: [17, 18, 19],
  },
  decisionParalysis: {
    label: "Decision Paralysis",
    color: "#f2c9b0",
    items: [7, 14, 15, 16],
  },
  emotionalExhaustion: {
    label: "Emotional Exhaustion",
    color: "#d4b4b4",
    items: [6, 12, 13],
  },
  internalGuilt: {
    label: "Internal Guilt",
    color: "#93b39d",
    items: [9, 10, 11],
  },
  identityConfusion: {
    label: "Identity Confusion",
    color: "#b4c4d4",
    items: [3, 8],
  },
  copingReliance: {
    label: "Coping Reliance",
    color: "#c9d4b4",
    items: [1, 2, 4, 5],
  },
}

export const QUESTIONS = [
  { id: 1,  text: "I use temporary escapes to get relief from internal stress." },
  { id: 2,  text: "I depend on coping methods that help me endure rather than resolve my conflicts." },
  { id: 3,  text: "I force humor or sarcasm to deflect attention away from the internal tension I am feeling." },
  { id: 4,  text: "I use \"mindless\" scrolling or background noise (TV/Podcasts) specifically to drown out my internal dialogue." },
  { id: 5,  text: "I depend on the feedback of others to validate my choices." },
  { id: 6,  text: "I often feel like I am fighting a battle with myself." },
  { id: 7,  text: "I find it difficult to make decisions because I feel pulled in multiple directions." },
  { id: 8,  text: "I often feel like I am playing a character rather than being myself." },
  { id: 9,  text: "I experience guilt that comes from ongoing struggles within myself." },
  { id: 10, text: "I tend to carry guilt even when nothing specific has gone wrong." },
  { id: 11, text: "I feel guilty even for thoughts that weren't expressed or acted on." },
  { id: 12, text: "I struggle to find the strength to respond to daily demands." },
  { id: 13, text: "I feel emotionally drained by my work/studies." },
  { id: 14, text: "My mood worsens when I have pending decisions." },
  { id: 15, text: "I rely on others' opinions to avoid deciding on my own." },
  { id: 16, text: "I feel uncomfortable being the final decision-maker." },
  { id: 17, text: "Inner mental conflict affects my concentration." },
  { id: 18, text: "I feel mentally stressed when I hold two opposite opinions." },
  { id: 19, text: "I struggle to accept feedback that contradicts my opinions." },
]

export const OPTIONS = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree",          value: 2 },
  { label: "Agree",             value: 3 },
  { label: "Strongly Agree",    value: 4 },
]

export const SCORE_BANDS = [
  {
    min: 19, max: 39,
    label: "Low Fatigue",
    sublabel: "Typical / Healthy range",
    description: "Your responses suggest minimal internal conflict fatigue. You tend to navigate internal tensions with relative ease and resilience.",
    color: "#93b39d",
    orbColor: "#a8cbb3",
    emoji: "🌿",
  },
  {
    min: 40, max: 43,
    label: "Below Average Fatigue",
    sublabel: "Slightly below average",
    description: "You experience some internal tension, but it remains manageable. Occasional moments of self-doubt or conflict are normal.",
    color: "#b4c9b4",
    orbColor: "#c0d4bf",
    emoji: "🌱",
  },
  {
    min: 44, max: 50,
    label: "Average Fatigue",
    sublabel: "Within the typical range",
    description: "Your level of internal conflict fatigue is consistent with the average person.",
    color: "#c4b7d4",
    orbColor: "#cfc5df",
    emoji: "☁️",
  },
  {
    min: 51, max: 55,
    label: "Above Average Fatigue",
    sublabel: "Slightly elevated",
    description: "You are experiencing a notable degree of internal conflict fatigue. This can affect decision-making and energy.",
    color: "#f2c9b0",
    orbColor: "#f5d4bc",
    emoji: "🍂",
  },
  {
    min: 56, max: 65,
    label: "High Fatigue",
    sublabel: "Significant internal strain",
    description: "Your internal fatigue is high. Persistent inner conflict can be draining.",
    color: "#d4b4b4",
    orbColor: "#dfc0c0",
    emoji: "🌧️",
  },
  {
    min: 66, max: 76,
    label: "Extremely High Fatigue",
    sublabel: "Please seek support",
    description: "Your responses indicate a very high level of internal conflict fatigue. Please consider reaching out to a mental health professional.",
    color: "#c4a4b4",
    orbColor: "#cca8b8",
    emoji: "💜",
  },
]

export function calculateScore(answers) {
  return Object.values(answers).reduce((sum, val) => sum + val, 0)
}

export function getBand(score) {
  return SCORE_BANDS.find(b => score >= b.min && score <= b.max) || SCORE_BANDS[SCORE_BANDS.length - 1]
}

export function getSubscaleScores(answers) {
  const results = {}
  for (const [key, sub] of Object.entries(SUBSCALES)) {
    const total = sub.items.reduce((sum, itemId) => {
      const answerIndex = itemId - 1
      return sum + (answers[answerIndex] ?? 0)
    }, 0)
    const max = sub.items.length * 4
    results[key] = {
      ...sub,
      score: total,
      max,
      percent: Math.round((total / max) * 100),
    }
  }
  return results
}
