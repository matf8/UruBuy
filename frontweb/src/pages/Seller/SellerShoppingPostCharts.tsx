import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { IShoppingPost } from "../../../types";
import { getShoppingPosts } from "../../services/Requests";

function SellerShoppingPostsCharts() {
  const { keycloak } = useKeycloak();
  const [email, setEmail] = useState("");
  const [shoppingPosts_, setShoppingPosts] = useState<IShoppingPost[] | undefined>(undefined);
  const [totalShoppingPost, setTotalShoppingPost] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(0);
  const [onSale, setOnSale] = useState(0);
  const [stockGLtTwo, setStockLtTwo] = useState(0);

  const myShp = {
    id: "",
    title: "",
    date: "",
    description: "",
    price: 0,
    onSale: false,
    saleDiscount: 0,
    category: { id: "0", name: "" },
    hasDelivery: false,
    deliveryCost: 0,
    addresses: [],
    stock: 0,
    averageRating: 0,
    isNew: false,
    weight: 0,
    base64Images: [],
    sellerEmail: "",
    shoppingPostStatus: "",
    showItemHandler: () => {},
  };

  useEffect(() => {
    const giveme5seconds = setTimeout(() => {
      let e = keycloak.tokenParsed?.email;
      setEmail(e);
      getShoppingPosts().then((res) => {
        let mshp: IShoppingPost[] = res.data;
        const totalShp = mshp.filter((o) => {
          if (o.sellerEmail === email) {
            return true;
          }
          return false;
        }).length;
        setTotalShoppingPost(totalShp);

        let activeShp = mshp.filter((o) => {
          if (o.sellerEmail === email && o.shoppingPostStatus === "PUBLISHED") {
            return true;
          }
          return false;
        }).length;
        setActive(activeShp);

        let unactiveShp = mshp.filter((o) => {
          if (o.sellerEmail === email && o.shoppingPostStatus === "PAUSED") {
            return true;
          }
          return false;
        }).length;
        setPaused(unactiveShp);

        let stock = mshp.filter((o) => {
          if (o.sellerEmail === email && o.stock < 3) {
            return true;
          }
          return false;
        }).length;
        setStockLtTwo(stock);

        let onSaleShp = mshp.filter((o) => {
          if (o.sellerEmail === email && o.onSale === true) {
            return true;
          }
          return false;
        }).length;
        setOnSale(onSaleShp);
        //setShoppingPosts(mshp);
      });
    }, 500);

    return () => {
      clearTimeout(giveme5seconds);
    };
  }, [email]);

  const dataShp = [
    { title: "Cantidad de productos publicados", value: totalShoppingPost, color: "#E38627" },
    { title: "Productos pausados", value: paused, color: "#0066ff" },
    { title: "Productos Activos", value: active, color: "#E066ff" },
  ];

  const dataStock = [
    { title: "Cantidad de productos publicados", value: totalShoppingPost, color: "#E38627" },
    { title: "Productos con stock menor a dos", value: stockGLtTwo, color: "#0066ff" },
  ];

  const dataOnSale = [
    { title: "Cantidad de productos publicados", value: totalShoppingPost, color: "#E38627" },
    { title: "Productos pausados", value: onSale, color: "#0066ff" },
  ];

  const defaultLabelStyle = {
    fontSize: "5px",
    fontFamily: "sans-serif",
  };
  return (
    <>
      <table className="w-full text-gray-900 bg-white shadow-none">
        <thead>
          <tr>
            <th className="p-2 text-white bg-blue-700">Publicaciones</th>
            <th className="p-2 text-white bg-blue-700">Con stock menor a 2</th>
            <th className="p-2 text-white bg-blue-700">Publicaciones en oferta</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-blue-900 bg-blue-100">
            <td className="p-2">
              {" "}
              <PieChart
                data={dataShp}
                lineWidth={20}
                paddingAngle={18}
                radius={25}
                rounded
                label={({ dataEntry }) => dataEntry.value}
                labelStyle={(index) => ({
                  fill: dataShp[index].color,
                  fontSize: "5px",
                  fontFamily: "sans-serif",
                })}
                labelPosition={60}
              />
            </td>
            <td className="p-2">
              <PieChart
                data={dataStock}
                label={({ dataEntry }) => dataEntry.value}
                labelStyle={(index) => ({
                  fill: dataStock[index].color,
                  fontSize: "5px",
                  fontFamily: "sans-serif",
                })}
                radius={25}
                labelPosition={112}
              />
            </td>
            <td className="p-2">
              <PieChart
                data={dataOnSale}
                label={({ x, y, dx, dy, dataEntry }) => (
                  <text
                    x={x}
                    y={y}
                    dx={dx}
                    dy={dy}
                    dominant-baseline="central"
                    text-anchor="middle"
                    style={{
                      fontSize: "5px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {Math.round(dataEntry.percentage) + "%"}
                  </text>
                )}
                labelStyle={defaultLabelStyle}
                radius={25}
              />
            </td>
          </tr>
          <tr className="flex-auto text-blue-900 bg-blue-200">
            <td className="p-2 mx-auto">
              {" "}
              <ul className="ml-20 list-disc list-outside place-content-center ">
                <li className="text-[#E38627]">
                  <span className="text-black">
                    Total de publicaciones: <b>{totalShoppingPost}</b>
                  </span>
                </li>
                <li className="text-[#E066ff]">
                  <span className="text-black">
                    Publicaciones activas: <b> {active}</b>
                  </span>
                </li>
                <li className="text-[#0066ff]">
                  <span className="text-black">
                    Publicaciones pausadas: <b> {paused}</b>
                  </span>
                </li>
              </ul>
            </td>
            <td className="p-2 mx-auto">
              <ul className="ml-20 list-disc list-outside place-content-center ">
                <li className="text-[#E38627]">
                  <span className="text-black">
                    Total de publicaciones: <b>{totalShoppingPost}</b>
                  </span>
                </li>
                <li className="text-[#0066ff]">
                  <span className="text-black">
                    Publicaciones con stock menor a 2: <b> {stockGLtTwo}</b>
                  </span>
                </li>
              </ul>
            </td>
            <td className="p-2 mx-auto">
              <ul className="ml-20 list-disc list-outside place-content-center ">
                <li className="text-[#E38627]">
                  <span className="text-black">
                    Total de publicaciones: <b>{totalShoppingPost}</b>
                  </span>
                </li>
                <li className="text-[#0066ff]">
                  <span className="text-black">
                    Publicaciones en oferta: <b> {stockGLtTwo}</b>
                  </span>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default SellerShoppingPostsCharts;
