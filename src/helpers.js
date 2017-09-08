function helpers() {
   return this;
}


module.exports = {
   arrays: {
     pick: function(array) {
        return array[Math.floor(Math.random() * array.length)]
     }
   },

   lists: {
     first_names: ["John", "Joe", "Greg"],
     last_names: ["Doe", "McRobust", "Greytide"]
   }
};
