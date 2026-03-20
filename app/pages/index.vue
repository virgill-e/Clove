<template>
  <div class="flex flex-col md:flex-row w-full h-dvh overflow-hidden font-serif selection:bg-white/30">
    
    <!-- LOGIN PANEL (Matcha) -->
    <div 
      class="relative flex items-center justify-center transition-all duration-900 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group overflow-hidden"
      :class="[
        activePanel === 'login' ? 'basis-full md:basis-[85%]' : 'basis-16 md:basis-24 brightness-90 grayscale-20',
        'bg-matcha bg-[url(/img/matcha.jpg)] bg-cover bg-center'
      ]"
      @click="activePanel !== 'login' ? activePanel = 'login' : null"
    >
       <div 
         class="absolute inset-x-0 inset-y-0 flex items-center justify-center transition-all duration-500 pointer-events-none"
         :class="activePanel === 'register' ? 'opacity-100 bg-white/25 delay-300' : 'opacity-0'"
       >
         <div class="text-espresso drop-shadow-[0_4px_16px_rgba(0,0,0,1)] tracking-[0.5em] font-black uppercase md:-rotate-90 text-xl md:text-3xl whitespace-nowrap">Login</div>
       </div>

       <Transition
         appear
         @before-enter="onBeforeEnter"
         @enter="onEnter"
         @leave="onLeave"
         :css="false"
       >
         <div 
           v-if="activePanel === 'login'"
           class="absolute inset-x-0 inset-y-0 flex items-center justify-center pointer-events-auto z-10"
         >
           <div class="glass-panel bg-white/30 p-8 md:p-14 rounded-[3rem] shadow-2xl w-full max-w-md mx-6 border-[1.5px] border-white/40 cursor-auto" @click.stop>
             <div class="form-item">
               <h2 class="text-4xl text-espresso mb-2 tracking-wide font-normal">Welcome Back</h2>
               <p class="text-espresso/80 mb-8 font-sans font-medium">Enter your details to access your recipes.</p>
             </div>
             
             <form class="space-y-4 font-sans" @submit.prevent="handleLogin">
               <div class="group/input form-item">
                 <label class="block text-xs font-bold uppercase tracking-widest text-espresso/70 mb-1 ml-2 transition-colors group-focus-within/input:text-espresso">Email</label>
                 <input v-model="loginForm.email" type="email" required class="w-full bg-white/40 border-[1.5px] border-white/50 rounded-3xl px-6 py-4 focus:outline-none focus:bg-white/60 focus:border-espresso/80 text-espresso placeholder-espresso/40 transition-all font-medium shadow-sm" placeholder="Virgile@clove.be" />
               </div>
               <div class="group/input form-item">
                 <label class="block text-xs font-bold uppercase tracking-widest text-espresso/70 mb-1 ml-2 transition-colors group-focus-within/input:text-espresso">Password</label>
                 <input v-model="loginForm.password" type="password" required class="w-full bg-white/40 border-[1.5px] border-white/50 rounded-3xl px-6 py-4 focus:outline-none focus:bg-white/60 focus:border-espresso/80 text-espresso placeholder-espresso/40 transition-all font-medium shadow-sm" placeholder="••••••••" />
               </div>
               <button :disabled="loading" class="form-item w-full bg-espresso text-matcha font-bold tracking-widest uppercase rounded-3xl py-4 mt-6 hover:bg-espresso/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
                 {{ loading ? 'Signing In...' : 'Sign In' }}
                 <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
               </button>
             </form>
             
             <!-- Switch to Register button -->
             <div class="form-item mt-8 text-center text-sm font-sans font-medium text-espresso/70">
               New around here? 
               <button @click="activePanel = 'register'" class="font-bold text-espresso ml-1 hover:underline decoration-2 underline-offset-4 transition-all">Create an account</button>
             </div>

             <!-- Message -->
             <div v-if="message && activePanel === 'login'" class="mt-4 text-center font-bold text-xs uppercase" :class="message.type === 'error' ? 'text-red-700' : 'text-green-700'">
               {{ message.text }}
             </div>
           </div>
         </div>
       </Transition>
    </div>


    <!-- REGISTER PANEL (Espresso) -->
    <div 
      class="relative flex items-center justify-center transition-all duration-900 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group overflow-hidden"
      :class="[
        activePanel === 'register' ? 'basis-full md:basis-[85%]' : 'basis-16 md:basis-24 brightness-90 grayscale-20',
        'bg-espresso bg-[url(/img/espresso.jpeg)] bg-cover bg-center'
      ]"
      @click="activePanel !== 'register' ? activePanel = 'register' : null"
    >
       <div 
         class="absolute inset-x-0 inset-y-0 flex items-center justify-center transition-all duration-500 pointer-events-none"
         :class="activePanel === 'login' ? 'opacity-100 bg-black/25 delay-300' : 'opacity-0'"
       >
         <div class="text-matcha drop-shadow-[0_0_20px_rgba(255,255,255,1)] tracking-[0.5em] font-black uppercase md:-rotate-90 text-xl md:text-3xl whitespace-nowrap">Register</div>
       </div>

       <Transition
         appear
         @before-enter="onBeforeEnter"
         @enter="onEnter"
         @leave="onLeave"
         :css="false"
       >
         <div 
           v-if="activePanel === 'register' && !currentUser"
           class="absolute inset-x-0 inset-y-0 flex items-center justify-center pointer-events-auto z-10"
         >
           <div class="glass-panel bg-black/25 p-8 md:p-14 rounded-[3rem] shadow-2xl w-full max-w-md mx-6 border-[1.5px] border-white/20 cursor-auto" @click.stop>
             <div class="form-item">
               <h2 class="text-4xl text-matcha mb-2 tracking-wide font-normal">Join Clove</h2>
               <p class="text-matcha/80 mb-8 font-sans font-medium">Start your digital recipe book today.</p>
             </div>
             
             <form class="space-y-4 font-sans" @submit.prevent="handleRegister">
               <div class="group/input form-item">
                 <label class="block text-xs font-bold uppercase tracking-widest text-matcha/70 mb-1 ml-2 transition-colors group-focus-within/input:text-matcha">Name</label>
                 <input v-model="registerForm.name" type="text" required class="w-full bg-white/20 border-[1.5px] border-white/30 rounded-3xl px-6 py-3.5 focus:outline-none focus:bg-white/30 focus:border-matcha/80 text-white placeholder-white/50 transition-all font-medium shadow-sm" placeholder="Virgile Bigaré" />
               </div>
               <div class="group/input form-item">
                 <label class="block text-xs font-bold uppercase tracking-widest text-matcha/70 mb-1 ml-2 transition-colors group-focus-within/input:text-matcha">Email</label>
                 <input v-model="registerForm.email" type="email" required class="w-full bg-white/20 border-[1.5px] border-white/30 rounded-3xl px-6 py-3.5 focus:outline-none focus:bg-white/30 focus:border-matcha/80 text-white placeholder-white/50 transition-all font-medium shadow-sm" placeholder="Virgile@clove.be" />
               </div>
               <div class="group/input form-item">
                 <label class="block text-xs font-bold uppercase tracking-widest text-matcha/70 mb-1 ml-2 transition-colors group-focus-within/input:text-matcha">Password</label>
                 <input v-model="registerForm.password" type="password" required class="w-full bg-white/20 border-[1.5px] border-white/30 rounded-3xl px-6 py-3.5 focus:outline-none focus:bg-white/30 focus:border-matcha/80 text-white placeholder-white/50 transition-all font-medium shadow-sm" placeholder="••••••••" />
               </div>
               <button :disabled="loading" class="form-item w-full bg-matcha text-espresso font-bold tracking-widest uppercase rounded-3xl py-4 mt-6 hover:bg-matcha/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
                 {{ loading ? 'Creating...' : 'Create Account' }}
                 <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
               </button>
             </form>

             <!-- Switch to Login button -->
             <div class="form-item mt-6 text-center text-sm font-sans font-medium text-matcha/70">
               Already have an account? 
               <button @click="activePanel = 'login'" class="font-bold text-matcha ml-1 hover:underline decoration-2 underline-offset-4 transition-all">Log in</button>
             </div>

             <!-- Message -->
             <div v-if="message && activePanel === 'register'" class="mt-4 text-center font-bold text-xs uppercase" :class="message.type === 'error' ? 'text-red-400' : 'text-green-400'">
               {{ message.text }}
             </div>
           </div>
         </div>

         <!-- Logged in state for current user -->
         <div v-else-if="currentUser" class="absolute inset-x-0 inset-y-0 flex items-center justify-center pointer-events-auto z-10">
            <div class="glass-panel bg-black/25 p-8 md:p-14 rounded-[3rem] shadow-2xl w-full max-w-md mx-6 border-[1.5px] border-white/20 text-center">
              <div class="form-item">
                <h2 class="text-4xl text-matcha mb-2 tracking-wide font-normal">Welcome, {{ (currentUser as any).name }}</h2>
                <p class="text-matcha/80 mb-8 font-sans font-medium">You are now connected to your kitchen.</p>
                <button @click="handleLogout" class="w-full bg-matcha text-espresso font-bold tracking-widest uppercase rounded-3xl py-4 hover:bg-matcha/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
                  Sign Out
                </button>
              </div>
            </div>
         </div>
       </Transition>
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
  // Fetch current user
  try {
    const data = await $fetch<{ user: any }>('/api/auth/me')
    if (data?.user) {
      currentUser.value = data.user
      navigateTo('/home') // Redirect if already logged in
    }
  } catch (e) {
    // No user logged in
  }

  // Use a slight delay to catch browser/extension-level autofocus
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
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  currentUser.value = null
  message.value = null
  activePanel.value = 'login'
}

