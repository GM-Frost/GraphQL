import AddBook from "../components/AddBook";
import BookList from "../components/BookList";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const Home = () => {
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <>
      <ApolloProvider client={client}>
        <div className=" w-[60%] h-full">
          <h1 className="text-2xl text-center mt-4 ">Book Library</h1>
          <BookList />
          <AddBook />
        </div>
      </ApolloProvider>
    </>
  );
};

export default Home;
