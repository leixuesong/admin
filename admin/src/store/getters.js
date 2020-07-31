const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  permission_routes: state => state.user.routes,
  add_routes: state => state.user.addRoutes,
  buttons: state => state.user.buttons
}
export default getters