const onBeforeEnter = (el: Element) => {
  const container = el as HTMLElement
  const glass = container.querySelector('.glass-panel') as HTMLElement
  const items = container.querySelectorAll('.form-item')
  
  gsap.set(container, { opacity: 1 }) // Container is visible immediately
  if (glass) {
    gsap.set(glass, { 
      y: 50, 
      opacity: 0, 
      scale: 0.9,
      '--blur': '0px',
      isolation: 'isolate'
    })
  }
  if (items.length) {
    gsap.set(items, { opacity: 0, y: 15 })
  }
}

const onEnter = (el: Element, done: () => void) => {
  const container = el as HTMLElement
  const glass = container.querySelector('.glass-panel') as HTMLElement
  const items = container.querySelectorAll('.form-item')
  
  const tl = gsap.timeline({ 
    onComplete: done,
    delay: 0.4 // Wait for panel expansion
  })
  
  tl.to(glass, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'power4.out'
  })
  .to(glass, {
    '--blur': '24px',
    duration: 1,
    ease: 'power2.inOut'
  }, '-=0.4')
  .to(items, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.6')
}

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    scale: 0.95,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<style scoped>
.glass-panel {
  backdrop-filter: blur(var(--blur, 0px));
  -webkit-backdrop-filter: blur(var(--blur, 0px));
  will-change: backdrop-filter, transform, opacity;
}
</style>
