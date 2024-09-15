import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";

const guestNav = [{ to: "/" }];
const userNav = [{ to: "/", text: "Home" }];

export default function UpdateProfile() {
  const { user, logout, setUser } = useAuth();
  const finalNav = user?.id ? userNav : guestNav;

  const [input, setInput] = useState({
    email: "",
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    setInput({
      email: user?.email || "",
      username: user?.username || "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  }, [user?.id]);

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();

    try {
      if (input.newPassword && input.newPassword !== input.confirmNewPassword) {
        alert("รหัสผ่านใหม่ไม่ตรงกัน");
        return;
      }

      const token = localStorage.getItem("token");

      const requestData = {
        email: input.email,
        username: input.username,
      };

      if (input.oldPassword) {
        requestData.oldPassword = input.oldPassword;
        requestData.newPassword = input.newPassword;
        requestData.confirmPassword = input.confirmNewPassword;
      }

      const response = await axios.put(
        `http://localhost:8889/auth/${user.id}`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.msg === "Update ok") {
        alert("แก้ไขข้อมูลสำเร็จ");
        setUser(response.data.result);
      } else {
        alert("รหัสผ่านเดิมไม่ถูกต้อง");
      }
      location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const navigate = useNavigate();

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
    <div className="w-full max-w-2xl bg-white p-8 shadow-lg rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
      บัญชีของ {user?.id ? user.username : "Guest"}
    </h2>
    <form onSubmit={hdlSubmit} className="space-y-6">
      <div>
        <label className="block text-left text-sm font-medium text-gray-700">
          ชื่อผู้ใช้งาน
        </label>
        <input
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          type="text"
          name="username"
          value={input.username}
          onChange={hdlChange}
        />
      </div>
      <div>
        <label className="block text-left text-sm font-medium text-gray-700">
          อีเมล์
        </label>
        <input
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          type="email"
          name="email"
          value={input.email}
          onChange={hdlChange}
        />
      </div>
      <div>
        <label className="block text-left text-sm font-medium text-gray-700">
          รหัสผ่านเดิม
        </label>
        <input
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          type="password"
          name="oldPassword"
          value={input.oldPassword}
          onChange={hdlChange}
        />
      </div>
      <div>
        <label className="block text-left text-sm font-medium text-gray-700">
          รหัสผ่านใหม่
        </label>
        <input
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          type="password"
          name="newPassword"
          value={input.newPassword}
          onChange={hdlChange}
        />
      </div>
      <div>
        <label className="block text-left text-sm font-medium text-gray-700">
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          type="password"
          name="confirmNewPassword"
          value={input.confirmNewPassword}
          onChange={hdlChange}
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          บันทึกการแก้ไข
        </button>
      </div>
    </form>
  </div>
  </div>
  );
}
