<template>
  <div class="flex flex-col md:flex-row w-full h-[100dvh] overflow-hidden font-serif selection:bg-white/30">
    
    <!-- LOGIN PANEL (Matcha) -->
    <div 
      class="relative flex items-center justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group overflow-hidden"
      :class="[
        activePanel === 'login' ? 'basis-full md:basis-[85%]' : 'basis-16 md:basis-24 brightness-90 grayscale-[20%]',
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

       <div 
         class="absolute inset-x-0 inset-y-0 flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
         :class="activePanel === 'login' ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-[150%] pointer-events-none'"
       >
         <div class="bg-white/30 backdrop-blur-xl p-8 md:p-14 rounded-[3rem] shadow-2xl w-full max-w-md mx-6 border-[1.5px] border-white/40 cursor-auto" @click.stop>
           <h2 class="text-4xl text-espresso mb-2 tracking-wide font-normal">Welcome Back</h2>
           <p class="text-espresso/80 mb-8 font-sans font-medium">Enter your details to access your recipes.</p>
           
           <form class="space-y-4 font-sans" @submit.prevent>
             <div class="group/input">
               <label class="block text-xs font-bold uppercase tracking-widest text-espresso/70 mb-1 ml-2 transition-colors group-focus-within/input:text-espresso">Email</label>
               <input type="email" class="w-full bg-white/40 border-[1.5px] border-white/50 rounded-3xl px-6 py-4 focus:outline-none focus:bg-white/60 focus:border-espresso/80 text-espresso placeholder-espresso/40 transition-all font-medium shadow-sm" placeholder="chef@clove.com" />
             </div>
             <div class="group/input">
               <label class="block text-xs font-bold uppercase tracking-widest text-espresso/70 mb-1 ml-2 transition-colors group-focus-within/input:text-espresso">Password</label>
               <input type="password" class="w-full bg-white/40 border-[1.5px] border-white/50 rounded-3xl px-6 py-4 focus:outline-none focus:bg-white/60 focus:border-espresso/80 text-espresso placeholder-espresso/40 transition-all font-medium shadow-sm" placeholder="••••••••" />
             </div>
             <button class="w-full bg-espresso text-matcha font-bold tracking-widest uppercase rounded-3xl py-4 mt-6 hover:bg-espresso/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2">
               Sign In
               <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
             </button>
           </form>
           
           <!-- Switch to Register button -->
           <div class="mt-8 text-center text-sm font-sans font-medium text-espresso/70">
             New around here? 
             <button @click="activePanel = 'register'" class="font-bold text-espresso ml-1 hover:underline decoration-2 underline-offset-4 transition-all">Create an account</button>
           </div>
         </div>
       </div>
    </div>


    <!-- REGISTER PANEL (Espresso) -->
    <div 
      class="relative flex items-center justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group overflow-hidden"
      :class="[
        activePanel === 'register' ? 'basis-full md:basis-[85%]' : 'basis-16 md:basis-24 brightness-90 grayscale-[20%]',
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

       <div 
         class="absolute inset-x-0 inset-y-0 flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
         :class="activePanel === 'register' ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 -translate-y-[150%] pointer-events-none'"
       >
         <div class="bg-black/25 backdrop-blur-xl p-8 md:p-14 rounded-[3rem] shadow-2xl w-full max-w-md mx-6 border-[1.5px] border-white/20 cursor-auto" @click.stop>
           <h2 class="text-4xl text-matcha mb-2 tracking-wide font-normal">Join Clove</h2>
           <p class="text-matcha/80 mb-8 font-sans font-medium">Start your digital recipe book today.</p>
           
           <form class="space-y-4 font-sans" @submit.prevent>
             <div class="group/input">
               <label class="block text-xs font-bold uppercase tracking-widest text-matcha/70 mb-1 ml-2 transition-colors group-focus-within/input:text-matcha">Name</label>
               <input type="text" class="w-full bg-white/20 border-[1.5px] border-white/30 rounded-3xl px-6 py-3.5 focus:outline-none focus:bg-white/30 focus:border-matcha/80 text-white placeholder-white/50 transition-all font-medium shadow-sm" placeholder="Julia Child" />
             </div>
             <div class="group/input">
               <label class="block text-xs font-bold uppercase tracking-widest text-matcha/70 mb-1 ml-2 transition-colors group-focus-within/input:text-matcha">Email</label>
               <input type="email" class="w-full bg-white/20 border-[1.5px] border-white/30 rounded-3xl px-6 py-3.5 focus:outline-none focus:bg-white/30 focus:border-matcha/80 text-white placeholder-white/50 transition-all font-medium shadow-sm" placeholder="chef@clove.com" />
             </div>
             <div class="group/input">
               <label class="block text-xs font-bold uppercase tracking-widest text-matcha/70 mb-1 ml-2 transition-colors group-focus-within/input:text-matcha">Password</label>
               <input type="password" class="w-full bg-white/20 border-[1.5px] border-white/30 rounded-3xl px-6 py-3.5 focus:outline-none focus:bg-white/30 focus:border-matcha/80 text-white placeholder-white/50 transition-all font-medium shadow-sm" placeholder="••••••••" />
             </div>
             <button class="w-full bg-matcha text-espresso font-bold tracking-widest uppercase rounded-3xl py-4 mt-6 hover:bg-matcha/90 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2">
               Create Account
               <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
             </button>
           </form>

           <!-- Switch to Login button -->
           <div class="mt-6 text-center text-sm font-sans font-medium text-matcha/70">
             Already have an account? 
             <button @click="activePanel = 'login'" class="font-bold text-matcha ml-1 hover:underline decoration-2 underline-offset-4 transition-all">Log in</button>
           </div>
         </div>
       </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activePanel = ref<'login' | 'register'>('login')
</script>
