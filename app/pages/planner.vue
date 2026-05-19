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
      <div class="w-12 h-12 rounded-full border border-espresso/10 md:flex hidden items-center justify-center nav-item">
        <svg class="w-4 h-4 text-espresso/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
    </header>

    <main class="flex-1 w-full max-w-screen-2xl mx-auto px-8 md:px-16 pb-32 flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
      
      <!-- LEFT: Planner -->
      <div class="flex-1">
        <div class="overflow-hidden mb-12">
          <h2 class="hero-item text-6xl md:text-8xl font-serif text-espresso leading-[0.85] tracking-tighter">
            This Week's<br/>
            <span class="italic font-light text-espresso/80">Menu.</span>
          </h2>
        </div>

        <div class="space-y-16">
          <div v-for="day in daysOfWeek" :key="day" class="planner-day border-t border-espresso/10 pt-8 relative">
             <div class="absolute -left-4 top-8 w-1 h-12 bg-matcha/50 rounded-full hidden lg:block"></div>
             <h3 class="text-3xl font-serif text-espresso mb-6">{{ day }}</h3>
             
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Existing Entries -->
                <div 
                  v-for="entry in getEntriesForDay(day)" 
                  :key="entry.id"
                  class="group relative"
                >
                  <div class="relative aspect-[4/3] rounded-3xl overflow-hidden border border-espresso/5 shadow-sm group-hover:shadow-xl transition-all duration-500 cursor-pointer bg-white">
                    <img :src="entry.recipe.imageUrl" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    <div class="absolute inset-0 bg-linear-to-t from-espresso/80 via-espresso/20 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                      <div>
                        <h5 class="text-cream font-serif text-xl mb-1">{{ entry.recipe.title }}</h5>
                        <p class="text-[0.6rem] uppercase tracking-widest text-cream/70">{{ entry.recipe.cookingTime }}</p>
                      </div>
                      <button @click.stop="removeEntry(entry.id)" class="w-8 h-8 rounded-full bg-cream/20 backdrop-blur-md flex items-center justify-center text-cream hover:bg-red-500 transition-colors">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Add Recipe Slot -->
                <div class="group relative">
                  <div 
                    @click="openSelectModal(day)"
                    class="aspect-[4/3] rounded-3xl border-2 border-dashed border-espresso/10 flex flex-col items-center justify-center text-espresso/30 hover:border-matcha/50 hover:text-matcha hover:bg-matcha/5 transition-all duration-300 cursor-pointer h-full min-h-[150px]"
                  >
                    <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>
                    <span class="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Add Recipe</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Shopping List Sidebar -->
      <div class="w-full lg:w-96 shrink-0 relative">
        <div class="sticky top-12 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 lg:p-10 border border-white/60 shadow-[0_8px_32px_rgba(74,43,24,0.06)]">
           <div class="flex items-center justify-between mb-8 border-b border-espresso/10 pb-6">
             <h3 class="text-2xl font-serif text-espresso">The Market<br/>List.</h3>
             <div class="w-12 h-12 rounded-full bg-espresso text-cream flex items-center justify-center font-bold text-xs">
               {{ shoppingList.length }}
             </div>
           </div>

           <div v-if="shoppingList.length === 0" class="text-center py-12 opacity-50">
             <svg class="w-8 h-8 mx-auto mb-4 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             <p class="text-sm italic font-serif">Your list is empty.</p>
             <p class="text-[0.55rem] uppercase tracking-widest mt-2">Plan meals to generate</p>
           </div>

           <ul v-else class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
             <li v-for="item in shoppingList" :key="item.name" class="flex flex-col group cursor-pointer" @click="toggleCheck(item)">
               <div class="flex items-baseline gap-3">
                 <div class="w-3 h-3 rounded-sm border border-espresso/30 flex items-center justify-center transition-colors mt-1 shrink-0" :class="{'bg-matcha border-matcha text-espresso': !!checkedItems[item.name]}">
                   <svg v-if="checkedItems[item.name]" class="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                 </div>
                 <div class="flex-1" :class="{'opacity-40 line-through': !!checkedItems[item.name]}">
                   <span class="font-medium text-espresso text-sm">{{ item.name }}</span>
                   <div class="text-[0.6rem] text-espresso/50 uppercase tracking-widest mt-0.5 flex flex-wrap gap-x-2">
                     <span v-for="(amt, i) in item.amounts" :key="i">
                       {{ amt }}<span v-if="i < item.amounts.length - 1">,</span>
                     </span>
                   </div>
                 </div>
               </div>
             </li>
           </ul>
        </div>
      </div>
    </main>

    <!-- Recipe Selection Modal -->
    <Transition name="fade">
      <div v-if="isSelectModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-espresso/40 backdrop-blur-sm" @click="closeSelectModal"></div>
        <div class="relative bg-cream w-full max-w-3xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-h-[85vh] flex flex-col border border-white/20">
          <button @click="closeSelectModal" class="absolute top-8 right-8 w-10 h-10 bg-white rounded-full flex items-center justify-center text-espresso/40 hover:text-espresso shadow-sm transition-colors z-10">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <h2 class="text-3xl md:text-4xl font-serif text-espresso mb-2">Select a Recipe</h2>
          <p class="text-[0.65rem] uppercase tracking-[0.2em] text-espresso/40 mb-8 font-bold">For {{ targetDay }}</p>

          <div v-if="recipes.length === 0" class="text-center py-12">
            <p class="italic font-serif text-espresso/50">You don't have any recipes yet.</p>
          </div>

          <div v-else class="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar pr-2 pb-8">
            <div 
              v-for="recipe in recipes" 
              :key="recipe.id"
              @click="addRecipeToPlanner(recipe.id)"
              class="flex items-center gap-4 bg-white/50 p-3 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all border border-espresso/5 group"
            >
              <img :src="recipe.imageUrl || '/img/matcha.jpg'" class="w-16 h-16 rounded-xl object-cover" />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-espresso text-sm truncate">{{ recipe.title }}</h4>
                <p class="text-[0.55rem] uppercase tracking-widest text-espresso/40 mt-1">{{ recipe.cookingTime || '45 Min' }}</p>
              </div>
              <div class="w-8 h-8 rounded-full border border-espresso/10 flex items-center justify-center text-espresso/0 group-hover:text-matcha group-hover:border-matcha transition-all mr-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

