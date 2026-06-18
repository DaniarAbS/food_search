<template> 
    <UCard class="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <img 
            :src="image" 
            :alt="foodName" 
            class="w-full h-56 object-cover">
        <div class="mt-4 space-y-1">
            <div class="text-2xl font-bold">
                {{ price }} ₸
            </div>

            <div class="text-base font-medium line-clamp-2">
                {{ foodName }}
            </div>

            <div class="text-sm text-gray-500">
                {{ cafeName }}
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
    defineProps<{
        image: string,
        foodName: string,
        cafeName: string,
        price: number
    }>()
</script>