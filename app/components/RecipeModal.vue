<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-espresso/40 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-4xl max-h-[90vh] bg-white/90 backdrop-blur-2xl rounded-[3rem] border-2 border-white/60 shadow-2xl overflow-hidden flex flex-col font-serif">
        
        <!-- Header -->
        <div class="p-8 md:px-12 md:py-10 border-b border-espresso/5 flex items-center justify-between shrink-0">
          <div>
            <h2 class="text-4xl text-espresso font-normal">New <span class="italic">Recipe</span>.</h2>
            <p class="text-espresso/60 font-sans font-medium mt-1">Initialize your next culinary masterpiece.</p>
          </div>
          <button @click="close" class="w-12 h-12 rounded-full border border-espresso/10 flex items-center justify-center hover:bg-espresso hover:text-matcha transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-8 md:p-12 font-sans space-y-10">
          
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="block text-[0.65rem] font-black uppercase tracking-[0.3em] text-espresso/50 ml-6">Recipe Title</label>
              <input v-model="form.title" type="text" placeholder="e.g. Matcha Soufflé" class="w-full bg-white/50 border-2 border-white/80 rounded-3xl px-8 py-5 focus:outline-none focus:border-espresso/20 focus:bg-white/80 transition-all font-bold text-espresso shadow-sm" />
            </div>
            
            <div class="space-y-2 relative">
              <label class="block text-[0.65rem] font-black uppercase tracking-[0.3em] text-espresso/50 ml-6">Tag / Category</label>
              <input 
                v-model="form.tag" 
                @input="searchTags"
                @focus="isTagSuggestionsVisible = true"
                @blur="handleTagBlur"
                type="text" 
                placeholder="Daily, Bakery, etc." 
                class="w-full bg-white/50 border-2 border-white/80 rounded-3xl px-8 py-5 focus:outline-none focus:border-espresso/20 focus:bg-white/80 transition-all font-bold text-espresso shadow-sm" 
              />
              <!-- Tag Suggestions -->
              <div v-if="isTagSuggestionsVisible && tagSuggestions.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-espresso/10 rounded-2xl shadow-xl z-30 overflow-hidden py-1">
                <button 
                  v-for="tag in tagSuggestions" 
                  :key="tag"
                  @mousedown="selectTag(tag)"
                  class="w-full px-8 py-3 text-left font-bold text-sm text-espresso hover:bg-espresso hover:text-matcha transition-all"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="block text-[0.65rem] font-black uppercase tracking-[0.3em] text-espresso/50 ml-6">Short Description</label>
            <textarea v-model="form.description" rows="2" placeholder="Tell the story behind this dish..." class="w-full bg-white/50 border-2 border-white/80 rounded-3xl px-8 py-5 focus:outline-none focus:border-espresso/20 focus:bg-white/80 transition-all font-bold text-espresso shadow-sm resize-none"></textarea>
          </div>

          <!-- Ingredients Area -->
          <div class="space-y-6">
            <div class="flex items-center justify-between ml-6 mr-6">
              <label class="block text-[0.65rem] font-black uppercase tracking-[0.3em] text-espresso/50">Ingredients & Measurements</label>
              <button @click="addIngredient" class="text-[0.6rem] font-black uppercase tracking-widest text-espresso/40 hover:text-espresso transition-colors">+ Add Item</button>
            </div>
            
            <div class="space-y-3">
              <div v-for="(ing, index) in form.ingredientInputs" :key="index" class="grid grid-cols-12 gap-3 group">
                <!-- Auto-suggest Input for Name -->
                <div class="col-span-12 md:col-span-7 relative">
                  <input 
                    v-model="ing.name" 
                    @input="searchIngredients(index)"
                    @focus="activeIngSearch = index"
                    @blur="handleBlur"
                    type="text" 
                    placeholder="Ingredient name..." 
                    class="w-full bg-white/50 border-2 border-white/80 rounded-2xl px-6 py-4 focus:outline-none focus:border-espresso/20 focus:bg-white/80 transition-all font-bold text-espresso shadow-sm" 
                  />
                  <!-- Suggestion Dropdown -->
                  <div v-if="activeIngSearch === index && suggestions.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-espresso/10 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
                    <button 
                      v-for="s in suggestions" 
                      :key="s.id"
                      @mousedown="selectSuggestion(index, s.name)"
                      class="w-full px-6 py-3 text-left font-bold text-sm text-espresso hover:bg-espresso hover:text-matcha transition-all"
                    >
                      {{ s.name }}
                    </button>
                  </div>
                </div>
                
                <div class="col-span-9 md:col-span-4">
                  <input v-model="ing.amount" type="text" placeholder="Amount (e.g. 250g)" class="w-full bg-white/50 border-2 border-white/80 rounded-2xl px-6 py-4 focus:outline-none focus:border-espresso/20 focus:bg-white/80 transition-all font-bold text-espresso shadow-sm" />
                </div>
                
                <div class="col-span-3 md:col-span-1 flex items-center justify-center">
                  <button @click="removeIngredient(index)" class="w-10 h-10 rounded-full flex items-center justify-center text-espresso/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Extra details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
               <div class="space-y-2">
                 <label class="block text-[0.65rem] font-black uppercase tracking-[0.3em] text-espresso/50 ml-6">Cooking / Prep Time</label>
                 <input v-model="form.cookingTime" type="text" placeholder="e.g. 45 min" class="w-full bg-white/50 border-2 border-white/80 rounded-3xl px-8 py-5 focus:outline-none focus:border-espresso/20 focus:bg-white/80 transition-all font-bold text-espresso shadow-sm" />
               </div>
               
               <div class="space-y-2">
                 <label class="block text-[0.65rem] font-black uppercase tracking-[0.3em] text-espresso/50 ml-6">Recipe Image</label>
                 <div 
                   @click="fileInput?.click()"
                   @dragover.prevent
                   @drop.prevent="handleFileDrop"
                   class="w-full min-h-[160px] bg-white/50 border-2 border-dashed border-white/80 rounded-4xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-espresso/20 hover:bg-white/80 transition-all group overflow-hidden relative"
                 >
                   <input 
                     ref="fileInput" 
                     type="file" 
                     class="hidden" 
                     accept="image/*" 
                     @change="handleFileChange" 
                   />
                   
                   <div v-if="imagePreview" class="absolute inset-0">
                      <img :src="imagePreview" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span class="text-white font-sans font-black text-[0.6rem] uppercase tracking-widest">Change Image</span>
                      </div>
                   </div>
                   
                   <div v-else class="text-center">
                      <div class="w-12 h-12 rounded-full bg-espresso/5 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-espresso/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p class="font-sans font-black text-[0.6rem] uppercase tracking-widest text-espresso/30 group-hover:text-espresso/50">Upload or Drop Image</p>
                      <p class="font-sans font-bold text-[0.55rem] text-espresso/20 mt-1 uppercase">Max 5MB • JPG, PNG, WebP</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div class="space-y-2">
             <label class="block text-[0.65rem] font-black uppercase tracking-[0.3em] text-espresso/50 ml-6">Instructions</label>
             <textarea v-model="form.instructions" rows="6" placeholder="Break it down step by step..." class="w-full bg-white/50 border-2 border-white/80 rounded-3xl px-8 py-6 focus:outline-none focus:border-espresso/20 focus:bg-white/80 transition-all font-bold text-espresso shadow-sm resize-none"></textarea>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="p-8 md:px-12 md:py-10 bg-linear-to-b from-transparent to-white/30 border-t border-espresso/5 flex items-center justify-end gap-6 shrink-0">
          <button @click="close" class="font-sans font-black text-[0.7rem] uppercase tracking-[0.3em] text-espresso/40 hover:text-espresso/70 transition-colors">Cancel Interaction</button>
          <button 
            @click="handleSubmit" 
            :disabled="loading"
            class="bg-espresso text-matcha px-12 py-5 rounded-full font-sans font-black text-[0.7rem] uppercase tracking-[0.4em] shadow-xl shadow-espresso/10 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {{ loading ? 'Synchronizing...' : 'Initialize Recipe' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const activeIngSearch = ref<number | null>(null)
