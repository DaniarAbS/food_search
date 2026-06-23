import OpenAI from 'openai'
import { supabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    console.log('AI FOOD API CALLED')
    const body = await readBody(event)

    const prompt = body?.prompt ?? ''
    
    console.log(
        process.env.OPENAI_API_KEY?.slice(0, 10)
    )

    const { data: foods, error } = await supabase
        .from('food')
        .select(`
                id,
                name,
                price,
                ingredients,
                servings,

                restaurants (
                    name
                ),

                categories (
                    name
                )
            `)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    const catalog = foods.map((food: any) => ({
        id: food.id,
        name: food.name,
        price: food.price,
        ingredients: food.ingredients,
        servings: food.servings,
        restaurant: (food.restaurants as any)?.name,
        category: (food.categories as any)?.name    
    }))

    const response = await openai.responses.create({
        model: "gpt-5.4-mini",
        temperature: 0,
        input: `
    You are a food recommendation assistant.

    User request:
        ${prompt}

    Catalog:
        ${JSON.stringify(catalog)}

    Rules:
    - Use ONLY foods from catalog.
    - Never invent foods.
    - Carefully analyze ingredients.
    - If user requests "something", prioritize foods containing "something".
    - If user excludes an ingredient, do not select foods containing it.
    - Rank foods from best match to worst match.
    - Return only IDs from the catalog.
    - Return ONLY valid JSON.

    Format:

    {
    "foodIds": [1, 2, 3]
    }
        `
    })

    console.log(response.output_text)

    let result: { foodIds: number[] }

    try {
        result = JSON.parse(response.output_text)
    } catch {
        throw createError({
            statusCode: 502,
            statusMessage: "ИИ вернул некорректный ответ"
        })
    }
    
    const selectedFoods = result.foodIds
        .map((id: number) => foods.find((food: any) => food.id === id))
        .filter(Boolean)

    return {
        foods: selectedFoods
    }
})