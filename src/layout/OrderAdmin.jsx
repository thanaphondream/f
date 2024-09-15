import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function OrderAdmin() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState([]);
  const [type, setType] = useState([]);
  const [input, setInput] = useState({ status: "" });
  const [pdfUrl, setPdfUrl] = useState("");
  const [note, setNote] = useState('');
  const [pays, setPays] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8889/admin/getOrder", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayment(response.data);
    } catch (error) {
      console.error("Error fetching payment:", error);
    }
  };
  
  useEffect(() => {

    const fetchType = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/getGameByPoint");
        setType(response.data.get);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchPayment();
    fetchType();
  }, []);

  const getPriceByPointId = (pointId) => {
    const game = type.find((game) => game.id === pointId);
    return game ? game.price : "";
  };

  const getPointById = (pointId) => {
    const game = type.find((game) => game.id === pointId);
    return game ? game.point : "";
  };

  const getGameNameById = (gameId) => {
    const game = type.find((game) => game.gameId === gameId);
    return game ? game.game.game_name : "";
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8889/admin/updateStatus/${id}`, {
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayment((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === id ? { ...payment, status: newStatus } : payment
        )
      );
      navigate('/orderstatus01');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangeStatus = (id, e) => {
    const newStatus = e.target.value;
    if (input.status === "เสร็จสิ้น" && newStatus === "ยกเลิก") {
      toast.error("ไม่สามารถเปลี่ยนสถานะเป็น ยกเลิก เมื่อสถานะปัจจุบันคือ เสร็จสิ้น");
      return;
    }
    setInput((prevOrderItem) => ({
      ...prevOrderItem,
      status: newStatus,
    }));
    updateStatus(id, newStatus);
    toast.success(`เปลี่ยนสถานะเป็น ${newStatus} เรียบร้อยแล้ว`);
  };

  const handleInputChange = (e) => {
    setNote(e.target.value);
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:8889/admin/cencal', {
        note: note,
        orderId: pays,
      });
      await axios.put(`http://localhost:8889/admin/updateStatus/${pays}`,{
        status: 'ยกเลิก'
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPayment()
      setShowModal(false);
      toast.success("Order cancelled successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const generateReceipt = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:8889/admin/generateReceipt/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setPdfUrl(response.data.filePath);
        const link = document.createElement("a");
        link.href = response.data.filePath;
        link.target = "_blank";
        link.click();
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Failed to generate receipt");
    }
  };

  const status0 = () => {
    navigate('/orderstatus01');
  };

  const status1 = () => {
    navigate('/ordercencal');
  };
  const payments = payment.filter((bk) => bk.status === 'รอดำเนินการ');

  return (
    <div className="overflow-x-auto p-4 bg-gray-100">
      <div className="text-right p-3">
        <button onClick={status1} className="border-2 border-stone-950 rounded-lg bg-red-500 text-white h-10 px-4 py-2 shadow-md hover:bg-red-600 transition-colors duration-300">
          ยกเลิก
        </button>
        <button className="border-2 border-stone-950 rounded-lg bg-amber-300 text-black h-10 px-4 py-2 shadow-md hover:bg-amber-400 transition-colors duration-300">
          สถานะรอดำเนินการ
        </button>
        <button onClick={status0} className="border-2 border-stone-950 rounded-lg bg-green-400 text-black h-10 px-4 py-2 shadow-md hover:bg-green-500 transition-colors duration-300">
          สถานะเส็จสิ้น
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">จัดการคำสั่งซื้อ</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border-b">เลขที่</th>
              <th className="px-4 py-2 border-b">ไอดีเกมส์</th>
              <th className="px-4 py-2 border-b">จำนวนพอยท์</th>
              <th className="px-4 py-2 border-b">ราคา</th>
              <th className="px-4 py-2 border-b">ชื่อเกม</th>
              <th className="px-4 py-2 border-b">สลิป</th>
              <th className="px-4 py-2 border-b">เวลาชำระเงิน</th>
              <th className="px-4 py-2 border-b">สถานะคำสั่งซื้อ</th>
              <th className="px-4 py-2 border-b">ยกเลิก</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item) => (
              <tr key={item.id} className="bg-white border-b">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.user_gameId}</td>
                <td className="px-4 py-2">{getPointById(item.pointId)}</td>
                <td className="px-4 py-2">{getPriceByPointId(item.pointId)}</td>
                <td className="px-4 py-2">{getGameNameById(item.games_id)}</td>
                <td className="px-4 py-2">
                  {item.Payment.length > 0
                    ? item.Payment.map((payment) => (
                      <a key={payment.id} href={payment.pay_img} target="_blank" rel="noopener noreferrer">
                        <img
                          src={payment.pay_img}
                          alt="Slip"
                          className="w-24 h-16 object-cover rounded shadow"
                        />
                      </a>
                    ))
                    : "No slip"}
                </td>
                <td className="px-4 py-2">
                  {item.Payment.length > 0
                    ? item.Payment.map((payment) => (
                      <div key={payment.id}>
                        {new Date(payment.pay_time).toLocaleString()}
                      </div>
                    ))
                    : "No payment time"}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="border-stone-950 rounded-lg bg-green-400 text-black h-10 px-4 py-2 shadow-md hover:bg-green-500 transition-colors duration-30"
                    onClick={() => updateStatus(item.id, 'เสร็จสิ้น')}
                  >
                    เปลี่ยนสถานะเป็นเส็จสิ้น
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => { setPays(item.id); setShowModal(true); }}
                    className="cursor-pointer transition-all bg-red-500 text-white px-6 py-2 rounded-lg border-red-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] disabled:active:translate-y-0 disabled:opacity-40"
                    disabled={item.status === "เสร็จสิ้น"}
                  >
                    หมายเหตุ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">ยกเลิกคำสั่งซื้อ</h2>
            <div className="mb-4">
              <label htmlFor="note" className="block text-gray-700 mb-2">สาเหตุที่ยกเลิก</label>
              <input
                type="text"
                name="note"
                id="note"
                value={note}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
