import angular from 'angular';
import template from './seller-list.tpl.html';
import './seller-list.scss';
import sellerService from '../../services/seller.service';

export default angular
  .module('sellerList.component', [])
  .factory(sellerService.name, sellerService.factory)
  .component('sellerList', {
    template,
    bindings: {
      selectedSeller: '&',
      sellerList: '='
    },
    controller: ['sellerService', 'toaster', function (sellerService, toaster) {
      // Header name
      this.name = 'Seller List';
      this.selectedSeller = null;

      // set Initial value of list
      this.sellerList = sellerService.list();

      // remove selected item
      this.removeSeller = function(sellerDetail) {
        this.selectedSeller = sellerDetail;
      }

      // delete item
      this.delete = function() {
        sellerService.remove(this.selectedSeller.id);
        this.sellerList = sellerService.list();
        this.selectedSeller = null;
        toaster.pop('success', "Seller Deleted", "Seller deleted successfully");
      }

      // save the form
      this.editSeller = function(sellerDetail) {
        this.selectedSeller({seller:angular.copy(sellerDetail)});
      }

      // Fetch value from the list
      this.fetchValue = function(list, key) {
        if (list && list.length) {
          return list.map(o => o[key]).toString();
        }
        return [];
      }

      // Convert boolean value into Yes/No into string
      this.filterForYesNo = function(arg) { return arg ? 'Yes' : 'No' };
    }],
  })
  .name;
