const photos = require("../photos-database.js");

let _id = 0;

module.exports = {
  postPhoto: (_parent, args) => {
    //{ _parent: undefined }
    const newPhoto = {
      id: ++_id,
      url: "inmutation", // 返却時のurlの値はPhotoリゾルバで上書きされる
      ...args.input,
      created: new Date(),
    };
    photos.push(newPhoto); // push { id: 1, url: 'inmutation', name: 'shiya', description: 'mine' }
    return newPhoto;
  },
}