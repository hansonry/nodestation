var arrayhelpers = require("./arrayhelpers");

var first_names = ["John", "Joe", "Greg", "Bob", "Frank"];
var last_names = ["McRobust", "Greytide", "Peters", "Doe"];

function names() {
   return this;
}

module.exports = {
   getRandomFirstName: function() {
       return arrayhelpers.pick(first_names);
   },

   getRandomLastName: function() {
       return arrayhelpers.pick(last_names);
   }
};
