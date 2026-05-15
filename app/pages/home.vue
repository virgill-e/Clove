<template>
  <div class="min-h-screen bg-cream text-espresso overflow-x-hidden font-sans selection:bg-matcha/30 selection:text-espresso relative flex flex-col">
    <!-- Noise overlay -->
    <div class="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- NAVIGATION -->
    <header class="w-full px-8 py-8 md:px-16 md:py-10 flex items-center justify-between z-40 relative">
      <div class="overflow-hidden">
        <h1 class="text-4xl md:text-5xl font-serif text-espresso tracking-tight leading-none nav-item">Clove.</h1>
      </div>
      
      <!-- Profile / User Actions -->
      <div class="flex items-center gap-6 overflow-hidden">
        <div class="nav-item flex items-center gap-4 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-espresso/10 shadow-[0_4px_16px_rgba(74,43,24,0.05)] hover:bg-white/60 transition-colors cursor-pointer group" @click="handleLogout">
          <div class="flex flex-col text-right">
            <span class="font-semibold text-[0.65rem] uppercase tracking-[0.15em] leading-tight text-espresso">{{ user?.name || 'Chef' }}</span>
            <span class="font-medium text-[0.55rem] uppercase tracking-[0.2em] text-espresso/50 group-hover:text-espresso/80 transition-colors">Sign Out</span>
          </div>
          <div class="w-10 h-10 rounded-full bg-espresso text-cream flex items-center justify-center font-serif text-xl italic shadow-inner">
            {{ user?.name?.[0] || 'V' }}
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full max-w-screen-2xl mx-auto px-8 md:px-16 pb-32 flex flex-col items-center">
      
      <!-- HERO -->
      <section class="w-full flex flex-col items-center justify-center text-center mt-12 md:mt-24 mb-32">
        <div class="overflow-hidden mb-6">
          <p class="hero-subtitle font-medium text-[0.65rem] md:text-xs uppercase tracking-[0.4em] text-espresso/60 mb-2">Your Personal Digital Kitchen</p>
        </div>
        <h2 class="text-7xl md:text-[9rem] lg:text-[11rem] leading-[0.85] font-serif text-espresso tracking-tighter flex flex-col items-center">
          <div class="overflow-hidden py-2"><span class="hero-title-line block">Curate,</span></div>
          <div class="overflow-hidden py-2 flex items-center gap-4 md:gap-8">
            <span class="hero-title-line block italic font-light text-espresso/80">cook</span> 
            <span class="hero-title-line block">&amp; share.</span>
          </div>
        </h2>
        
        <!-- SEARCH & FILTER -->
        <div class="w-full max-w-3xl mt-20 relative z-20 hero-search">
          <div class="relative group">
            <div class="absolute inset-0 bg-espresso/5 rounded-3xl blur-xl group-hover:bg-espresso/10 transition-all duration-500"></div>
            <div class="relative flex items-center bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-2 shadow-[0_8px_32px_rgba(74,43,24,0.06)] shadow-[inset_0_2px_0_0_rgba(255,255,255,0.8)] focus-within:ring-4 focus-within:ring-espresso/10 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-espresso/40 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search your recipes..." 
                class="flex-1 bg-transparent border-none px-4 py-4 focus:outline-none text-espresso placeholder-espresso/40 font-medium text-lg tracking-tight"
              />
              <button @click="isModalOpen = true" class="bg-matcha text-espresso px-6 py-4 rounded-2xl font-semibold text-[0.65rem] uppercase tracking-[0.2em] hover:bg-matcha/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                New
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-center gap-2 flex-wrap mt-8">
             <button 
               @click="activeTag = ''"
               :class="[
                 (!activeTag) ? 'bg-espresso text-cream shadow-md' : 'text-espresso/60 hover:bg-espresso/5',
                 'px-5 py-2 rounded-full text-[0.6rem] uppercase tracking-[0.2em] font-semibold transition-all duration-300'
               ]"
             >
               All
             </button>
             <button 
               v-for="tag in tags" 
               :key="tag"
               @click="activeTag = tag"
               :class="[
                 (activeTag === tag) ? 'bg-espresso text-cream shadow-md' : 'text-espresso/60 hover:bg-espresso/5',
                 'px-5 py-2 rounded-full text-[0.6rem] uppercase tracking-[0.2em] font-semibold transition-all duration-300'
               ]"
             >
               {{ tag }}
             </button>
          </div>
        </div>
      </section>

      <!-- RECIPES GRID (Editorial Masonry Style) -->
      <section class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-10">
        <div 
          v-for="(recipe, index) in filteredRecipes" 
          :key="recipe.id" 
          @click="navigateTo(`/recipes/${recipe.id}`)"
          class="recipe-card group relative flex flex-col bg-white/40 border border-white/60 rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(74,43,24,0.04)] shadow-[inset_0_2px_0_0_rgba(255,255,255,0.6)] hover:shadow-[0_20px_40px_rgba(74,43,24,0.12)] hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          :class="[
             index % 5 === 0 ? 'lg:col-span-8 lg:flex-row h-[400px] md:h-[500px]' : 
             index % 5 === 1 ? 'lg:col-span-4 h-[400px] md:h-[500px]' : 
             index % 5 === 2 ? 'lg:col-span-4 h-[450px]' :
             index % 5 === 3 ? 'lg:col-span-4 h-[450px]' :
                               'lg:col-span-4 h-[450px]'
          ]"
        >
          <!-- Image Section -->
          <div class="relative overflow-hidden" :class="[index % 5 === 0 ? 'lg:w-1/2 h-full' : 'w-full h-3/5']">
            <div class="absolute inset-0 bg-espresso/10 z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
            <img :src="recipe.imageUrl || '/img/matcha.jpg'" :alt="recipe.title" class="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            
            <div class="absolute top-6 left-6 z-20">
               <span class="bg-cream/90 backdrop-blur-md text-espresso px-3 py-1.5 rounded-lg font-semibold text-[0.55rem] uppercase tracking-[0.2em] shadow-sm">
                 {{ recipe.tag }}
               </span>
            </div>
          </div>
          
          <!-- Content Section -->
          <div class="p-8 md:p-10 flex flex-col justify-between flex-1" :class="[index % 5 === 0 ? 'lg:w-1/2' : '']">
            <div>
              <div class="flex items-center gap-3 mb-4 font-semibold text-[0.55rem] uppercase tracking-[0.2em] text-espresso/40">
                <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {{ recipe.cookingTime || '45 Min' }}</span>
                <span class="w-1 h-1 rounded-full bg-espresso/20"></span>
                <span>{{ recipe.ingredients?.length || 5 }} Ingredients</span>
              </div>
              <h3 class="text-3xl md:text-4xl font-serif text-espresso leading-[1.1] tracking-tight mb-4 group-hover:text-matcha transition-colors duration-300">
                {{ recipe.title }}
              </h3>
              <p class="text-espresso/60 text-sm leading-relaxed font-light line-clamp-2 md:line-clamp-3">
                {{ recipe.description || 'A beautiful, curated recipe perfect for your collection. Discover the intricate flavors and instructions inside.' }}
              </p>
            </div>
            
            <div class="mt-8 flex items-center text-espresso font-semibold text-[0.65rem] uppercase tracking-[0.2em] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
              View Recipe <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4-4m-4 4H3"/></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <div v-if="filteredRecipes.length === 0" class="w-full py-32 flex flex-col items-center justify-center text-center opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-espresso/30 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        <p class="font-serif text-3xl text-espresso mb-2">No recipes found.</p>
        <p class="text-espresso/60 font-light">Try adjusting your search or add a new one.</p>
      </div>

    </main>

    <!-- FOOTER -->
    <footer class="w-full py-12 border-t border-espresso/5 flex flex-col items-center justify-center relative z-10 bg-cream/50 backdrop-blur-lg">
      <p class="font-serif italic text-2xl text-espresso/40 mb-4">Clove.</p>
      <p class="font-semibold text-[0.55rem] uppercase tracking-[0.4em] text-espresso/30">Crafted with precision &bull; 2026</p>
    </footer>

    <RecipeModal 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
      @success="() => { fetchRecipes(); fetchTags(); }" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import gsap from 'gsap'
