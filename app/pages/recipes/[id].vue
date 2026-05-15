<template>
  <div class="min-h-screen bg-cream text-espresso overflow-x-hidden font-sans selection:bg-matcha/30 selection:text-espresso relative flex flex-col">
    <!-- Noise overlay -->
    <div class="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- NAVIGATION -->
    <header class="w-full px-8 py-8 md:px-16 md:py-10 flex items-center justify-between z-40 relative">
      <div class="overflow-hidden">
        <button 
          @click="navigateTo('/home')" 
          class="nav-item flex items-center gap-3 font-semibold text-[0.65rem] uppercase tracking-[0.3em] text-espresso/40 hover:text-espresso transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Kitchen
        </button>
      </div>
      <div class="overflow-hidden">
        <h1 class="nav-item text-2xl md:text-3xl font-serif text-espresso tracking-tight leading-none">Clove.</h1>
      </div>
      <div class=" flex items-center gap-4">
        <!-- Share Button (Visible for all) -->
        <button 
          @click="handleShare"
          class="w-12 h-12 rounded-full border border-espresso/10 flex items-center justify-center text-espresso/40 hover:text-espresso hover:bg-white/60 transition-all duration-300"
          title="Share Recipe"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </button>

        <!-- Save Button (Only if not owner) -->
        <button 
          v-if="!isOwner"
          @click="handleSave"
          :disabled="isSaving"
          class="nav-item bg-matcha text-espresso px-6 py-3 rounded-full font-bold text-[0.6rem] uppercase tracking-[0.2em] shadow-lg shadow-matcha/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save to My Kitchen' }}
        </button>

        <!-- Delete Button (Only if owner) -->
        <button 
          v-if="isOwner"
          @click="handleDelete"
          class="nav-item w-12 h-12 rounded-full border border-espresso/10 flex items-center justify-center text-espresso/20 hover:text-red-400 hover:border-red-100 hover:bg-red-50 transition-all duration-300"
          title="Delete Recipe"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
        
        <!-- Edit Button (Only if owner) -->
        <button 
          v-if="isOwner"
          @click="isModalOpen = true"
          class="nav-item bg-espresso text-matcha px-6 py-3 rounded-full font-bold text-[0.6rem] uppercase tracking-[0.2em] shadow-lg shadow-espresso/10 hover:scale-105 active:scale-95 transition-all"
        >
          Edit Recipe
        </button>
      </div>
    </header>

    <main v-if="recipe" class="flex-1 w-full max-w-screen-xl mx-auto px-8 md:px-16 pb-32">
      
      <!-- HERO AREA -->
      <section class="mt-12 md:mt-20 mb-20 md:mb-24">
        <div class="mb-6 flex items-center gap-4 flex-wrap">
          <span class="hero-item inline-block bg-matcha/20 text-espresso px-4 py-2 rounded-lg font-bold text-[0.6rem] uppercase tracking-[0.3em]">
            {{ recipe.tag }}
          </span>
          <span v-if="!isOwner" class="hero-item inline-block bg-espresso text-cream px-4 py-2 rounded-lg font-bold text-[0.6rem] uppercase tracking-[0.3em]">
            Original creation by {{ recipe.creatorName }}
          </span>
          
          <!-- SAVED BY STATS (For owners) -->
          <div v-if="isOwner && recipe.savedBy?.length > 0" class="hero-item relative group">
            <div class="flex items-center gap-3 bg-white/40 border border-white/60 px-4 py-1.5 rounded-full shadow-sm cursor-help">
               <div class="flex -space-x-2">
                  <div v-for="(saver, i) in recipe.savedBy.slice(0, 3)" :key="i" class="w-6 h-6 rounded-full bg-espresso border border-cream flex items-center justify-center text-[0.45rem] text-cream font-bold uppercase">
                    {{ saver.name[0] }}
                  </div>
               </div>
               <span class="text-[0.55rem] font-bold uppercase tracking-[0.1em] text-espresso/40">
                  Saved by {{ recipe.savedBy.length }} {{ recipe.savedBy.length > 1 ? 'Chefs' : 'Chef' }}
               </span>
            </div>
            
            <!-- Floating List of Names -->
            <div class="absolute top-full left-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl border border-espresso/5 rounded-3xl shadow-2xl z-50 p-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
               <h4 class="text-[0.6rem] font-black uppercase tracking-[0.2em] text-espresso/30 mb-4 pb-3 border-b border-espresso/5">Appreciated by</h4>
               <ul class="space-y-3">
                 <li v-for="saver in recipe.savedBy" :key="saver.name" class="flex items-center gap-3">
                   <div class="w-6 h-6 rounded-full bg-matcha/20 text-espresso flex items-center justify-center text-[0.5rem] font-bold uppercase">
                     {{ saver.name[0] }}
                   </div>
                   <span class="text-xs font-bold text-espresso">{{ saver.name }}</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
        
        <div class="overflow-hidden mb-12">
          <h2 class="hero-item text-6xl md:text-8xl lg:text-[10rem] font-serif text-espresso leading-[0.85] tracking-tighter">
            {{ recipe.title }}
          </h2>
        </div>

        <div class="hero-item flex flex-col md:flex-row md:items-center gap-8 md:gap-16 border-t border-espresso/10 pt-10">
           <div class="flex items-center gap-10 font-semibold text-[0.65rem] uppercase tracking-[0.3em] text-espresso/40">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ recipe.cookingTime || '45 Min' }}
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {{ recipe.ingredients?.length || 0 }} Ingredients
              </div>
           </div>
           <p class="flex-1 text-lg md:text-xl text-espresso/60 font-light leading-relaxed italic border-l-2 border-matcha/30 pl-8">
             "{{ recipe.description || 'Discover the intricate flavors and artisanal techniques behind this signature dish.' }}"
           </p>
        </div>
      </section>

      <!-- BIG HERO IMAGE -->
      <section class="content-item mb-24 md:mb-32">
        <div class="aspect-[21/9] w-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/60 shadow-2xl relative group">
           <img 
             :src="recipe.imageUrl || '/img/matcha.jpg'" 
             :alt="recipe.title" 
             class="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[3000ms] ease-out"
           />
           <div class="absolute inset-0 bg-espresso/5 mix-blend-overlay"></div>
        </div>
      </section>

      <!-- INGREDIENTS SECTION -->
      <section class="content-item mb-32">
        <div class="flex items-center gap-6 mb-16">
          <h3 class="text-3xl md:text-5xl font-serif text-espresso leading-none">Ingredients.</h3>
          <div class="h-px flex-1 bg-espresso/10"></div>
          <span class="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-espresso/30">{{ recipe.ingredients?.length || 0 }} items</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          <div 
            v-for="ing in recipe.ingredients" 
            :key="ing.id"
            class="flex items-baseline justify-between group py-4 border-b border-espresso/5 last:md:border-b-0"
          >
            <div class="flex items-center gap-4">
              <div class="w-1.5 h-1.5 rounded-full bg-matcha group-hover:scale-150 transition-transform duration-500"></div>
              <span class="font-medium text-espresso tracking-tight text-lg">{{ ing.name }}</span>
            </div>
            <span class="font-bold text-[0.65rem] uppercase tracking-[0.2em] text-espresso/30 group-hover:text-espresso/60 transition-colors">{{ ing.amount }}</span>
          </div>
        </div>
      </section>

      <!-- PREPARATION SECTION -->
      <section class="content-item max-w-4xl">
        <div class="flex items-center gap-6 mb-20">
          <h3 class="text-3xl md:text-5xl font-serif text-espresso leading-none">The Method.</h3>
          <div class="h-px flex-1 bg-espresso/10"></div>
        </div>

        <div class="space-y-24">
          <div v-for="(step, index) in instructions" :key="index" class="relative group pl-16 md:pl-24">
            <!-- Step Number Overlay -->
            <div class="absolute left-0 top-0 text-6xl md:text-8xl font-serif italic text-espresso/5 group-hover:text-matcha/10 transition-colors duration-700 select-none">
              {{ (index + 1).toString().padStart(2, '0') }}
            </div>
            
            <div class="relative pt-6 md:pt-10">
               <p class="text-xl md:text-2xl text-espresso/70 leading-[1.6] font-light">
                {{ step }}
               </p>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Loading State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-6 opacity-30">
       <div class="w-12 h-12 border-2 border-espresso/10 border-t-espresso rounded-full animate-spin"></div>
       <p class="font-serif italic text-xl">Curating recipe details...</p>
    </div>

    <!-- FOOTER -->
    <footer class="w-full py-24 border-t border-espresso/5 flex flex-col items-center justify-center relative z-10 bg-cream/50">
      <p class="font-serif italic text-3xl text-espresso/20 mb-8">Clove.</p>
      <div class="flex items-center gap-10 mb-12">
         <button @click="navigateTo('/home')" class="font-bold text-[0.6rem] uppercase tracking-[0.4em] text-espresso/30 hover:text-espresso transition-all hover:tracking-[0.6em]">Back to Gallery</button>
      </div>
      <p class="font-bold text-[0.55rem] uppercase tracking-[0.5em] text-espresso/10 tracking-widest">© 2026 Crafted with Love</p>
    </footer>

    <!-- Edit Modal -->
    <RecipeModal 
      :is-open="isModalOpen" 
      :recipe="recipe"
      @close="isModalOpen = false" 
      @success="handleUpdateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import gsap from 'gsap'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const recipe = ref<any>(null)
