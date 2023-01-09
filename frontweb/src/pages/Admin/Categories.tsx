import Button from "@mui/material/Button";
import { DataGrid, esES, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Category } from "../../../types.d";
import { deleteCategory, editCategory, getCategories } from "../../services/Requests";
import ModalCategory from "./Forms/Components/ModalCategory";

function Categories() {
  const [categories, setCategories] = useState<Category[] | undefined>(undefined);

  const getCate = () => {
    return getCategories().then((res) => {
      setCategories(res?.data);
    });
  };

  useEffect(() => {
    getCate();
    console.log(categories);
  }, []);

  const editModal = () => { };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Categoría", width: 200 },
    {
      field: "action",
      headerName: "",
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
          Swal.fire({
            title: "Eliminar categoría",
            showDenyButton: true,
            icon: "warning",
            confirmButtonText: "Si",
            denyButtonText: `No`,
            text: "Esta acción eliminara la categoría",
          }).then((result) => {
            if (result.isConfirmed) {
              deleteCategory(thisRow.name as string);
              Swal.fire("Categoría eliminada", "", "success").then((result) => {
                if (result.isConfirmed) window.location.reload();
              });
            } else if (result.isDenied) {
              Swal.fire("No se ha eliminado la categoría", "", "info").then((result) => {
                if (result.isConfirmed) window.location.reload();
              });
            }
          });
        };
        const onClickEdit = async (e: any) => {
          e.stopPropagation(); // don't select this row after clicking

          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
          {
            let id = thisRow.id;
            let catnametochange = "";
            Swal.fire({
              title: "Editar cateoría",
              html: `<input type="text" id="catname"  class="swal2-input" placeholder="Ingrese nombre">`,
              confirmButtonText: "Guardar",
              focusConfirm: false,
              preConfirm: () => {
                catnametochange = (Swal.getPopup()?.querySelector("#catname") as HTMLInputElement)?.value;
                if (!catnametochange) {
                  Swal.showValidationMessage(`No puede estar vacío 🙃`);
                }
                return { locatnametochangegin: catnametochange };
              },
            }).then((result) => {
              Swal.fire({
                title: "Confirma el cambio?",
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
                  editCategory(id as string, catnametochange);
                  Swal.fire("Se ha guardado el cambio!", "", "success").then((result) => {
                    window.location.reload();
                  });
                } else if (result.isDenied) {
                  Swal.fire("No se ha guardado el cambio", "", "info");
                }
              });
            });
          }
        };
        return (
          <>
            <Button color="error" onClick={onClickDelete}>
              Eliminar
            </Button>
            <Button color="success" onClick={onClickEdit}>
              Editar
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
        {categories ? (
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={categories as any}
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
        <div className="py-10">
          <ModalCategory />
        </div>
      </div>
    </>
  );
}

export default Categories;
