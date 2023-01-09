import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getUsersKC, getUserWithAdminRole, getUserWithSellerRole } from "../../services/Requests";
import { User } from "./AdminUsers";

function AdminGraphics() {
  const [usersKc, setUsersKc] = useState<User[] | undefined>(undefined);
  const [activeUsers, setActiveUsers] = useState(0);
  const [blockedUser, setUserBlockedUser] = useState(0);
  const [sellers, setSellers] = useState(0);
  const [sellerGroup, setSellerGroup] = useState<User[] | undefined>(undefined);
  const [admin, setAdmin] = useState(0);

  useEffect(() => {
    const giveme5seconds = setTimeout(() => {
      let users: User[];
      getUsersKC()
        .then()
        .then((r) => {
          users = r?.data;
          setUsersKc(users);
          const active = users.filter((o) => {
            if (o.enabled === true) {
              return true;
            }
            return false;
          }).length;
          setActiveUsers(active);

          let blocked = users.filter((o) => {
            if (o.enabled === false) {
              return true;
            }
            return false;
          }).length;
          setUserBlockedUser(blocked);
        });
    }, 500);
    return () => {
      clearTimeout(giveme5seconds);
    };
  }, [usersKc]);

  useEffect(() => {
    const giveme2seconds = setTimeout(() => {
      let sellers_: User[];
      getUserWithSellerRole()?.then((res) => {
        sellers_ = res?.data;
        setSellerGroup(sellers_);
        let s = sellers_.filter((o) => {
          if (o.username != null) {
            o.isSeller = true;
            return true;
          }
          return false;
        }).length;
        setSellers(s);
      });

      let admin_: User[];
      getUserWithAdminRole()?.then((resp) => {
        admin_ = resp?.data;
        let a = admin_.filter((o) => {
          if (o.username != null) {
            return true;
          }
          return false;
        }).length;
        setAdmin(a);
      });
    }, 200);

    return () => {
      clearTimeout(giveme2seconds);
    };
  }, [sellers]);

  const defaultLabelStyle = {
    fontSize: "5px",
    fontFamily: "sans-serif",
  };
  const row = [{ id: 0, username: "", email: "" }];
  const userActives_ = [
    { title: "Usuarios registrados", value: activeUsers, color: "#E38627" },
    { title: "Usuarios activos", value: activeUsers + blockedUser, color: "#E066ff" },
  ];

  const userBlocked_ = [
    { title: "Usuarios registrados", value: activeUsers, color: "#E38627" },
    { title: "Usuarios bloqueados", value: blockedUser, color: "#0066ff" },
  ];

  const userRoles_ = [
    { title: "Usuarios vendedores", value: sellers, color: "#E38627" },
    { title: "Usuarios compradores", value: activeUsers + blockedUser - (admin + sellers), color: "#0066ff" },
    { title: "Total de administradores", value: admin, color: "#F7F700" },
  ];

  return (
    <div className="py-20 px-80" style={{ height: 600, width: "100%" }}>
      <table className="w-full text-gray-900 bg-white shadow-none">
        <thead>
          <tr>
            <th className="p-2 text-white bg-blue-700">Usuarios Activos</th>
            <th className="p-2 text-white bg-blue-700">Usuarios Bloqueados</th>
            <th className="p-2 text-white bg-blue-700">Roles de usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-blue-900 bg-blue-100">
            <td className="p-2">
              {" "}
              <PieChart
                data={userActives_}
                lineWidth={20}
                paddingAngle={18}
                radius={25}
                rounded
                label={({ dataEntry }) => dataEntry.value}
                labelStyle={(index) => ({
                  fill: userActives_[index].color,
                  fontSize: "5px",
                  fontFamily: "sans-serif",
                })}
                labelPosition={60}
              />
            </td>
            <td className="p-2">
              <PieChart
                data={userBlocked_}
                label={({ dataEntry }) => dataEntry.value}
                labelStyle={(index) => ({
                  fill: userBlocked_[index].color,
                  fontSize: "5px",
                  fontFamily: "sans-serif",
                })}
                radius={25}
                labelPosition={112}
              />
            </td>
            <td className="p-2">
              <PieChart
                data={userRoles_}
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
                    Usuarios activos: <b> {activeUsers}</b>
                  </span>
                </li>
                <li className="text-[#E066ff]">
                  <span className="text-black">
                    Total de usuarios: <b>{activeUsers + blockedUser}</b>
                  </span>
                </li>
              </ul>
            </td>
            <td className="p-2 mx-auto">
              <ul className="ml-20 list-disc list-outside place-content-center ">
                <li className="text-[#0066ff]">
                  <span className="text-black">
                    Usuarios bloqueados: <b>{blockedUser}</b>
                  </span>
                </li>
                <li className="text-[#E38927]">
                  <span className="text-black">
                    Total de usuarios del sistema: <b> {blockedUser + activeUsers}</b>
                  </span>
                </li>
              </ul>
            </td>
            <td className="p-2 mx-auto">
              <ul className="ml-20 list-disc list-outside place-content-center ">
                <li className="text-[#E38627]">
                  <span className="text-black">
                    Total de vededores: <b>{sellers}</b>
                  </span>
                </li>
                <li className="text-[#0066ff]">
                  <span className="text-black">
                    Total de comrpadores: <b> {activeUsers + blockedUser - (admin + sellers)}</b>
                  </span>
                </li>
                <li className="text-[#F7F700]">
                  <span className="text-black">
                    Total de administradores: <b> {admin}</b>
                  </span>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default AdminGraphics;
