import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-local-storage';
import './common/app.scss';

import appRoutes from './app.routes';
import homeView from './views/home/home.view';
import constants from './constants/constant';

angular
  .module('app', [
    homeView,
    'ui.router',
    'LocalStorageModule',
  ])
  .constant('Constants', constants)
  .config(appRoutes)
