<template>
  <div class="min-h-screen bg-matcha overflow-x-hidden font-serif selection:bg-espresso/10 selection:text-espresso">
    <!-- TOP NAVIGATION -->
    <header class="p-6 md:px-12 md:py-8 flex items-center justify-between bg-matcha/80 backdrop-blur-xl sticky top-0 z-50 border-b border-espresso/10">
      <div class="flex items-center gap-6">
        <h1 class="text-4xl font-normal text-espresso tracking-tight">Clove</h1>
        <div class="hidden md:block h-8 w-px bg-espresso/10"></div>
        <p class="hidden md:block text-espresso/60 font-sans font-black text-[0.7rem] uppercase tracking-[0.4em] mt-1">Cook and love</p>
      </div>
      
      <div class="flex items-center gap-10">
        <div 
          class="relative group"
          @mouseenter="isMenuVisible = true"
          @mouseleave="isMenuVisible = false"
        >
          <div 
            @click="toggleMenu"
            class="cursor-pointer flex items-center gap-4 py-2 pl-2 pr-6 rounded-full border border-espresso/10 bg-white/5 hover:bg-white/20 hover:border-espresso/20 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-espresso/5 active:scale-[0.98]"
          >
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 transition-transform duration-300" :class="{'rotate-180': isMenuVisible}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
          >
            <div 
              v-if="isMenuVisible"
              class="absolute right-0 top-full pt-3 w-56 z-50"
            >
              <div class="bg-white/95 backdrop-blur-2xl border border-espresso/10 rounded-4xl shadow-2xl shadow-espresso/10 overflow-hidden py-2">
                <div class="px-6 py-4 border-b border-espresso/5 mb-2">
                  <p class="font-sans font-black text-[0.6rem] uppercase tracking-[0.2em] text-espresso/40 mb-1">Signed in as</p>
                  <p class="font-sans font-bold text-sm text-espresso truncate">{{ user?.email || 'user@clove.be' }}</p>
                </div>
                
                <button 
                  @click="handleLogout"
                  class="w-full px-6 py-4 text-left font-sans font-black text-[0.7rem] uppercase tracking-[0.3em] text-espresso hover:bg-espresso hover:text-matcha transition-all duration-300 flex items-center justify-between group/item"
                >
                  Sign Out
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transform transition-transform group-hover/item:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12 md:py-24">
      
      <!-- HERO & SEARCH AREA -->
      <section class="max-w-3xl mx-auto text-center mb-32">
        <h2 class="text-6xl md:text-8xl text-espresso mb-12 leading-[1.05] font-light">
          Your <span class="italic text-espresso/80">curated</span> <br/> 
          <span class="font-normal">collection.</span>
        </h2>
        
        <div class="relative max-w-2xl mx-auto mb-14 drop-shadow-sm">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Find a recipe..." 
            class="w-full bg-white/40 border-2 border-white/50 rounded-full px-14 py-6 focus:outline-none focus:bg-white/60 focus:border-espresso/30 text-espresso placeholder-espresso/40 transition-all font-sans font-bold text-base tracking-wide shadow-inner"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <div class="flex items-center justify-center gap-3 flex-wrap font-sans font-black text-[0.7rem] uppercase tracking-[0.25em]">
           <button 
             @click="activeTag = ''"
             :class="[
               (!activeTag) ? 'bg-espresso text-matcha shadow-lg shadow-espresso/10' : 'text-espresso/70 border-2 border-espresso/10 hover:border-espresso/40 bg-white/10',
               'px-8 py-3 rounded-full transition-all'
             ]"
           >
             All Recipes
           </button>
           <button 
             v-for="tag in tags" 
             :key="tag"
             @click="activeTag = tag"
             :class="[
               (activeTag === tag) ? 'bg-espresso text-matcha shadow-lg shadow-espresso/10' : 'text-espresso/70 border-2 border-espresso/10 hover:border-espresso/40 bg-white/10',
               'px-8 py-3 rounded-full transition-all'
             ]"
           >
             {{ tag }}
           </button>
        </div>
      </section>

      <!-- RECIPES GRID -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        
        <!-- Create Button -->
        <button @click="isModalOpen = true" class="group flex flex-col items-center justify-center h-[520px] rounded-[3.5rem] border-2 border-dashed border-espresso/15 bg-espresso/5 text-espresso/40 hover:bg-espresso/10 hover:border-espresso/30 transition-all duration-500">
           <div class="w-14 h-14 rounded-full border-2 border-espresso/10 flex items-center justify-center mb-8 bg-white/20 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
           </div>
           <span class="font-sans font-black text-xs uppercase tracking-[0.4em]">Initialize New</span>
        </button>

        <!-- Dynamic Recipes -->
        <div v-for="recipe in filteredRecipes" :key="recipe.id" class="group flex flex-col h-[520px] bg-white/40 rounded-[3.5rem] border-2 border-white/60 overflow-hidden cursor-pointer shadow-2xl shadow-espresso/5 transition-all duration-700 hover:border-espresso/20">
           <div class="h-80 overflow-hidden relative border-b border-espresso/5">
              <img :src="recipe.imageUrl || '/img/matcha.jpg'" :alt="recipe.title" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div class="absolute top-6 right-6 flex items-center gap-2">
                 <span class="bg-espresso/80 backdrop-blur-md text-matcha px-4 py-2 rounded-full font-sans font-black text-[0.6rem] uppercase tracking-widest shadow-xl shadow-black/10">
                   {{ recipe.tag }}
                 </span>
              </div>
           </div>

           <div class="p-8 flex flex-col flex-1 bg-linear-to-b from-white/10 to-white/30">
             <div class="flex items-center gap-4 mb-3 font-sans font-black text-[0.65rem] uppercase tracking-[0.3em] text-espresso/40">
                <span class="text-espresso/60 px-3 py-1 bg-espresso/5 rounded-lg border border-espresso/5">{{ recipe.cookingTime || 'Active' }}</span>
                <span class="w-1.5 h-1.5 rounded-full bg-espresso/10"></span>
                <span>{{ recipe.ingredients?.length || 0 }} Ingredients</span>
             </div>
             
             <h3 class="text-2xl text-espresso mb-3 font-normal leading-[1.15] tracking-tight group-hover:text-espresso/70 transition-colors">
               {{ recipe.title }}
             </h3>
             
             <p class="text-espresso/60 font-sans font-bold text-[0.85rem] leading-relaxed line-clamp-2 italic">
               "{{ recipe.description || 'No description provided.' }}"
             </p>
           </div>
        </div>
      </section>

      <footer class="mt-48 pb-16 text-center border-t border-espresso/5 pt-16">
        <p class="font-sans font-black text-[0.6rem] uppercase tracking-[0.6em] text-espresso/30">Clove &reg; &bull; 2026</p>
      </footer>
    </main>

    <RecipeModal 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
      @success="() => { fetchRecipes(); fetchTags(); }" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import RecipeModal from '~/components/RecipeModal.vue'

definePageMeta({
  middleware: 'auth'
})

const user = ref<{ name: string, email: string } | null>(null)
const isMenuVisible = ref(false)
const isModalOpen = ref(false)
const recipes = ref<any[]>([])
const tags = ref<string[]>([])
const searchQuery = ref('')
const activeTag = ref('')

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}

const fetchRecipes = async () => {
  try {
    const data = await $fetch<any[]>('/api/recipes')
    recipes.value = data
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

onMounted(async () => {
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
</style>
