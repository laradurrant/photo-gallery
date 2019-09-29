var mongoose = require("mongoose");
var Photo = require("../models/photo");



function seedDB(data){
 
    Photo.remove({}, function(err) { 
      console.log('collection removed') 
  });
      Photo.create(data, function (err, data) {
        if(err) {
          done(err);
        }

 
      });
    

 
}


/*

https://www.freecodecamp.org/forum/t/mongodb-and-mongoose-create-many-records-with-model-create/208546

var createManyPeople = function(arrayOfPeople, done) {
    Person.create(arrayOfPeople, function (err, data) {
      if (err) {
        done(err);
      }
    done(null, data);
    });
    
};


    Photo.create({
        title: "Sweet Pea",
        image: "IMG_6295.jpg",
        body: "A lovely photo of sweet pea."
    });

*/


module.exports = seedDB;