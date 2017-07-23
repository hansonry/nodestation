
module.exports = {
   create: function() {
      var self = this;
      this.list = [];
      this.version = 0;
      this.width = -1;
      this.height = -1;

      this.setup = function(width, height, data) {
         self.width = width;
         self.height = height;
         var i = 0;
         for(var y = 0; y < height; y++ ) {
            for(var x = 0; x < width; x++) {
               self.add(data[i], x, y);
               i++;
            }
         }
      }


      this.add = function(type, x, y) {
         var obj = {
            type: type,
            x: x, 
            y: y, 
         };
         self.list.push(obj);
         return obj;
      }
      this.remove = function(tile) {
         for(var i = 0; i < self.list.length; i ++)
         {
            if(self.list[i] == tile) {
               self.list.splice(i, 1);
               break;
            }
         }
      }
      return this;
   }
};


