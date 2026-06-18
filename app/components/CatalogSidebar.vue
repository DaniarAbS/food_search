<template>
  <aside class="w-64 shrink-0">
    <h2 class="text-2xl font-semibold mb-6">
      Категории
    </h2>

    <div class="space-y-2">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="emit('select-category', category.name)"
        class="
          w-full
          flex
          justify-between
          items-center
          px-4
          py-3
          rounded-lg
          text-left
          hover:bg-gray-100
          transition
        "
      >
        <span>
          {{ category.name }}
        </span>

        <span class="text-gray-500 text-sm">
          {{ category.count }}
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'select-category', category: string): void
}>()

defineProps<{
  categories: {
      id: number
      name: string
      count: number
  }[]
}>()
</script>