import RecipeModal from '~/components/RecipeModal.vue'

definePageMeta({
  middleware: 'auth'
})

const user = ref<{ name: string, email: string } | null>(null)
const isModalOpen = ref(false)
const recipes = ref<any[]>([])
const tags = ref<string[]>([])
const searchQuery = ref('')
const activeTag = ref('')

const fetchRecipes = async () => {
  try {
    const data = await $fetch<any[]>('/api/recipes')
    recipes.value = data
    // Trigger entrance animation for recipes
    nextTick(() => animateCards())
  } catch (e) {
    console.error('Failed to fetch recipes', e)
  }
}

const fetchTags = async () => {
  try {
    const data = await $fetch<string[]>('/api/recipes/tags')
    tags.value = data
  } catch (e) {
    console.error('Failed to fetch tags', e)
  }
}

const filteredRecipes = computed(() => {
  return recipes.value.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         (r.description && r.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesTag = !activeTag.value || r.tag === activeTag.value
    return matchesSearch && matchesTag
  })
})

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    navigateTo('/')
  } catch (e) {
    console.error('Logout failed', e)
  }
}

// GSAP Animations
const animateHero = () => {
  const tl = gsap.timeline()
  
  // Nav items
  tl.fromTo('.nav-item', 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
  )
  
  // Hero subtitle
  tl.fromTo('.hero-subtitle',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
    '-=0.6'
  )
  
  // Hero title lines
  tl.fromTo('.hero-title-line',
    { y: 150, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'expo.out' },
    '-=0.6'
  )
  
  // Search bar
  tl.fromTo('.hero-search',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    '-=0.8'
  )
}

const animateCards = () => {
  gsap.fromTo('.recipe-card',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
  )
}

onMounted(async () => {
  animateHero() // Run hero animation immediately
  
  const { data } = await useFetch<{ user: any }>('/api/auth/me')
  if (data.value?.user) {
    user.value = data.value.user
  }
  fetchRecipes()
  fetchTags()
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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  line-clamp: 3;
}
</style>
