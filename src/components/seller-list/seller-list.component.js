import angular from 'angular';
import template from './seller-list.tpl.html';
import './seller-list.scss';
import sellerService from '../../services/seller.service';

export default angular
  .module('sellerList.component', [])
  .factory(sellerService.name, sellerService.factory)
  .component('sellerList', {
    template,
    controller: ['sellerService','$rootScope', '$scope', 'Constants', 'toaster', function (sellerService, $rootScope, $scope, Constants, toaster) {
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
        $rootScope.$broadcast(Constants.eventNames.UPDATE_SELLER_INFO, sellerDetail.id);
      }

      // Fetch value from the list
      this.fetchValue = function(list, key) {
        if (list && list.length) {
          return list.map(o => o[key]).toString();
        }
        return [];
      }

      // Handler for the update the table list
      $scope.$on(Constants.eventNames.UPDATE_SELLER_LIST, function (event) {
        event.currentScope.$ctrl.sellerList = sellerService.list();
      });

      // Convert boolean value into Yes/No into string
      this.filterForYesNo = function(arg) { return arg ? 'Yes' : 'No' };
    }],
  })
  .name;
