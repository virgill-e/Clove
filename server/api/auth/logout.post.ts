export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_user', { path: '/' });
  return { success: true };
});
