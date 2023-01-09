import { useKeycloak } from "@react-keycloak/web";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomer, getSeller, getUserCart } from "../../services/Requests";
import Searchbar from "../Searchbar";
import ShoppingCart from "../ShoppingCart";

export default function NavbarUrubuy({ fixed }: any) {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [emailUser, setEmailUser] = useState("");
  const [picture, setPicture] = useState("");

  useEffect(() => {
    const getPhotoDelayed = setTimeout(() => {
      fetchEmail();
    }, 1500);

    return () => {
      clearTimeout(getPhotoDelayed);
    };
  }, [emailUser]);

  async function fetchEmail() {
    let email = localStorage.getItem("email");
    if (email) {
      setEmailUser(email);
      getUserCart(email)
        .then((res: any) => {
          if (res.status === 200) {
            localStorage.setItem("cartId", res.data.id);
          }
        })
        .catch((err) => {
          console.log(err.response.data);
          localStorage.removeItem("cartId");
        });

      let uInfo = keycloak.loadUserInfo();
      if (keycloak.hasRealmRole("vendedor")) {
        uInfo.then((res: any) => {
          let e = res.email as string;
          setEmailUser(res.email);
          getSeller(e)
            .then((result: any) => {
              let p = result.data.picture;
              if (p !== "") {
                setPicture(p);
              } else {
                setPicture("https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png");
              }
            })
            .catch((err: any) => {
              console.log(err);
            });
        });
      } else {
        if (email) {
          getCustomer(email)
            .then((result: any) => {
              let p = result.data.picture;
              if (p !== null || p !== undefined) {
                setPicture(p);
              } else {
                setPicture("https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png");
              }
            })
            .catch((err: any) => {
              console.log(err);
            });
        }
      }
    }
  }

  const handleCustomerSignUp = () => {
    navigate("/signupcustomer");
  };

  const handleSellerSingUp = () => {
    navigate("/signupseller");
  };

  const handleSellerDash = () => {
    navigate("/homeseller");
  };

  const handleSell = () => {
    navigate("/sell");
  };

  const handleUserProfile = () => {
    navigate("/profile");
  };

  const removeStorage = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("cartId");
  };

  return (
    <Navbar fluid={true} rounded={false} className="bg-[#1F2937]">
      <Navbar.Brand href="http://uru-buy.me/">
        <img src="https://i.ibb.co/h1DRKMH/urub3.png" className="h-6 mr-3 sm:h-9" alt="Urubuy" />
        <span className="self-center text-xl font-semibold whitespace-nowrap">{/*      */}</span>
      </Navbar.Brand>
      <Searchbar />
      {keycloak.authenticated && <ShoppingCart />}

      <div className="flex md:order-2">
        {keycloak.authenticated && (
          <Dropdown
            className="bg-[#1F2937]"
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img={
                  picture && picture.length > 0
                    ? picture.includes("http")
                      ? picture
                      : picture.includes("data:image")
                      ? picture
                      : "data:image/jpg;base64," + picture
                    : "https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png"
                }
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm text-[#fff] text-center">Bienvenido</span>
              <span className="block text-sm font-medium truncate text-[#d8a13c] text-center">
                {keycloak.tokenParsed?.preferred_username}
              </span>
            </Dropdown.Header>
            <Dropdown.Item className="text-[#d8a13c] hover:text-[#1F2937]" onClick={handleUserProfile}>
              Mi perfil
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              className="text-[#fff] hover:text-[#1F2937]"
              onClick={() => {
                removeStorage();
                keycloak.logout();
              }}
            >
              Salir
            </Dropdown.Item>
          </Dropdown>
        )}
        {!keycloak.authenticated && (
          <>
            <Navbar.Collapse></Navbar.Collapse>
            <button
              className="h-10 px-5 text-yellow-700 transition-colors duration-150 border border-yellow-500 rounded-lg focus:shadow-outline hover:bg-blue-800 hover:text-yellow-400"
              onClick={() => keycloak.login()}
            >
              Login
            </button>
            <button
              className="h-10 px-5 ml-5 text-yellow-700 transition-colors duration-150 border border-yellow-500 rounded-lg focus:shadow-outline hover:bg-blue-800 hover:text-yellow-400"
              onClick={handleCustomerSignUp}
            >
              Registrarse
            </button>
            {keycloak.hasRealmRole("vendedor") && (
              <button
                className="h-10 px-5 ml-5 text-yellow-700 transition-colors duration-150 border border-yellow-500 rounded-lg focus:shadow-outline hover:bg-blue-800 hover:text-yellow-400"
                onClick={handleSell}
              >
                Vender
              </button>
            )}
          </>
        )}
        {keycloak.hasRealmRole("comprador") && !keycloak.hasRealmRole("vendedor") && (
          <button
            className="h-10 px-5 ml-5 text-yellow-700 transition-colors duration-150 border border-yellow-500 rounded-lg focus:shadow-outline hover:bg-blue-800 hover:text-yellow-400"
            onClick={handleSellerSingUp}
          >
            Ser vendedor
          </button>
        )}
        {keycloak.hasRealmRole("vendedor") && (
          <button
            className="h-10 px-5 ml-5 text-yellow-700 transition-colors duration-150 border border-yellow-500 rounded-lg focus:shadow-outline hover:bg-blue-800 hover:text-yellow-400"
            onClick={handleSellerDash}
          >
            Panel de vendedor
          </button>
        )}
      </div>
    </Navbar>
  );
}