const currentUser = ref<any>(null)
const isModalOpen = ref(false)
const isSaving = ref(false)

const isOwner = computed(() => {
  return recipe.value && currentUser.value && recipe.value.userId === currentUser.value.id
})

const fetchUser = async () => {
  try {
    const data = await $fetch<{ user: any }>('/api/auth/me')
    currentUser.value = data.user
  } catch (e) {}
}

const fetchRecipe = async () => {
  try {
    const data = await $fetch<any>(`/api/recipes/${route.params.id}`)
    recipe.value = data
    nextTick(() => animateContent())
  } catch (e) {
    console.error('Failed to fetch recipe', e)
    navigateTo('/home')
  }
}

const handleUpdateSuccess = () => {
  fetchRecipe() // Refresh data
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) return
  
  try {
    await $fetch(`/api/recipes/${route.params.id}`, {
      method: 'DELETE'
    })
    navigateTo('/home')
  } catch (e) {
    console.error('Failed to delete recipe', e)
  }
}

const handleSave = async () => {
  isSaving.value = true
  try {
    await $fetch(`/api/recipes/${route.params.id}/save`, {
      method: 'POST'
    })
    alert('Recipe saved to your kitchen!')
  } catch (e) {
    console.error('Failed to save recipe', e)
  } finally {
    isSaving.value = false
  }
}

const handleShare = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  alert('Recipe link copied to clipboard!')
}

const instructions = computed(() => {
  if (!recipe.value?.instructions) return []
  return recipe.value.instructions.split('\n').filter((s: string) => s.trim().length > 0)
})

// GSAP Animations
const animateEntrance = () => {
  const tl = gsap.timeline()
  
  tl.fromTo('.nav-item', 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
  )
  
  tl.fromTo('.hero-item',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: 'expo.out' },
    '-=0.6'
  )
}

const animateContent = () => {
  gsap.fromTo('.content-item',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
  )
}

onMounted(() => {
  animateEntrance()
  fetchUser()
  fetchRecipe()
})
</script>

<style scoped>
/* Custom transitions and scroll adjustments */
</style>
