<template>
  <div class="min-h-screen bg-cream text-espresso overflow-x-hidden font-sans selection:bg-matcha/30 selection:text-espresso relative flex flex-col items-center justify-center py-12 px-6">
    <!-- Noise overlay -->
    <div class="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center z-10">
      
      <!-- LEFT: Editorial Branding Presentation (Hidden on small screens) -->
      <div class="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-8 hero-section">
        <div>
          <span class="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-matcha mb-3 block font-sans">Welcome to your kitchen</span>
          <h1 class="text-7xl font-serif text-espresso tracking-tight leading-none mb-6">Clove.</h1>
          <p class="text-espresso/70 text-base leading-relaxed font-serif italic max-w-sm">
            "A beautifully curated space to store, schedule, and share your favorite culinary discoveries."
          </p>
        </div>

        <!-- Editorial Arch Image -->
        <div class="relative w-full aspect-[3/4] rounded-t-[8rem] overflow-hidden border border-espresso/5 shadow-xl bg-white/40 p-2">
          <div class="w-full h-full rounded-t-[7.5rem] overflow-hidden relative">
            <img src="/img/matcha.jpg" class="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" alt="Culinary art" />
            <div class="absolute inset-0 bg-espresso/5 mix-blend-multiply"></div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Minimal Form Container -->
      <div class="col-span-1 lg:col-span-7 flex flex-col justify-center items-center">
        <!-- Logo for Mobile -->
        <div class="lg:hidden text-center mb-8">
          <h1 class="text-5xl font-serif text-espresso tracking-tight leading-none mb-2">Clove.</h1>
          <p class="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-espresso/40">Digital Kitchen Suite</p>
        </div>

        <div class="w-full max-w-md relative">
          <!-- Main Form Card -->
          <div class="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-[0_16px_48px_rgba(74,43,24,0.05)] flex flex-col transition-all duration-500">
            
            <!-- Panel Header -->
            <div class="text-center mb-8">
              <h2 class="text-3xl md:text-4xl font-serif text-espresso mb-2">
                {{ activePanel === 'login' ? 'Welcome back.' : 'Join Clove.' }}
              </h2>
              <p class="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-espresso/40">
                {{ activePanel === 'login' ? 'Sign in to access your kitchen' : 'Start your digital recipe collection' }}
              </p>
            </div>

            <!-- Login Form -->
            <div v-if="activePanel === 'login'">
              <form class="space-y-5" @submit.prevent="handleLogin">
                <div class="space-y-2">
                  <label class="block text-[0.55rem] font-bold uppercase tracking-[0.2em] text-espresso/50 ml-1">Email Address</label>
                  <input 
                    v-model="loginForm.email" 
                    type="email" 
                    required 
                    class="w-full bg-white/60 border border-espresso/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-matcha focus:ring-4 focus:ring-matcha/5 text-espresso placeholder-espresso/20 transition-all font-medium text-base" 
                    placeholder="chef@clove.be" 
                  />
                </div>
                
                <div class="space-y-2">
                  <label class="block text-[0.55rem] font-bold uppercase tracking-[0.2em] text-espresso/50 ml-1">Password</label>
                  <input 
                    v-model="loginForm.password" 
                    type="password" 
                    required 
                    class="w-full bg-white/60 border border-espresso/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-matcha focus:ring-4 focus:ring-matcha/5 text-espresso placeholder-espresso/20 transition-all font-medium text-base" 
                    placeholder="••••••••" 
                  />
                </div>

                <button 
                  :disabled="loading" 
                  class="w-full bg-espresso text-cream font-bold text-[0.65rem] uppercase tracking-[0.3em] rounded-2xl py-5 mt-6 hover:bg-espresso/90 transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                  {{ loading ? 'Authenticating...' : 'Sign In' }}
                </button>
              </form>

              <div class="mt-8 text-center border-t border-espresso/5 pt-6">
                <button 
                  @click="activePanel = 'register'" 
                  class="text-espresso/50 hover:text-espresso text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-colors decoration-matcha underline underline-offset-8"
                >
                  New to Clove? Create account
                </button>
              </div>
            </div>

            <!-- Register Form -->
            <div v-else>
              <form class="space-y-5" @submit.prevent="handleRegister">
                <div class="space-y-2">
                  <label class="block text-[0.55rem] font-bold uppercase tracking-[0.2em] text-espresso/50 ml-1">Chef Name</label>
                  <input 
                    v-model="registerForm.name" 
                    type="text" 
                    required 
                    class="w-full bg-white/60 border border-espresso/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-matcha focus:ring-4 focus:ring-matcha/5 text-espresso placeholder-espresso/20 transition-all font-medium text-base" 
                    placeholder="Chef Virgile" 
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-[0.55rem] font-bold uppercase tracking-[0.2em] text-espresso/50 ml-1">Email Address</label>
                  <input 
                    v-model="registerForm.email" 
                    type="email" 
                    required 
                    class="w-full bg-white/60 border border-espresso/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-matcha focus:ring-4 focus:ring-matcha/5 text-espresso placeholder-espresso/20 transition-all font-medium text-base" 
                    placeholder="chef@clove.be" 
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-[0.55rem] font-bold uppercase tracking-[0.2em] text-espresso/50 ml-1">Choose Password</label>
                  <input 
                    v-model="registerForm.password" 
                    type="password" 
                    required 
                    class="w-full bg-white/60 border border-espresso/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-matcha focus:ring-4 focus:ring-matcha/5 text-espresso placeholder-espresso/20 transition-all font-medium text-base" 
                    placeholder="••••••••" 
                  />
                </div>

                <button 
                  :disabled="loading" 
                  class="w-full bg-matcha text-espresso font-bold text-[0.65rem] uppercase tracking-[0.3em] rounded-2xl py-5 mt-6 hover:bg-matcha/90 transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                  {{ loading ? 'Creating...' : 'Create Account' }}
                </button>
              </form>

              <div class="mt-8 text-center border-t border-espresso/5 pt-6">
                <button 
                  @click="activePanel = 'login'" 
                  class="text-espresso/50 hover:text-espresso text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-colors decoration-espresso/30 underline underline-offset-8"
                >
                  Have an account? Log in
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>

    <!-- Error/Success Messages -->
    <div v-if="message" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60]">
      <div class="bg-espresso text-cream px-8 py-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl font-medium text-xs uppercase tracking-widest">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const route = useRoute()
