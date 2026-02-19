<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <div class="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/50 p-8">
      <h1 class="mb-6 text-2xl font-bold text-white">Admin Login</h1>
      <form class="space-y-4" @submit.prevent="signIn">
        <div>
          <label class="mb-2 block text-sm text-slate-400">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            placeholder="admin@example.com"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm text-slate-400">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        <button
          type="submit"
          class="w-full rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-500">
        Create an admin user in your Supabase dashboard (Authentication → Users).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const user = useSupabaseUser()
watch(user, (u) => {
  if (u) navigateTo('/admin')
}, { immediate: true })

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const supabase = useSupabaseClient()

async function signIn() {
  error.value = ''
  loading.value = true
  try {
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (err) {
      error.value = err.message
      return
    }
    await navigateTo('/admin')
  } finally {
    loading.value = false
  }
}
</script>
