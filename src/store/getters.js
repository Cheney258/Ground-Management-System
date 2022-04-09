const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  uid: state => state.user.uid,
  userInfo: state => state.user.userInfo,
  myapply: state => state.user.myapply,
  permission_routes: state => state.permission.routes,
  status: state => state.user.status
}
export default getters
