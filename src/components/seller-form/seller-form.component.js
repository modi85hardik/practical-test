import angular from 'angular';
import template from './seller-form.tpl.html';
import './seller-form.scss';
import sellerService from '../../services/seller.service';

export default angular
  .module('sellerForm.component', [])
  .factory(sellerService.name, sellerService.factory)
  .component('sellerForm', {
    template,
    controller: ['sellerService', 'Constants' ,'toaster', function (sellerService, Constants, toaster) {
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

      // set Initial value of list
      this.sellerList = sellerService.list();

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
        },
        onDeselectAll: function() {
          that.countCurrency = 0;
        }
      }
      
      // Events handeling for office dropdown
      this.multiDropdownEventsOffice = {
        onItemSelect: function() {
          that.countOffice += 1;
        },
        onItemDeselect: function() {
          that.countOffice -= 1;
        },
        onDeselectAll: function() {
          that.countOffice = 0;
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
        let submittedForm = form;
        if(this.FormValidation(submittedForm)) {
          return;
        } else {
          sellerService.save(this.seller);
          this.clear(form);
          this.isFormSubmitted = false;
          // Publish message to update table list
          this.sellerList = sellerService.list();
          toaster.pop('success', "Seller Saved", "Seller saved successfully");
        }
      }

      // Check the custom validation for multiple selection check box
      this.FormValidation = function(form) {
        if (!this.seller.dealTypeBided && !this.seller.dealTypeGuaranteed) {
          return true;
        } else if (this.seller.currencies.length === 0) {
          this.isFormSubmitted = true;
          return true
        } else if (this.seller.office.length === 0) {
          this.isFormSubmitted = true;
          return true
        } else if(!form.$valid) {
          this.isFormSubmitted = true;
          return true
        } else {
          return false
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

    // for sharing the data from list to form component using bindings
    this.selectedSeller = function (seller) {
      this.seller.sellerName = seller.sellerName;
      this.seller.dealTypeBided = seller.dealTypeBided;
      this.seller.dealTypeGuaranteed = seller.dealTypeGuaranteed;
      this.seller.email = seller.email;
      this.seller.contactName = seller.contactName;
      this.seller.id = seller.id;
      that.countCurrency = seller.currencies.length;
      that.countOffice = seller.office.length;
      angular.forEach(seller.currencies, function(value) {
        that.seller.currencies.push(
          Constants.currencyList[Constants.currencyList.multiIndexOf(value.label)]
        );
      });
      angular.forEach(seller.office, function(value) {
        that.seller.office.push(
          Constants.offices[Constants.offices.multiIndexOf(value.label)]
        );
      });
    }
    }],
  })
  .name;