definePageMeta({
  middleware: 'auth'
})

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const plannerEntries = ref<any[]>([])
const shoppingList = ref<any[]>([])
const checkedItems = ref<Record<string, string>>({})
const recipes = ref<any[]>([])

// Modal state
const isSelectModalOpen = ref(false)
const targetDay = ref('')

const fetchData = async () => {
  try {
    const [entries, list, userRecipes] = await Promise.all([
      $fetch('/api/planner'),
      $fetch('/api/planner/shopping-list'),
      $fetch('/api/recipes') // Fetch user's recipes for the modal
    ])
    plannerEntries.value = entries as any[]
    
    const newList = list as any[]
    shoppingList.value = newList
    recipes.value = userRecipes as any[]

    // Smart Uncheck: if amounts have changed for a checked item, uncheck it so the user doesn't forget
    let hasChanges = false
    for (const name in checkedItems.value) {
      const currentItem = newList.find((i: any) => i.name === name)
      if (currentItem) {
        const currentAmounts = currentItem.amounts.join(',')
        if (checkedItems.value[name] !== currentAmounts) {
          // Amounts changed, uncheck!
          delete checkedItems.value[name]
          hasChanges = true
        }
      }
    }
    
    if (hasChanges) {
      localStorage.setItem('clove_shopping_list', JSON.stringify(checkedItems.value))
    }

  } catch (e) {
    console.error('Failed to fetch planner data', e)
  }
}

onMounted(() => {
  fetchData()
  
  // Load checked items from local storage
  try {
    const saved = localStorage.getItem('clove_shopping_list')
    if (saved) {
      checkedItems.value = JSON.parse(saved)
    }
  } catch (e) {}
  
  // Entrance animation
  const tl = gsap.timeline()
  tl.fromTo('.nav-item', 
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
  )
  tl.fromTo('.hero-item',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'expo.out' },
    '-=0.6'
  )
  tl.fromTo('.planner-day',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
    '-=0.8'
  )
})

const getEntriesForDay = (day: string) => {
  return plannerEntries.value.filter(e => e.day === day)
}

const openSelectModal = (day: string) => {
  targetDay.value = day
  isSelectModalOpen.value = true
}

const closeSelectModal = () => {
  isSelectModalOpen.value = false
  targetDay.value = ''
}

const addRecipeToPlanner = async (recipeId: string) => {
  try {
    await $fetch('/api/planner', {
      method: 'POST',
      body: {
        recipeId,
        day: targetDay.value,
        mealType: 'Meal'
      }
    })
    closeSelectModal()
    fetchData() // Refresh data
  } catch (e) {
    console.error('Failed to add recipe to planner', e)
  }
}

const removeEntry = async (id: string) => {
  if(!confirm('Remove this recipe from your planner?')) return
  try {
    await $fetch(`/api/planner/${id}`, { method: 'DELETE' })
    fetchData()
  } catch (e) {
    console.error('Failed to remove entry', e)
  }
}

const toggleCheck = (item: any) => {
  const name = item.name
  if (checkedItems.value[name]) {
    delete checkedItems.value[name]
  } else {
    checkedItems.value[name] = item.amounts.join(',')
  }
  // Persist to local storage
  localStorage.setItem('clove_shopping_list', JSON.stringify(checkedItems.value))
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(74,43,24,0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(74,43,24,0.15);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(74,43,24,0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
