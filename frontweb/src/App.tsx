import "./App.css";
import "./styles.css"; // TAILWIND
import { toast } from "react-toastify";
import { getAdminToken } from "./services/Requests";
import Navigation from "./Navigation";

function App() {
  toast.configure();
  getAdminToken(); //Token para KeycloakAdmin

  return (
    <>
      <Navigation />
    </>
  );
}

export default App;
