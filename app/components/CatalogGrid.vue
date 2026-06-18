<template>
    <div
        class="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6
        "
    >
        <FoodCard 
            v-for="food in foods"
            :key="food.id"
            :image="food.image"
            :food-name="food.foodName"
            :cafe-name="food.cafeName"
            :price="food.price"
        />
    </div>
</template>

<script setup lang="ts">
interface Food {
  id: number
  image: string
  foodName: string
  cafeName: string
  price: number
}

defineProps<{
  foods: Food[]
}>()
</script>