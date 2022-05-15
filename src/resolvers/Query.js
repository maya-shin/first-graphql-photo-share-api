module.exports = {
  totalPhotos: (_parent, args, { db }) =>
    db.collection("photos").estimatedDocumentCount(),
  allPhotos: (_parent, args, { db }) =>
    db.collection("photos").find().toArray(),
  totalUsers: (_parent, args, { db }) =>
    db.collection("users").estimatedDocumentCount(),
  allUsers: (_parent, args, { db }) => db.collection("users").find().toArray(),
};
