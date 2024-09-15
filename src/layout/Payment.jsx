import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ProductForm() {
  const orderId = location.pathname.split('/')[2];
  const [order, setOrder] = useState([]);
  const [product, setProduct] = useState([]);
  const [type, setType] = useState([]);
  const { id } = useParams();

  const [input, setInput] = useState({
    pay_img: '',
    pay_price: '',
    pay_time: new Date(),
    orderId: orderId,
  });
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fileInput = useRef(null);

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const file = fileInput.current?.files[0];
      const formData = new FormData();
      if (!file) {
        setNotification({ message: 'กรุณาเลือกไฟล์', type: 'error' });
        return;
      }
      Object.entries(input).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) {
        formData.append('image', file);
      }
      const token = localStorage.getItem('token');
      const rs = await axios.post(`http://localhost:8889/auth/payment`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification({ message: 'ชำระเงินสำเร็จ', type: 'success' });
      setTimeout(() => {
        window.location.href = "/";
      }, 3000); // Redirect after showing the success message
    } catch (err) {
      setNotification({ message: 'เกิดข้อผิดพลาด: ' + err.message, type: 'error' });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8889/auth/orderdetail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchType = async () => {
      try {
        const response = await axios.get('http://localhost:8889/admin/getGameByPoint');
        setType(response.data.get);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchProduct();
    fetchType();
  }, [id]);

  const game = type?.find((el) => el.id === product.pointId);

  const Notification = ({ message, type }) => {
    if (!message) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
      <div className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${bgColor}`}>
        {message}
      </div>
    );
  };

  return (
    <div className="bg-purple-100 min-h-screen flex justify-center items-center p-8">
      <Notification message={notification.message} type={notification.type} />
      <div className="card w-full max-w-lg bg-white shadow-xl rounded-lg p-6">
        <figure className="px-10 pt-10">
          <img src="/src/layout/429901252_1899411400487773_5201540840981834173_n.jpg" alt="QR" className="rounded-xl" />
        </figure>
        <div className="card-body text-center space-y-4">
          <h2 className="card-title text-purple-700">ชำระเงิน</h2>
          <p className="text-purple-600">ไอดีผู้เล่น: {product?.user_gameId}</p>
          <p className="text-purple-600">จำนวนที่ต้องจ่าย: {game?.price} บาท</p>
          <p className="text-purple-600">พ้อยท์ที่ได้: {game?.point} บาท</p>
          <input type="file" accept="image/*" ref={fileInput} name="pay_img" className="file-input file-input-bordered file-input-primary w-full" />
          <div className="card-actions mt-4">
            <button className="btn btn-primary w-full" onClick={hdlSubmit}>ยืนยันการชำระเงิน</button>
          </div>
        </div>
      </div>
    </div>
  );
}
