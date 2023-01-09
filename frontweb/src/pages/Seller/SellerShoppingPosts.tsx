import Button from "@mui/material/Button";
import { DataGrid, esES, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { useKeycloak } from "@react-keycloak/web";
import { Pencil } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IShoppingPost } from "../../../types.d";
import { getShoppingPosts } from "../../services/Requests";
import DrawerSeller from "./Dashboard/DrawerSeller";
import { Footer } from "../../components/Footer";

function SellerShoppingPosts() {
  const { keycloak } = useKeycloak();
  const [shoppingPosts, setShoppingPosts] = useState<IShoppingPost[] | undefined>(undefined);
  const [sellerEmail, setSellerEmail] = useState("");

  const selectedShoppingPost = (id: String) => {
    return shoppingPosts?.find((post) => post.id === id);
  };

  useEffect(() => {
    const givme5srconds = setTimeout(() => {
      let email = keycloak.tokenParsed?.email;
      setSellerEmail(email);
      getShoppingPosts().then((res) => {
        let mshp: IShoppingPost[] = res.data;
        mshp = mshp.filter((e) => e.sellerEmail === email);
        console.log(mshp);

        setShoppingPosts(mshp);
      });
    }, 500);

    return () => {
      clearTimeout(givme5srconds);
    };
  }, [sellerEmail]);

  const navigate = useNavigate();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Tilulo", width: 200 },
    {
      field: "category",
      headerName: "Categoría",
      valueGetter: (params) => {
        let theCat;
        if (params.row.category) {
          theCat = params.row.category.name;
        }
        return theCat;
      },
    },
    { field: "sellerEmail", headerName: "email" },
    { field: "price", headerName: "Precio" },
    { field: "hasDelivery", type: "boolean", headerName: "Tiene envío" },
    { field: "saleDiscount", headerName: "Descuento" },
    { field: "stock", headerName: "Stock" },
    {
      field: "action",
      headerName: "Editar",
      width: 120,
      sortable: false,
      flex: 140,
      renderCell: (params) => {
        const onClickDelete = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          let selected = selectedShoppingPost(params.id as string) as IShoppingPost;
          navigate("/editSellerShoppingPost", { state: { shoppingPost: selected } });
        };

        return (
          <>
            <Button color="success" onClick={onClickDelete}>
              <Pencil size={32} color="#19a944" weight="fill" />
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mis publicaciones </h1>
        </div>
      </header>
      <div className="py-20 px-80" style={{ height: 600, width: "100%" }}>
        <>
          {shoppingPosts ? (
            <DataGrid
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={shoppingPosts as any}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          ) : (
            <DataGrid
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={row as any}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          )}
        </>
      </div>
      <Footer />
    </>
  );
}

export default SellerShoppingPosts;
