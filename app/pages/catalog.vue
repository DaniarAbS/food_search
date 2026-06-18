<template>
    <div class="container mx-auto p-8">
        <div class="flex gap-10">
            <CatalogSidebar 
                :categories="categories"
                :selected-category="selectedCategory"
                @select-category="selectedCategory = $event"
            />

            <div class="flex-1">
                <CatalogFilters 
                  v-model:search="search"
                  v-model:selected-cafe="selectedCafe"
                  v-model:selected-ingredient="selectedIngredient"
                  v-model:price-range="priceRange"
                  :cafe-options="cafeOptions"
                  :ingredient-options="ingredientOptions"
                  :max-price="maxPrice"
                />
                <CatalogGrid :foods="paginatedFoods"/>
                
                <div class="flex justify-center mt-10">
                    <UPagination
                        v-model:page="page"
                        :items-per-page="pageSize"
                        :total="filteredFoods.length"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CatalogGrid from '~/components/CatalogGrid.vue';
const selectedCategory = ref('all')
const search = ref('')
const selectedCafe = ref('Все Кафе')
const selectedIngredient = ref('Все ингредиенты')
const priceRange = ref<[number, number]>([0, 5000])

const cafeOptions = computed(() => {
  const cafes = [...new Set(
    foods.value.map(food => food.cafeName)
  )]

  return [
    'Все Кафе',
    ...cafes
  ]
})

const ingredientOptions = computed(() => {
  const ingredients = new Set<string>()

  foods.value.forEach(food => {
    food.ingredients.forEach(i => {
      ingredients.add(i)
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

const maxPrice = computed(() => {
  if (foods.value.length === 0) return 5000
  return Math.max(...foods.value.map(food => food.price))
})

const page = ref(1)
const pageSize = 8

watch(search, () => {
  page.value = 1
})

watch(selectedCategory, () => {
  page.value = 1
})

watch(selectedCafe, () => {
  page.value = 1
})

watch(priceRange, () => {
  page.value = 1
}, {
  deep: true
})

watch(selectedIngredient, () => {
  page.value = 1
})

const paginatedFoods = computed(() => {
  const start = (page.value - 1) * pageSize

  return filteredFoods.value.slice(
    start,
    start + pageSize
  )
})

const categories = [
  {
    id: 0,
    name: 'Все блюда',
    count: 124
  },
  {
    id: 1,
    name: 'Супы',
    count: 12
  },
  {
    id: 2,
    name: 'Плов',
    count: 8
  },
  {
    id: 3,
    name: 'Пицца',
    count: 14
  },
  {
    id: 4,
    name: 'Бургеры',
    count: 15
  },
  {
    id: 5,
    name: 'Десерты',
    count: 9
  }
]

const foods = ref([
    {
        id: 1,
        image: 'https://picsum.photos/400/300?1',
        foodName: 'Плов по-ташкентски',
        cafeName: 'Кафе Самарканд',
        price: 2200,
        category: 'Плов',
        portion: 350,
        ingredients: [
          'Beef',
          'Rice',
          'Carrot',
          'Onion'
        ]
    },
    {
        id: 2,
        image: 'https://picsum.photos/400/300?2',
        foodName: 'Лагман',
        cafeName: 'Кафе Дастархан',
        price: 1800,
        category: 'Супы',
        portion: 550,
        ingredients: [
          'Dough',
          'Rice',
          'Carrot',
          'Onion'
        ]
    },
    {
        id: 3,
        image: 'https://picsum.photos/400/300?3',
        foodName: 'Шашлык',
        cafeName: 'Уют',
        price: 2500,
        category: 'Плов',
        portion: 350,
        ingredients: [
          'Beef',
          'Tomato',
          'Onion'
        ]
    },
    {
        id: 4,
        image: 'https://picsum.photos/400/300?4',
        foodName: 'Пицца Пепперони',
        cafeName: 'Pizza House',
        price: 3200,
        category: 'Пицца',
        portion: 450,
        ingredients: [
          'Cheese',
          'Tomato',
          'Dough'
        ]
    },
    {
        id: 5,
        image: 'https://picsum.photos/400/300?5',
        foodName: 'Пицца Пепперони',
        cafeName: 'Pizza House',
        price: 3200,
        category: 'Пицца',
        portion: 450,
        ingredients: [
          'Cheese',
          'Tomato',
          'Dough'
        ]
    },
    {
        id: 6,
        image: 'https://picsum.photos/400/300?6',
        foodName: 'Пицца Пепперони',
        cafeName: 'Pizza House',
        price: 3200,
        category: 'Пицца',
        portion: 450,
        ingredients: [
          'Cheese',
          'Tomato',
          'Dough'
        ]
    },
    {
        id: 7,
        image: 'https://picsum.photos/400/300?7',
        foodName: 'Пицца Пепперони',
        cafeName: 'Pizza House',
        price: 3200,
        category: 'Бургеры',
        portion: 450,
        ingredients: [
          'Cheese',
          'Tomato',
          'Dough'
        ]
    },
    {
        id: 8,
        image: 'https://picsum.photos/400/300?8',
        foodName: 'Пицца Пепперони',
        cafeName: 'Pizza House',
        price: 3200,
        category: 'Десерты',
        portion: 450,
        ingredients: [
          'Cheese',
          'Tomato',
          'Dough'
        ]
    },
    {
        id: 9,
        image: 'https://picsum.photos/400/300?9',
        foodName: 'Пицца Пепперони',
        cafeName: 'Pizza House',
        price: 3200,
        category: 'Бургеры',
        portion: 450,
        ingredients: [
          'Cheese',
          'Tomato',
          'Dough'
        ]
    }
])
</script>