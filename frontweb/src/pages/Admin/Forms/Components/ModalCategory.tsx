import React, { useState } from "react";
import { ListPlus } from "phosphor-react";
import { addCategory } from "../../../../services/Requests";

const ModalCategory = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setNameCat] = useState("");

  const handleAdd = () => {
    addCategory(name)
      .then((res) => {
        if (res.status === 200) window.location.reload();
      })
      .catch((er) => console.log(er));
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    setNameCat(e.target.value);
  };

  return (
    <>
      <button
        className="px-6 py-3 mb-1 mr-1 font-bold text-white rounded shadow outline-none bg-sky-500 white active:bg-blue-500 hover:shadow-lg focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Agregar
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-gray-300 border-solid rounded-t bg-sky-500 ">
                  <ListPlus size={32} color="#f4f0f0" />
                  <h3 className="text-2xl font=semibold text-white">Agregar Categoría</h3>
                  <button
                    className="float-right text-black bg-transparent border-0"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="relative flex-auto p-6">
                  <form className="w-full px-8 pt-6 pb-8 rounded shadow-md">
                    <label className="block mb-1 text-sm font-bold text-black">Nombre</label>
                    <input
                      onChange={handleChange}
                      value={name}
                      className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                    />
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                  <button
                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
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
    </>
  );
};

export default ModalCategory;
