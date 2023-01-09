import { Rating } from "@mui/material";
import { X } from "phosphor-react";
import { useEffect, useState } from "react";
import { TReview } from "../../types";
import { getShoppingPostById } from "../services/Requests";
interface IReviewList {
  shoppingPostId: string;
}

const ReviewList = (props: IReviewList) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [reviews, setReviews] = useState<TReview[]>();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    return getShoppingPostById(props.shoppingPostId).then((r) => {
      if (r.status === 200) setReviews(r.data.reviews);
    });
  };

  return (
    <>
      {reviews && reviews.length > 0 && (
        <button
          className="px-6 py-3 mb-1 mr-1 mx-7 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-slate-600 active:bg-cyan-600 hover:shadow-lg focus:outline-none"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Ver reseñas
        </button>
      )}
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto mx-auto">
              <div className="relative flex flex-col w-full mt-28 p-4 bg-white border-2 rounded-sm border-black shadow-lg outline-none focus:outline-none">
                <div className="flex text-center justify-between p-5 border-b border-solid rounded-t border-slate-200">
                  <h3 className="text-3xl font-semibold">Reseñas del producto</h3>
                  <button onClick={() => setShowModal(false)}>
                    <X size={32} />
                  </button>
                </div>
                <div className=" mb-2 text-gray-700 grid grid-cols-2">
                  {reviews && reviews.length! > 0
                    ? reviews?.map((review, index) => (
                        <div
                          key={index}
                          className="max-w-sm p-6 bg-slate-200 border border-gray-400 rounded-lg shadow-black shadow-md m-1 "
                        >
                          <div className="flex content-center ">
                            {review.base64Images &&
                              review.base64Images.map((i) => (
                                <img
                                  className="w-20 mx-auto"
                                  src={i && i.length > 0 ? i : `data:image/jpg;base64,${i} `}
                                  alt="product"
                                />
                              ))}
                          </div>
                          <Rating value={review.rating} readOnly />
                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{review.date}</p>
                          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                            {review.shoppingPost.title}
                          </h5>

                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{review.description}</p>
                        </div>
                      ))
                    : null}
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

export default ReviewList;
