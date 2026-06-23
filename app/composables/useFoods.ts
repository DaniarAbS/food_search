export async function useFoods() {
  const { $supabase } = useNuxtApp()

  const { data } = await $supabase
    .from('food')
    .select(`
      id,
      name,
      price,
      ingredients,
      image_url,
      category_id,

      restaurants (
        id,
        name,
        gis_link
      ),

      categories (
        id,
        name
      )
    `)
    .range(0, 4000)

  const foods = ref(
    (data ?? []).map(food => ({
      id: food.id,

      image:
        food.image_url ??
        'https://placehold.co/400x300',

      foodName: food.name,

      cafeName:
        (food.restaurants as any)?.name ?? '',

      category:
        (food.categories as any)?.name ?? '',

      price: food.price,

      ingredients:
        food.ingredients
          ?.split(',')
          .map((x: string) => x.trim()) ?? []
    }))
  )

  return {
    foods
  }
}