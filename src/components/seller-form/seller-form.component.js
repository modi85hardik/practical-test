import angular from 'angular';
import template from './seller-form.tpl.html';
import './seller-form.scss';
import sellerService from '../../services/seller.service';




export default angular
  .module('sellerForm.component', [])
  .factory(sellerService.name, sellerService.factory)
  .component('sellerForm', {
    template,
    controller: ['sellerService', '$scope', '$rootScope', 'Constants' ,'toaster', function (sellerService, $scope, $rootScope, Constants, toaster) {
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
        id: 0
      }

      
      // Header name
      this.name = 'Seller Form';

      // Setting for the multiple dropdown
      this.multipleDropdownSetting = {checkBoxes: true, enableSearch: true, showCheckAll: false, showUncheckAll: false}
      
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
          toaster.pop('success', "Seller Saved", "Seller saved successfully");
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

      // Utility to get the index of matched values from an array based on label key.
      Array.prototype.multiIndexOf = function (el) { 
        var idxs = '';
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i].label === el) {
                idxs = i;
            }
        }
        return idxs;
    };



      // Handler for get the sellerId on click of edit btn 
      $scope.$on(Constants.eventNames.UPDATE_SELLER_INFO, function (event, sellerId) {
        const matchedSeller = sellerService.get(sellerId);
        for(let i = 0 ; i < matchedSeller.currencies.length ; i++) {
          event.currentScope.$ctrl.seller.currencies.push(
            Constants.currencyList[Constants.currencyList.multiIndexOf(matchedSeller.currencies[i].label)]
          );
        }
        for(let i = 0 ; i < matchedSeller.office.length ; i++) {
          event.currentScope.$ctrl.seller.office.push(
            Constants.offices[Constants.offices.multiIndexOf(matchedSeller.office[i].label)]
          );
        }
        event.currentScope.$ctrl.seller.sellerName = sellerService.get(sellerId).sellerName;
        event.currentScope.$ctrl.seller.dealTypeBided = sellerService.get(sellerId).dealTypeBided;
        event.currentScope.$ctrl.seller.dealTypeGuaranteed = sellerService.get(sellerId).dealTypeGuaranteed;
        event.currentScope.$ctrl.seller.email = sellerService.get(sellerId).email;
        event.currentScope.$ctrl.seller.contactName = sellerService.get(sellerId).contactName;
        event.currentScope.$ctrl.seller.id = sellerService.get(sellerId).id;

        // event.currentScope.$ctrl.seller = angular.copy(sellerService.get(sellerId));
      });

    }],
  })
  .name;
