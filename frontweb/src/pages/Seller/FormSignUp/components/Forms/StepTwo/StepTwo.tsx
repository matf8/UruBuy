import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState, useEffect } from "react";
import { FormContext } from "../../../Form";
import * as yup from "yup";
import {
  validateOldId,
  setSellerRole,
  getUsersKC,
  sendEmail,
  validateNewId,
  signUpSellerLocal,
} from "../../../../../../services/Requests";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Seller } from "../../../../../../../types";

function StepTwo() {
  const { keycloak } = useKeycloak();

  const username = keycloak.tokenParsed?.preferred_username;
  const { activeStepIndex, setActiveStepIndex, formData, setFormData }: any = useContext(FormContext);

  useEffect(() => {
    let x = localStorage.getItem("personalId");
    if (x != null) {
      setPersonalId(x);
    }
  }, []);

  const navigate = useNavigate();
  const ValidationSchema = yup.object().shape({
    newCi: yup.string().required(),
    oldCi: yup.string().url().required(),
  });

  const [serieNewCi, setSerieNewCi_] = useState("");
  const [serieOldCi, setSerieOldCi_] = useState("");
  const [folioOldCi, setSFolioOldCi_] = useState("");
  const [personalId, setPersonalId] = useState("");

  function handleChangeNewCi(event: any) {
    setSerieNewCi_(event.target.value);
  }

  function handleChangeSerieOldCi(event: any) {
    setSerieOldCi_(event.target.value);
  }

  function handleChangeFolioOldCi(event: any) {
    setSFolioOldCi_(event.target.value);
  }

  const verifySellerNewId = (id: string, serie: string) => {
    validateNewId(id, serie)
      .then((res) => {
        if (res.status === 200) {
          let s: Seller = {
            firstName: res.data.name,
            lastName: res.data.lastName,
            personalId: res.data.personalId,
            barcode: res.data.secureCode,
            username: username,
            email: "",
            password: "",
            picture: "",
            addresses: [],
            averageRating: 0,
            givenUserReviews: [],
            receivedUserReviews: [],
            sales: [],
          };
          Swal.fire({
            title: "Usuario validado",
            text: "Se ha validado su identidad. Ya puedes vender! 🤩",
            showConfirmButton: true,
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              beSeller(s);
            }
          });
        }
      })
      .catch((err) =>
        Swal.fire({
          title: "Usuario invalidado",
          text: "No hemos podido validar tu identidad. Contacta a un administrador",
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        }),
      );
    //connect to sideco
  };

  const beSeller = (seller: Seller) => {
    getUsersKC()
      .then((res) => {
        if (res?.status === 200) {
          const x: any[] = res?.data;
          x.forEach((element) => {
            if (element.username === username) {
              let uid = element.id;
              setSellerRole(uid).then((res) => {
                if (res?.status === 204) {
                  let _seller: Seller = {
                    username: username,
                    firstName: seller.firstName,
                    lastName: seller.lastName,
                    email: element.email,
                    password: "",
                    picture: "https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png",
                    addresses: [],
                    barcode: seller.barcode,
                    personalId: seller.personalId,
                    averageRating: 0,
                    givenUserReviews: [],
                    receivedUserReviews: [],
                    sales: [],
                  };
                  signUpSellerLocal(_seller)
                    .then((res) => {
                      if (res?.status === 200) setActiveStepIndex(activeStepIndex + 1);
                    })
                    .catch((err) => console.log(err.response.data));
                }
              });
              //  sendEmail(uid);
            }
          });
        }
      })
      .catch((err) => console.log(err.response.data));
  };

  const verifySellerOldId = (oldId: string, serieLetter: string, fileNumber: string) => {
    validateOldId(oldId, serieLetter, fileNumber)
      .then((res) => {
        if (res.status === 200) {
          let s: Seller = {
            firstName: res.data.name,
            lastName: res.data.lastName,
            personalId: res.data.personalId,
            barcode: res.data.secureCode,
            username: username,
            email: "",
            password: "",
            picture: "https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png",
            addresses: [],
            averageRating: 0,
            givenUserReviews: [],
            receivedUserReviews: [],
            sales: [],
          };
          Swal.fire({
            title: "Usuario validado",
            text: "Se ha validado su identidad. Ya puedes vender! 🤩",
            showConfirmButton: true,
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              beSeller(s);
            }
          });
        }
      })
      .catch((err) =>
        Swal.fire({
          title: "Usuario invalidado",
          text: "No hemos podido validar tu identidad. Contacta a un administrador",
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        }),
      );
  };

  return (
    <Formik
      initialValues={{
        picked: "newCi",
      }}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
      }}
    >
      {({ values }) => (
        <Form className="flex flex-col">
          <div className="flex flex-col items-start mb-2">
            <label className="mb-10 text-2xl font-medium text-gray-900">Seleccione la versión de su cédula</label>
            <div role="group" aria-labelledby="my-radio-group place-items-center">
              <label className="items-center align-middle">
                <Field type="radio" name="picked" value="newCi" />
                Con chip
                <img
                  src="https://abrecuentas.itau.com.uy/assets/images/nueva_cedula_icono.svg"
                  className="mb-6 mt4 object-fill ... "
                />
              </label>
              <label className="mt-10">
                <Field type="radio" name="picked" value="oldCi" />
                Sin chip
                <img
                  src="https://abrecuentas.itau.com.uy/assets/images/antigua_cedula_icono.svg"
                  className="mb-6 mt4 object-fill ... "
                />
              </label>
              {/* <div>Picked: {values.picked}</div> */}
            </div>
            <div></div>
            {values.picked.toString() === "oldCi" ? (
              <>
                <div className="flex flex-col items-start mb-2">
                  <label className="font-medium text-gray-900">Serie</label>
                  <Field
                    name="serieOld"
                    className="p-2 border-2 rounded-md"
                    placeholder=""
                    onChange={handleChangeSerieOldCi}
                  />
                </div>
                <div className="flex flex-col items-start mb-2">
                  <label className="font-medium text-gray-900">Número de folio</label>
                  <Field
                    name="folio"
                    className="p-2 border-2 rounded-md"
                    type="number"
                    placeholder=""
                    onChange={handleChangeFolioOldCi}
                  />
                </div>
                <div>
                  <img alt="oldId" src="https://i.ibb.co/vqf85JL/oldId.jpg" className="mb-6 mt4 object-fill ... " />
                </div>
                <button
                  name="butonOldCi"
                  className="p-2 my-2 font-medium text-white bg-indigo-500 rounded-md"
                  type="submit"
                  onClick={() => verifySellerOldId(personalId, serieOldCi, folioOldCi)}
                >
                  Siguiente
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-start mb-2">
                  <label className="font-medium text-gray-900">Serie</label>
                  <Field
                    name="serie_new"
                    className="p-2 border-2 rounded-md"
                    placeholder=""
                    onChange={handleChangeNewCi}
                  />
                </div>
                <div>
                  <img alt="oldId" src="https://i.ibb.co/4Sz0PbR/newId.jpg" className="mb-6 mt4 object-fill ... " />
                </div>
                <button
                  name="butonNewCi"
                  className="p-2 my-2 font-medium text-white bg-indigo-500 rounded-md"
                  type="submit"
                  onClick={() => verifySellerNewId(personalId, serieNewCi)}
                >
                  Siguiente
                </button>
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default StepTwo;
