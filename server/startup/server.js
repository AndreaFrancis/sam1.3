if(Meteor.isServer){
    Meteor.methods({
        createNewUser: function(user){
            if (!user.username){
              throw new Meteor.Error(422, 'Please include a username.');
            }
            if (!user.password){
              throw new Meteor.Error(422, 'Please include a password.');
            }
            Accounts.createUser(user);
        },
        deleteUser : function(id){
            return Meteor.users.remove(id);
        },
        findPatient: function(parameter){
            function delayedMessge() {
            console.log("SAM-INFO: "+parameter);
            Sql.q("select * from SE_HC where HCL_NOMBRE LIKE '%"+parameter+"%'", function (err, res) {
                      console.log("SAM-INFO: B");
                      if(err){
                        console.log("ERRROR:"+ err);
                      }else{
                        res.forEach(function(r){
                              console.log("i:"+r['HCL_NOMBRE']+" "+r['HCL_SEXO']+" "+r['HCL_APPAT']+" "+r['HCL_APMAT']+" "+r['HCL_NUMCI']+" "+r['HCL_CODIGO']+" "+r['HCL_DIRECC']+" "+r['HCL_TELDOM']);
                        });
                        console.log("SAM-INFO"+res.length);
                        response = res;
                        return res;
                      }
            });
          }
          console.log("SAM-INFO: a");
          var wrappedDelayedMessage = Async.wrap(delayedMessge);
          console.log("SAM-INFO: b");
          var response = wrappedDelayedMessage();
          console.log("SAM-INFO: c");
          return response;
        }
    });
}
