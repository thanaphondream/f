import axios from "axios";
import React,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Orderstatus01() {
    const navigate = useNavigate();
    const [payment, setPayment] = useState([]);
    const [type, setType] = useState([]);
    const [input, setInput] = useState({ status: "" });
    const [pdfUrl, setPdfUrl] = useState("");
    useEffect(() => {
      const fetchPayment = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:8889/admin/getOrder",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setPayment(response.data);
        } catch (error) {
          console.error("Error fetching payment:", error);
        }
      };
  
      const fetchType = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8889/admin/getGameByPoint"
          );
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
  
    const updateStatus = async (id) => {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:8889/admin/updateStatus/${id}`,
          { status: 'เสร็จสิ้น' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPayment((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === id ? { ...payment, status: newStatus } : payment
          )
        );
      } catch (err) {
        alert(err.message);
      }
    };
  
    const deleteOrder = async (paymentId) => {
      const confirmDelete = window.confirm("ต้องการที่จะลบคำสั่งซื้อ?");
      if (!confirmDelete) {
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:8889/admin/deleteOrder/${paymentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPayment((prevPayments) =>
          prevPayments.filter((payment) => payment.id !== paymentId)
        );
        toast.success("ลบคำสั่งซื้อเรียบร้อย");
      } catch (error) {
        console.error(
          "Error deleting order:",
          error.response?.data || error.message
        );
        alert(
          `Failed to delete order: ${error.response?.data?.msg || error.message}`
        );
      }
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
          setPdfUrl(response.data.filePath); // ตั้งค่า URL ของ PDF
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
  
    const status0 = () => {
        navigate('/orderadmin')
      }
      const status1 = () => {
        navigate('/ordercencal')
      }
    
      const payments = payment.filter((bk)=> bk.status === 'เสร็จสิ้น')
  
    return (
      <div className="overflow-x-auto p-4 bg-gray-100">
             <div className="text-right p-3">
        <button onClick={status1} className="border-2 border-stone-950 rounded-lg bg-red-500 text-white h-10 px-4 py-2 shadow-md hover:bg-red-600 transition-colors duration-300">
          ยกเลิก
        </button>
        <button  onClick={status0} className="border-2 border-stone-950 rounded-lg bg-amber-300 text-black h-10 px-4 py-2 shadow-md hover:bg-amber-400 transition-colors duration-300">
          สถานะรอดำเนินการ
        </button>
        <button className="border-2 border-stone-950 rounded-lg bg-green-400 text-black h-10 px-4 py-2 shadow-md hover:bg-green-500 transition-colors duration-300">
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
                <th className="px-4 py-2 border-b">ใบเสร็จ</th>
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
                    <button className="text-green-500">เส็จสิ้นแล้ว</button>
                      
                  </td>
  
  
                  <td className="px-4 py-2">
                    <button
                      onClick={() => generateReceipt(item.id)}
                      className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
  border-blue-600
  border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] disabled:hover:translate-y-[0px] hover:border-b-[6px]
  active:border-b-[2px] active:brightness-90 active:translate-y-[2px] disabled:active:translate-y-0 disabled:opacity-40"
                      disabled={item.status !== "เสร็จสิ้น"}>
                      สร้างใบเสร็จ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default Orderstatus01