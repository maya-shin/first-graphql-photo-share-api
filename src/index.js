const { ApolloServer } = require("apollo-server");
const users = require("./users-database.js");
const photos = require("./photos-database.js");
const tags = require("./tags-database.js");
const { GraphQLScalarType } = require("graphql");

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  scalar DateTime

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput): Photo!
  }
`;

let _id = 0;

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto: (_parent, args) => {
      //{ _parent: undefined }
      const newPhoto = {
        id: ++_id,
        url: "inmutation", // 返却時のurlの値はPhotoリゾルバで上書きされる
        ...args.input,
        created: new Date()
      };
      photos.push(newPhoto); // push { id: 1, url: 'inmutation', name: 'shiya', description: 'mine' }
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => {
      // parent is { id: 1, url: 'inmutation', name: 'shiya', description: 'mine' }
      return `http://yoursite.com/img/${parent.id}.jpg`; // 返却時にurlを左記値にする
    },
    postedBy: (parent) => {
      return users.find((u) => u.githubLogin == parent.githubUser);
    },
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoID === parent.id) // 対象の写真が関係しているタグの配列を返す
        .map((tag) => tag.userID) // タグの配列をユーザーIDの配列に変換する
        .map((userID) => users.find((u) => u.githubLogin === userID)), // ユーザーIDの配列をユーザーオブジェクトの配列に変換する
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) =>{
      console.log(parent.id)
      return tags
        .filter((tag) => tag.userID === parent.githubLogin) //対象のユーザーが関係しているタグの配列を返す
        .map((tag) => tag.photoID) // タグの配列を写真IDの配列に変換する
        .map((photoID) => photos.find((p) => p.id === photoID)) // 写真IDの配列を写真オブジェクトの配列に変換する
      }
  },
  DateTime: new GraphQLScalarType({
    name: `DateTime`,
    description: `A valid date time value`,
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Server runninng on ${url}`));
