import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import { DataGrid, esES, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { blockUser, getUsersKC, getUserWithSellerRole, unBlockUser } from "../../services/Requests";
import AdminGraphics from "./AdminGraphics";
import AdminShoppingPost from "./AdminShoppingPosts";
import AdminUsers, { User } from "./AdminUsers";
import Categories from "./Categories";
import DrawerAdmin from "./DrawerAdmin";
import EditShoppingPostStatus from "./EditShoppingPostStatus";
import MobileNif from "./MobileNotif";

function AdminStatitics() {
  // const [ready, setReady] = useState(true);
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [usersKc, setUsersKc] = useState<User[] | undefined>(undefined);
  const [id, setId] = useState("");
  const [sellers, setSellers] = useState(0);
  const [sellerGroup, setSellerGroup] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    const giveme2seconds = setTimeout(() => {
      let sellers_: User[] = [];
      getUserWithSellerRole()?.then((res) => {
        sellers_ = res?.data;
        //setSellerGroup(sellers_);
        sellers_.forEach((e) => {
          e.isSeller = true;
        });
        setSellerGroup(sellers_);
      });
    }, 0);

    return () => {
      clearTimeout(giveme2seconds);
    };
  }, [sellers]);

  useEffect(() => {
    const giveme5seconds = setTimeout(() => {
      let users: User[];
      getUsersKC()
        .then()
        .then((r) => {
          users = r?.data;
          //setUsersKc(users);
          let active = users.filter((o) => {
            if (o.username !== "adminapp") {
              sellerGroup?.forEach((t) => {
                if (t.username === o.username) {
                  o.isSeller = true;
                }
              });
              return true;
            }
            return false;
          });
          setUsersKc(active);
        });
    }, 400);

    return () => {
      clearTimeout(giveme5seconds);
    };
  }, [sellerGroup]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "username", headerName: "Usuario", width: 130 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "isSeller", headerName: "Es vendedor", type: "boolean", width: 100 },
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
            Swal.fire("El usuario ya esta bloqueado", "", "info");
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
      <DrawerAdmin />
      <div className="flex-auto felx">
        <Box sx={{ width: "auto%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <div className="ml-40">
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Gestión de usuarios" value="1" />
                  <Tab label="Estadisticas de usuarios" value="2" />
                  <Tab label="Categorias" value="3" />
                  <Tab label="Editar estado de publicación" value="4" />
                  <Tab label="Editar publicación" value="5" />
                  <Tab label="Gestionar administradores" value="6" />
                  <Tab label="Notificaciones" value="7" />
                </TabList>
              </div>
            </Box>
            <TabPanel value="2">
              <AdminGraphics />
            </TabPanel>
            <TabPanel value="1">
              <div className="mt-1 px-80" style={{ height: 800, width: "100%" }}>
                {usersKc ? (
                  <DataGrid
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    rows={usersKc as any}
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
                <div className="py-10 px-50"></div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="mt-1 px-80" style={{ height: 800, width: "100%" }}>
                <Categories />
              </div>
            </TabPanel>
            <TabPanel value="4">
              <div className="mt-1 px-80" style={{ height: 800, width: "100%" }}>
                <EditShoppingPostStatus />
              </div>
            </TabPanel>
            <TabPanel value="5">
              <div className="mt-1 px-80" style={{ height: 800, width: "100%" }}>
                <AdminShoppingPost />
              </div>
            </TabPanel>
            <TabPanel value="6">
              <div className="mt-1 px-80" style={{ height: 800, width: "100%" }}>
                <AdminUsers />
              </div>
            </TabPanel>
            <TabPanel value="7">
              <div className="mt-1 px-80" style={{ height: 800, width: "100%" }}>
                <MobileNif />
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </>
  );
}
export default AdminStatitics;
