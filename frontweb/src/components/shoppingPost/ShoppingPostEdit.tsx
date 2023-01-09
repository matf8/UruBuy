import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IEditShoppingPost } from "../../../types";
import DrawerSeller from "../../pages/Seller/Dashboard/DrawerSeller";
import { editShoppingPost } from "../../services/Requests";
import { Footer } from "../Footer";

const currentShoppingPost = {
  id: "0",
  title: "NombreShoppingPost",
  description: "Descripción",
  price: 100,
  base64Images: [""],
  saleDiscount: 20,
  categoryId: 1,
  hasDelivery: true,
  onSale: true,
  deliveryCost: 10,
  stock: 5,
  isNew: true,
  weight: 0.85,
  addresses: ["Dirección2"],
  sellerEmail: "",
  status: 1,
};

const ShoppingPostEdit = () => {
  const [editShoppingPost_, setEditShoppingPost] = useState<IEditShoppingPost>(currentShoppingPost);
  const navigate = useNavigate();
  const [editShoppingPostImages, setEditShoppingPostImages] = useState<string[]>([]);
  const [editShoppingPostImagesURL, setEditShoppingPostImagesURL] = useState<string[]>([]);
  const [showFirstTime, setShowFirstTime] = useState<boolean>(true);
  const location = useLocation();
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    if (location.state) {
      let sp: IEditShoppingPost = location.state.shoppingPost;
      console.log(sp);
      setEditShoppingPost(sp);
    }
  }, []);

  const handleChange = (e: any) => {
    e.persist();
    setEditShoppingPost((u: any) => ({
      ...u,
      [e.target.name]: e.target.value,
    }));
  };

  const convertBase64Images = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      return setEditShoppingPostImages((editShoppingPostImages) => [
        ...editShoppingPostImages,
        fileReader.result as string,
      ]);
    };

    fileReader.onerror = () => {
      return null;
    };
  };

  const createShoppingPostImagesHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setEditShoppingPostImages([]);
    if (target.files instanceof FileList) {
      setEditShoppingPostImagesURL(Array.from(target.files).map((file) => URL.createObjectURL(file)));
      Array.from(target.files).map((file) => convertBase64Images(file));
      setEditShoppingPost({
        ...editShoppingPost_,
        base64Images: editShoppingPostImages,
      });
      setShowFirstTime(false);
    }
  };

  const createShoppingPostDeliveryHandler = () => {
    setEditShoppingPost({
      ...editShoppingPost_,
      hasDelivery: !editShoppingPost_.hasDelivery,
    });
  };

  const postShoppingPostPlaceHolder = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    console.log("Cantidad de imágenes: " + editShoppingPostImages?.length);

    let myPost = {
      id: editShoppingPost_.id,
      title: editShoppingPost_.title,
      description: editShoppingPost_.description,
      price: editShoppingPost_.price,
      base64Images: editShoppingPostImages,
      saleDiscount: editShoppingPost_.saleDiscount,
      hasDelivery: editShoppingPost_.hasDelivery,
      deliveryCost: editShoppingPost_.deliveryCost,
      addresses: addresses.length > 0 ? addresses : editShoppingPost_.addresses,
      stock: editShoppingPost_.stock,
      isNew: editShoppingPost_.isNew,
      weight: editShoppingPost_.weight,
      onSale: editShoppingPost_.onSale,
    };
    console.log(myPost);

    editShoppingPost(myPost).then((res: any) => {
      console.log(res);
      if (res.status === 200) {
        Swal.fire({
          title: "Se ha editado la publicación",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/homeseller");
          }
        });
      }
    });
    console.log("Edicion enviada");
  };

  const handleChangeAddress = (e: any) => {
    e.persist();
    setAddresses(Array(e.target.value));
  };

  return (
    <div>
      <DrawerSeller />
      <div className="w-full max-w-xl mx-auto mt-4">
        <h1 className="mt-8 mb-8 text-5xl font-medium leading-tight text-blue-600">Editar publicación</h1>
        <form
          onSubmit={postShoppingPostPlaceHolder}
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md [&>input]:my-2"
          action="post"
        >
          <label htmlFor="createShoppingPostTitle">Nombre</label>
          <input
            onChange={handleChange}
            value={editShoppingPost_.title}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            name="title"
            id="createShoppingPostTitle"
            required
          />
          <label htmlFor="createShoppingPostDescription">Descripción</label>
          <input
            onChange={handleChange}
            value={editShoppingPost_.description}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            name="description"
            id="createShoppingPostDescription"
            required
          />
          <label htmlFor="createShoppingPostPrice">Precio (USD)</label>
          <input
            onChange={handleChange}
            value={editShoppingPost_.price}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="number"
            name="price"
            id="createShoppingPostPrice"
            min="0"
            required
          />
          <label htmlFor="createShoppingPostImages">Imagenes</label>
          <input
            onChange={createShoppingPostImagesHandler}
            className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="file"
            name="createShoppingPostImages"
            id="createShoppingPostImages"
            alt="images"
            multiple
          />
          <div className="grid grid-cols-3 gap-4">
            {showFirstTime
              ? editShoppingPost_.base64Images &&
                editShoppingPost_.base64Images.map((image: string) => (
                  <img
                    src={`data:image/jpeg;base64,${image.replace("data:image/jpeg;base64,", "")}`}
                    key={Math.random()}
                    alt="Preview de la foto"
                  />
                ))
              : editShoppingPostImagesURL &&
                editShoppingPostImagesURL.map((imageURL) => (
                  <img src={imageURL} key={Math.random()} alt="Preview de la foto" />
                ))}
          </div>
          <label htmlFor="createShoppingPostSaleDiscount">Porcentaje de descuento</label>
          <input
            onChange={handleChange}
            value={editShoppingPost_.saleDiscount}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="number"
            name="saleDiscount"
            id="saleDiscount"
            min="0"
          />
          <div className="w-full">
            <label htmlFor="createShoppingPostDelivery">Delivery</label>
            <input
              className="ml-2"
              onChange={createShoppingPostDeliveryHandler}
              defaultChecked={editShoppingPost_.hasDelivery}
              type="checkbox"
              name="hasDelivery"
              id="createShoppingPostDelivery"
            />
          </div>
          {editShoppingPost_.hasDelivery ? (
            <>
              <label htmlFor="createShoppingPostDeliveryCost">Costo del delivery</label>
              <input
                onChange={handleChange}
                value={editShoppingPost_.deliveryCost}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="number"
                name="deliveryCost"
                id="createShoppingPostDeliveryCost"
                min="0"
              />
            </>
          ) : (
            ""
          )}
          <div className="flex">
            <div>
              <label htmlFor="ShoppingPostAddress">Dirección del local</label>
              <input
                onChange={handleChangeAddress}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                name="ShoppingPostAddress"
                id="ShoppingPostAddress"
              />
            </div>
          </div>

          <label htmlFor="createShoppingPostStock">Stock</label>
          <input
            onChange={handleChange}
            value={editShoppingPost_.stock}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="number"
            name="stock"
            id="createShoppingPostStock"
            min="1"
            required
          />
          <label htmlFor="createShoppingPostWeight">Peso en kilogramos</label>
          <input
            onChange={handleChange}
            value={editShoppingPost_.weight}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="number"
            name="weight"
            id="createShoppingPostWeight"
            step=".01"
            min="0.01"
            required
          />
          <div className="flex justify-center items-center mt-3 mb-[-10px]">
            <input
              type="submit"
              className="leading-tight cursor-pointer text-white bg-gradient-to-r inline-flex from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-9 py-2.5 text-right mr-2 mb-2"
              value="Editar publicación de venta"
            />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingPostEdit;
