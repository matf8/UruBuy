import { createContext, useState } from "react";


export const SearchContext = createContext({
    query: "",
    searchHandler: (p: any) => {},
});

const SearchContextProvider = (props: any) => {
    const [query, setQuery] = useState("");
    const searchHandler = (query: any) => {
        setQuery(query);
    };

    return(
        <SearchContext.Provider value={{query:query, searchHandler:searchHandler}}>
        {props.children}
        </SearchContext.Provider>
    );
};

export default SearchContextProvider;