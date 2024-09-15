import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [type, setType] = useState([]);
  const [order, setOrder] = useState([]);
  const [input, setInput] = useState({
    user_gameId: '',
    point_id: '',
    status: '',
    gameId: '',
    email: '',
  });
  // const [notification, setNotification] = useState({ message: '', type: '' });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
     
        const response = await axios.get(`http://localhost:8889/auth/getproduct/${id}`
        );
        setProduct(response.data);
        setInput(prev => ({ ...prev, gameId: response.data.id }));
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

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8889/auth/orderdetail/${product?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data); 
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchProduct();
    fetchType();
    fetchOrder();
  }, [id, product?.id]);

  const hdlChange = (e) => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    const { user_gameId, point_id } = input;
    if (!user_gameId || !point_id) {
      // setNotification({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน', type: 'error' });
      return toast.warning("กรุณากรอกข้อมูลให้ครบถ้วน")
    }

    try {
      const token = localStorage.getItem("token");
      if(token){
        const response = await axios.post("http://localhost:8889/auth/order", input, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          toast.success("สั่งซื้อสำเร็จ",{
            autoClose: 2000,
            onClose: () => {
              navigate("/payment")
            }
          })
        }
      }
      else{
        toast.warning("กรุณาล็อคอินก่อนทำการสั่งซื้อ",{
          autoClose:2000,
          onClose: () => {
            navigate("/login")
          }
        })
      }
      
    } catch (error) {
      // setNotification({ message: 'กรุณาเข้าสู่ระบบก่อนทำการสั่งซ์้อ ' , type: 'error' });
      toast.warning(error.response.data)
      console.log(error.response.data)
    }
  };

  // useEffect(() => {
  //   if (notification.message) {
  //     const timer = setTimeout(() => {
  //       setNotification({ message: '', type: '' });
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [notification.message]);

  // const Notification = ({ message, type }) => {
  //   if (!message) return null;

  //   const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  //   return (
  //     <div className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${bgColor}`}>
  //       {message}
  //     </div>
  //   );
  // };

  const findType = type.filter((el) => el.gameId === product.id);

  return (
    <div className="bg-white-100 min-h-screen p-8">
      {/* <Notification message={notification.message} type={notification.type} /> */}
      <div className="bg-purple-100 shadow-lg rounded-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <img src={product.img} alt="" className="w-full h-auto mb-4" />
          <h2 className="text-2xl font-bold text-purple-700 mb-2">{product.game_name}</h2>
          <p className="text-purple-600">{product.description}</p>
        </div>
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg shadow-inner">
            <form>
              <label className="block mb-4">
                <span className="block text-purple-700 font-semibold">กรอกไอดีผู้เล่น</span>
                <input
                  placeholder={product.game_name === "Valorant" ? 'กรอกไอดีผู้เล่น(babu#1234)' : 'กรอกไอดีผู้เล่น(#1234)'}
                  type="text"
                  className="input input-bordered w-full mt-2 p-2 rounded-lg border border-purple-300"
                  name="user_gameId"
                  value={input.user_gameId}
                  onChange={hdlChange}
                />
              </label>
            </form>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-inner">
            <label className="block mb-4">
              <span className="block text-purple-700 font-semibold">เลือกจำนวนที่ต้องการ</span>
              <select
                name="point_id"
                value={input.point_id}
                onChange={hdlChange}
                className="input input-bordered w-full mt-2 p-2 rounded-lg border border-purple-300"
              >
                <option hidden>เลือกจำนวนที่ต้องการ</option>
                {findType && findType.map(el => (
                  <option key={el.id} value={el.id}>
                    จำนวนพอย : {el.point} ราคา : {el.price} บาท
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-inner">
            <label className="block mb-4">
              <span className="block text-purple-700 font-semibold">เลือกวิธีการชำระเงิน</span>
              <div className="flex gap-5 items-center mt-2">
                <input type="checkbox" defaultChecked className="checkbox checkbox-md" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" alt="payment" className="w-24" />
              </div>
            </label>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-inner">
            <label className="block mb-4">
              <span className="block text-purple-700 font-semibold">ซื้อ!</span>
              <span className="block text-purple-600 mb-2">เพิ่มเติม: หากต้องการรับใบเสร็จในการสั่งซื้อ กรุณาใส่อีเมลล์ ใบเสร็จจะถูกส่งไปตามอีเมลล์ที่กรอกไว้</span>
              <input
                type="email"
                className="input input-bordered w-full mt-2 p-2 rounded-lg border border-purple-300"
                name="email"
                value={input.email}
                onChange={hdlChange}
              />
            </label>
            <button className="btn bg-purple-700 text-white w-full py-2 rounded-lg" onClick={hdlSubmit}>ซื้อตอนนี้</button>
          </div>
        </div>
      </div>
    </div>
  );
}