const suggestions = ref<any[]>([])

const isTagSuggestionsVisible = ref(false)
const tagSuggestions = ref<string[]>([])

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const initialForm = {
  title: '',
  description: '',
  instructions: '',
  tag: 'Daily',
  cookingTime: '',
  ingredientInputs: [
    { name: '', amount: '' }
  ]
}

const form = reactive({ ...initialForm })

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Max 5MB.')
      return
    }
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleFileDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0]
    if (file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
         alert('Image is too large. Max 5MB.')
         return
      }
      selectedFile.value = file
      imagePreview.value = URL.createObjectURL(file)
    }
  }
}

const close = () => {
  Object.assign(form, initialForm)
  form.ingredientInputs = [{ name: '', amount: '' }]
  selectedFile.value = null
  imagePreview.value = null
  emit('close')
}

const addIngredient = () => {
  form.ingredientInputs.push({ name: '', amount: '' })
}

const removeIngredient = (index: number) => {
  if (form.ingredientInputs.length > 1) {
    form.ingredientInputs.splice(index, 1)
  }
}

const searchIngredients = async (index: number) => {
  const input = form.ingredientInputs[index]
  if (!input) return
  
  const query = input.name
  if (query.length < 2) {
    suggestions.value = []
    return
  }
  
  try {
    const data = await $fetch<any[]>(`/api/ingredients/search?q=${encodeURIComponent(query)}`)
    suggestions.value = data
  } catch (e) {
    console.error('Search failed', e)
  }
}

const selectSuggestion = (index: number, name: string) => {
  if (form.ingredientInputs[index]) {
    form.ingredientInputs[index].name = name
  }
  suggestions.value = []
  activeIngSearch.value = null
}

const handleBlur = () => {
  // Use timeout to allow mousedown to fire on suggestion
  setTimeout(() => {
    activeIngSearch.value = null
  }, 200)
}

const searchTags = async () => {
  const query = form.tag
  try {
    const data = await $fetch<string[]>(`/api/recipes/tags?q=${encodeURIComponent(query)}`)
    tagSuggestions.value = data
  } catch (e) {
    console.error('Tag search failed', e)
  }
}

const selectTag = (tag: string) => {
  form.tag = tag
  tagSuggestions.value = []
  isTagSuggestionsVisible.value = false
}

const handleTagBlur = () => {
  setTimeout(() => {
    isTagSuggestionsVisible.value = false
  }, 200)
}

const handleSubmit = async () => {
  if (!form.title) return
  
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('instructions', form.instructions)
    formData.append('tag', form.tag)
    formData.append('cookingTime', form.cookingTime)
    formData.append('ingredientInputs', JSON.stringify(form.ingredientInputs))
    
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    await $fetch('/api/recipes', {
      method: 'POST',
      body: formData
    })
    emit('success')
    close()
  } catch (e) {
    console.error('Submission failed', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
