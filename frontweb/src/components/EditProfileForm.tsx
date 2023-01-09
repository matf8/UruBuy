import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import NavbarUrubuy from "../components/Navbar/NavbarUrubuy";
import { getSeller, getCustomer, updatePicture } from "../services/Requests";
import { Customer, Seller } from "./../../types";
import { Trash } from "phosphor-react";
import placeholderUser from "../assets/placeholderUser.png";
import { Avatar } from "flowbite-react";
import Swal from "sweetalert2";

function EditProfileForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [apell, setApell] = useState("");
  const [picture, setPicture] = useState("");
  const [ci, setCi] = useState(0);
  const { keycloak } = useKeycloak();

  let uInfo = keycloak.loadUserInfo();
  let u = keycloak.tokenParsed?.preferred_username;

  useEffect(() => {
    if (keycloak.hasRealmRole("vendedor")) {
      setUsername(u);
      uInfo.then((res: any) => {
        let e = res.email as string;
        setEmail(res.email);
        getSeller(e)
          .then((result: any) => {
            setName(result.data.firstName);
            setApell(result.data.lastName);
            setCi(result.data.personalId);
            let p = result.data.picture;
            if (p != null) {
              setPicture(p);
            } else {
              setPicture("https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png");
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      });
    } else {
      setUsername(u);
      uInfo.then((res: any) => {
        let e = res.email as string;
        setEmail(res.email);
        getCustomer(e)
          .then((result: any) => {
            setName(result.data.firstName);
            setApell(result.data.lastName);
            setCi(result.data.personalId);
            let p = result.data.picture;
            if (p != null) {
              setPicture(p);
            } else {
              setPicture("https://i.ibb.co/hyBvJ4W/ms-icon-150x150.png");
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      });
    }
  }, []);

  function deletePicture() {
    updatePicture(username, "")
      ?.then((res) => {
        if (res.status === 200) window.location.reload();
      })
      .catch((er) =>
        Swal.fire({
          title: "La foto de su perfil no pudo ser eliminada, intentelo de nuevo mas tarde",
          icon: "error",
          confirmButtonText: "Ok",
        }),
      );
  }
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
    setPicture(f as string);
  };

  function handleUpdate() {
    if (picture) {
      updatePicture(username, picture)
        ?.then((res) => {
          if (res.status === 200) window.location.reload();
        })
        .catch((er) =>
          Swal.fire({
            title: "La foto de su perfil no pudo ser modificada, intentelo de nuevo mas tarde",
            icon: "error",
            confirmButtonText: "Ok",
          }),
        );
    } else
      Swal.fire({
        title: "ha ocurrido un error, intentelo de nuevo mas tarde",
        icon: "error",
        confirmButtonText: "Ok",
      });
  }

  return (
    <div id="page-container">
      <div className="grid max-w-2xl grid-cols-4 gap-4 pt-4 pb-4 pl-8 pr-8 mx-auto mt-4 mb-8 bg-white border border-gray-200 rounded-lg shadow-md">
        <div className=" flex col-span-2 ">
          <Avatar
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            alt="User settings"
            size={"120"}
            img={
              picture.includes("http")
                ? picture
                : picture.includes("data:image")
                ? picture
                : "data:image/jpg;base64," + picture
            }
            rounded={true}
          />
          <button className="flex justify-center items-end mb-1" onClick={() => deletePicture()}>
            <Trash size={36} color="#d11010" weight="thin" />
          </button>
        </div>
        <div className="col-span-2 col-end-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="small_size">
            Cambiar foto de perfil
          </label>
          <input
            className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="small_size"
            type="file"
            onChange={handleUpload}
          />
        </div>
        <div className="col-span-2 col-end-3">
          <label
            htmlFor="username"
            className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-gray-300"
          >
            Nombre de usuario
          </label>
          <input
            type="text"
            id="userName"
            value={username}
            disabled
            className="mb-6 disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col-span-2 col-end-5">
          <label htmlFor="email" className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-gray-300">
            Correo electrónico
          </label>
          <input
            type="text"
            id="email-disabled"
            aria-label="disabled input"
            className="mb-6 disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={email}
            disabled
          />
        </div>

        {keycloak.hasRealmRole("vendedor") && (
          <>
            <div className="col-span-1">
              <label htmlFor="ci" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Cédula de identidad
              </label>
              <input
                type="text"
                id="ci-disabled"
                aria-label="disabled input"
                className="mb-6 text-xs disabled:opacity-50 bg-gray-100 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={ci}
                disabled
              />
            </div>
          </>
        )}

        <div className="col-span-1 col-end-5 mt-7">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => handleUpdate()}
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileForm;
