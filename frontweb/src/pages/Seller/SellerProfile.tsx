import React from "react";
import { Footer } from "../../components/Footer";
import NavbarUrubuy from "../../components/Navbar/NavbarUrubuy";
import { useEffect, useState } from "react";
import { getSeller } from "../../services/Requests";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Star } from "phosphor-react";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { Seller } from "../../../types";
import { Rating } from "@mui/material";

export default function SellerProfile() {
  const [user, setUser] = useState<Seller | undefined>(undefined);
  const location = useLocation();
  const [purchaseNumber, setPurchaseNumber] = useState(0);
  const [givenReviewNumber, setGivenReviewNumber] = useState(0);
  const [receiveReviewNumber, setReceiveReviewNumber] = useState(0);

  useEffect(() => {
    if (location.state) {
      let sellerEmail = location.state.email as string;
      getSeller(sellerEmail)
        .then((result: any) => {
          setPurchaseNumber(result.data.sales.length);
          setGivenReviewNumber(result.data.givenUserReviews.length);
          setReceiveReviewNumber(result.data.receivedUserReviews.length);
          setUser(result.data);
        })
        .catch((err: any) => {
          Swal.fire("Error", err.response.data, "error");
        });
    } else console.log("seller profile: no hay state");
  }, []);

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
                      <img
                        alt="..."
                        src={
                          !user?.picture
                            ? "https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png"
                            : user?.picture.includes("http")
                            ? user?.picture
                            : user?.picture.includes("data:image")
                            ? user?.picture
                            : "data:image/jpg;base64," + user?.picture
                        }
                        className="absolute h-auto -m-16 -ml-20 align-middle border-none rounded-full shadow-xl lg:-ml-16"
                        style={{ maxWidth: "150px" }}
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 lg:w-4/12 lg:order-3 lg:text-right lg:self-center">
                    <div className="px-3 py-6 mt-32 sm:mt-0">
                      <h3 className="mb-2 text-4xl font-semibold leading-normal text-gray-800">{user?.username}</h3>
                    </div>
                  </div>
                  <div className="w-full px-4 lg:w-4/12 lg:order-1">
                    <div className="flex justify-center py-4 pt-8 lg:pt-4">
                      <div className="p-3 mr-4 text-center">
                        <span className="block text-xl font-bold tracking-wide text-gray-700 uppercase">
                          {purchaseNumber}
                        </span>

                        <span className="text-sm text-gray-500">Ventas realizadas</span>
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
                  <div className="mt-0 mb-2 text-sm font-bold leading-normal text-gray-500 uppercase">
                    <i className="mr-2 text-lg text-gray-500 fas fa-map-marker-alt"></i> Montevideo, Uruguay
                  </div>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel3a-header"
                    >
                      <Star size={32} color="#2193b1" />
                      <Typography variant="h6" className="ml-3">
                        Calificaciones recibidas
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="mt-10 mb-2 text-gray-700 grid grid-cols-2">
                        {user?.receivedUserReviews && user?.receivedUserReviews.length! > 0
                          ? user?.receivedUserReviews?.map((review, index) => (
                              <div
                                key={index}
                                className="max-w-sm p-6 bg-slate-200 border border-gray-400 rounded-lg shadow-md shadow-black"
                              >
                                <Rating value={review.rating} readOnly />
                                <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{review.date}</p>
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
