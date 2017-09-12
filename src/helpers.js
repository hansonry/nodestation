function helpers() {
   return this;
}


module.exports = {
   arrays: {
     pick: function(array) {
        if (typeof array == "string" && this.lists[array])
          return this.lists[array[Math.floor(Math.random() * array.length)]]
        return array[Math.floor(Math.random() * array.length)]
     }
   },

   lists: {
     first_names: ["John", "Joe", "Greg"],
     last_names: ["Doe", "McRobust", "Greytide"]
   }
};
