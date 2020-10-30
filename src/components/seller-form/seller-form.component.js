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
      let that = this;

      // Setting for the multiselect dropdown
      this.multipleDropdownSetting = {
        checkBoxes: true, 
        enableSearch: true, 
        scrollableHeight: '310px', 
        scrollable: true,
        smartButtonMaxItems: Constants.currencyList.length,
        smartButtonTextConverter: function (text) {
          return text;
        },
      }

      // Text setting for multiselect dropdown
      this.multipleDropdownText = {checkAll: "Select All", uncheckAll:"Unselect All"}

      // Events handeling for currency dropdown
      this.multiDropdownEventsCurrency = {
        onItemSelect: function() {
         that.countCurrency += 1
        },
        onItemDeselect: function() {
          that.countCurrency -= 1;
        }
      }
      
      // Events handeling for office dropdown
      this.multiDropdownEventsOffice = {
        onItemSelect: function() {
          that.countOffice += 1;
        },
        onItemDeselect: function() {
          that.countOffice -= 1;
        }
      }

      // Set the local storage on initial page load
      this.$onInit = function() {
        sellerService.setInitialStorage();
        this.isFormSubmitted = false;
        this.countCurrency = 0;
        this.countOffice = 0;
      }


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
        } else if (this.seller.currencies.length === 0) {
          this.isFormSubmitted = true;
          return true;
        } else if (this.seller.office.length === 0) {
          this.isFormSubmitted = true;
          return true;
        } else {
          return false;
        }
      }

      // Utility to get the index of matched values from an array based on label key.
      Array.prototype.multiIndexOf = function (el) { 
        let idxs = '';
        angular.forEach(this, function(value, key) {
          if (value.label === el) {
            idxs = key;
          }
        });
        return idxs;
    };



      // Handler for get the sellerId on click of edit btn 
      $scope.$on(Constants.eventNames.UPDATE_SELLER_INFO, function (event, sellerId) {
        
        const matchedSeller = sellerService.get(sellerId);
        that.countCurrency = matchedSeller.currencies.length;
        that.countOffice = matchedSeller.office.length;
        angular.forEach(matchedSeller.currencies, function(value) {
          event.currentScope.$ctrl.seller.currencies.push(
            Constants.currencyList[Constants.currencyList.multiIndexOf(value.label)]
          );
        });

        angular.forEach(matchedSeller.office, function(value) {
          event.currentScope.$ctrl.seller.office.push(
            Constants.offices[Constants.offices.multiIndexOf(value.label)]
          );
        });
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
