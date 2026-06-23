export interface AiCard {
  id: string
  category?: string
  people?: string
  budget?: string
  restrictions: string
  comment: string
}

export interface AiRequest {
  cards: AiCard[]
  comment: string
}

interface Candidate {
  id: number
  name: string
  price: number
  category: string
  ingredients: string
}

const PER_CARD_LIMIT = 25 // candidates gathered per dish card
const MAX_CANDIDATES = 100 // overall safety cap

function toCandidate(food: any): Candidate {
  const ingredients = Array.isArray(food.ingredients)
    ? food.ingredients.join(', ')
    : (food.ingredients ?? '')

  return {
    id: food.id,
    name: food.foodName ?? food.name ?? '',
    price: food.price,
    category: food.category ?? '',
    ingredients: ingredients.slice(0, 200),
  }
}

function parseBudget(budget?: string): number | null {
  if (!budget) return null
  const digits = budget.replace(/\D/g, '')
  return digits ? Number(digits) : null
}

function matchesCard(food: any, card: AiCard): boolean {
  if (card.category && food.category !== card.category) return false
  const cap = parseBudget(card.budget)
  if (cap !== null && food.price > cap) return false
  return true
}

// Gather candidates per card so every dish is represented, instead of
// one flat slice that could be dominated by a single category.
function buildCandidates(foods: any[], request: AiRequest): Candidate[] {
  const seen = new Set<number>()
  const out: Candidate[] = []

  const constrainedCards = request.cards.filter(c => c.category || c.budget)

  if (constrainedCards.length) {
    for (const card of constrainedCards) {
      let taken = 0
      for (const food of foods) {
        if (taken >= PER_CARD_LIMIT || out.length >= MAX_CANDIDATES) break
        if (seen.has(food.id) || !matchesCard(food, card)) continue
        seen.add(food.id)
        out.push(toCandidate(food))
        taken++
      }
    }
    return out
  }

  // No category/price anywhere -> capped slice of the whole catalog
  for (const food of foods) {
    if (out.length >= MAX_CANDIDATES) break
    if (seen.has(food.id)) continue
    seen.add(food.id)
    out.push(toCandidate(food))
  }
  return out
}

function buildAiPrompt(request: AiRequest): string {
  const parts: string[] = []

  request.cards.forEach((card, index) => {
    const lines: string[] = []
    if (card.category) lines.push(`Категория: ${card.category}`)
    if (card.people) lines.push(`Количество человек: ${card.people}`)
    if (card.budget) lines.push(`Бюджет: ${card.budget}`)
    if (card.restrictions.trim())
      lines.push(`Ингредиенты (пожелания или ограничения): ${card.restrictions.trim()}`)
    if (card.comment.trim())
      lines.push(`Пожелания: ${card.comment.trim()}`)

    if (lines.length)
      parts.push(`Блюдо ${index + 1}:\n${lines.join('\n')}`)
  })

  if (request.comment.trim())
    parts.push(`Общий комментарий: ${request.comment.trim()}`)

  return parts.join('\n\n')
}

export function useAiFood() {
  const aiLoading = ref(false)
  const aiError = ref('')
  const aiResultIds = ref<number[] | null>(null)

  function clearAi() {
    aiResultIds.value = null
  }

  async function submitAiFood(request: AiRequest, foods: any[]) {
    aiLoading.value = true
    aiError.value = ''

    try {
      const catalog = buildCandidates(foods, request)

      console.log('Всего блюд в каталоге:', foods.length)
      console.log('Отправляем в ИИ:', catalog.length)
      console.log('Кандидаты:', catalog)

      if (!catalog.length) {
        aiResultIds.value = []
        return
      }

      const res = await $fetch<{ foodIds: number[] }>('/api/ai-food', {
        method: 'POST',
        body: { prompt: buildAiPrompt(request), catalog },
      })

      aiResultIds.value = res.foodIds ?? []
    } catch (e: any) {
      aiError.value =
        e?.data?.message || e?.message || 'Не удалось подобрать блюда'
    } finally {
      aiLoading.value = false
    }
  }

  return { aiLoading, aiError, aiResultIds, clearAi, submitAiFood }
}