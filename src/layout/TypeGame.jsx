import axios from "axios";
import { useState } from "react";
import Typegame from "./gameTypeAdmin";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Protype() {
  const [input, setInput] = useState({
    name: "",
  });
  // const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      if (input.name === "") {
        toast.warning("กรุณากรอกประเภทเกมส์");
      } else {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:8889/admin/typegames", input, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // setNotification({ message: 'เพิ่มประเภทเกมส์เรียบร้อย', type: 'success' });
        toast.success("เพิ่มประเภทเกมส์เรียบร้อย");
        setReload(!reload);
        setInput({ name: "" }); // Reset input after successful submission

      }
    } catch (err) {
      toast.warning(err.message);
      console.log(err.message);
    }
  };

  

  return (
    <div>
      <form
        className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6"
        onSubmit={hdlSubmit}
      >
        <div className="text-3xl mb-5 ml-20 font-bold">หมวดหมู่เกม</div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">หมวดหมู่เกม</span>
          </div>
          <input
            type="text"
            placeholder="เพิ่มหมวดหมู่เกม"
            className="input input-bordered w-full"
            name="name"
            value={input.name}
            onChange={hdlChange}
          />
        </label>
        <button className="btn btn-primary">เพิ่ม</button>
      </form>
      <Typegame  reload={reload} setReload={setReload}/>
    </div>
  );
}
