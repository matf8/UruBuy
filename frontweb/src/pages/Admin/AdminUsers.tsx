import Button from "@mui/material/Button";
import { DataGrid, esES, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { blockUser, getUserWithAdminRole, unBlockUser } from "../../services/Requests";
import ModalAdminUser from "./Forms/Components/ModalAdminUser";

export type User = {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  isSeller: boolean;
};

function AdminUsers() {
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [id, setId] = useState("");

  const getUsers = () => {
    return getUserWithAdminRole()?.then((res) => {
      setUsers(res?.data);
    });
  };

  useEffect(() => {
    let isReady = false;

    const handleChange = () => {
      getUsers();
    };
    handleChange();
    return () => {
      isReady = true;
    };
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "username", headerName: "Usuario", width: 130 },
    { field: "email", headerName: "Email", width: 180 },
    {
      field: "enabled",
      headerName: "Habilitado",
      type: "boolean",
      width: 90,
    },

    {
      field: "action",
      headerName: "",
      width: 120,
      sortable: false,
      flex: 140,
      align: "right",
      renderCell: (params) => {
        const onClickBlock = (e: any) => {
          e.stopPropagation();
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          setId(thisRow.id as string);
          console.log(thisRow.id);
          if (thisRow.enabled) {
            Swal.fire({
              title: "Bloquear usuario",
              showDenyButton: true,
              confirmButtonText: "Si",
              denyButtonText: `No`,
              icon: "warning",
              text: "Esta acción bloqueará al usuario, cerrará sus sesiones activas y no podrá volver a iniciar sesión",
            }).then((result) => {
              if (result.isConfirmed) {
                blockUser(thisRow.id as string);
                Swal.fire("Usuario bloqueado", "", "success").then((result) => {
                  if (result.isConfirmed) window.location.reload();
                });
              } else if (result.isDenied) {
                Swal.fire("No se ha bloqueado el usuario", "", "info");
              }
            });
          } else {
            Swal.fire("El usuario ya está bloqueado", "", "info");
          }
        };
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
          console.log(thisRow.id);
          if (!thisRow.enabled) {
            Swal.fire({
              title: "Desbloquear usuario",
              showDenyButton: true,
              icon: "warning",
              confirmButtonText: "Si",
              denyButtonText: `No`,
              text: "Esta acción desbloqueará al usuario permitiéndole volver a iniciar sesión",
            }).then((result) => {
              if (result.isConfirmed) {
                unBlockUser(thisRow.id as string);
                Swal.fire("Usuario desbloqueado", "", "success").then((result) => {
                  if (result.isConfirmed) window.location.reload();
                });
              } else if (result.isDenied) {
                Swal.fire("No se ha desbloqueado el usuario", "", "info").then((result) => {
                  if (result.isConfirmed) window.location.reload();
                });
              }
            });
          } else {
            Swal.fire("El usuario ya esta desbloqueado", "", "info");
          }
        };
        return (
          <>
            <Button color="success" onClick={onClickUnblock}>
              Desbloquear
            </Button>
            <Button color="error" onClick={onClickBlock}>
              Bloquear
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
        {users ? (
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={users as any}
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
        <div className="py-10 px-50">
          <ModalAdminUser />
        </div>
      </div>
    </>
  );
}
export default AdminUsers;
