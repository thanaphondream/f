import React, { useState, useEffect } from "react";
import axios from "axios";
import Gameadmin from "../layout/gameAdmin";
import { toast } from "react-toastify";

export default function ProductForm() {
  const [input, setInput] = useState({
    name: "",
    gametypeId: "",
  });
  const [img, setImg] = useState(null); // Change to store the file directly
  const [typegames, setType] = useState([]);
  const [reload, setReload] = useState(false);

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file); // Just store the file directly
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("gametypeId", input.gametypeId);
      formData.append("image", img); // Append the file directly
      await axios.post("http://localhost:8889/admin/createproduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("เพิ่มเกมส์เรียบร้อยแล้ว");
      setReload(!reload);
      setInput({ name: "", gametypeId: "" }); // Reset input fields
      setImg(null); // Reset image file
    } catch (err) {
      toast.warning("กรอกข้อมูลให้ครบ");
    }
  };

  useEffect(() => {
    const getProList = async () => {
      try {
        const rs1 = await axios.get("http://localhost:8889/admin/getType");
        setType(rs1.data.getG);
      } catch (err) {
        console.error("Error fetching product types:", err);
      }
    };
    getProList();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-100 py-10">
      <form
        className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6 bg-white"
        onSubmit={hdlSubmit}
      >
        <div className="text-3xl mb-5 ml-20 font-bold">เพิ่มเกม</div>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">ชื่อเกม</span>
          </div>
          <input
            type="text"
            placeholder="เพิ่มเกม"
            className="input input-bordered w-full "
            name="name"
            value={input.name}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">เพิ่มรูปภาพ</span>
          </div>
          <input
            type="file"
            placeholder="เพิ่มรูป"
            className="input input-bordered w-full "
            name="img"
            onChange={handleFileChange}
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">หมวดหมู่เกม</span>
          </div>
          <select
            name="gametypeId"
            value={input.gametypeId}
            onChange={hdlChange}
            className="select select-bordered w-full"
          >
            <option hidden>เลือกหมวดหมู่เกม</option>
            {typegames &&
              typegames.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.gametype_name}
                </option>
              ))}
          </select>
        </label>
        <button className="btn btn-primary">เพิ่มใหม่</button>
      </form>
      <Gameadmin reload={reload} setReload={setReload} />
    </div>
  );
}
