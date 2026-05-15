<template>
  <div class="flex flex-col md:flex-row w-full h-dvh overflow-hidden bg-cream font-sans selection:bg-matcha/30 selection:text-espresso relative">
    <!-- Noise overlay -->
    <div class="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- Left Panel (Login) -->
    <div 
      class="relative flex-1 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group overflow-hidden border-b md:border-b-0 md:border-r border-espresso/10"
      :class="[
        activePanel === 'login' ? 'md:grow-[1.5]' : 'md:grow-[0.5] brightness-75 grayscale-[0.2]',
      ]"
      @click="activePanel !== 'login' ? activePanel = 'login' : null"
    >
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 bg-matcha/20 z-0"></div>
      <img src="/img/matcha.jpg" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" alt="Matcha" />
      <div class="absolute inset-0 bg-linear-to-b from-espresso/40 to-espresso/80 md:from-transparent md:to-espresso/60 z-1"></div>

      <!-- Vertical Label -->
      <div 
        class="absolute inset-0 flex items-center justify-center transition-all duration-700 pointer-events-none z-10"
        :class="activePanel === 'login' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
      >
        <div class="text-cream font-serif italic text-4xl md:text-6xl md:-rotate-90 tracking-tighter drop-shadow-2xl">Login.</div>
      </div>

      <!-- Form Content -->
      <Transition @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" :css="false">
        <div v-if="activePanel === 'login'" class="relative z-20 w-full max-w-md px-8">
          <div class="glass-panel bg-white/10 backdrop-blur-3xl p-10 md:p-14 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/20 ring-1 ring-white/10">
            <div class="form-item overflow-hidden mb-8 text-center">
              <h2 class="text-5xl md:text-6xl font-serif text-cream leading-none tracking-tight mb-4">Welcome back.</h2>
              <p class="text-cream/60 font-medium text-sm tracking-wide uppercase">Your recipes are waiting.</p>
            </div>

            <form class="space-y-5" @submit.prevent="handleLogin">
              <div class="form-item space-y-1.5">
                <label class="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-cream/40 ml-1">Email</label>
                <input v-model="loginForm.email" type="email" required class="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:bg-white/20 focus:border-white/40 text-cream placeholder-cream/20 transition-all font-medium" placeholder="chef@clove.be" />
              </div>
              <div class="form-item space-y-1.5">
                <label class="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-cream/40 ml-1">Password</label>
                <input v-model="loginForm.password" type="password" required class="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:bg-white/20 focus:border-white/40 text-cream placeholder-cream/20 transition-all font-medium" placeholder="••••••••" />
              </div>
              <button :disabled="loading" class="form-item w-full bg-matcha text-espresso font-bold text-[0.65rem] uppercase tracking-[0.3em] rounded-2xl py-5 mt-8 hover:bg-matcha/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                {{ loading ? 'Authenticating...' : 'Sign In' }}
              </button>
            </form>

            <div class="form-item mt-10 text-center">
              <button @click="activePanel = 'register'" class="text-cream/40 hover:text-cream text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-colors decoration-matcha/30 underline underline-offset-8">New here? Create account</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Right Panel (Register) -->
    <div 
      class="relative flex-1 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group overflow-hidden"
      :class="[
        activePanel === 'register' ? 'md:grow-[1.5]' : 'md:grow-[0.5] brightness-75 grayscale-[0.2]',
      ]"
      @click="activePanel !== 'register' ? activePanel = 'register' : null"
    >
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 bg-espresso/20 z-0"></div>
      <img src="/img/espresso.jpeg" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" alt="Espresso" />
      <div class="absolute inset-0 bg-linear-to-b from-matcha/40 to-matcha/80 md:from-transparent md:to-matcha/60 z-1"></div>

      <!-- Vertical Label -->
      <div 
        class="absolute inset-0 flex items-center justify-center transition-all duration-700 pointer-events-none z-10"
        :class="activePanel === 'register' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
      >
        <div class="text-cream font-serif italic text-4xl md:text-6xl md:-rotate-90 tracking-tighter drop-shadow-2xl">Join Us.</div>
      </div>

      <!-- Form Content -->
      <Transition @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" :css="false">
        <div v-if="activePanel === 'register'" class="relative z-20 w-full max-w-md px-8">
          <div class="glass-panel bg-white/10 backdrop-blur-3xl p-10 md:p-14 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/20 ring-1 ring-white/10">
            <div class="form-item overflow-hidden mb-8 text-center">
              <h2 class="text-5xl md:text-6xl font-serif text-cream leading-none tracking-tight mb-4">Join Clove.</h2>
              <p class="text-cream/60 font-medium text-sm tracking-wide uppercase">Start your digital collection.</p>
            </div>

            <form class="space-y-5" @submit.prevent="handleRegister">
              <div class="form-item space-y-1.5">
                <label class="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-cream/40 ml-1">Name</label>
                <input v-model="registerForm.name" type="text" required class="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:bg-white/20 focus:border-white/40 text-cream placeholder-cream/20 transition-all font-medium" placeholder="Chef Virgile" />
              </div>
              <div class="form-item space-y-1.5">
                <label class="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-cream/40 ml-1">Email</label>
                <input v-model="registerForm.email" type="email" required class="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:bg-white/20 focus:border-white/40 text-cream placeholder-cream/20 transition-all font-medium" placeholder="chef@clove.be" />
              </div>
              <div class="form-item space-y-1.5">
                <label class="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-cream/40 ml-1">Password</label>
                <input v-model="registerForm.password" type="password" required class="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:bg-white/20 focus:border-white/40 text-cream placeholder-cream/20 transition-all font-medium" placeholder="••••••••" />
              </div>
              <button :disabled="loading" class="form-item w-full bg-cream text-espresso font-bold text-[0.65rem] uppercase tracking-[0.3em] rounded-2xl py-5 mt-8 hover:bg-cream/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                {{ loading ? 'Creating...' : 'Create Account' }}
              </button>
            </form>

            <div class="form-item mt-10 text-center">
              <button @click="activePanel = 'login'" class="text-cream/40 hover:text-cream text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-colors decoration-cream/30 underline underline-offset-8">Have an account? Log in</button>
            </div>
          </div>
        </div>
      </Transition>
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

