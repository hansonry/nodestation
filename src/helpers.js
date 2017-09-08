function helpers() {
   var self = this;

   this.examplefunc = function() {

   }
   return this;
}


module.exports = {

   misc: {
     examplefunc: function() {
       return null;
     }
   },

   arrays: {
     pick: function(array) {
        return array[Math.floor(Math.random() * array.length)]
     }
   }
};
