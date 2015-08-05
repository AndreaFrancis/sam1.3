/**
 * Created by Andrea on 07/06/2015.
 */

Users = Meteor.users;
Ground.Collection(Users,'users');


var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
    stores: [imageStore]
});
