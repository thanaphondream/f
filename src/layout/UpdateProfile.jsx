import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const guestNav = [{ to: "/" }];

const userNav = [{ to: "/", text: "Home" }];

export default function UpdateProfile() {
  const { user, logout, reload, setReload } = useAuth();
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
      oldPassword: user?.password,
      newPassword: "",
      confirmNewPassword: "",
    });
  }, [user?.id, reload]);

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

      if (response.status === 200) {
        // console.log(response.data.msg)
        toast.success("แก้ไขข้อมูลสำเร็จ", {
          autoClose: 2000,
          onClose: () => {
            setReload(prev => !prev)
          }
        });
        
        // setUser(response.data.result);
      } else {
        toast.warning("รหัสผ่านเดิมไม่ถูกต้อง");
      }
      

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 bg-purple-50 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-700 mb-8">แก้ไขโปรไฟล์</h1>
      <div className="text-xl mb-4">
        บัญชีของ {user?.id ? user.username : "Guest"}
      </div>
      <hr className="border-t border-gray-400 w-4/5 mb-6" />
      <form className="bg-white p-8 shadow-lg rounded-lg w-4/5 max-w-md">
        <div className="flex flex-col space-y-6">
          <label className="flex flex-col">
            <span className="text-purple-700 font-semibold">E-MAIL</span>
            <input
              className="input input-bordered input-secondary w-full mt-2 p-2 rounded-lg border border-purple-300"
              type="email"
              name="email"
              value={input.email}
              onChange={hdlChange}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-purple-700 font-semibold">Username</span>
            <input
              className="input input-bordered input-secondary w-full mt-2 p-2 rounded-lg border border-purple-300"
              type="text"
              name="username"
              value={input.username}
              onChange={hdlChange}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-purple-700 font-semibold">รหัสผ่านเดิม</span>
            <input
              className="mt-1 p-2 w-full border border-pink-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              type="password"
              name="oldPassword"
              value={input.oldPassword}
              onChange={hdlChange}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-purple-700 font-semibold">รหัสผ่านใหม่</span>
            <input
              className="mt-1 p-2 w-full border border-pink-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              type="password"
              name="newPassword"
              value={input.newPassword}
              onChange={hdlChange}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-purple-700 font-semibold">ยืนยันรหัสผ่านใหม่</span>
            <input
              className="mt-1 p-2 w-full border border-pink-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              type="password"
              name="confirmNewPassword"
              value={input.confirmNewPassword}
              onChange={hdlChange}
            />
          </label>
          <button
            type="submit"
            className="btn bg-purple-700 text-white mt-4 p-2 rounded-lg"
            onClick={hdlSubmit}
          >
            บันทึกการแก้ไข
          </button>
        </div>
      </form>
    </div>
  );
}
