import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { getAuthorQuery, addBookMutation, getBooksQuery } from "./Queries";
import { useState, useEffect } from "react";

interface IAuthorList {
  id: string;
  name: string;
}

interface IBookList {
  name: string;
  genre: string;
  authorId: string;
}

const initialState: IBookList = {
  name: "",
  genre: "",
  authorId: "",
};

const AddBook: React.FC = () => {
  const client = useApolloClient();

  const {
    loading: authorLoading,
    error: errorAuthor,
    data: authorData,
  } = useQuery(getAuthorQuery);

  const [
    addBook,
    { data: addBookData, loading: addBookLoading, error: addBookMutationError },
  ] = useMutation(addBookMutation);

  if (errorAuthor) return <p>Error : {errorAuthor.message}</p>;

  const [formData, setFormData] = useState<IBookList>(initialState);
  const [message, setMessage] = useState("");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const diplayAuthors = () => {
    if (authorLoading) {
      return <option disabled>Loading Authors...</option>;
    } else {
      return authorData.authors.map((author: IAuthorList) => (
        <option key={author.id} value={author.id}>
          {author.name}
        </option>
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.name === "" ||
      formData.genre === "" ||
      formData.authorId === ""
    ) {
      setMessage(
        <>
          <p className="text-red-500">Please input all the Values</p>
        </>
      );
      return;
    }
    try {
      const result = await addBook({
        variables: formData,
      });
      console.log("Book Added", result);
      setFormData(initialState);
      await client.refetchQueries({
        include: [getBooksQuery],
      });
      setMessage(
        <>
          <p className="text-green-500">Book Added!</p>
        </>
      );
    } catch (error) {
      console.error("Book Error", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      <div className="flex justify-center items-center mt-20">
        <form
          className="bg-white p-10 shadow-lg rounded-lg w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          {message && (
            <p className="flex text-sm justify-center font-bold">{message}</p>
          )}
          <h1 className="flex justify-center text-center text-2xl font-bold mb-10">
            Add New Book
          </h1>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Book Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#ec4370]"
                id="inline-book-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Genre
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#ec4370]"
                id="inline-genre-name"
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Author
              </label>
            </div>
            <div className="md:w-2/3 relative">
              <select
                onChange={handleChange}
                name="authorId"
                value={formData.authorId}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option>Select Authors</option>
                {diplayAuthors()}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-red-400 hover:bg-red-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Add Books +
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBook;
