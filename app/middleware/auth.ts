export default defineNuxtRouteMiddleware(async (to, from) => {
  // Use useRequestHeaders to get the cookie on the server
  const { data } = await useFetch<{ user: any }>('/api/auth/me', {
    headers: useRequestHeaders(['cookie'])
  })

  if (!data.value?.user) {
    return navigateTo('/')
  }
})
