import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { MagnifyingGlass } from "phosphor-react";

const Searchbar = (props: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchContext = useContext(SearchContext);
  const navigate = useNavigate();
  const searchQueryHandler = () => {
    searchContext.searchHandler(searchQuery);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      searchContext.searchHandler(searchQuery);
      navigate("/");
    }
  };

  return (
    <div className="flex">
      <div className="relative w-full">
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
						focus:ring-blue-500 focus:border-blue-500 block w-full pr-40 p-2.5  dark:bg-gray-700
						dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
							dark:focus:border-blue-500"
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Buscar producto"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>
      <Link to="/">
        <button
          className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border
					border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
					dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="submit"
          onClick={searchQueryHandler}
        >
          <MagnifyingGlass size={20} color="#f8f6f6" weight="duotone" />
        </button>
      </Link>
    </div>
  );
};

export default Searchbar;