const activePanel = ref<'login' | 'register'>('login')
const loading = ref(false)
const currentUser = ref<any>(null)
const message = ref<{ text: string, type: 'error' | 'success' } | null>(null)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })

const getRedirectPath = () => {
  return (route.query.redirect as string) || '/home'
}

onMounted(async () => {
  try {
    const data = await $fetch<{ user: any }>('/api/auth/me')
    if (data?.user) {
      currentUser.value = data.user
      navigateTo(getRedirectPath())
    }
  } catch (e) {}

  setTimeout(() => {
    if (document.activeElement instanceof HTMLInputElement) {
      document.activeElement.blur()
    }
  }, 100)

  // Subtle entrance animation using GSAP
  gsap.fromTo('.hero-section', 
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 1.4, ease: 'power4.out' }
  )
})

const handleLogin = async () => {
  loading.value = true
  message.value = null
  try {
    const res = await $fetch<{ success: boolean, user: any }>('/api/auth/login', {
      method: 'POST',
      body: loginForm.value
    })
    if (res.success) {
      currentUser.value = res.user
      message.value = { text: 'Welcome back!', type: 'success' }
      setTimeout(() => navigateTo(getRedirectPath()), 800)
    }
  } catch (err: any) {
    message.value = { text: err.data?.statusMessage || 'Login failed', type: 'error' }
    setTimeout(() => message.value = null, 3000)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  message.value = null
  try {
    const res = await $fetch<{ success: boolean, user: any }>('/api/auth/register', {
      method: 'POST',
      body: registerForm.value
    })
    if (res.success) {
      currentUser.value = res.user
      message.value = { text: 'Account created!', type: 'success' }
      setTimeout(() => navigateTo(getRedirectPath()), 800)
    }
  } catch (err: any) {
    message.value = { text: err.data?.statusMessage || 'Registration failed', type: 'error' }
    setTimeout(() => message.value = null, 3000)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Smooth typography tracking */
h1, h2 {
  font-feature-settings: "lnum" 1, "kern" 1;
}
</style>
