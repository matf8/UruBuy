import Rating from "@mui/material/Rating/Rating";
import { useKeycloak } from "@react-keycloak/web";
import {
  Chat,
  Clock,
  House,
  NavigationArrow,
  Repeat,
  ShieldCheck,
  ShoppingCartSimple,
  Truck,
  User,
} from "phosphor-react";
import { useEffect, useState } from "react";
import { Category } from "../../../types";
import { addToCart, getSeller } from "../../services/Requests";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import imageNotFound from "../../assets/imageNotFound.png";
import ReviewList from "../ReviewList";

interface IShoppingPostDetails {
  showItem: {
    id: string;
    title: string;
    date?: string | null;
    description: string;
    price: number;
    onSale: boolean;
    saleDiscount?: number | null;
    category: Category;
    hasDelivery: boolean;
    deliveryCost?: number | null;
    addresses: string[];
    stock: number;
    averageRating?: number | null;
    isNew: boolean;
    weight?: number | null;
    base64Images: string[];
    sellerEmail: string;
    shoppingPostStatus: string;
  };
  showItemHandler: (event: React.SyntheticEvent) => void;
}

const ShoppingPost = (props: IShoppingPostDetails) => {
  const { keycloak } = useKeycloak();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [sellerUserName, setSellerUserName] = useState("");
  const [sellerCalif, setSellerCalif] = useState(0);
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState<string>(
    props.showItem.base64Images && props.showItem.base64Images.length > 0
      ? props.showItem.base64Images[0].includes("data:image")
        ? props.showItem.base64Images[0]
        : `data:image/jpg;base64,${props.showItem.base64Images[0]}`
      : imageNotFound,
  );

  const currentImageHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCurrentImage(target.src);
  };

  const handleAddCart = (shopId: string) => {
    let cartCount = localStorage.getItem("cartId");
    if (!cartCount) {
      localStorage.setItem("cartId", props.showItem.id);
    }
    let email = localStorage.getItem("email");
    if (email) {
      addToCart(email, +shopId)
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Producto agregado al carrito!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).finally(() => {
              window.location.replace("/");
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      Swal.fire({
        title: "Error",
        text: "Hubo error con el email",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    getSellerData();
  }, []);

  const getSellerData = () => {
    return getSeller(props.showItem.sellerEmail).then((res) => {
      setSellerUserName(res.data.username);
      let calif = res?.data.averageRating;
      if (calif) setSellerCalif(calif);
    });
  };

  return (
    <>
      <div className="bg-white">
        <div className="pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center max-w-2xl px-4 mx-auto space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
              <li key={-1}>
                <div className="flex items-center">
                  <House size={12} color="#171d6d" weight="fill" />{" "}
                  <a
                    id={"-1"}
                    onClick={props.showItemHandler}
                    className="ml-2 mr-2 text-sm font-medium text-gray-900 cursor-default"
                  >
                    Home
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-4 h-5 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>

              <li key={props.showItem.category.id}>
                <div className="flex items-center">
                  <a className="mr-2 text-sm font-medium text-gray-900">{props.showItem.category.name}</a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-4 h-5 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
              <li className="text-sm">
                <p className="font-medium text-gray-500 hover:text-gray-600">{props.showItem.title}</p>
              </li>
            </ol>
          </nav>
          <div className="items-start justify-center px-4 py-12 md:flex 2xl:px-20 md:px-6">
            <div id="cardShow" className="hidden xl:w-2/6 lg:w-2/5 w-80 md:block">
              <a>
                <img className="w-full" alt="img of a girl posing" src={currentImage} />
              </a>
              <div id="img_show" className="flex mx-16 mt-3 ">
                {props.showItem.base64Images && props.showItem.base64Images.length > 0 ? (
                  props.showItem.base64Images.map((image, index) => (
                    <img
                      key={index}
                      className="w-10 ml-5 bg-white rounded-lg shadow-md border-1 hover:bg-sky-700 dark:bg-gray-800 dark:border-gray-700"
                      src={image.includes("data:image") ? image : `data:image/jpg;base64,${image}`}
                      onClick={currentImageHandler}
                      alt="imagen de publicación"
                    />
                  ))
                ) : (
                  <img
                    className="w-10 ml-5 bg-white rounded-lg shadow-md border-1 hover:bg-sky-700 dark:bg-gray-800 dark:border-gray-700"
                    src={imageNotFound}
                    onClick={currentImageHandler}
                    alt="imagen de publicación no encontrada"
                  />
                )}
              </div>
            </div>

            <div className="mt-6 xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0">
              <div className="pb-6 border-b border-gray-200">
                <p className="text-sm leading-none text-gray-600"></p>
                <p className="mt-2 text-4xl font-semibold leading-7 text-gray-800 lg:leading-6">
                  {props.showItem.title}
                </p>
              </div>
              <div>
                <p className="ml-2 text-base leading-normal text-left text-gray-600 lg:leading-tight mt-7">
                  {props.showItem.description}
                </p>
                <p className="mt-4 ml-2 text-base leading-4 text-left text-gray-600">Peso: {props.showItem.weight}</p>
                <p className="mt-4 ml-2 text-base leading-4 text-left text-gray-600">
                  Condición: {props.showItem.isNew ? "Nuevo" : "Usado"}
                </p>
                <p className="mt-4 ml-2 text-base leading-4 text-left text-gray-600">
                  Fecha de publicado : {props.showItem.date}
                </p>
                <p className="mt-4 mb-10 ml-2 text-base leading-normal text-left text-gray-600 md:w-96">
                  Stock disponible: {props.showItem.stock}
                </p>
              </div>
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  USD {props.showItem.price - (props.showItem.price * props.showItem.saleDiscount!) / 100}
                </p>
                {props.showItem.saleDiscount! > 0 ? (
                  <>
                    <p className="line-through">USD {props.showItem.price}</p>
                    <p className="text-lime-600">{props.showItem.saleDiscount}% OFF</p>
                  </>
                ) : (
                  ""
                )}
                <div className="mt-6">
                  <h3 className="sr-only">Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Rating name="text-feedback" value={props.showItem.averageRating} readOnly precision={0.5} />
                    </div>
                    <ReviewList shoppingPostId={props.showItem.id} />
                  </div>
                </div>
                {keycloak.authenticated ? (
                  props.showItem.stock === 0 || props.showItem.shoppingPostStatus === "PAUSED" ? (
                    <form className="mt-10">
                      <button
                        type="button"
                        className="flex items-center justify-center w-full px-8 py-3 mt-10 text-base font-medium text-white bg-red-900 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled
                      >
                        <Clock size={32} color="#ffffff" weight="fill" />
                        La publicación ha sido temporalmente pausada por el vendedor
                      </button>
                    </form>
                  ) : (
                    <form className="mt-10">
                      <button
                        type="button"
                        className="flex items-center justify-center w-full px-8 py-3 mt-10 text-base font-medium text-white border border-transparent rounded-md bg-sky-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => handleAddCart(props.showItem.id)}
                      >
                        <ShoppingCartSimple size={32} color="#ffffff" weight="fill" />
                        Agregar al carrito
                      </button>
                    </form>
                  )
                ) : props.showItem.stock === 0 || props.showItem.shoppingPostStatus === "PAUSED" ? (
                  <form className="mt-10">
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center w-full px-8 py-3 mt-10 ml-5 text-base font-medium text-white bg-red-900 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <Clock size={32} color="#ffffff" weight="fill" />
                      La publicación ha sido temporalmente pausada por el vendedor
                    </button>
                  </form>
                ) : (
                  <form className="mt-10">
                    <button
                      type="button"
                      onClick={() => keycloak.login()}
                      className="flex items-center justify-center w-full px-8 py-3 mt-10 ml-5 text-base font-medium text-white border border-transparent rounded-md bg-sky-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <ShoppingCartSimple className="mr-5 " size={32} color="#ffffff" weight="fill" />
                      Agregar al carrito
                    </button>
                  </form>
                )}
              </div>
              <div>
                {props.showItem.hasDelivery ? (
                  <div className="py-4 border-t border-b border-gray-200 mt-7">
                    <div onClick={() => setShow(!show)} className="flex items-center justify-between cursor-pointer">
                      <Truck size={32} color="#171d6d" weight="fill" />{" "}
                      <p className="leading-4 text-left text-gray-800">Envio y costo</p>
                      <button
                        className="rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="show or hide"
                      >
                        <svg
                          className={"transform " + (show ? "rotate-180" : "rotate-0")}
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 1L5 5L1 1"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      className={
                        "pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 " + (show ? "block" : "hidden")
                      }
                      id="sect"
                    >
                      {"USD" + props.showItem.deliveryCost}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                <div className="py-4 border-b border-gray-200">
                  <div onClick={() => setShow2(!show2)} className="flex items-center justify-between cursor-pointer">
                    <User size={32} color="#171d6d" weight="fill" />
                    <p className="leading-4 text-left text-gray-800">Conoce al vendedor</p>
                    <button
                      className="rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                      aria-label="show or hide"
                    >
                      <svg
                        className={"transform " + (show2 ? "rotate-180" : "rotate-0")}
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 1L5 5L1 1"
                          stroke="#4B5563"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div
                    className={
                      " text-left text-base leading-normal pr-2 mt-2 text-gray-600 " + (show2 ? "block" : "hidden")
                    }
                    id="sect"
                  >
                    <p>
                      Vendedor:{" "}
                      <button
                        className="font-bold"
                        onClick={() => {
                          navigate("/sellerProfile", { state: { email: props.showItem.sellerEmail } });
                        }}
                      >
                        {sellerUserName}
                      </button>
                    </p>
                    <p className="mt-3">
                      Reputación:
                      {sellerCalif > 0 ? (
                        <Rating name="text-feedback" value={sellerCalif} readOnly precision={0.5} />
                      ) : (
                        "No hay calificaciones para este vendedor"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                {!props.showItem.hasDelivery || props.showItem.addresses !== null ? (
                  <div className="py-4 border-b border-gray-200">
                    <div onClick={() => setShow3(!show3)} className="flex items-center justify-between cursor-pointer">
                      <NavigationArrow size={32} color="#171d6d" weight="fill" />
                      <p className="leading-4 text-left text-gray-800">Direcciones de retiro</p>
                      <button
                        className="rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="show or hide"
                      >
                        <svg
                          className={"transform " + (show3 ? "rotate-180" : "rotate-0")}
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 1L5 5L1 1"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      className={
                        "pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 " + (show3 ? "block" : "hidden")
                      }
                      id="sect"
                    >
                      {props.showItem.addresses &&
                        props.showItem.addresses.length > 0 &&
                        props.showItem.addresses.map((x, i) => <p key={i}>{x}</p>)}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 border-b border-gray-200">
                    <div onClick={() => setShow3(!show3)} className="flex items-center justify-between cursor-pointer">
                      <NavigationArrow size={32} color="#171d6d" weight="fill" />
                      <p className="leading-4 text-left text-gray-800">Direcciones de retiro</p>
                      <button
                        className="rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="show or hide"
                      >
                        <svg
                          className={"transform " + (show3 ? "rotate-180" : "rotate-0")}
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 1L5 5L1 1"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      className={
                        "pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 " + (show3 ? "block" : "hidden")
                      }
                      id="sect"
                    >
                      Este producto solo esta disponible para envío
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="2xl:container 2xl:mx-auto md:py-12 py-9">
        <div className="grid grid-cols-1 px-4 py-10 bg-gray-50 lg:grid-cols-4 md:grid-cols-2 lg:gap-8 md:gap-12 gap-14 lg:px-20 lg:py-12 md:px-12">
          <div>
            <Truck size={44} color="#636469" weight="thin" />
            <h3 className="mt-8 text-xl font-semibold leading-5 text-left text-gray-800 lg:mt-2">Envios a domicilio</h3>
            <p className="w-full mt-4 font-normal leading-6 text-left text-gray-600 lg:w-full md:w-9/12">
              Si tu compra cuenta con envio incluido, puedes recibir tu compra en la puerta de tu casa
            </p>
          </div>
          <div>
            <Chat size={44} color="#636469" weight="thin" />
            <h3 className="mt-8 text-xl font-semibold leading-5 text-left text-gray-800 lg:mt-2">
              Atencion al cliente
            </h3>
            <p className="w-full mt-4 font-normal leading-6 text-left text-gray-600 lg:w-full md:w-9/12">
              Nuestro call center esta disponible 24 horas{" "}
              <span className="font-semibold cursor-pointer ">+598-99-000-233</span> y tambien puedes contactarnos en{" "}
              <span className="font-semibold cursor-pointer ">hola@urubuy.me</span>
            </p>
          </div>
          <div>
            <Repeat size={44} color="#636469" weight="thin" />
            <h3 className="mt-8 text-xl font-semibold leading-5 text-left text-gray-800 lg:mt-2">Recicla!</h3>
            <p className="w-full mt-4 font-normal leading-6 text-left text-gray-600 lg:w-full md:w-9/12">
              Vende aqui los articulos que no usas
            </p>
          </div>
          <div>
            <ShieldCheck size={44} color="#636469" weight="thin" />
            <h3 className="mt-8 text-xl font-semibold leading-5 text-left text-gray-800 lg:mt-2">Paga tranquilo</h3>
            <p className="w-full mt-4 font-normal leading-6 text-left text-gray-600 lg:w-full md:w-9/12">
              Urubuy cuenta con un política estricta anti fraude. Todos nuestros vendedores son identificados legalmente
              para que tu compra no sea una estafa
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingPost;
