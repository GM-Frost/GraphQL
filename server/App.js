const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

//CONNECTION TO DATABASE:
mongoose.connect(process.env.MONGO_DB);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/Schema");

const app = express();

//USE GRAPHQL

//ALLOW CROSS-ORigin Request
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    //options
    schema,
    graphiql: true,
  })
);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
