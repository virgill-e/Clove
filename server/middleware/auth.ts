export default defineEventHandler(async (event) => {
  const cookieValue = getCookie(event, 'auth_user');
  if (cookieValue) {
    try {
      event.context.user = JSON.parse(cookieValue);
    } catch (e) {
      // Invalid cookie
    }
  }
});
