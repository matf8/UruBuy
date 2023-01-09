import { useState } from "react";
import { Footer } from "../../components/Footer";
import NavbarUrubuy from "../../components/Navbar/NavbarUrubuy";
import { addUserKc, signUpCustomerLocal } from "../../services/Requests";
import { useNavigate } from "react-router-dom";
import { Customer, UserKC } from "../../../types";
import Swal from "sweetalert2";

const SignUpCustomer = () => {
  const [newUser, setNewUser] = useState<Customer | undefined>(undefined);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>();
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    e.persist();
    setNewUser((u: any) => ({
      ...u,
      [e.target.name]: e.target.value,
    }));
  };

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpload = async (data: any) => {
    const file = data.target.files[0];
    const f = await convertBase64(file);
    newUser!.picture = f as string;
  };

  const newSignUp = () => {
    let mail = /\S+@\S+\.\S+/.test(newUser?.email as string);

    newUser?.username === undefined ||
    newUser?.username === "" ||
    newUser?.email === "" ||
    newUser?.email === undefined ||
    newUser.password === "" ||
    newUser.password === undefined ||
    passwordConfirmation === "" ||
    passwordConfirmation === undefined ||
    addresses.length === 0 ||
    addresses[0] === ""
      ? Swal.fire({
          title: "¡Alguno de los campos obligatorios está vacío!",
          text: "Ingrese datos en cada uno de los campos obligatorios y vuelva a confirmar su registro.",
          icon: "warning",
          confirmButtonText: "Ok",
        })
      : !mail
      ? Swal.fire({
          title: "¡El correo electrónico ingresado no es valido!",
          text: "Ingrese un correo electrónico valido e intente de nuevo",
          icon: "warning",
          confirmButtonText: "Ok",
        })
      : newUser?.password !== passwordConfirmation
      ? Swal.fire({
          title: "¡Las contraseñas no coinciden!",
          text: "Vuelva a ingresar contraseña y confirmación de contraseña correctamente",
          icon: "warning",
          confirmButtonText: "Ok",
        })
      : newSignUpCorrect();
  };

  const newSignUpCorrect = () => {
    let u: UserKC = {
      username: newUser!.username,
      firstName: "",
      lastName: "",
      email: newUser!.email,
      password: newUser!.password,
    };
    addUserKc(u)
      .then((res) => {
        if (res?.status === 201) {
          let newU = {
            username: newUser!.username,
            firstName: "",
            lastName: "",
            addresses: addresses,
            email: newUser!.email,
            password: newUser!.password,
          };
          signUpCustomerLocal(newU!).then((res) => {
            if (res?.status === 200) {
              Swal.fire({
                title: "Usuario registrado",
                text: "¡Se ha enviado un correo para activar su cuenta, verifque su correo para iniciar sesión en UruBuy!",
                icon: "success",
                confirmButtonText: "Ok",
              }).then((result) => {
                if (result.isConfirmed) navigate("/");
              });
            }
          });
        }
      })
      .catch((err) => console.log(err.response.data));
  };

  function handleAddress(e: any) {
    let x = Array(e.target.value);
    setAddresses(x);
  }

  function handlePassConfirm(e: any) {
    let pass = e.target.value as string;
    setPasswordConfirmation(pass);
  }

  return (
    <div id="page-container">
      <NavbarUrubuy />
      <div className="grid max-w-2xl grid-cols-4 gap-4 pt-4 pb-4 pl-8 pr-8 mx-auto mt-4 mb-8 bg-white border border-gray-200 rounded-lg shadow-black shadow-md">
        <div className="col-span-4 col-end-5">
          <h1 className="text-5xl font-extrabold dark:text-white">Registro</h1>
        </div>
        <div>
          <label htmlFor="email" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Nombre de usuario
            <p className="text-red-700 align-text-top">*</p>
          </label>
          <input
            type="text"
            onChange={handleChange}
            className="mb-6 disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="username"
          />
        </div>
        <div>
          <label htmlFor="email" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Correo electrónico
            <p className="text-red-700 align-text-top">*</p>
          </label>
          <input
            type="text"
            placeholder="usuario@ejemplo.com"
            onChange={handleChange}
            className=" placeholder-gray-400 mb-6 disabled:opacity-50 bg-gray-100 border border-gray-300  text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            name="email"
          />
        </div>
        <div className="col-span-2 col-end-5">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={require("../../assets/placeholderUser.png")}
            alt="Foto de perfil"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="ci" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Contraseña
            <p className="text-red-700 align-text-top">*</p>
          </label>
          <input
            type="password"
            onChange={handleChange}
            name="password"
            className="mb-6 text-xs disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="ci" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Repetir contraseña
            <p className="text-red-700 align-text-top">*</p>
          </label>
          <input
            type="password"
            onChange={(e) => handlePassConfirm(e)}
            name="passwordRepite"
            className="mb-6 text-xs disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="ci" className="flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Dirección de envio
            <p className="text-red-700 align-text-top">*</p>
          </label>
          <textarea
            onChange={(e) => handleAddress(e)}
            name="address"
            className="mb-6 text-xs disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-2 col-end-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="small_size">
            Foto de perfil
          </label>
          <input
            className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            name="picture"
            onChange={handleUpload}
          />
        </div>
        <div className="col-span-1 col-end-5">
          <button
            type="submit"
            onClick={newSignUp}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Aceptar
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default SignUpCustomer;
