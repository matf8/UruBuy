import { Keyhole } from "phosphor-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { UserKC } from "../../../../../types";
import { addUserKc, deleteAdminByEmail, getUsersKC, sendEmail, setRole } from "../../../../services/Requests";

const ModalAdminUser = () => {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [existUser, setExistUser] = useState<boolean>();

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    // setExistUser(false);
  };

  const handleAdd = () => {
    let u: UserKC = {
      username: username,
      firstName: "",
      lastName: "",
      email: email,
      password: password,
    };
    if (existUser) {
      Swal.fire({
        title: "El usuario ya existe",
        showConfirmButton: true,
        confirmButtonText: "Volver",
      }).then((res) => {
        setExistUser(false);
      });
    } else {
      Swal.fire({
        title: "Confirma la creación del administrador?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Crear",
        denyButtonText: `No crear`,
      }).then((result) => {
        if (result.isConfirmed) {
          addUserKc(u).then((res) => {
            if (res?.status === 201) {
              let uid = getId(u.username);
            }
          });
        } else if (result.isDenied) {
          Swal.fire("No se ha creado el usuario administrador", "", "info");
        }
      });
    }
  };

  const handleDeleteAdmin = (email: string) => {
    Swal.fire({
      title: "Confirma la eliminación del administrador?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "red",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteAdminByEmail(email);
        setShowModalDel(false);
        Swal.fire("Usuario administrador eliminado!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("No se ha eliminado el usuario administrador", "", "info");
      }
    });
  };

  const getId = (username: string) => {
    getUsersKC().then((res) => {
      if (res?.status === 200) {
        const x: any[] = res?.data;
        x.forEach((element) => {
          if (element.username === username) {
            let uid = element.id;
            setRole(uid);
            sendEmail(uid);
          }
        });
      }
    });
  };

  const handleChangeUsername = (e: any) => {
    setUsername(e.target.value);
  };

  const handleChangeEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const handleOnBlur = (e: any) => {
    let nom = false;
    getUsersKC()
      .then((res) => {
        const x: any[] = res?.data;
        x.forEach((element) => {
          if (element.username === username) {
            nom = true;
          }
        });
        if (nom) {
          setExistUser(true);
        } else setExistUser(false);
      })
      .catch((err) => setExistUser(false));
  };

  return (
    <>
      <button
        className="px-6 py-3 mb-10 mr-10 font-bold text-white rounded shadow outline-none bg-sky-500 white active:bg-blue-500 hover:shadow-lg focus:outline-none"
        type="button"
        onClick={() => setShowModalAdd(true)}
      >
        Agregar Administrador
      </button>
      <button
        className="px-6 py-3 mb-1 mr-1 font-bold text-white bg-red-700 rounded shadow outline-none white active:bg-blue-500 hover:shadow-lg focus:outline-none"
        type="button"
        onClick={() => setShowModalDel(true)}
      >
        Eliminar Administrador
      </button>

      {showModalAdd ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-gray-300 border-solid rounded-t bg-sky-500 ">
                  <Keyhole size={32} color="#e8e8e8" />
                  <h3 className="text-2xl font=semibold text-white">Agregar Administrador</h3>
                  <button
                    className="float-right text-black bg-transparent border-0"
                    onClick={() => setShowModalAdd(false)}
                  ></button>
                </div>
                <div className="relative flex-auto p-6">
                  <form className="w-full px-8 pt-6 pb-8 rounded shadow-md">
                    <label className="block mb-1 text-sm font-bold text-black">Usuario</label>
                    <input
                      onChange={handleChangeUsername}
                      onBlur={handleOnBlur}
                      value={username}
                      className={
                        existUser === true
                          ? "border-red-600 w-full px-1 py-2 text-black border-2 rounded shadow appearance-none"
                          : " border-green-600 w-full px-1 py-2 text-black border rounded shadow appearance-none"
                      }
                    />
                    <label className="block mb-1 text-sm font-bold text-black">Email</label>
                    <input
                      onChange={handleChangeEmail}
                      value={email}
                      className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                    />
                    <label className="block mb-1 text-sm font-bold text-black">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChangePassword}
                      value={password}
                      className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                    />
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                  <button
                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setShowModalAdd(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-green-700 rounded shadow outline-none active:bg-yellow-700 hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={() => handleAdd()}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {showModalDel ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 bg-red-700 border-b border-gray-300 border-solid rounded-t ">
                  <Keyhole size={32} color="#e8e8e8" />
                  <h3 className="text-2xl font=semibold text-white">Eliminar Administrador</h3>
                  <button
                    className="float-right text-black bg-transparent border-0"
                    onClick={() => setShowModalDel(false)}
                  ></button>
                </div>
                <div className="relative flex-auto p-6">
                  <form className="w-full px-8 pt-6 pb-8 rounded shadow-md">
                    <label className="block mb-1 text-sm font-bold text-black">Email</label>
                    <input
                      onChange={handleChangeEmail}
                      value={email}
                      className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                    />
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                  <button
                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setShowModalDel(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-red-700 rounded shadow outline-none active:bg-yellow-700 hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={() => handleDeleteAdmin(email)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ModalAdminUser;
