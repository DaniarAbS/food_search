<template>
  <UModal
    :open="open"
    title="✨ Подбор еды с ИИ"
    description="Добавьте блюда, которые хотите, и опишите пожелания — ИИ подберёт из каталога"
    scrollable
    :ui="{ content: 'sm:max-w-2xl' }"
    @update:open="(value) => { if (!value) emit('close') }"
  >
    <template #body>
      <div class="space-y-5">
        <!-- Карточки блюд -->
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800"
        >
          <div class="flex items-center justify-between">
            <p class="font-medium">Блюдо {{ index + 1 }}</p>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="removeCard(card.id)"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Категория">
              <USelect
                v-model="card.category"
                :items="categoryOptions"
                placeholder="Любая"
                icon="i-lucide-utensils"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Для скольких человек">
              <USelect
                v-model="card.people"
                :items="peopleOptions"
                placeholder="Не важно"
                icon="i-lucide-users"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Цена">
              <USelect
                v-model="card.budget"
                :items="budgetOptions"
                placeholder="Любая"
                icon="i-lucide-wallet"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Ингредиенты / ограничения">
              <UInput
                v-model="card.restrictions"
                placeholder="Без лука, без грибов"
                icon="i-lucide-leaf"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="Комментарий">
            <UInput
              v-model="card.comment"
              placeholder="Например: острое, побольше сыра"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Кнопка добавления — не исчезает -->
        <UButton
          block
          color="neutral"
          variant="outline"
          icon="i-lucide-plus"
          label="Добавить блюдо"
          class="border-dashed"
          @click="addCard"
        />

        <!-- Общий комментарий, независимо от карточек -->
        <div class="border-t border-gray-200 pt-5 dark:border-gray-800">
          <UFormField label="Общий комментарий">
            <UTextarea
              v-model="comment"
              :rows="3"
              placeholder="Общие пожелания ко всему заказу"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="w-full space-y-2">
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <UButton
          block
          size="lg"
          icon="i-lucide-sparkles"
          label="Подобрать блюда"
          :loading="loading"
          :disabled="!canSubmit"
          @click="onSubmit"
        />
        <UButton
          block
          color="neutral"
          variant="ghost"
          size="lg"
          label="Закрыть"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { AiCard, AiRequest } from '~/composables/useAiFood'

defineProps<{
  open: boolean
  categoryOptions: string[]
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
  close: []
  submit: [request: AiRequest]
}>()

const peopleOptions = ['1 человек', '2 человека', '3 человека', '4+']
const budgetOptions = ['До 2000 ₸', 'До 2500 ₸', 'До 3000 ₸', 'До 5000 ₸']

let seq = 0
function createCard(): AiCard {
  return {
    id: `card-${Date.now()}-${seq++}`,
    category: undefined,
    people: undefined,
    budget: undefined,
    restrictions: '',
    comment: '',
  }
}

const cards = reactive<AiCard[]>([createCard()])
const comment = ref('')

function addCard() {
  cards.push(createCard())
}

function removeCard(id: string) {
  const i = cards.findIndex(c => c.id === id)
  if (i !== -1) cards.splice(i, 1)
}

const canSubmit = computed(() =>
  comment.value.trim().length > 0 ||
  cards.some(
    c =>
      c.category ||
      c.people ||
      c.budget ||
      c.restrictions.trim() ||
      c.comment.trim()
  )
)

function onSubmit() {
  emit('submit', {
    cards: cards.map(c => ({ ...c })),
    comment: comment.value,
  })
}
</script>