<template>
    <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3x1 font-bold">
                Блюда
            </h1>

            <UInput 
                v-model="search"
                placeholder="Поиск блюда, кафе"
                icon="i-lucide-search"
                class="w-80"
            />
        </div>
        <div class="flex flex-wrap gap-3">
            <div class="w-72">
                <div class="flex justify-between text-sm mb-2">
                    <span>
                    {{ priceRange[0] }} ₸
                    </span>

                    <span>
                    {{ priceRange[1] }} ₸
                    </span>
                </div>

                <USlider
                    v-model="priceRange"
                    :min="0"
                    :max="props.maxPrice || 5000"
                    :step="100"
                />
                </div>

                <USelectMenu 
                    v-model="selectedCafe"
                    :items="props.cafeOptions"
                    placeholder="Кафе"
                />

                <USelectMenu 
                    v-model="selectedPortion"
                    :items="portionOptions"
                    placeholder="Порция"
                />

                <USelectMenu
                    v-model="selectedIngredient"
                    :items="props.ingredientOptions"
                    placeholder="Ингредиенты"
                />

                <USelectMenu
                    v-model="selectedSort"
                    :items="sortOptions"
                    placeholder="Сортировка"
                />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = defineModel<string>('search', {
  default: ''
})

const selectedCafe = defineModel<string>('selectedCafe')
  const selectedIngredient = defineModel<string>('selectedIngredient')

const props = defineProps<{
  cafeOptions: string[]
  ingredientOptions: string[]
  maxPrice: number
}>()

const priceRange = defineModel<[number, number]>(
  'priceRange',
  {
    default: () => [0, 5000]
  }
)

watch(() => props.maxPrice, (newMax) => {
  if (priceRange.value[1] > newMax) {
    priceRange.value = [priceRange.value[0], newMax]
  }
})

const selectedPortion = ref()
const selectedSort = ref()

const portionOptions = [
  'до 200 г',
  '200 - 400 г',
  '400+ г'
]

const sortOptions = [
  'По популярности',
  'Сначала дешёвые',
  'Сначала дорогие',
  'По названию'
]

</script>