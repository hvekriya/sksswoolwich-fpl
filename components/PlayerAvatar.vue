<template>
  <div
    class="flex overflow-hidden rounded-full bg-slate-700"
    :class="sizeClass"
  >
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="name"
      class="h-full w-full object-cover"
      loading="lazy"
    />
    <span
      v-else
      class="flex h-full w-full items-center justify-center font-bold text-slate-500"
      :class="textSizeClass"
    >
      {{ (name || '?')[0] }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ avatarUrl?: string; name: string; size?: 'sm' | 'md' | 'lg' }>(),
  { size: 'md' }
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-6 w-6'
    case 'lg': return 'h-12 w-12'
    default: return 'h-8 w-8'
  }
})

const textSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-xs'
    case 'lg': return 'text-lg'
    default: return 'text-sm'
  }
})
</script>
