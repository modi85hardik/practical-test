export default {
  name: 'sellerService',
  factory: ['localStorageService', (localStorageService) => {
    let uid = 1;
    // Set the initial value of table 
    let sellerList = [];

    // Save the seller data
    const save = (seller) => {
      if(!seller.id) {
        uid = uid + 1;
        seller.id = uid;
        sellerList.push(seller);
        localStorageService.set('sellers', sellerList);
      } else {
        sellerList = sellerList.filter((item) => item.id != seller.id);
        sellerList.push(seller);
        localStorageService.set('sellers', sellerList);
      }
    };

    // Get the seller data using specific id
    const get = (id) => {
      let matchedSeller = sellerList.find(o => o.id === id);
      return matchedSeller
    };

    // Get all list of seller
    const list = () => {
      sellerList = localStorageService.get('sellers');
      return sellerList;
    };

    // Remove seller using id
    const remove = (id) => {
      let matchedSeller = sellerList.find(o => o.id === id);
      const index = sellerList.indexOf(matchedSeller);
      if (index > -1) {
        sellerList.splice(index, 1);
      }
      localStorageService.set('sellers', sellerList);
    };
    
    // Export the each method of services
    return {
      save,
      get,
      remove,
      list,
    };
  }]
}
