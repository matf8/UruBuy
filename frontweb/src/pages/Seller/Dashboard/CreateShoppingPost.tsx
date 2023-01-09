import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { emptyCreateShoppingPost } from "../../../emptyTypes";
import { Category, ICreateShoppingPost } from "../../../../types.d";
import { Footer } from "../../../components/Footer";
import { addShoppingPost, getCategories } from "../../../services/Requests";
import DrawerSeller from "../Dashboard/DrawerSeller";
import { useNavigate } from "react-router-dom";

const CreateShoppingPost = () => {
  const [createShoppingPost, setCreateShoppingPost] = useState<ICreateShoppingPost>(emptyCreateShoppingPost);
  const [createShoppingPostImages, setCreateShoppingPostImages] = useState<string[]>([]);
  const [createShoppingPostImagesURL, setCreateShoppingPostImagesURL] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categoryIdSelected, setCategoryIdSelected] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    e.persist();
    setCreateShoppingPost((u: any) => ({
      ...u,
      [e.target.name]: e.target.value,
    }));
  };

  const convertBase64Images = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      return setCreateShoppingPostImages((createShoppingPostImages) => [
        ...createShoppingPostImages,
        fileReader.result as string,
      ]);
    };

    fileReader.onerror = () => {
      return null;
    };
  };

  const createShoppingPostImagesHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPostImages([]);
    if (target.files instanceof FileList) {
      setCreateShoppingPostImagesURL(Array.from(target.files).map((file) => URL.createObjectURL(file)));
      Array.from(target.files).map((file) => convertBase64Images(file));
      setCreateShoppingPost({
        ...createShoppingPost,
        base64Images: createShoppingPostImages,
      });
    }
  };

  const createShoppingPostIsNewHandler = () => {
    setCreateShoppingPost({
      ...createShoppingPost,
      isNew: !createShoppingPost.isNew,
    });
  };

  const createShoppingPostDeliveryHandler = () => {
    setCreateShoppingPost({
      ...createShoppingPost,
      hasDelivery: !createShoppingPost.hasDelivery,
    });
  };

  const handleOnSale = () => {
    setCreateShoppingPost({
      ...createShoppingPost,
      onSale: !createShoppingPost.onSale,
    });
  };

  const createShPost = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    let myPost = {
      title: createShoppingPost.title,
      description: createShoppingPost.description,
      price: createShoppingPost.price,
      base64Images: createShoppingPostImages,
      saleDiscount: createShoppingPost.saleDiscount,
      hasDelivery: createShoppingPost.hasDelivery,
      deliveryCost: createShoppingPost.deliveryCost,
      addresses: addresses,
      stock: createShoppingPost.stock,
      isNew: createShoppingPost.isNew,
      weight: createShoppingPost.weight,
      onSale: createShoppingPost.onSale,
      categoryId: categoryIdSelected,
      sellerEmail: keycloak.tokenParsed?.email,
    };

    addShoppingPost(myPost)
      .then((res: any) => {
        if (res.status === 200) {
          Swal.fire({
            title: "¡Publicación creada!",
            text: "La publicación se ha creado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/myshopingposts");
            }
          });
        }
      })
      .catch((er) => {
        Swal.fire({
          title: "¡Publicación imposible de crear!",
          text: "La publicación no se ha creado correctamente, revise los datos e intente nuevamente",
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.status === 200) {
          setCategoryList(res.data as Category[]);
        }
      })
      .catch((er) => {});
  }, []);

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setCategoryIdSelected(event.target.value);
  };

  const handleChangeAddress = (e: any) => {
    e.persist();
    let a = e.target.value;
    let arr: string[] = [];
    arr.push(a);
    setAddresses(arr);
  };

  return (
    <div>
      <DrawerSeller />
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto text-left ml-72 max-w-7xl sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Crear una publicación </h1>
        </div>
      </header>
      <div className="w-full max-w-xl mx-auto mt-4">
        <form
          onSubmit={createShPost}
          className="px-8 pt-6 pb-8 mb-4 bg-white border border-gray-200 rounded-lg shadow-md shadow-black dark:bg-gray-800 dark:border-gray-700 [&>input]:my-2"
          action="post"
        >
          <label htmlFor="createShoppingPostTitle">Nombre</label>
          <input
            onChange={handleChange}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            name="title"
            id="createShoppingPostTitle"
            required
          />
          <label htmlFor="createShoppingPostDescription">Descripción</label>
          <textarea
            onChange={handleChange}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            name="description"
            id="createShoppingPostDescription"
            required
          />
          <label htmlFor="createShoppingPostPrice">Precio (USD)</label>
          <input
            onChange={handleChange}
            className="w-24 px-3 py-2 ml-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="number"
            name="price"
            id="createShoppingPostPrice"
            min="0"
            required
          />
          <label
            htmlFor="createShoppingPostImages"
            className="ml-4 cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Cargar imágenes
          </label>
          <input
            onChange={createShoppingPostImagesHandler}
            className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="file"
            name="createShoppingPostImages"
            id="createShoppingPostImages"
            alt="images"
            style={{ display: "none" }}
            multiple
          />
          <div className="grid grid-cols-3 gap-4">
            {createShoppingPostImagesURL
              ? createShoppingPostImagesURL.map((imageURL) => (
                  <img src={imageURL} key={Math.random()} alt="Preview de la foto" />
                ))
              : ""}
          </div>
          <>
            <div className="w-full py-2">
              <label htmlFor="createShoppingPostSale">En oferta</label>
              <input
                className="ml-2"
                onChange={handleOnSale}
                type="checkbox"
                name="onSale"
                id="createShoppingPostSale"
              />
            </div>
            {createShoppingPost.onSale ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="col-start-1">
                  <label htmlFor="createShoppingPostSaleDiscount">Porcentaje de descuento</label>
                  <input
                    onChange={handleChange}
                    className="px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    type="number"
                    name="saleDiscount"
                    id="saleDiscount"
                    min="0"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </>
          <div>
            {
              <FormControl>
                <label htmlFor="createShoppingPostDelivery">Seleccione una categoria</label>
                <Select id="demo-simple-select" value={categoryIdSelected} onChange={(e) => handleChangeSelect(e)}>
                  {categoryList &&
                    categoryList.map((x, y) => (
                      <MenuItem key={y} value={x.id}>
                        {x.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            }
          </div>
          <div className="w-full">
            <label htmlFor="createShoppingPostDelivery">Delivery</label>
            <input
              className="ml-2"
              onChange={createShoppingPostDeliveryHandler}
              type="checkbox"
              name="hasDelivery"
              id="createShoppingPostDelivery"
            />
          </div>
          {createShoppingPost.hasDelivery ? (
            <>
              <label htmlFor="createShoppingPostDeliveryCost">Costo del delivery</label>
              <input
                onChange={handleChange}
                className="w-24 px-3 py-2 ml-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                required
              />
            </div>
          </div>
          <label htmlFor="createShoppingPostStock">Stock</label>
          <input
            onChange={handleChange}
            className="w-24 px-3 py-2 ml-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="number"
            name="stock"
            id="createShoppingPostStock"
            min="1"
            required
          />
          <div className="w-full">
            <label htmlFor="createShoppingPostIsNew">Producto nuevo</label>
            <input
              className="ml-2"
              onChange={createShoppingPostIsNewHandler}
              type="checkbox"
              name="isNew"
              id="createShoppingPostIsNew"
            />
          </div>
          <label htmlFor="createShoppingPostWeight">Peso en kilogramos</label>
          <input
            onChange={handleChange}
            className="w-24 px-3 py-2 ml-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
              value="Crear publicación de venta"
            />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateShoppingPost;

/* old handlers 

  /*
  const createShoppingPostTitleHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      title: target.value,
    });
  };

  const createShoppingPostDescriptionHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      description: target.value,
    });
  };

  const createShoppingPostPriceHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      price: +target.value,
    });
  };

  const createShoppingPostSaleDiscountHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      saleDiscount: +target.value,
    });
  };

  const createShoppingPostDeliveryHandler = () => {
    setCreateShoppingPost({
      ...createShoppingPost,
      hasDelivery: !createShoppingPost.hasDelivery,
    });
  };

 
  const createShoppingPostAdressHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      addresses: target.value,
    });
  };
 
  const createShoppingPostStockHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      stock: +target.value,
    });
  };

  const createShoppingPostDeliveryCostHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      deliveryCost: +target.value,
    });
  };
 
  const createShoppingPostWeightHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    setCreateShoppingPost({
      ...createShoppingPost,
      weight: +target.value,
    });
  };
*/
