export default defineNuxtRouteMiddleware((to: any, from: any) => {
  if (!to.query.token) {
    return navigateTo({path: '/'});
  }
  return true;
})