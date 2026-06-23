export function useFoodFilters(foods: Ref<any[]>) {
  const selectedCategory = ref('all')
  const search = ref('')
  const selectedCafe = ref('Все Кафе')
  const selectedIngredient = ref('Все ингредиенты')
  const priceRange = ref<[number, number]>([0, 5000])

  const categories = computed(() => {
    const counts = new Map()

    foods.value.forEach(food => {
      counts.set(
        food.category,
        (counts.get(food.category) || 0) + 1
      )
    })

    return [
      {
        id: 0,
        name: 'Все блюда',
        count: foods.value.length
      },

      ...Array.from(counts.entries()).map(
        ([name, count], index) => ({
          id: index + 1,
          name,
          count
        })
      )
    ]
  })

  const cafeOptions = computed(() => {
  const cafes = [
    ...new Set(
      foods.value.map(food => food.cafeName)
    )
  ]

  return [
    'Все Кафе',
    ...cafes
  ]
})  

const ingredientOptions = computed(() => {
  const ingredients = new Set<string>()

  foods.value.forEach(food => {
    food.ingredients.forEach((ingredient: string) => {
      ingredients.add(ingredient)
    })
  })

  return [
    'Все ингредиенты',
    ...Array.from(ingredients).sort()
  ]
})

const filteredFoods = computed(() => {
  return foods.value.filter(food => {
    const matchesCategory =
      selectedCategory.value === 'all' ||
      selectedCategory.value === 'Все блюда' ||
      food.category === selectedCategory.value

    const matchesCafe =
      selectedCafe.value === 'Все Кафе' ||
      food.cafeName === selectedCafe.value

    const matchesSearch =
      food.foodName
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||

      food.cafeName
        .toLowerCase()
        .includes(search.value.toLowerCase())

    const matchesPrice =
      food.price >= priceRange.value[0] &&
      food.price <= priceRange.value[1]

    const matchesIngredient =
      selectedIngredient.value === 'Все ингредиенты' ||
      food.ingredients.includes(
        selectedIngredient.value
      )

    return (
      matchesCategory &&
      matchesSearch &&
      matchesCafe &&
      matchesPrice &&
      matchesIngredient
    )
  })
})

  return {
    categories,
    cafeOptions,
    ingredientOptions,
    filteredFoods,

    selectedCategory,
    search,
    selectedCafe,
    selectedIngredient,
    priceRange
  }
}