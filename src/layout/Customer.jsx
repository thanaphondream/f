import axios from "axios";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const [user, setUser] = useState([]);
  const [input, setInput] = useState({
    role: "",
  });
  useEffect(() => {
    const getUser = async (req, res, next) => {
      const rs = await axios.get("http://localhost:8889/admin/user");
      setUser(rs.data.user);
    };
    getUser();
  }, []);

  function FormatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  }
  const updateRole = async (id, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8889/admin/upadteRole/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("แก้ไขสถานะผู้ใช้งานเรียบร้อย");
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleChangeRole = (id, e) => {
    const newRole = e.target.value;
    setInput((prevOrderItem) => ({
      ...prevOrderItem,
      role: newRole,
    }));
    updateRole(id, newRole);
    setTrigger((prev) => !prev); // Trigger re-fetch data
  };
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>No.</th>
            <th>username</th>
            <th>E-mail</th>
            <th>role</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {user.map((user) => (
            <tr>
              <th>{user.id}</th>
              <th>{user.username}</th>
              <th>{user.email}</th>
              <th>
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user.id, e)}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
