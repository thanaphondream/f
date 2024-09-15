import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Product({ reload, setReload }) {
  const [game, setGame] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8889/admin/typegames"
        );
        setGame(response.data.typegames);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [reload]);

  const hdlDelete = async (e, id) => {
    if(confirm("ต้องการลบประเภทเกมส์หรือไม่ ?") === true){
      try {
        e.stopPropagation();
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8889/admin/deletetypegames/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("ลบข้อมูลเรียบร้อย");
        setGame((prev) => prev.filter((item) => item.id !== id)); // Remove the item from the list
      } catch (err) {
        toast.warning(err.message.data);
      }
    }
    
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>ชื่อเกม</th>
            <th>แก้ไข</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {game.map((item) => (
            <tr key={item.id}>
              <th>{item.id}</th>
              <th>{item.gametype_name}</th>
              <th>
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    document.getElementById(`my_modal_${item.id}`).showModal()
                  }
                >
                  แก้ไข
                </button>
              </th>
              <th>
                <button
                  className="btn btn-error"
                  onClick={(e) => hdlDelete(e, item.id)}
                >
                  ลบ
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      {game.map((item, index) => (
        <Modal key={index} item={item} setReload={setReload} reload={reload}/>
      ))}
    </div>
  );
}

const Modal = ({ item,setReload, reload }) => {
  const modalId = `my_modal_${item.id}`;
  const [editData, setEditData] = useState({
    gametype_name: item.gametype_name,
  });
  const [isEditing, setEditing] = useState(false);
  const handleEditClick = () => {
    setEditData({ ...item });
    setEditing(true);
  };

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    try {
      const id = item.id;
      const apiUrl = `http://localhost:8889/admin/updateType/${id}`;
      await axios.patch(apiUrl, editData);
      toast.success("อัปเดทเรียบร้อย");
      setReload(!reload)
      setEditing(false);
      document.getElementById(modalId).close();
    } catch (error) {
      toast.warning("เกิดข้อผิดพลาดในการแก้ไข");
      console.error("เกิดข้อผิดพลาดในการแก้ไข", error);
    }
  };

  const handleChange = (e) => {
    setEditData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-5">แก้ไขข้อมูล</h3>
        <h3 className="text-lg mb-5">
          ประเภทเกมส์:{" "}
          {isEditing ? (
            <input
              type="text"
              name="gametype_name"
              value={editData.gametype_name}
              onChange={handleChange}
            />
          ) : (
            item.gametype_name
          )}
        </h3>
        <div className="flex justify-end">
          {isEditing ? (
            <button className="btn btn-success" onClick={handleSaveClick}>
              บันทึก
            </button>
          ) : (
            <button className="btn btn-warning" onClick={handleEditClick}>
              แก้ไข
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => document.getElementById(modalId).close()}>
          Close
        </button>
      </form>
    </dialog>
  );
};
