const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  email: state => state.user.email,
  phone_number: state => state.user.phone_number,
  menus: state => state.user.menus
}
export default getters
