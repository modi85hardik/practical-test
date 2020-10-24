export default ['$stateProvider', '$locationProvider', ($stateProvider, $locationProvider) => {
  $stateProvider.state({
    name: 'home',
    component: 'home',
    url: '/'
  });

  $locationProvider.html5Mode(true);
}]
