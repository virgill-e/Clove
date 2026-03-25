<template>
  <div class="min-h-screen bg-matcha overflow-x-hidden font-serif selection:bg-espresso/10 selection:text-espresso">
    <!-- NAVIGATION -->
    <header class="p-6 md:px-12 md:py-8 flex items-center justify-between bg-matcha/80 backdrop-blur-xl sticky top-0 z-50 border-b border-espresso/10">
      <button 
        @click="navigateTo('/home')" 
        class="flex items-center gap-3 font-sans font-black text-[0.7rem] uppercase tracking-[0.3em] text-espresso/60 hover:text-espresso transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to Gallery
      </button>
      
      <div class="flex items-center gap-6">
        <h1 class="text-2xl font-normal text-espresso tracking-tight">Clove</h1>
      </div>
      
      <div class="w-24"></div> <!-- Spacer for balance -->
    </header>

    <main v-if="recipe" class="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
      
      <!-- HERO HEADER -->
      <header class="max-w-4xl mb-16 md:mb-24">
         <span class="inline-block bg-espresso/5 border border-espresso/10 text-espresso/60 px-6 py-2 rounded-full font-sans font-black text-[0.65rem] uppercase tracking-[0.3em] mb-8">
           {{ recipe.tag }}
         </span>
         <h2 class="text-5xl md:text-8xl text-espresso font-normal leading-none tracking-tight mb-8">
           {{ recipe.title }}
         </h2>
         <div class="h-1.5 w-24 bg-espresso/10 rounded-full"></div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        <!-- LARGE IMAGE & SUMMARY -->
        <div class="lg:col-span-7 flex flex-col gap-12">
          <div class="aspect-[16/10] lg:aspect-[4/3] rounded-[4rem] overflow-hidden border-2 border-white/60 shadow-2xl shadow-espresso/10 relative group">
            <img 
              :src="recipe.imageUrl || '/img/matcha.jpg'" 
              :alt="recipe.title" 
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          <div class="bg-white/40 p-12 rounded-[3.5rem] border-2 border-white/60 shadow-xl shadow-espresso/5">
            <div class="flex items-center gap-8 mb-10 pb-8 border-b border-espresso/5 font-sans font-black text-[0.7rem] uppercase tracking-[0.3em] text-espresso/40">
               <div class="flex items-center gap-3">
                 <span class="w-10 h-10 rounded-full bg-espresso/5 border border-espresso/5 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-espresso/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 </span>
                 <span class="text-espresso/70">{{ recipe.cookingTime || 'Active' }}</span>
               </div>
            </div>

            <p class="text-2xl text-espresso/70 italic leading-relaxed font-normal">
              "{{ recipe.description || 'A timeless selection from the Clove collection, crafted for those who appreciate the essence of flavor.' }}"
            </p>
          </div>
        </div>

        <!-- DETAILS: INGREDIENTS & STEPS -->
        <div class="lg:col-span-5 flex flex-col gap-16">
          
          <!-- Ingredients Section -->
          <section>
            <div class="flex items-center gap-6 mb-10">
              <h3 class="text-3xl text-espresso font-normal">Ingredients</h3>
              <div class="h-px flex-1 bg-espresso/10"></div>
            </div>
            
            <ul class="space-y-6">
              <li 
                v-for="ing in recipe.ingredients" 
                :key="ing.id"
                class="flex items-baseline justify-between py-3 border-b border-white/40 pb-4 last:border-0"
              >
                <span class="font-sans font-bold text-base tracking-tight text-espresso/80">{{ ing.name }}</span>
                <span class="font-sans font-black text-[0.7rem] uppercase tracking-[0.2em] text-espresso/40 ml-4 shrink-0">{{ ing.amount }}</span>
              </li>
            </ul>
          </section>

          <!-- Instructions Section -->
          <section>
            <div class="flex items-center gap-6 mb-10">
              <h3 class="text-3xl text-espresso font-normal">Method</h3>
              <div class="h-px flex-1 bg-espresso/10"></div>
            </div>

            <div class="space-y-10 relative pl-4 border-l border-espresso/5">
              <div v-for="(step, index) in instructions" :key="index" class="relative group">
                <!-- Step Indicator Circle -->
                <div class="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-espresso/20 group-hover:bg-espresso transition-colors"></div>
                
                <div class="mb-2">
                  <span class="font-sans font-black text-[0.65rem] uppercase tracking-[0.3em] text-espresso/60 block">Step {{ Number(index) + 1 }}</span>
                </div>
                <p class="text-[1.05rem] text-espresso/80 leading-[1.7] font-normal">
                  {{ step }}
                </p>
              </div>
            </div>
          </section>
        </div>

      </div>
    </main>

    <div v-else class="min-h-screen flex items-center justify-center">
       <div class="w-12 h-12 border-4 border-espresso/10 border-t-espresso rounded-full animate-spin"></div>
    </div>

    <footer class="mt-48 pb-16 text-center border-t border-espresso/5 pt-16">
      <p class="font-sans font-black text-[0.6rem] uppercase tracking-[0.6em] text-espresso/30">Clove &reg; &bull; 2026</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const recipe = ref<any>(null)

const fetchRecipe = async () => {
  try {
    const data = await $fetch<any>(`/api/recipes/${route.params.id}`)
    recipe.value = data
  } catch (e) {
    console.error('Failed to fetch recipe', e)
    navigateTo('/home')
  }
}

const instructions = computed(() => {
  if (!recipe.value?.instructions) return []
  // Split by newlines and filter out empty strings
  return recipe.value.instructions.split('\n').filter((s: string) => s.trim().length > 0)
})

onMounted(() => {
  fetchRecipe()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
</style>
