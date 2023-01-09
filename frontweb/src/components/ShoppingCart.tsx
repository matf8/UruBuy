import { ShoppingCartSimple } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ShoppingCart = () => {
  const [itemCount, setItemCount] = useState(false);
  const navigate = useNavigate();

  const loadCart = () => {
    let cartCount = localStorage.getItem("cartId") as string;
    if (cartCount) {
      setItemCount(true);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleOpenCart = () => {
    if (!itemCount)
      Swal.fire({
        title: "No tienes productos en el carrito",
        icon: "warning",
        confirmButtonText: "Ok",
      });
    else navigate("/shoppingcartlist");
  };

  return (
    <div>
      <button
        onClick={handleOpenCart}
        className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {itemCount ? (
          <div className="absolute inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-0 -right-0 dark:border-gray-900">
            {itemCount}
          </div>
        ) : (
          ""
        )}
        <ShoppingCartSimple size={28} color="#c59b02" weight="duotone" />
      </button>
    </div>
  );
};

export default ShoppingCart;
