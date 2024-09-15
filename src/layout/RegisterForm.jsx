import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: '', 
    password: '',
    confirmPassword: '',
    email: ''
  });
  // const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // validation
      if (input.password !== input.confirmPassword) {
        toast.warning("รหัสผ่านไม่ตรงกัน");
        return;
      }
      
      const rs = await axios.post('http://localhost:8889/auth/register', input);
      
      if (rs.status === 200) {
        toast.success("สมัครสมาชิกเรียบร้อย", {
          autoClose: 2000,
          onClose: () => {
            navigate("/login");
          }
        });
      }
      
    } catch (err) {
      // console.log(err.response)
      if (err.response) {
        if (err.response.status === 500) {
          toast.error(err.response.data.error);
        }
      } else {
        toast.error("เกิดข้อผิดพลาด ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      }
    }
  };
  
  // const Notification = ({ message, type, onClose }) => {
  //   if (!message) return null;

  //   const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  //   return (
  //     <div className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${bgColor}`}>
  //       {message}
  //       <button className="ml-4 text-white" onClick={onClose}>x</button>
  //     </div>
  //   );
  // };

  return (
    <div className="p-5 border w-1/3 min-w-[500px] mx-auto rounded mt-5 bg-purple-100">
      <div className="text-3xl mb-5">Register Form</div>
      <form className="flex flex-col gap-2" onSubmit={hdlSubmit}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="username"
            value={input.username}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">E-mail</span>
          </div>
          <input
            type="email"
            className="input input-bordered w-full max-w-xs"
            name="email"
            value={input.email}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
            name="password"
            value={input.password}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Confirm Password</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={hdlChange}
          />
        </label>
        
        <div className="flex gap-8 py-4">
          <button type="submit" className="btn btn-outline bg-purple-500 text-white">Submit</button>
        </div>
      </form>
      {/* <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })}
      /> */}
    </div>
  );
}
