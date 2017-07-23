




module.exports = {
   create: function() {
      var self = this;
      this.list = [];
      this.add = function(id) {
         var obj = {
            id: id,
            x: 0, 
            y: 0, 
         };
         self.list.push(obj);
         return obj;
      }
      this.remove = function(pawn) {
         for(var i = 0; i < self.list.length; i ++)
         {
            if(self.list[i] == pawn) {
               self.list.splice(i, 1);
               break;
            }
         }
      }
      return this;
   }
};


