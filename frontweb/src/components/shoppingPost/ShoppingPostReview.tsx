import { Star, X } from "phosphor-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { reviewShoppingPost } from "../../services/Requests";
import imageNotFound from "../../assets/imageNotFound.png";
import { useNavigate } from "react-router";

interface IShoppingPostReview {
  id: number;
  title: string;
  base64Images: string[];
}

const ShoppingPostReview = (props: IShoppingPostReview) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [qualification, setQualification] = useState<number>(0);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewImagesURL, setReviewImagesURL] = useState<string[]>([]);
  const [textReview, setTextReview] = useState<string>("");
  const [warning, setWarning] = useState<boolean>(false);
  const navigate = useNavigate();

  const textReviewHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setTextReview(target.value);
  };

  const convertBase64Images = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      return setReviewImages((reviewImages) => [...reviewImages, fileReader.result as string]);
    };

    fileReader.onerror = () => {
      return null;
    };
  };

  const createShoppingPostImagesHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setReviewImages([]);
    if (target.files instanceof FileList) {
      setReviewImagesURL(Array.from(target.files).map((file) => URL.createObjectURL(file)));
      Array.from(target.files).map((file) => convertBase64Images(file));
    }
  };

  const clearReview = () => {
    setWarning(false);
    setQualification(0);
    setReviewImages([]);
    setReviewImagesURL([]);
    setTextReview("");
    setShowModal(false);
  };

  type TNewReview = {
    id: string;
    date: string;
    rating: number;
    description: string;
    customerEmail: string;
    base64Images: string[];
    shoppingPostId: string;
  };
  const sendReview = (send: boolean) => {
    if (qualification > 0 && send) {
      let email = localStorage.getItem("email");
      let r: TNewReview = {
        id: "",
        date: "",
        rating: qualification,
        description: textReview,
        customerEmail: email!,
        base64Images: reviewImages,
        shoppingPostId: props.id.toString(),
      };
      reviewShoppingPost(r)
        .then((res: any) => {
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
        })
        .catch((err) => {
          if (err.response.status === 403)
            Swal.fire({
              title: "No puedes calificar dos veces al mismo producto",
              icon: "error",
              showConfirmButton: true,
              confirmButtonText: "Ok",
            });
        });
      clearReview();
    } else if (send) setWarning(true);
    else {
      clearReview();
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-slate-600 rounded shadow outline-none active:bg-cyan-600 hover:shadow-lg focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Calificar producto
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto mx-auto">
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                  <h3 className="text-3xl font-semibold">Calificar {props.title}</h3>
                  <button onClick={() => sendReview(false)}>
                    <X size={32} />
                  </button>
                </div>
                <div className="relative grid flex-auto p-6 h-lg place-items-center">
                  <p className="my-4 text-lg leading-relaxed text-slate-500">
                    ¿Cómo fue tu experiencia con {props.title}?
                  </p>

                  <img
                    className="rounded-full "
                    src={
                      props.base64Images && props.base64Images.length > 0
                        ? props.base64Images[0].includes("data:image")
                          ? props.base64Images[0]
                          : `data:image/jpg;base64,${props.base64Images[0]}`
                        : imageNotFound
                    }
                    alt={"foto de" + props.base64Images[0]}
                  />
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
                          {index > qualification ? <Star size={40} /> : <Star size={40} weight="fill" color="yellow" />}
                        </button>
                      );
                    })}
                  </div>
                  <label htmlFor="createShoppingPostImages">Comparte fotos del producto que compraste</label>
                  <input
                    onChange={createShoppingPostImagesHandler}
                    className="border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    type="file"
                    name="createShoppingPostImages"
                    id="createShoppingPostImages"
                    alt="images"
                    multiple
                  />
                  <div className="grid max-w-2xl grid-cols-3 gap-4 my-4">
                    {reviewImagesURL
                      ? reviewImagesURL.map((imageURL) => (
                          <img
                            src={imageURL}
                            className={"object-contain h-48 w-96"}
                            key={Math.random()}
                            alt="Preview de la foto"
                          />
                        ))
                      : ""}
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

export default ShoppingPostReview;
