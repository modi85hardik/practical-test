import angular from 'angular';
import template from './seller-form.tpl.html';
import './seller-form.scss';
import sellerService from '../../services/seller.service';

export default angular
  .module('sellerForm.component', [])
  .factory(sellerService.name, sellerService.factory)
  .component('sellerForm', {
    template,
    controller: ['sellerService', '$scope', '$rootScope', 'Constants', function (sellerService, $scope, $rootScope, Constants) {
      this.currencyList = Constants.currencyList;
      this.offices = Constants.offices;
      // Bind object in the form
      this.seller = {
        sellerName: '',
        currencies: [],
        office: [],
        dealTypeBided: false,
        dealTypeGuaranteed: true,
        contactName: '',
        email: '',
      }
      // Header name
      this.name = 'Seller Form';
      
      // Clear the form
      this.clear = function(form) {
        form.$setPristine();
        form.$setUntouched();
        this.seller = {
          sellerName: '',
          currencies: [],
          office: [],
          dealTypeBided: false,
          dealTypeGuaranteed: true,
          contactName: '',
          email: '',
        }
      }

      // save the form
      this.submit = function(form) {
        if(this.FormValidation()) {
          return;
        } else {
          sellerService.save(this.seller);
          this.clear(form);
          // Publish message to update table list
          $rootScope.$broadcast(Constants.eventNames.UPDATE_SELLER_LIST, true);
        }
      }

      // Check the custom validation for multiple selection check box
      this.FormValidation = function() {
        if (!this.seller.dealTypeBided && !this.seller.dealTypeGuaranteed) {
          return true;
        } else if (this.isMultiSelected(this.seller.office)) {
          return true;
        } else if (this.isMultiSelected(this.seller.currencies)) {
          return true;
        } else {
          return false;
        }
      }

      // Utility to check more than one element in list or not 
      this.isMultiSelected = function(list) {
        if (list && list.length) {
          return false;
        }
        return true;
      }

      // Handler for get the sellerId on click of edit btn 
      $scope.$on(Constants.eventNames.UPDATE_SELLER_INFO, function (event, sellerId) {
        event.currentScope.$ctrl.seller = angular.copy(sellerService.get(sellerId));
      });
    }],
  })
  .name;
