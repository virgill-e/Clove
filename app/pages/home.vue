<template>
  <div class="min-h-screen bg-matcha overflow-x-hidden font-serif selection:bg-espresso/10 selection:text-espresso">
    <!-- TOP NAVIGATION - Refined & Clear -->
    <header class="p-6 md:px-12 md:py-8 flex items-center justify-between bg-matcha/80 backdrop-blur-xl sticky top-0 z-50 border-b border-espresso/10">
      <div class="flex items-center gap-6">
        <h1 class="text-4xl font-normal text-espresso tracking-tight">Clove</h1>
        <div class="hidden md:block h-8 w-px bg-espresso/10"></div>
        <p class="hidden md:block text-espresso/60 font-sans font-black text-[0.7rem] uppercase tracking-[0.4em] mt-1">Cook and love</p>
      </div>
      
      <div class="flex items-center gap-10">
        <div class="relative group cursor-pointer flex items-center gap-4 py-2 pl-2 pr-6 rounded-full border border-espresso/10 bg-white/5 hover:bg-white/20 hover:border-espresso/20 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-espresso/5 active:scale-[0.98]">
          <div class="w-12 h-12 rounded-full bg-espresso text-matcha flex items-center justify-center font-sans font-black text-sm uppercase shadow-md relative group-hover:scale-105 transition-transform duration-500 overflow-hidden ring-4 ring-matcha/30">
            <div class="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {{ user?.name?.[0] || 'V' }}
          </div>
          <div class="flex flex-col">
            <span class="font-sans font-black text-[0.75rem] uppercase tracking-widest text-espresso leading-none mb-1.5">{{ user?.name || 'Profile' }}</span>
            <div class="relative h-3 overflow-hidden">
              <div class="flex flex-col transition-all duration-500">
                <span class="h-3 flex items-center font-sans font-black text-[0.6rem] text-espresso uppercase tracking-widest gap-1.5 whitespace-nowrap">
                  Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12 md:py-24">
      
      <!-- HERO & SEARCH AREA - Bold & Focused -->
      <section class="max-w-3xl mx-auto text-center mb-32">
        <h2 class="text-6xl md:text-8xl text-espresso mb-12 leading-[1.05] font-light">
          Your <span class="italic text-espresso/80">curated</span> <br/> 
          <span class="font-normal">collection.</span>
        </h2>
        
        <div class="relative max-w-2xl mx-auto mb-14 drop-shadow-sm">
          <input 
            type="text" 
            placeholder="Find a recipe..." 
            class="w-full bg-white/40 border-2 border-white/50 rounded-full px-14 py-6 focus:outline-none focus:bg-white/60 focus:border-espresso/30 text-espresso placeholder-espresso/40 transition-all font-sans font-bold text-base tracking-wide shadow-inner"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <!-- TAG FILTERS - High Contrast Pills -->
        <div class="flex items-center justify-center gap-3 flex-wrap font-sans font-black text-[0.7rem] uppercase tracking-[0.25em]">
           <button class="bg-espresso text-matcha px-8 py-3 rounded-full shadow-lg shadow-espresso/10 transition-all">All Objects</button>
           <button class="text-espresso/70 px-8 py-3 rounded-full border-2 border-espresso/10 hover:border-espresso/40 transition-all bg-white/10">Bakery</button>
           <button class="text-espresso/70 px-8 py-3 rounded-full border-2 border-espresso/10 hover:border-espresso/40 transition-all bg-white/10">Infusions</button>
           <button class="text-espresso/70 px-8 py-3 rounded-full border-2 border-espresso/10 hover:border-espresso/40 transition-all bg-white/10">Desserts</button>
           <button class="text-espresso/70 px-8 py-3 rounded-full border-2 border-espresso/10 hover:border-espresso/40 transition-all bg-white/10">Daily</button>
        </div>
      </section>

      <!-- RECIPES GRID - Designer Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        
        <!-- Create Button - Designer Outline -->
        <button class="group flex flex-col items-center justify-center h-[520px] rounded-[3.5rem] border-2 border-dashed border-espresso/15 bg-espresso/[0.03] text-espresso/40 hover:bg-espresso/[0.06] hover:border-espresso/30 transition-all duration-500">
           <div class="w-14 h-14 rounded-full border-2 border-espresso/10 flex items-center justify-center mb-8 bg-white/20">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
           </div>
           <span class="font-sans font-black text-xs uppercase tracking-[0.4em]">Initialize New</span>
        </button>

        <!-- Dummy Recipes - Premium Designer Cards -->
        <div v-for="recipe in recipes" :key="recipe.title" class="group flex flex-col h-[520px] bg-white/40 rounded-[3.5rem] border-2 border-white/60 overflow-hidden cursor-pointer shadow-2xl shadow-espresso/5 transition-all duration-700 hover:border-espresso/20">
           <div class="h-80 overflow-hidden relative border-b border-espresso/5">
              <img :src="recipe.image" :alt="recipe.title" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <!-- Glass Badge Overlay -->
              <div class="absolute top-6 right-6 flex items-center gap-2">
                 <span class="bg-espresso/80 backdrop-blur-md text-matcha px-4 py-2 rounded-full font-sans font-black text-[0.6rem] uppercase tracking-widest shadow-xl shadow-black/10">
                   {{ recipe.tag }}
                 </span>
              </div>
           </div>

           <div class="p-8 flex flex-col flex-1 bg-linear-to-b from-white/10 to-white/30">
             <div class="flex items-center gap-4 mb-3 font-sans font-black text-[0.65rem] uppercase tracking-[0.3em] text-espresso/40">
                <span class="text-espresso/60 px-3 py-1 bg-espresso/5 rounded-lg border border-espresso/5">{{ recipe.time }}</span>
                <span class="w-1.5 h-1.5 rounded-full bg-espresso/10"></span>
                <span>Active</span>
             </div>
             
             <h3 class="text-2xl text-espresso mb-3 font-normal leading-[1.15] tracking-tight group-hover:text-espresso/70 transition-colors">
               {{ recipe.title }}
             </h3>
             
             <p class="text-espresso/60 font-sans font-bold text-[0.85rem] leading-relaxed line-clamp-2 italic">
               "{{ recipe.description }}"
             </p>
           </div>
        </div>
      </section>

      <!-- FOOTER - High-End Minimal -->
      <footer class="mt-48 pb-16 text-center border-t border-espresso/5 pt-16">
        <p class="font-sans font-black text-[0.6rem] uppercase tracking-[0.6em] text-espresso/30">Clove Collection &reg; Selected Recipes &bull; MMXXVI</p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const user = ref<{ name: string } | null>(null)

const recipes = [
  {
    title: 'Matcha & Vanilla Infusion',
    tag: 'Infusion',
    time: '5 min',
    image: '/img/matcha.jpg',
    description: 'A creamy and aromatic blend of authentic Japanese matcha and Madagascar vanilla beans.'
  },
  {
    title: 'Rustic Sourdough Focaccia',
    tag: 'Bakery',
    time: '2 hours',
    image: '/img/espresso.jpeg',
    description: 'Slow-fermented sourdough with roasted garlic, rosemary, and cold-pressed olive oil.'
  },
  {
    title: 'Espresso Glazed Carrots',
    tag: 'Side Dish',
    time: '20 min',
    image: '/img/espresso.jpeg',
    description: 'Unexpectedly rich and sweet carrots braised in a coffee reduction with sea salt flakes.'
  }
]

onMounted(async () => {
  const { data } = await useFetch<{ user: any }>('/api/auth/me')
  if (data.value?.user) {
    user.value = data.value.user
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  line-clamp: 2;
}
</style>
