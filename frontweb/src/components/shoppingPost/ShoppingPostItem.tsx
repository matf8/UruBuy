import { Clock, ShoppingCart } from "phosphor-react";
import { IShoppingPost } from "../../../types";
import { addToCart } from "../../services/Requests";
import Swal from "sweetalert2";
import { useKeycloak } from "@react-keycloak/web";
import imageNotFound from "../../assets/imageNotFound.png";
import Rating from "@mui/material/Rating/Rating";

const ShoppingPostItem = (props: IShoppingPost) => {
  const { keycloak } = useKeycloak();

  const handleAddCart = (id: string) => {
    if (keycloak.authenticated) {
      let email = localStorage.getItem("email");
      if (email) {
        addToCart(email!, +id).then((res) => {
          if (res.status === 200) {
            let id = localStorage.getItem("cartId");
            if (!id) {
              localStorage.setItem("cartId", "cart");
            }
            Swal.fire({
              title: "Agregado al carrito",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).finally(() => {
              window.location.reload();
            });
          }
        });
      }
    } else {
      Swal.fire({
        title: "Necesitas iniciar sesión para añadir productos al carrito",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <div className="flex mx-16 mt-6">
        <div
          id="card"
          className="bg-white rounded-lg shadow-md w-30 dark:bg-gray-800 dark:border-gray-700 shadow-black"
        >
          <a>
            <img
              className="p-5 rounded-t-lg "
              id={props.id}
              onClick={props.showItemHandler}
              src={
                props.base64Images && props.base64Images.length > 0
                  ? props.base64Images[0].includes("data:image")
                    ? props.base64Images[0]
                    : `data:image/jpg;base64,${props.base64Images[0]} `
                  : imageNotFound
              }
              alt="product"
            />
          </a>
          <div className="px-5 pb-5">
            <a>
              <h3
                className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
                id={props.id}
                onClick={props.showItemHandler}
              >
                {props.title}
              </h3>
            </a>
            <div className="flex items-center mt-2.5 mb-5">
              <Rating name="text-feedback" value={props.averageRating} readOnly precision={0.5} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">USD {props.price}</span>
              {props.saleDiscount! > 0 ? (
                <h4 className="mb-3 text-base font-semibold tracking-tight text-lime-600 text-start">
                  {props.saleDiscount}% OFF
                </h4>
              ) : (
                ""
              )}
              {props.stock === 0 || props.shoppingPostStatus === "PAUSED" ? (
                <a
                  className="text-white bg-red-900 hover:bg-red-600 focus:ring-4 focus:ring-blue-300 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <Clock size={32} />
                </a>
              ) : (
                <a
                  onClick={() => handleAddCart(props.id)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <ShoppingCart size={32} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingPostItem;
