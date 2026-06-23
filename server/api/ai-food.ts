import OpenAI from 'openai'

interface Candidate {
  id: number
  name: string
  price: number
  category: string
  ingredients: string
}

const PER_DISH = 6 // how many options to return per "Блюдо N"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const prompt: string = body?.prompt ?? ''
  const catalog: Candidate[] = Array.isArray(body?.catalog) ? body.catalog : []

  if (!catalog.length) {
    return { foodIds: [] }
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const response = await openai.responses.create({
    model: 'gpt-5.4-mini',
    temperature: 0,
    input: `
You are a food recommendation assistant for a food delivery catalog.

The user described one or more dishes (each "Блюдо N") plus optional general wishes.
Each dish may specify category, budget, number of people, ingredient wishes, and a comment.

User request:
${prompt}

Catalog (ONLY these foods may be recommended):
${JSON.stringify(catalog)}

Rules:
- For EACH "Блюдо N" in the request, return up to ${PER_DISH} best-matching foods, ordered best match first.
- The ingredient field can be an INCLUSION ("с курицей", "побольше сыра" -> prefer foods that have it) or an EXCLUSION ("без лука", "без грибов" -> must NOT contain it). Never return a food that violates an exclusion.
- Respect each dish's category and budget.
- Combine the results for all dishes into one array, in dish order. If a dish has no good match, skip it.
- Use ONLY ids that exist in the catalog. Never invent foods or ids.
- Return ONLY valid JSON in exactly this format: {"foodIds": [1, 2, 3]}
`,
  })

  let result: { foodIds: number[] }
  try {
    result = JSON.parse(response.output_text)
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'ИИ вернул некорректный ответ' })
  }

  // dedupe + drop any hallucinated ids
  const allowed = new Set(catalog.map(c => c.id))
  const foodIds = [...new Set(result.foodIds ?? [])].filter(id => allowed.has(id))

  return { foodIds }
})