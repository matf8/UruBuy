import Button from "@mui/material/Button";
import { DataGrid, esES, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { Check, Prohibit } from "phosphor-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ShoppingPost } from "../../../types";
import { getShoppingPosts, updateStatusShoppingPost } from "../../services/Requests";

function EditShoppingPostStatus() {
  const [shoppingPosts_, setShoppingPosts] = useState<ShoppingPost[] | undefined>(undefined);

  const getSHP = () => {
    return getShoppingPosts().then((res) => {
      setShoppingPosts(res?.data);
    });
  };

  useEffect(() => {
    getSHP();
  }, []);

  const changeStatus = (id: String, status: String) => {
    let _shoppingPost = {
      id: id,
      shoppingPostStatus: status,
    };
    updateStatusShoppingPost(_shoppingPost).then((res: any) => {
      if (res.status === 200) {
        Swal.fire({
          title: "Se ha editado la publicación",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.replace("/");
          }
        });
      }
    });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Título Publicación", width: 180 },
    { field: "sellerEmail", headerName: "Email vendedor", width: 180 },
    { field: "shoppingPostStatus", headerName: "Estado de publicación", width: 180 },
    {
      field: "action",
      headerName: "Publicar/Pausar",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const onClickChangeStatusSHPpublished = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          Swal.fire({
            title: "¿Confirma el cambio de estado a PUBLICADO?",
            showDenyButton: true,
            icon: "warning",
            confirmButtonText: "Si",
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              changeStatus(thisRow.id as string, "PUBLISHED");
              Swal.fire("Se ha guardado el cambio", "", "success");
            } else {
              Swal.fire("No se ha guardado el cambio", "", "info");
            }
          });
        };
        const onClickChangeStatusSHPpaused = async (e: any) => {
          e.stopPropagation();

          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          {
            let id = thisRow.id;
            Swal.fire({
              title: "¿Confirma el cambio de estado a PAUSADO?",
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: "Si",
              denyButtonText: "No",
              customClass: {
                actions: "my-actions",
                confirmButton: "order-2",
                denyButton: "order-3",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                changeStatus(id as String, "PAUSED");
                Swal.fire("Se ha guardado el cambio!", "", "success").then((result) => {
                  window.location.reload();
                });
              } else if (result.isDenied) {
                Swal.fire("No se ha guardado el cambio", "", "info");
              }
            });
          }
        };
        return (
          <>
            <Button color="error" onClick={onClickChangeStatusSHPpublished}>
              <Check size={24} color="#228B22" weight="fill" />
            </Button>
            <Button color="success" onClick={onClickChangeStatusSHPpaused}>
              <Prohibit size={32} color="#F70F00" weight="fill" />
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
        {shoppingPosts_ ? (
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={shoppingPosts_ as any}
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
      </div>
    </>
  );
}

export default EditShoppingPostStatus;
