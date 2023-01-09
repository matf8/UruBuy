import Button from "@mui/material/Button";
import { DataGrid, esES, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { useKeycloak } from "@react-keycloak/web";
import { ShoppingCart } from "phosphor-react/";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ShoppingPost } from "../../../types";
import { findPurchaseById, getSellerProfile, updateSellStatus } from "../../services/Requests";
import { handleStatus } from "../MyProfile";
import DrawerSeller from "./Dashboard/DrawerSeller";

export type Sell = {
  id: Number;
  status: String;
  date: String;
  total: Number;
  address: String;
  isDelivery: boolean;
  orderPayPalId: String;
  sellerEmail: String;
  customerEmail: String;
  shoppingPosts: ShoppingPost[];
  customerReview: null;
  sellerReview: null;
};

function MySells() {
  const kecloak = useKeycloak();
  let email = kecloak.keycloak.tokenParsed?.email;
  const [theSell, setTheSell] = useState<Sell[] | undefined>(undefined);
  const [theShp, setTheShp] = useState<ShoppingPost[] | undefined>(undefined);
  const [shoppingPostToShow, setShoppingPostToShow] = useState<ShoppingPost[] | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  let sell_: Sell[] = [];

  useEffect(() => {
    const giveme2seconds = setTimeout(() => {
      aux(email);
    }, 800);
    return () => {
      clearTimeout(giveme2seconds);
    };
  }, []);

  const aux = (email: string) => {
    let shp_: ShoppingPost[] = [];

    getSellerProfile(email).then((res) => {
      sell_ = res.data.sales;
      sell_.forEach((e) => {
        e.status = handleStatus(e.status as string);
      });
      setTheSell(sell_);
      sell_.forEach((e) => {
        shp_ = e.shoppingPosts;
      });
      setTheShp(shp_);
    });
  };

  const nextOrderStatus = (status: String) => {
    switch (status) {
      case "En preparacion":
        return "OUT_FOR_DELIVERY";
      case "En camino":
        return "READY_FOR_PICKUP";
      case "Listo para retirar":
        return "DELIVERED";
      case "Entregado":
        return Swal.fire("Este producto ya fue entregado");
      default:
        return null;
    }
  };

  const viewShopP = (id: string) => {
    let shpPurch: ShoppingPost[] = [];
    findPurchaseById(id).then((res) => {
      shpPurch = res?.data.shoppingPosts;
      setShoppingPostToShow(shpPurch);
    });
    setShowModal(true);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "status", headerName: "Estado", width: 100 },
    { field: "date", headerName: "Fecha", width: 100 },
    { field: "isDelivery", headerName: "Es envío?", type: "boolean", width: 80 },
    { field: "customerEmail", headerName: "E-mail cliente", width: 180 },
    { field: "orderPayPalId", headerName: "PayPal ID", width: 200 },
    { field: "total", headerName: "Total USD", width: 80 },

    {
      field: "viewShpP",
      headerName: "Articulos",
      width: 120,
      sortable: false,

      align: "right",
      renderCell: (params) => {
        const onClickShowShopP = async (e: any) => {
          e.stopPropagation();
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => {
              thisRow[c.field] = params.getValue(params.id, c.field);
            });
          viewShopP(thisRow?.id as string);
        };
        return (
          <>
            <Button variant="contained" color="success" onClick={onClickShowShopP}>
              Articulo/s
            </Button>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Estado de la entrega",
      width: 120,
      sortable: false,
      align: "right",
      renderCell: (params) => {
        const onClickUnblock = async (e: any) => {
          e.stopPropagation();
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => {
              thisRow[c.field] = params.getValue(params.id, c.field);
            });
          let newStatus = nextOrderStatus(thisRow?.status as string);
          updateSellStatus(thisRow?.id as string, newStatus as string).then((e) => {
            if (e.status === 200) {
              Swal.fire("Se ha cambiado el estado de la entrega", "", "success").then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            }
          });
        };
        return (
          <>
            <Button variant="contained" color="info" onClick={onClickUnblock}>
              Cambiar
            </Button>
          </>
        );
      },
    },
  ];

  const row = [{ id: 0, username: "", email: "" }];

  return (
    <>
      <DrawerSeller />
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto text-left ml-72 max-w-7xl sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mis ventas </h1>
        </div>
      </header>
      <div className="px-64" style={{ height: 700, width: "100%" }}>
        {theSell ? (
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={theSell as any}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        ) : (
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={row as any}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        )}
      </div>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-gray-300 border-solid rounded-t bg-sky-500 ">
                  <ShoppingCart size={32} color="#ffff" weight="fill" />
                  <h3 className="text-2xl font=semibold text-white"> Artículos de la compra</h3>
                </div>
                <div className="relative flex-auto p-6">
                  <form className="w-full px-8 pt-6 pb-8 rounded shadow-md">
                    {shoppingPostToShow && shoppingPostToShow?.map((e) => <li>{e.title}</li>)}
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                  <button
                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-green-500 uppercase outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default MySells;
