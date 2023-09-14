const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const _ = require("lodash");

//Importing Model
const BookModel = require("../models/Book");
const AuthorModel = require("../models/Author");

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    genre: {
      type: GraphQLString,
    },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        //return _.filter(authors, { id: parent.authorId });
        return AuthorModel.findById(parent.authorId);
      },
    },
  }),
});
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return _.filter(books, { authorId: parent.id });
        return BookModel.find({ authorId: parent.id });
      },
    },
  }),
});

//Creating Root Queries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      //Grabbing the actual Data and send to GraphQL
      resolve(parent, args) {
        //CODE TO GET DATA FROM DB or OTHER SOURCES
        // return _.find(books, { id: args.id });
        return BookModel.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id });
        return AuthorModel.findById(args.id);
      },
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parents, args) {
        //return books;
        return BookModel.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parents, args) {
        //return authors;
        return AuthorModel.find({});
      },
    },
  },
});

//SETTING MUTATION
const Mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parents, args) {
        let author = new AuthorModel({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parents, args) {
        let book = new BookModel({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
  },
});
module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
