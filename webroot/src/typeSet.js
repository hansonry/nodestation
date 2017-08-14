


function TypeSet() {
   var self = this;

   this.items = [];

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

   this.initItem = function(item, name) {
      var itemTypeIndex = findItemTypeByName(name);
      if(itemTypeIndex >= 0) {
         var itemType = self.items[itemTypeIndex];
         item.type = name;
         item.pawnSlotType = '';
         item.pawnVisible = false;
         item.name = name;
         itemType.createFunction(item);
      }
   }


   return this;
}

