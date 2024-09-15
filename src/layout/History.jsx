import axios from "axios";
import { useEffect, useState } from "react";

export default function History() {
  const [user, setUser] = useState([]);
  const [payment, setPayment] = useState([]);
  const [type, setType] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); // State for managing the modal
  const [modalVisible, setModalVisible] = useState(false); // State for showing/hiding the modal
  const [pdfUrl, setPdfUrl] = useState(""); // State for storing PDF URL

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/user");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8889/auth/getOrderbyUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayment(response.data);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    };

    const fetchType = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/getGameByPoint");
        setType(response.data.get);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    getUser();
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

  const handleStatusClick = (note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedNote(null);
  };

  const generateReceipt = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8889/admin/generateReceipt/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setPdfUrl(response.data.filePath); // Set the PDF URL
        const link = document.createElement("a");
        link.href = response.data.filePath;
        link.target = "_blank"; // Open the PDF in a new tab
        link.click();
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Failed to generate receipt");
    }
  };

  const getModelStatus = (item) => {
    if (item.status === 'ยกเลิก') {
      return (
        <td className="px-4 py-2 text-red-500 cursor-pointer" onClick={() => handleStatusClick(item?.Cencal[0]?.note)}>
          <ins>{item.status}</ins>
        </td>
      );
    } else if (item.status === 'เสร็จสิ้น') {
      return (
        <td className="px-4 py-2 text-green-700">{item.status}</td>
      );
    } else {
      return (
        <td className="px-4 py-2 text-amber-400">{item.status}</td>
      );
    }
  };

  const getReceiptButton = (item) => {
    if (item.status === 'เสร็จสิ้น') {
      return (
        <td className="px-4 py-2">
          <button
            onClick={() => generateReceipt(item.id)}
            className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] disabled:hover:translate-y-[0px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] disabled:active:translate-y-0 disabled:opacity-40"
            disabled={item.status !== "เสร็จสิ้น"}>
            สร้างใบเสร็จ
          </button>
        </td>
      );
    } else {
      return (
        <td className="px-4 py-2">รายการยังไม่เสร็จ</td>
      );
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-8">ประวัติการสั่งซื้อ</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">ไอดีเกมส์</th>
                <th className="px-4 py-2">เกมส์</th>
                <th className="px-4 py-2">ราคาที่จ่าย</th>
                <th className="px-4 py-2">จำนวนพอยท์</th>
                <th className="px-4 py-2">สถานะ</th>
                <th className="px-4 py-2">ใบเสร็จ</th>
              </tr>
            </thead>
            <tbody>
              {payment.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.user_gameId}</td>
                  <td className="px-4 py-2">{getGameNameById(item.games_id)}</td>
                  <td className="px-4 py-2">{getPriceByPointId(item.pointId)}</td>
                  <td className="px-4 py-2">{getPointById(item.pointId)}</td>
                  {getModelStatus(item)}
                  {getReceiptButton(item)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modalVisible && (
          <div onClick={handleCloseModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <button onClick={handleCloseModal} className="absolute top-2 right-2 text-xl">&times;</button>
              <p>{selectedNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
