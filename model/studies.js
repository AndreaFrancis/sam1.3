/**
 * Created by Andrea on 28/07/2015.
 */

Studies = new Mongo.Collection("Studies", {
  transform: function (doc) {
      /**
      if(doc.analisys) {
        for (var i = 0; i < doc.analisys.length; i++) {
          doc.analisys[i].name = Analisys.findOne(doc.analisys[i].analisys).name;
        }
      }**/

    return doc;
  }
});

Ground.Collection(Studies,'studies');
