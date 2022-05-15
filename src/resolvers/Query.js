const photos = require("../photos-database.js");

module.exports = {
  totalPhotos: () => photos.length,
  allPhotos: () => photos,
}