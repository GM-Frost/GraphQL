import { gql, useQuery } from "@apollo/client";
import { getBookQuery } from "../components/Queries";
const BookDetails = ({ bookSelect }) => {
  const { loading, error, data } = useQuery(getBookQuery, {
    variables: { id: bookSelect },
    skip: !bookSelect,
  });

  const book = data?.book;
  if (loading) {
    return (
      <div className="fixed top-0 right-0 w-[40%] h-full bg-[#ec4370] p-8 overflow-auto shadow-[-2px_-3px_5px_rgba(0,0,0,0.3)l] box-border text-white">
        Loading book details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 right-0 w-[40%] h-full bg-[#ec4370] p-8 overflow-auto shadow-[-2px_-3px_5px_rgba(0,0,0,0.3)l] box-border text-white">
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (data?.book) {
    return (
      <>
        <div className="fixed top-0 right-0 w-[40%] h-full bg-[#ec4370] p-8 overflow-auto shadow-[-2px_-3px_5px_rgba(0,0,0,0.3)l] box-border text-white">
          <p className="text-center text-2xl mb-2">Book Details </p>
          <div className="justify-evenly flex flex-col gap-2 text-lg">
            <p>Book Name: {book?.name}</p>
            <p>Genre: {book?.genre}</p>
            <p>Author: {book?.author.name}</p>
            <p>Age: {book?.author.age}</p>
            <ul className="list-disc p-4 list-inside">
              <span className="text-2xl"> Other Books by Author:</span>
              {book?.author?.books.map((book) => (
                <li className="" key={book.id}>
                  {book.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="fixed top-0 right-0 w-[40%] h-full bg-[#ec4370] p-8 overflow-auto shadow-[-2px_-3px_5px_rgba(0,0,0,0.3)l] box-border text-white">
        No book Selected...
      </div>
    );
  }
};

export default BookDetails;
