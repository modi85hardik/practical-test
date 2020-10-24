import angular from 'angular';
import template from './home.tpl.html';
import './home.scss';
import sellerForm from '../../components/seller-form/seller-form.component';
import sellerList from '../../components/seller-list/seller-list.component';

export default angular
  .module('home.view', [
    sellerForm,
    sellerList,
  ])
  .component('home', {
    template,
  })
  .name;
