function TypeSet() {
   var self = this;

   this.items = [];

   this.addItemType = function(name, createFunction, enabled) {
      enabled = enabled || true;
      if(enabled) {
         var itemType = {
            name: name,
            createFunction: createFunction
         }

         self.items.push(itemType);
      }
   }

   function findItemTypeByName(name) {
      var itemTypeIndex = -1;
      for(var i = 0; i < self.items.length; i++) {
         var itemType = self.items[i];
         if(itemType.name == name) {
            itemTypeIndex = i;
            break;
         }
      }
      return itemTypeIndex;
   }

   function findItemTypeByValue(item) {
      var itemIndex = -1;
      for(var i = 0; i < self.items.length; i++) {
         if(self.items[i] == item) {
            itemIndex = i;
            break;
         }
      }
      return itemIndex;
   }

   this.hasItemType = function(name) {
      var itemTypeIndex = findItemTypeByName(name);
      return itemTypeIndex >= 0;
   }

   this.hasItem = function(item) {
     var itemIndex = findItemByValue(item);
     return itemIndex >= 0;
   }

   this.initItem = function(item, name) {
      var itemTypeIndex = findItemTypeByName(name);
      if(itemTypeIndex >= 0) {
         var itemType = self.items[itemTypeIndex];
         item.type = name;
         item.pawnSlotType = '';
         item.pawnVisible = false;
         itemType.createFunction(item);
      }
   }
   return this;
}


module.exports = {
   createTypeSet: function() {
      return new TypeSet();
   }
};
