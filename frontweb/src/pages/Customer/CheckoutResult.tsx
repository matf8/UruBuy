import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TShoppingCart } from "../../../types";
import { Footer } from "../../components/Footer";
import NavbarUrubuy from "../../components/Navbar/NavbarUrubuy";
import { getUserCart } from "../../services/Requests";

const CheckoutResult = () => {
  const [userCart, setUserCart] = useState<TShoppingCart | undefined>(undefined);

  useEffect(() => {
    // return () => {
    //cloud not needed
    fetchUserCart();
    // };
  }, []);

  async function fetchUserCart() {
    let email = localStorage.getItem("email");
    if (email) {
      getUserCart(email)
        .then((res: any) => {
          console.log(res);

          if (res.status === 200) {
            let cart: TShoppingCart = res.data;
            setUserCart(cart);
          }
        })
        .catch((err) => {
          console.log(err.response.data);
          Swal.fire({
            icon: "success",
            title: "Gracias por tu compra!",
            text: "Tu pedido se ha realizado con éxito",
            showConfirmButton: true,
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.removeItem("cartId");
              window.location.replace("/");
            }
          });
        });
    } else {
      console.log("Email invalido");
    }
  }

  return (
    <div>
      <NavbarUrubuy />
      {userCart ? (
        <>
          <div className="block max-w-md p-6 m-auto mt-16 bg-white border border-gray-300 rounded-lg shadow-lg mb-72 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Hubo un problema y la compra no se ha completado :{"("}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Vuelva a intentarlo despues de unos minutos o comuniquese con atención al cliente.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="block max-w-md p-6 m-auto mt-16 bg-white border border-gray-300 rounded-lg shadow-lg mb-72 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              ¡Gracias por su compra en Urubuy!
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Verifique su email asociado a su cuenta de Urubuy para encontrar el recibo de su compra.
            </p>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default CheckoutResult;
