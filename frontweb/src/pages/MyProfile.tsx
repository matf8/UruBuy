import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Rating } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useKeycloak } from "@react-keycloak/web";
import { Avatar } from "flowbite-react";
import { PencilCircle, ShoppingBag, Star } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditProfileForm from "../components/EditProfileForm";
import { Footer } from "../components/Footer";
import NavbarUrubuy from "../components/Navbar/NavbarUrubuy";
import { deleteCustomerKC, getCustomer, getSeller, suspendAccount } from "../services/Requests";
import { Customer, Seller, TPurchase } from "./../../types";

export const handleStatus = (status: string) => {
  let s = "";
  status === "PREPARING_ORDER"
    ? (s = "En preparacion")
    : status === "OUT_FOR_DELIVERY"
    ? (s = "En camino")
    : status === "READY_FOR_PICKUP"
    ? (s = "Listo para retirar")
    : status === "DELIVERED"
    ? (s = "Entregado")
    : (s = "Indefinido");
  return s;
};

export default function MyProfile() {
  const [user, setUser] = useState<Customer | undefined>(undefined);
  const [seller, setSeller] = useState<Seller | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [purchaseNumber, setPurchaseNumber] = useState(0);
  const [givenReviewNumber, setGivenReviewNumber] = useState(0);
  const [receiveReviewNumber, setReceiveReviewNumber] = useState(0);

  const [picture, setPicture] = useState("");
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  let uInfo = keycloak.loadUserInfo();
  let u = keycloak.tokenParsed?.preferred_username;

  useEffect(() => {
    if (keycloak.hasRealmRole("vendedor")) {
      let local = localStorage.getItem("email")!;
      setEmail(local);
      getSeller(local)
        .then((result: any) => {
          let p = result.data.picture;
          setPurchaseNumber(result.data.sales.length);
          setGivenReviewNumber(result.data.givenUserReviews.length);
          setReceiveReviewNumber(result.data.receivedUserReviews.length);
          setSeller(result.data);
          if (p !== "") {
            setPicture(p);
          } else {
            setPicture("https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png");
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      setUsername(u);
      uInfo.then((res: any) => {
        let e = res.email as string;
        setEmail(res.email);
        getCustomer(e)
          .then((result: any) => {
            let p = result.data.picture;
            setPurchaseNumber(result.data.purchases.length);
            setGivenReviewNumber(result.data.givenReviews.length + result.data.givenUserReviews.length);
            setReceiveReviewNumber(result.data.receivedUserReviews.length);
            setUser(result.data);
            if (p !== undefined) {
              setPicture(p);
            } else {
              setPicture("https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png");
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      });
    }
  }, []);

  const handleSuspendCustomerAccount = (email: string) => {
    Swal.fire({
      title: "¿Desea suspender su cuenta?",
      text: "Esta acción es reversible si se vuelve a registrar con el mismo email que tiene actualmente",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Suspender",
      confirmButtonColor: "red",
      denyButtonColor: "green",
    }).then((result) => {
      if (result.isConfirmed) {
        suspendAccount(email)
          .then((r) => {
            if (r.status === 200) {
              deleteCustomerKC(email);
            }
          })
          .catch((e) => Swal.fire("Hubo un error intenté mas tarde", e.response.data, "error"));
      }
    });
  };

  const handleClick = (itemPurchase: TPurchase) => {
    let _id = itemPurchase.id;
    navigate("/purchaseProducts", { state: { id: _id, email: email } });
  };

  return (
    <>
      <NavbarUrubuy />
      <main className="profile-page">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-auto"
            style={{
              backgroundImage: "url('https://i.ibb.co/TDyR02L/urubuy.png')",
            }}
          >
            <span id="blackOverlay" className="absolute w-full h-full bg-black opacity-50"></span>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 top-auto w-full overflow-hidden pointer-events-none"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="text-gray-300 fill-current" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-gray-300">
          <div className="container px-4 mx-auto">
            <div className="relative flex flex-col w-full min-w-0 mb-6 -mt-64 break-words bg-white rounded-lg shadow-xl">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="flex justify-center w-full px-4 lg:w-3/12 lg:order-2">
                    <div className="relative">
                      <Avatar
                        className="absolute h-auto -m-16 -ml-20 align-middle shadow-xl lg:-ml-16"
                        alt="User settings"
                        size={"120"}
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
                    </div>
                  </div>

                  <>
                    {!keycloak.hasRealmRole("vendedor") && (
                      <div className="w-full px-4 lg:w-4/12 lg:order-3 lg:text-right lg:self-center">
                        <div className="px-3 py-6 mt-32 sm:mt-0">
                          <button
                            className="px-4 py-2 mb-1 text-xs font-bold text-white uppercase bg-red-500 rounded shadow outline-none active:bg-pink-600 hover:shadow-md focus:outline-none sm:mr-2"
                            type="button"
                            style={{ transition: "all .15s ease" }}
                            onClick={() => handleSuspendCustomerAccount(email)}
                          >
                            Suspender mi cuenta
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                  <div className="w-full px-4 lg:w-4/12 lg:order-1">
                    <div className="flex justify-center py-4 pt-8 lg:pt-4">
                      <div className="p-3 mr-4 text-center">
                        <span className="block text-xl font-bold tracking-wide text-gray-700 uppercase">
                          {purchaseNumber}
                        </span>

                        <span className="text-sm text-gray-500">
                          {keycloak.hasRealmRole("vendedor") ? "Ventas realizadas" : "Compras realizadas"}
                        </span>
                      </div>
                      <div className="p-3 mr-4 text-center">
                        <span className="block text-xl font-bold tracking-wide text-gray-700 uppercase">
                          {givenReviewNumber}
                        </span>
                        <span className="text-sm text-gray-500">Reseñas dadas</span>
                      </div>
                      <div className="p-3 text-center lg:mr-4">
                        <span className="block text-xl font-bold tracking-wide text-gray-700 uppercase">
                          {receiveReviewNumber}
                        </span>
                        <span className="text-sm text-gray-500">Reseñas recibidas</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 text-center">
                  <h3 className="mb-2 text-4xl font-semibold leading-normal text-gray-800">{username}</h3>
                  <div className="mt-0 mb-2 text-sm font-bold leading-normal text-gray-500 uppercase">
                    <i className="mr-2 text-lg text-gray-500 fas fa-map-marker-alt"></i> Montevideo, Uruguay
                  </div>
                  <div className="mt-10 mb-2 text-gray-700">
                    <i className="mr-2 text-lg text-gray-500 fas fa-briefcase"></i>
                    {}
                  </div>
                </div>
                <div className="py-10 mt-10 text-center border-t border-gray-300">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4 lg:w-9/12">
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <PencilCircle size={32} color="#2193b1" />
                          <Typography variant="h6"> Ver mis datos </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <EditProfileForm />
                        </AccordionDetails>
                      </Accordion>
                      {!keycloak.hasRealmRole("vendedor") ? (
                        <>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel2a-content"
                              id="panel2a-header"
                            >
                              <ShoppingBag size={32} color="#2193b1" />
                              <Typography variant="h6">Ver mis compras</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <table className="mx-auto text-sm shadow-black text-left text-gray-500 bg-white border border-gray-200 shadow-md dark:text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-center ">
                                      Resumen
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {user && user.purchases && user.purchases.length > 0
                                    ? user?.purchases.map((p, index) => (
                                        <tr key={index}>
                                          <div className="flex-row justify-between hover:bg-slate-600 ">
                                            <a
                                              className="cursor-pointer hover:text-white "
                                              onClick={() => handleClick(p)}
                                            >
                                              <td className="px-8 py-4 text-center text-gray-900">
                                                {p.date ? p.date : Date.now()}
                                              </td>
                                              <td className="px-8 py-4 text-center text-gray-900">
                                                {handleStatus(p.status)}
                                              </td>
                                            </a>
                                          </div>
                                        </tr>
                                      ))
                                    : null}
                                </tbody>
                              </table>
                            </AccordionDetails>
                          </Accordion>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel3a-header"
                            >
                              <Star size={32} color="#2193b1" />
                              <Typography variant="h6"> Calificaciones a vendedores</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <div className="grid grid-cols-2 mt-10 mb-2 text-gray-700">
                                {user?.givenUserReviews && user?.givenUserReviews.length! > 0
                                  ? user?.givenUserReviews?.map((review, index) => (
                                      <div
                                        key={index}
                                        className="max-w-sm p-6 border border-gray-400 rounded-lg bg-slate-200 shadow-md shadow-black"
                                      >
                                        <Rating value={review.rating} readOnly />
                                        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                          {review.date}
                                        </p>
                                        <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                          {review.sellerEmail}
                                        </h5>

                                        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                          {review.description}
                                        </p>
                                      </div>
                                    ))
                                  : null}
                              </div>
                            </AccordionDetails>
                          </Accordion>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel4a-header"
                            >
                              <Star size={32} color="#2193b1" />
                              <Typography variant="h6"> Calificaciones recibidas</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {
                                <div className="grid grid-cols-2 mt-10 mb-2 text-gray-700">
                                  {user?.receivedUserReviews && user?.receivedUserReviews.length! > 0
                                    ? user?.receivedUserReviews?.map((review, index) => (
                                        <div
                                          key={index}
                                          className="max-w-sm p-6 border border-gray-400 rounded-lg bg-slate-200 shadow-md shadow-black"
                                        >
                                          <Rating value={review.rating} readOnly />
                                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                            {review.date}
                                          </p>
                                          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                            {review.sellerEmail}
                                          </h5>

                                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                            {review.description}
                                          </p>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              }
                            </AccordionDetails>
                          </Accordion>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel5a-header"
                            >
                              <Star size={32} color="#2193b1" />
                              <Typography variant="h6"> Calificaciones a productos</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {
                                <div className="grid grid-cols-2 mt-10 mb-2 text-gray-700">
                                  {user?.givenReviews && user?.givenReviews.length! > 0
                                    ? user?.givenReviews?.map((review, index) => (
                                        <div
                                          key={index}
                                          className="max-w-sm p-6 bg-slate-200 border border-gray-400 rounded-lg shadow-md shadow-black m-1 "
                                        >
                                          <div className="flex content-center ">
                                            {review.base64Images &&
                                              review.base64Images.length > 0 &&
                                              review.base64Images.map((i, index) => (
                                                <img
                                                  key={index}
                                                  className="w-20 mx-auto"
                                                  src={i && i.length > 0 ? i : `data:image/jpg;base64,${i} `}
                                                  alt="product"
                                                />
                                              ))}
                                          </div>
                                          <Rating value={review.rating} readOnly />
                                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                            {review.date}
                                          </p>
                                          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                            {review.shoppingPost.title}
                                          </h5>

                                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                            {review.description}
                                          </p>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              }
                            </AccordionDetails>
                          </Accordion>
                        </>
                      ) : (
                        <>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel2a-content"
                              id="panel2a-header"
                            >
                              <ShoppingBag size={32} color="#2193b1" />
                              <Typography variant="h6">Ver mis ventas</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <table className="mx-auto text-sm shadow-black text-left text-gray-500 bg-white border border-gray-200 shadow-md dark:text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-center ">
                                      Resumen
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {seller && seller.sales.length > 0
                                    ? seller?.sales.map((p, index) => (
                                        <div className="flex-row justify-between hover:bg-slate-600 ">
                                          <tr key={index}>
                                            <a
                                              className="cursor-pointer hover:text-white "
                                              onClick={() => handleClick(p)}
                                            >
                                              <td className="px-8 py-4 text-center text-gray-900">
                                                {p.date ? p.date : Date.now()}
                                              </td>
                                              <td className="px-8 py-4 text-center text-gray-900">
                                                {handleStatus(p.status)}
                                              </td>
                                            </a>
                                          </tr>
                                        </div>
                                      ))
                                    : null}
                                </tbody>
                              </table>
                            </AccordionDetails>
                          </Accordion>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel3a-header"
                            >
                              <Star size={32} color="#2193b1" />
                              <Typography variant="h6"> Calificaciones a compradores</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <div className="mt-10 mb-2 text-gray-700 grid grid-cols-2">
                                {seller?.givenUserReviews && seller?.givenUserReviews.length! > 0
                                  ? seller?.givenUserReviews?.map((review, index) => (
                                      <div
                                        key={index}
                                        className="max-w-sm p-6 border border-gray-400 rounded-lg shadow-md shadow-black bg-slate-200 "
                                      >
                                        <Rating value={review.rating} readOnly />
                                        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                          {review.date}
                                        </p>
                                        <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                          {review.customerEmail}
                                        </h5>

                                        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                          {review.description}
                                        </p>
                                      </div>
                                    ))
                                  : null}
                              </div>
                            </AccordionDetails>
                          </Accordion>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel4a-header"
                            >
                              <Star size={32} color="#2193b1" />
                              <Typography variant="h6"> Calificaciones recibidas</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {
                                <div className="mt-10 mb-2 text-gray-700 grid grid-cols-2">
                                  {seller?.receivedUserReviews && seller?.receivedUserReviews.length! > 0
                                    ? seller?.receivedUserReviews?.map((review, index) => (
                                        <div
                                          key={index}
                                          className="max-w-sm p-6 border border-gray-400 rounded-lg shadow-md shadow-black bg-slate-200 "
                                        >
                                          <Rating value={review.rating} readOnly />
                                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                            {review.date}
                                          </p>
                                          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                            {review.customerEmail}
                                          </h5>

                                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                            {review.description}
                                          </p>
                                        </div>
                                      ))
                                    : null}
                                </div>
                              }
                            </AccordionDetails>
                          </Accordion>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
