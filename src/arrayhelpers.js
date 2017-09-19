function arrayhelpers() {
   return this;
}

module.exports = {
   pick: function(array) {
      return array[Math.floor(Math.random() * array.length)];
 },
};
