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

export function useAiFood() {
  const aiLoading = ref(false)
  const aiError = ref('')
  const aiResultIds = ref<number[] | null>(null)

  function clearAi() {
    aiResultIds.value = null
  }

  function buildAiPrompt(request: AiRequest) {
    const parts: string[] = []

    request.cards.forEach((card, index) => {
      const lines: string[] = []
      if (card.category) lines.push(`Категория: ${card.category}`)
      if (card.people) lines.push(`Количество человек: ${card.people}`)
      if (card.budget) lines.push(`Бюджет: ${card.budget}`)
      if (card.restrictions.trim())
        lines.push(`Ограничения по ингредиентам: ${card.restrictions.trim()}`)
      if (card.comment.trim())
        lines.push(`Пожелания: ${card.comment.trim()}`)

      if (lines.length)
        parts.push(`Блюдо ${index + 1}:\n${lines.join('\n')}`)
    })

    if (request.comment.trim())
      parts.push(`Общий комментарий: ${request.comment.trim()}`)

    return parts.join('\n\n')
  }

  async function submitAiFood(request: AiRequest) {
    aiLoading.value = true
    aiError.value = ''

    try {
      const res = await $fetch<{ foods: { id: number }[] }>('/api/ai-food', {
        method: 'POST',
        body: { prompt: buildAiPrompt(request) },
      })

      aiResultIds.value = res.foods.map(food => food.id)
    } catch (e: any) {
      aiError.value =
        e?.data?.message || e?.message || 'Не удалось подобрать блюда'
    } finally {
      aiLoading.value = false
    }
  }

  return {
    aiLoading,
    aiError,
    aiResultIds,
    clearAi,
    submitAiFood,
  }
}