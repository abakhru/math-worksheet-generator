import { describe, it, expect } from 'vitest'
import {
  generateQuestion,
  generateMultipleChoiceQuestion,
  generateDailyQuestions,
  dateToSeed,
  getVisualAidData,
} from '@/engine/questions'

describe('questions engine', () => {
  describe('dateToSeed', () => {
    it('converts date string to numeric seed', () => {
      const seed = dateToSeed('2026-03-14')
      expect(seed).toBe(20260314)
    })

    it('produces same seed for same date', () => {
      const seed1 = dateToSeed('2025-12-25')
      const seed2 = dateToSeed('2025-12-25')
      expect(seed1).toBe(seed2)
    })

    it('produces different seeds for different dates', () => {
      const seed1 = dateToSeed('2025-12-25')
      const seed2 = dateToSeed('2025-12-26')
      expect(seed1).not.toBe(seed2)
    })
  })

  describe('generateQuestion', () => {
    it('generates question with correct multiplication table', () => {
      const q = generateQuestion(5, 'practice')
      expect(q.a).toBe(5)
      expect(q.table).toBe(5)
    })

    it('generates correct answer', () => {
      const q = generateQuestion(7, 'practice')
      expect(q.answer).toBe(q.a * q.b)
    })

    it('generates multiplier between 2 and 14', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateQuestion(6, 'practice')
        expect(q.b).toBeGreaterThanOrEqual(2)
        expect(q.b).toBeLessThanOrEqual(14)
      }
    })

    it('includes mode in question', () => {
      const q = generateQuestion(3, 'speedrun')
      expect(q.mode).toBe('speedrun')
    })

    it('produces deterministic questions with seed', () => {
      const q1 = generateQuestion(5, 'daily', 12345)
      const q2 = generateQuestion(5, 'daily', 12345)
      expect(q1.b).toBe(q2.b)
      expect(q1.answer).toBe(q2.answer)
    })
  })

  describe('generateMultipleChoiceQuestion', () => {
    it('generates 4 unique choices', () => {
      const q = generateQuestion(4, 'practice')
      const mcq = generateMultipleChoiceQuestion(q)
      expect(mcq.choices.length).toBe(4)
      expect(new Set(mcq.choices).size).toBe(4)
    })

    it('includes correct answer in choices', () => {
      const q = generateQuestion(8, 'practice')
      const mcq = generateMultipleChoiceQuestion(q)
      expect(mcq.choices).toContain(q.answer)
    })

    it('has valid correctIndex', () => {
      const q = generateQuestion(6, 'practice')
      const mcq = generateMultipleChoiceQuestion(q)
      expect(mcq.correctIndex).toBeGreaterThanOrEqual(0)
      expect(mcq.correctIndex).toBeLessThan(4)
      expect(mcq.choices[mcq.correctIndex]).toBe(q.answer)
    })

    it('generates plausible distractors (not too far from answer)', () => {
      const q = generateQuestion(7, 'practice')
      const mcq = generateMultipleChoiceQuestion(q)
      mcq.choices.forEach((choice) => {
        // Distractors should be within reasonable range of answer
        const diff = Math.abs(choice - q.answer)
        expect(diff).toBeLessThan(q.answer + 50) // Plausible range
      })
    })
  })

  describe('generateDailyQuestions', () => {
    it('generates exactly 20 questions', () => {
      const questions = generateDailyQuestions('2026-03-14')
      expect(questions.length).toBe(20)
    })

    it('all questions are multiple choice', () => {
      const questions = generateDailyQuestions('2026-03-14')
      questions.forEach((q) => {
        expect(q.choices).toBeDefined()
        expect(q.choices.length).toBe(4)
        expect(q.correctIndex).toBeDefined()
      })
    })

    it('uses date-seeded PRNG (deterministic)', () => {
      const questions1 = generateDailyQuestions('2026-03-14')
      const questions2 = generateDailyQuestions('2026-03-14')

      for (let i = 0; i < questions1.length; i++) {
        expect(questions1[i].a).toBe(questions2[i].a)
        expect(questions1[i].b).toBe(questions2[i].b)
        expect(questions1[i].answer).toBe(questions2[i].answer)
      }
    })

    it('different dates produce different questions', () => {
      const questions1 = generateDailyQuestions('2026-03-14')
      const questions2 = generateDailyQuestions('2026-03-15')

      // At least some questions should be different
      const different = questions1.filter(
        (q, i) => q.answer !== questions2[i].answer
      ).length
      expect(different).toBeGreaterThan(0)
    })

    it('all mode is set to daily', () => {
      const questions = generateDailyQuestions('2026-03-14')
      questions.forEach((q) => {
        expect(q.mode).toBe('daily')
      })
    })
  })

  describe('getVisualAidData', () => {
    it('returns grid type for small multiplications', () => {
      const aid = getVisualAidData(3, 4)
      expect(aid?.type).toBe('grid')
      expect(aid?.cols).toBe(3)
      expect(aid?.rows).toBe(4)
      expect(aid?.dots).toHaveLength(12)
    })

    it('returns distributive for larger multiplications', () => {
      const aid = getVisualAidData(7, 8)
      expect(aid?.type).toBe('distributive')
      expect(aid?.mainGrid).toBeDefined()
    })

    it('handles 5×5 edge case (grid)', () => {
      const aid = getVisualAidData(5, 5)
      expect(aid?.type).toBe('grid')
    })

    it('handles 6×6 (distributive)', () => {
      const aid = getVisualAidData(6, 6)
      expect(aid?.type).toBe('distributive')
    })

    it('distributive includes formula', () => {
      const aid = getVisualAidData(7, 8)
      expect(aid?.formula).toContain('7')
      expect(aid?.formula).toContain('8')
    })

    it('generates correct number of dots in grid', () => {
      const aid = getVisualAidData(4, 5)
      expect(aid?.dots).toHaveLength(20)
    })
  })
})
