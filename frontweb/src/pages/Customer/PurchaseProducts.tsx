import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Customer, Seller, TPurchase } from "../../../types";
import { Footer } from "../../components/Footer";
import NavbarUrubuy from "../../components/Navbar/NavbarUrubuy";
import ShoppingPostReview from "../../components/shoppingPost/ShoppingPostReview";
import { findPurchaseById, getCustomerProfile, getSellerProfile } from "../../services/Requests";
import { handleStatus } from "../MyProfile";
import SellerPostReview from "./SellerPostReview";
import { useKeycloak } from "@react-keycloak/web";
import CustomerPostReview from "../Seller/CustomerPostReview";
import { emptyPurchase } from "../../emptyTypes";

export default function PurchaseProducts(props: any) {
  const [purchase, setPurchase] = useState<TPurchase>(emptyPurchase);
  const [seller, setSeller] = useState<Seller | undefined>(undefined);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [cReviewed, setcReviewed] = useState<boolean>(false);
  const [sReviewed, setsReviewed] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const isSeller = keycloak.hasRealmRole("vendedor");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    // cloud
    //return () => {
    fetchPurchase();
    //  };
  }, []);

  async function fetchPurchase() {
    if (location.state) {
      let idPurchase: string = location.state.id;
      let p: TPurchase = emptyPurchase;
      findPurchaseById(idPurchase)
        .then((res: any) => {
          if (res.status === 200) {
            p = res.data;
            isSeller
              ? p.sellerReview && p.sellerReview.sellerEmail === location.state.email
                ? setsReviewed(false)
                : setsReviewed(true)
              : p.customerReview && p.customerReview.customerEmail === location.state.email
              ? setcReviewed(false)
              : setcReviewed(true);
            setPurchase(p);
            if (p.id !== "") {
              isSeller
                ? getCustomerProfile(p.customerEmail).then((res) => {
                    if (res.status === 200) setCustomer(res.data);
                  })
                : getSellerProfile(p.sellerEmail).then((r) => {
                    if (r.status === 200) setSeller(r.data);
                  });
            } else Swal.fire("Error", "No se pudo encontrar el vendedor", "error");
          }
        })
        .catch((e: any) => console.log(e));
    } else console.log("purhcase products: no hay state");
  }

  const profileSeller = (email: string) => {
    if (email) navigate("/sellerProfile", { state: { email: email } });
    else Swal.fire("Error", "Imposible ir al perfil del vendedor", "error");
  };

  const profileCustomer = (email: string) => {
    if (email) navigate("/customerProfile", { state: { email: email } });
    else Swal.fire("Error", "Imposible ir al perfil del comprador", "error");
  };

  return (
    <div id="page-container">
      <NavbarUrubuy />
      <div className="flex mt-10 mb-72">
        <table className="mx-auto text-sm text-left text-gray-500 bg-white shadow-md shadow-black dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            {isSeller ? "Resumen de ventas" : "Resumen de compra"}
          </caption>

          <thead className="text-xs text-gray-400 uppercase bg-gray-700 shadow-md shadow-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Estatus
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Monto total
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                {isSeller ? (
                  <button onClick={() => profileCustomer(customer?.username!)}>{customer?.username}</button>
                ) : (
                  <button onClick={() => profileSeller(seller?.username!)}>{seller?.username}</button>
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            <td className="px-8 py-4 text-center text-gray-900 dark:text-white">{purchase.date}</td>
            <td className="px-8 py-4 text-center text-gray-900 dark:text-white">{handleStatus(purchase.status)}</td>
            <td className="px-8 py-4 text-center text-gray-900 dark:text-white">{"USD" + purchase.total}</td>
            <td className="px-8 py-4 text-center text-gray-900 dark:text-white">
              {isSeller && customer && sReviewed ? (
                purchase.status === "DELIVERED" ? (
                  <CustomerPostReview
                    email={customer?.email!}
                    username={customer?.username!}
                    picture={customer?.picture!}
                    id={purchase.id}
                  />
                ) : (
                  "No disponible aún"
                )
              ) : (
                seller &&
                cReviewed &&
                (purchase.status === "DELIVERED" ? (
                  <SellerPostReview
                    email={seller?.email!}
                    username={seller?.username!}
                    picture={seller?.picture!}
                    id={purchase.id}
                  />
                ) : (
                  "No disponible aún"
                ))
              )}
            </td>
          </tbody>
        </table>
        <table className="mx-auto text-sm text-left text-gray-500 bg-white shadow-md shadow-black">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Productos de esta compra
          </caption>
          <thead className="text-xs text-gray-400 uppercase bg-gray-700 shadow-md shadow-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Nombre del producto
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Precio
              </th>

              {!isSeller ? (
                <th scope="col" className="px-6 py-3 text-center">
                  Calificar
                </th>
              ) : (
                <th scope="col" className="px-6 py-3 text-center"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {purchase.shoppingPosts && purchase.shoppingPosts.length > 0
              ? purchase.shoppingPosts.map((item) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={item.id}
                  >
                    <td className="px-8 py-4 text-center text-gray-900 dark:text-white">{item.title}</td>
                    <td className="px-6 py-4 font-semibold text-center text-gray-900 dark:text-white">
                      {"USD" + item.price}
                    </td>
                    <td className="px-6 py-4 font-semibold text-center text-gray-900 dark:text-white">
                      {purchase.status === "DELIVERED" && !isSeller ? (
                        <ShoppingPostReview id={+item.id} title={item.title} base64Images={[]} />
                      ) : !isSeller ? (
                        "No disponible aún"
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
