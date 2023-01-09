import { useEffect, useState } from "react";
import { CheckoutDetail, TCheckout } from "../../types";
import { Footer } from "../components/Footer";
import NavbarUrubuy from "../components/Navbar/NavbarUrubuy";
import { useLocation } from "react-router-dom";
import { addCheckout, deleteCheckout, findCheckout } from "../services/Requests";
import { emptyCheckout } from "../emptyTypes";
import Swal from "sweetalert2";

const Checkout = (props: any) => {
  const [checkoutDetail, setCheckoutDetail] = useState<CheckoutDetail>(emptyCheckout);

  const location = useLocation();
  useEffect(() => {
    //  return () => {
    //cloud not needed
    fetchCheckout();
    // };
  }, []);

  async function fetchCheckout() {
    if (location.state) {
      let checkout: TCheckout[] = location.state.checkout;
      addCheckout(checkout).then((res: any) => {
        if (res.status === 200)
          findCheckout(res.data)
            .then((res: any) => {
              let c: CheckoutDetail = res.data;
              setCheckoutDetail(c);
            })
            .catch((e: any) => console.log(e));
      });
    }
  }

  function handlePaypal() {
    //cloud http://backend.uru-buy.me/paypal/pay
    window.location.replace("http://backend.uru-buy.me/paypal/pay/" + checkoutDetail.total.toFixed(2));
  }

  function handleCancel() {
    let id = checkoutDetail.id;
    deleteCheckout(id)
      .then((res: any) => {
        if (res.status === 200) window.location.replace("/shoppingcartlist");
      })
      .catch((e: any) => {
        console.log(e);
        Swal.fire({
          title: "Ha ocurrido un error, intente mas tarde",
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  }

  return (
    <div id="page-container">
      <NavbarUrubuy />
      <div className="flex mt-10 mb-72">
        <table className="mx-auto text-sm text-left text-gray-500 bg-white border border-gray-200 shadow-md dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Resumen de compra
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              Verifique que todos los datos son correctos antes de continuar.
            </p>
          </caption>
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Nombre del producto
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Metodo de envio
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Cantidad
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Descuento
              </th>
            </tr>
          </thead>
          <tbody>
            {checkoutDetail &&
              checkoutDetail.checkoutShoppingPosts &&
              checkoutDetail.checkoutShoppingPosts.map((item, index: number = 0) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={item.id}
                >
                  <td className="px-6 py-4 font-semibold text-center text-gray-900 dark:text-white">
                    {item.shoppingPost.title}
                  </td>

                  <td className="px-8 py-4 text-center text-gray-900 dark:text-white">
                    {item.isDelivery ? "Delivery a : " + item.address : "Retira en : " + item.address}
                  </td>
                  <td className="px-6 py-4 font-semibold text-center text-gray-900 dark:text-white">
                    {item.quantity.toString()}
                  </td>

                  <td className="px-6 py-4 font-semibold text-center text-gray-900 dark:text-white">
                    {item.shoppingPost.onSale ? (
                      <p className="text-center text-blue-400 line-through text-decoration-line">
                        {item.shoppingPost.saleDiscount + "%"}
                      </p>
                    ) : (
                      "0%"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Detalles del recibo
            </h5>
            <h1>SubTotal: USD {checkoutDetail.subtotal}</h1>

            <h1>Costo de delivery: + USD {checkoutDetail.deliveryCost}</h1>

            <h1>Descuentos: - USD {checkoutDetail.discount}</h1>

            <h1>Total a pagar: USD {checkoutDetail.total}</h1>
          </div>

          <div className="flex items-start justify-center 1">
            <button
              onClick={() => handlePaypal()}
              type="button"
              className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 mr-2 ml-2 mb-2"
            >
              <svg
                className="w-4 h-4 mr-2 -ml-1"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="paypal"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="currentColor"
                  d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
                ></path>
              </svg>
              Pagar con Paypal
            </button>
            <button
              onClick={() => handleCancel()}
              className=" text-white bg-gradient-to-r inline-flex from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
