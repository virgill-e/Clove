export default defineEventHandler(async (event) => {
  const cookieValue = getCookie(event, 'auth_user');
  
  if (!cookieValue) {
    return { user: null };
  }

  try {
    const user = JSON.parse(cookieValue);
    return { user };
  } catch (e) {
    return { user: null };
  }
});
