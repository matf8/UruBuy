import React, { useState } from "react";
import { Footer } from "../../components/Footer";
import NavbarUrubuy from "../../components/Navbar/NavbarUrubuy";
import placeholderUser from "../../assets/placeholderUser.png";
import { addUserKc, signUpSellerLocal, getUsersKC, sendEmail } from "../../services/Requests";
import { useNavigate } from "react-router-dom";
import { Seller, UserKC } from "../../../types";

// esto no se usa, se puede covnertir en editar perfil seller

const SignUpSeller = () => {
  const [seller, setSeller] = useState<Seller | undefined>(undefined);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    e.persist();
    setSeller((u: any) => ({
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
    seller!.picture = f as string;
  };

  const getId = (username: string) => {
    getUsersKC().then((res) => {
      if (res?.status === 200) {
        const x: any[] = res?.data;
        x.forEach((element) => {
          if (element.username === username) {
            let uid = element.id;
            sendEmail(uid);
          }
        });
      }
    });
  };

  const newSignUp = () => {
    if (seller) {
      let u: UserKC = {
        username: seller.username,
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email,
        password: seller.password,
      };
      addUserKc(u).then((res) => {
        if (res?.status === 201) {
          getId(u.username);
          signUpSellerLocal(seller!).then((res) => {
            if (res?.status === 201) navigate("/");
          });
        }
      });
    }
  };

  return (
    <div id="page-container">
      <NavbarUrubuy />
      <div className="grid max-w-2xl grid-cols-4 gap-4 pt-4 pb-4 pl-8 pr-8 mx-auto mt-4 mb-8 border border-gray-200 rounded-lg shadow-md bg-sky-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <div className="col-span-4 col-end-5">
          <h1 className="text-5xl font-extrabold dark:text-white">Registro</h1>
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Nombre de usuario
          </label>
          <input
            type="text"
            onChange={handleChange}
            className="mb-6 disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="username"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Correo electrónico
          </label>
          <input
            type="text"
            onChange={handleChange}
            className="mb-6 disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          <label htmlFor="ci" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            onChange={handleChange}
            name="password"
            className="mb-6 text-xs disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="ci" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Repetir Password
          </label>
          <input
            type="password"
            onChange={handleChange}
            name="passwordRepite"
            className="mb-6 text-xs disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="ci" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Dirección
          </label>
          <input
            type="text"
            onChange={handleChange}
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
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignUpSeller;
