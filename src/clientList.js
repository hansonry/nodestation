




module.exports = {
   create: function() {
      var self = this;
      this.list = [];
      this.add = function(socket) {
         var obj = { 
            socket: socket, 
            keys: {
               up: false,
               down: false,
               left: false,
               right: false
            },
            controlledPawn: undefined
         };
         self.list.push(obj);
         return obj;
      }
      this.remove = function(socket) {
         for(var i = 0; i < self.list.length; i ++)
         {
            if(self.list[i].socket == socket) {
               self.list.splice(i, 1);
               break;
            }
         }
      }
      return this;
   }
};


