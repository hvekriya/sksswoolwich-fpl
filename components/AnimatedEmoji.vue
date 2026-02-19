<template>
  <picture class="inline-block align-middle">
    <source
      :srcset="`https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.webp`"
      type="image/webp"
    />
    <img
      :src="`https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.gif`"
      :alt="fallback"
      :width="size"
      :height="size"
      class="inline-block"
      loading="eager"
    />
  </picture>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type: 'fire' | 'cold' | 'love' | 'trophy' | 'goals' | 'assists' | 'medal'
    size?: number
  }>(),
  { size: 24 }
)

const codepointMap = {
  fire: '1f525',
  cold: '1f976',
  love: '1f970',
  trophy: '1f3c6',
  goals: '26bd',
  assists: '1f3af',
  medal: '1f947',
} as const

const fallbackMap = {
  fire: '🔥',
  cold: '🥶',
  love: '🥰',
  trophy: '🏆',
  goals: '⚽',
  assists: '🎯',
  medal: '🏅',
} as const

const codepoint = codepointMap[props.type]
const fallback = fallbackMap[props.type]
</script>
