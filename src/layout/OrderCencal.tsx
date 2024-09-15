import axios from "axios";
import React,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OrderCencal() {
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
  
    const handleChangeStatus = (id, e) => {
      const newStatus = e.target.value;
      setDisabledOptions((prev) =>
        newStatus === 'ยกเลิก' || newStatus === 'เสร็จสิ้น'
          ? [...prev, newStatus]
          : prev.filter((status) => status !== newStatus)
      );
      if (input.status === "เสร็จสิ้น" && newStatus === "ยกเลิก") {
        toast.error(
          "ไม่สามารถเปลี่ยนสถานะเป็น ยกเลิก เมื่อสถานะปัจจุบันคือ เสร็จสิ้น"
        );
        return;
      }
      setInput((prevOrderItem) => ({
        ...prevOrderItem,
        status: newStatus,
      }));
      updateStatus(id, newStatus);
      toast.success(`เปลี่ยนสถานะเป็น${newStatus} เรียบร้อยแล้ว`);
    };
  
  
    const status0 = () => {
        navigate('/orderadmin')
      }
      const status1 = () => {
        navigate('/orderstatus01')
      }
    
      const payments = payment.filter((bk)=> bk.status === 'ยกเลิก')
  
    return (
      <div className="overflow-x-auto p-4 bg-gray-100">
             <div className="text-right p-3">
        <button className="border-2 border-stone-950 rounded-lg bg-red-500 text-white h-10 px-4 py-2 shadow-md hover:bg-red-600 transition-colors duration-300">
          ยกเลิก
        </button>
        <button  onClick={status0} className="border-2 border-stone-950 rounded-lg bg-amber-300 text-black h-10 px-4 py-2 shadow-md hover:bg-amber-400 transition-colors duration-300">
          สถานะรอดำเนินการ
        </button>
        <button onClick={status1} className="border-2 border-stone-950 rounded-lg bg-green-400 text-black h-10 px-4 py-2 shadow-md hover:bg-green-500 transition-colors duration-300">
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
                <th className="px-4 py-2 border-b">ยกเลิกเนื่องจาก</th>
                <th className="px-4 py-2 border-b">สถานะ</th>
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
                    <button>{item?.Cencal[0]?.note}</button>
                      
                  </td>
  
  
                  <td className="px-4 py-2">
                    <button className="text-red-600">
                      ยกเลิกแล้ว
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

export default OrderCencal