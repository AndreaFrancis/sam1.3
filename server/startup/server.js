if(Meteor.isServer){

    Meteor.methods({
        createNewUser: function(user){
            if (!user.username)
                throw new Meteor.Error(422, 'Please include a username.');
            if (!user.password)
                throw new Meteor.Error(422, 'Please include a password.');
            Accounts.createUser(user);
        },
        deleteUser : function(id){       ///Some Delete Method (ignore if dont needed)
            return Meteor.users.remove(id);
        }
    });
}
