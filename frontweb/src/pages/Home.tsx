import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useKeycloak } from "@react-keycloak/web";
import NavbarUrubuy from "../components/Navbar/NavbarUrubuy";
import ShoppingPostFilter from "../components/shoppingPost/ShoppingPostFilter";
import { SearchContext } from "../context/SearchContext";

function Home() {
  const searchContext = useContext(SearchContext);
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  keycloak.tokenParsed?.email ? localStorage.setItem("email", keycloak.tokenParsed?.email) : console.log("no set");
  keycloak.hasRealmRole("appAdmin") && navigate("/homeadmin");

  return (
    <div id="page-container">
      <div className="App">
        <NavbarUrubuy />
        <ShoppingPostFilter name={searchContext.query} />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