const activePanel = ref<'login' | 'register'>('login')
const loading = ref(false)
const currentUser = ref<any>(null)
const message = ref<{ text: string, type: 'error' | 'success' } | null>(null)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })

onMounted(async () => {
  try {
    const data = await $fetch<{ user: any }>('/api/auth/me')
    if (data?.user) {
      currentUser.value = data.user
      navigateTo('/home')
    }
  } catch (e) {}

  setTimeout(() => {
    if (document.activeElement instanceof HTMLInputElement) {
      document.activeElement.blur()
    }
  }, 100)
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
      setTimeout(() => navigateTo('/home'), 800)
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
      setTimeout(() => navigateTo('/home'), 800)
    }
  } catch (err: any) {
    message.value = { text: err.data?.statusMessage || 'Registration failed', type: 'error' }
    setTimeout(() => message.value = null, 3000)
  } finally {
    loading.value = false
  }
}

// GSAP Animations
const onBeforeEnter = (el: Element) => {
  const glass = (el as HTMLElement).querySelector('.glass-panel')
  const items = (el as HTMLElement).querySelectorAll('.form-item')
  gsap.set(glass, { opacity: 0, y: 30, scale: 0.95 })
  gsap.set(items, { opacity: 0, y: 20 })
}

const onEnter = (el: Element, done: () => void) => {
  const glass = (el as HTMLElement).querySelector('.glass-panel')
  const items = (el as HTMLElement).querySelectorAll('.form-item')
  const tl = gsap.timeline({ onComplete: done })
  tl.to(glass, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out' })
    .to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.8')
}

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power2.in', onComplete: done })
}
</script>

<style scoped>
.glass-panel {
  will-change: transform, opacity;
}
</style>
