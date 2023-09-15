import { useQuery } from "@apollo/client";
import { getBookQuery, getBooksQuery } from "./Queries";
import BookDetails from "../pages/BookDetails";
import { useState } from "react";

const BookList = () => {
  interface IBookList {
    id: string;
    name: string;
  }
  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(getBooksQuery);

  const [selectedBook, setSelectedbook] = useState(null);

  if (booksLoading) return <p>Loading books...</p>;
  if (booksError) return <p>Error: {booksError.message}</p>;

  const selectBook = (bookId) => {
    setSelectedbook(bookId);
  };
  return (
    <>
      <div className="">
        <ul className="p-0">
          {booksData.books.map((book: IBookList) => (
            <li
              key={book.id}
              onClick={() => {
                selectBook(book.id);
              }}
              className="inline-block rounded border shadow-lg cursor-pointer text-[#ec4370] m-3 p-2.5 border-solid border-[#ec4370] hover:bg-[#ec4370] hover:text-white"
            >
              {book.name}
            </li>
          ))}
        </ul>
        <BookDetails bookSelect={selectedBook} />
      </div>
    </>
  );
};

export default BookList;
