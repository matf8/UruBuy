import { Rating } from "@mui/material";
import { Star, X } from "phosphor-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { TUserReview } from "../../../types";
import { reviewUser } from "../../services/Requests";
import { useNavigate } from "react-router";

interface ICustomerPostReview {
  email: string;
  username: string;
  picture: string;
  id: string;
}

const CustomerPostReview = (props: ICustomerPostReview) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [qualification, setQualification] = useState<number>(0);
  const [textReview, setTextReview] = useState<string>("");
  const [warning, setWarning] = useState<boolean>(false);
  const navigate = useNavigate();
  const textReviewHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setTextReview(target.value);
  };

  const clearReview = () => {
    setWarning(false);
    setQualification(0);
    setTextReview("");
    setShowModal(false);
  };

  const sendReview = (send: boolean) => {
    if (qualification > 0 && send) {
      let email = localStorage.getItem("email");
      let r: TUserReview = {
        id: "",
        date: "",
        rating: qualification,
        description: textReview,
        customerEmail: props.email!,
        sellerEmail: email!,
        from: "SELLER",
        purchaseId: props.id,
      };
      reviewUser(r).then((res: any) => {
        if (res.status === 200) {
          clearReview();
          Swal.fire({
            title: "Reseña agregada correctamente",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "Ok",
          });
          navigate("/profile");
        }
      });
      clearReview();
      window.location.replace("/profile");
    } else if (send) setWarning(true);
    else {
      clearReview();
      setShowModal(false);
    }
  };

  return (
    <>
      {/*Esto simula el hacer click a una publicación que el comprador desea hacerle review*/}
      <button
        className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-slate-600 active:bg-cyan-600 hover:shadow-lg focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Calificar Comprador
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto mx-auto">
              {/*content*/}
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                  <h3 className="text-3xl font-semibold">Calificar a {props.username}</h3>
                  <button onClick={() => sendReview(false)}>
                    <X size={32} />
                  </button>
                </div>
                {/*body*/}
                <div className="relative grid flex-auto p-6 h-lg place-items-center">
                  <p className="my-4 text-lg leading-relaxed text-slate-500">
                    ¿Cómo fue tu experiencia con el comprador {props.username}?
                  </p>

                  <img className="w-[200px] h-[200px] rounded-full object-contain" src={props.picture} />
                  <div className="star-rating">
                    {warning ? <p className="font-bold text-red-600">Debes añadir una calificación</p> : ""}

                    {[...Array(5)].map((star, index) => {
                      index += 1;
                      return (
                        <button
                          type="button"
                          key={index}
                          className={index <= qualification ? "on" : "off"}
                          onClick={() => setQualification(index)}
                        >
                          {index > qualification ? (
                            <Star size={40} />
                          ) : (
                            <Star size={40} weight="fill" color="#FBBF5D" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    onChange={textReviewHandler}
                    placeholder="Cuentanos un poco más agregando un comentario adicional"
                    name="review"
                    id="review"
                    cols={80}
                    rows={8}
                  ></textarea>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                  <button
                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => sendReview(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={() => sendReview(true)}
                  >
                    Calificar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
};

export default CustomerPostReview;
