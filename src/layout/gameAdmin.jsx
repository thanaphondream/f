import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Product({reload, setReload}) {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/admin/getprolist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(response.data.getP);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [reload]);

  const hdlDelete = async (e, id) => {
    try {
      e.stopPropagation();
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8889/admin/deletegame/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("ลบเกมส์สำเร็จ");
      setProduct(prevProducts => prevProducts.filter(item => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>รูปภาพ</th>
            <th>ชื่อเกม</th>
            <th>หมวดหมู่เกม</th>
            <th>แก้ไข</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {product.map((item, index) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <figure><img src={item.img} alt="game" className="px-10 pt-10 max-w-xs max-h-xs" /></figure>
              </td>
              <td>{item.game_name}</td>
              <td>{item.gametype_name.gametype_name}</td>
              <td><button className="btn btn-warning" onClick={() => document.getElementById(`my_modal_${item.id}`).showModal()}>แก้ไข</button></td>
              <td><button className="btn btn-error" onClick={(e) => hdlDelete(e, item.id)}>ลบ</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {product.map((item, index) => (
        <Modal key={index} item={item} setProduct={setProduct} setReload={setReload} reload={reload} />
      ))}
    </div>
  );
}

const Modal = ({ item, setProduct, setReload, reload }) => {
  const modalId = `my_modal_${item.id}`;
  const [editData, setEditData] = useState({
    game_name: item.game_name,
    gametype_id: item.gametype_name.id,
  });
  const [imgFile, setImgFile] = useState(null); // To store the new image file
  const [typegames, setType] = useState([]);

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const id = item.id;
      const apiUrl = `http://localhost:8889/admin/updateproduct/${id}`;

      // Create a new FormData object for the request
      const formData = new FormData();
      formData.append('game_name', editData.game_name);
      formData.append('gametype_id', editData.gametype_id);
      if (imgFile) {
        formData.append('image', imgFile); // Add the image file if it exists
      }

      await axios.patch(apiUrl, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      toast.success("อัปเดทเกมส์เรียบร้อย");
      setReload(!reload);
      document.getElementById(modalId).close();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการแก้ไข");
      console.error("Error updating data", error);
    }
  };

  const handleChange = (e) => {
    setEditData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setImgFile(e.target.files[0]); // Set the selected image file
  };

  useEffect(() => {
    const getProList = async () => {
      const rs1 = await axios.get("http://localhost:8889/admin/getType");
      setType(rs1.data.getG);
    };
    getProList();
  }, []);

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-5">แก้ไขข้อมูล</h3>
        <div className="mb-5">
          <label className="label">
            <span className="label-text">ชื่อเกม</span>
          </label>
          <input
            type="text"
            name="game_name"
            value={editData.game_name}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-5">
          <label className="label">
            <span className="label-text">รูปภาพ</span>
          </label>
          <input
            type="file"
            name="img"
            onChange={handleFileChange} // Handle file selection
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-5">
          <label className="label">
            <span className="label-text">หมวดหมู่เกม</span>
          </label>
          <select
            name="gametype_id"
            value={editData.gametype_id}
            onChange={handleChange}
            className="input input-bordered w-full"
          >
            <option hidden>หมวดหมู่เกม</option>
            {typegames &&
              typegames.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.gametype_name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-success" onClick={handleSaveClick}>Save</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => document.getElementById(modalId).close()}>Close</button>
      </form>
    </dialog>
  );
};
