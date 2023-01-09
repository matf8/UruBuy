import Button from "@mui/material/Button";
import { DataGrid, esES, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { useKeycloak } from "@react-keycloak/web";
import { PencilCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IShoppingPost } from "../../../types";
import { getShoppingPosts } from "../../services/Requests";

function AdminShoppingPost() {
  const { keycloak } = useKeycloak();
  const [shoppingPosts, setShoppingPosts] = useState<IShoppingPost[] | undefined>(undefined);
  const [sellerEmail, setSellerEmail] = useState("");
  const selectedShoppingPost = (id: String) => {
    return shoppingPosts?.find((post) => post.id === id);
  };

  useEffect(() => {
    const giveme5seconds = setTimeout(() => {
      let email = keycloak.tokenParsed?.email;
      setSellerEmail(email);
      getShoppingPosts().then((res) => {
        let mshp: IShoppingPost[] = res.data;
        setShoppingPosts(mshp);
      });
    }, 500);

    return () => {
      clearTimeout(giveme5seconds);
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
      headerName: "",
      width: 120,
      sortable: false,
      flex: 140,
      renderCell: (params) => {
        const onClickEdit = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          let selected = selectedShoppingPost(params.id as string) as IShoppingPost;
          navigate("/editShoppingPostAdmin", { state: { shoppingPost: selected } });
        };

        return (
          <>
            <Button color="success" onClick={onClickEdit}>
              <PencilCircle size={28} color="#171d6d" weight="fill" className="mr-1" />
            </Button>
          </>
        );
      },
    },
  ];
  const row = [{ id: 0, username: "", email: "" }];

  return (
    <>
      <div className="" style={{ height: 600, width: "100%" }}>
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
    </>
  );
}

export default AdminShoppingPost;
