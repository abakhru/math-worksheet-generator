import { Question, MultipleChoiceQuestion, GameMode } from '@/types'

// Mulberry32 PRNG for deterministic daily challenges
function mulberry32(a: number) {
  return function () {
    a = (a + 0x6d2b79f5) | 0
    const t = Math.imul(a ^ (a >>> 15), 1 | a)
    return ((t ^ (t + 1023)) >>> 0) / 4294967296
  }
}

export function dateToSeed(dateStr: string): number {
  return parseInt(dateStr.replace(/-/g, ''))
}

export function generateQuestion(table: number, mode: GameMode, seed?: number): Question {
  let rng = Math.random
  if (seed !== undefined) {
    const generator = mulberry32(seed + Math.floor(Math.random() * 1000))
    rng = generator
  }

  const multiplier = Math.floor(rng() * 13) + 2 // 2-14
  return {
    a: table,
    b: multiplier,
    answer: table * multiplier,
    table,
    mode,
  }
}

export function generateMultipleChoiceQuestion(q: Question, seed?: number): MultipleChoiceQuestion {
  let rng = Math.random
  if (seed !== undefined) {
    const generator = mulberry32(seed)
    rng = generator
  }

  const { answer } = q
  const distractors = new Set<number>()

  // Generate 3 plausible distractors
  while (distractors.size < 3) {
    const { a, b } = q
    const choice = Math.random()

    let distractor: number
    if (choice < 0.33) {
      // answer ± b
      distractor = answer + (Math.random() < 0.5 ? -b : b)
    } else if (choice < 0.66) {
      // answer ± a
      distractor = answer + (Math.random() < 0.5 ? -a : a)
    } else {
      // (a±1)×b
      const offset = Math.random() < 0.5 ? -1 : 1
      distractor = (a + offset) * b
    }

    if (distractor > 0 && distractor !== answer) {
      distractors.add(distractor)
    }
  }

  const choices = [answer, ...Array.from(distractors)]
  const correctIndex = 0
  const shuffled = shuffleArray([...choices], seed)
  const newCorrectIndex = shuffled.indexOf(answer)

  return {
    ...q,
    choices: shuffled,
    correctIndex: newCorrectIndex,
  }
}

function shuffleArray<T>(arr: T[], seed?: number): T[] {
  const result = [...arr]
  let rng = Math.random
  if (seed !== undefined) {
    const generator = mulberry32(seed)
    rng = generator
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateDailyQuestions(dateStr: string): MultipleChoiceQuestion[] {
  const seed = dateToSeed(dateStr)
  const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const questions: MultipleChoiceQuestion[] = []

  for (let i = 0; i < 20; i++) {
    const table = tables[Math.floor((seed + i) % tables.length)]
    const q = generateQuestion(table, 'daily', seed + i)
    questions.push(generateMultipleChoiceQuestion(q, seed + i))
  }

  return questions
}

// Visual aid for understanding multiplication (dot arrays)
export function getVisualAidData(a: number, b: number) {
  if (a <= 5 && b <= 5) {
    // Simple grid: return array of dots
    return {
      type: 'grid',
      cols: a,
      rows: b,
      dots: Array.from({ length: a * b }, (_, i) => i),
    }
  } else if (a > 5 || b > 5) {
    // Distributive: split large factor
    const [first, second] = a > b ? [b, a] : [a, b]
    const split = 5
    const remainder = first - split

    return {
      type: 'distributive',
      mainGrid: { cols: first, rows: split },
      remainderGrid: remainder > 0 ? { cols: first, rows: remainder } : null,
      formula: `${first} × ${second} = (${split} × ${second}) + (${remainder} × ${second})`,
    }
  }

  return null
}
