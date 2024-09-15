import axios from 'axios';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [input, setInput] = useState({
    username: '',
    password: '',
  });
  // const [notification, setNotification] = useState({ message: '', type: '' });

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    // setNotification({ message: '', type: '' });

    // Validation
    if (!input.username || !input.password) {
      // setNotification({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน', type: 'error' });
      toast.warning("ชื่อหรือรหัสผ่านว่างอยู่")
      return;
    }

    try {
      console.log(input)
      const rs = await axios.post('http://localhost:8889/auth/login', input);
      localStorage.setItem('token', rs.data.token);
      console.log(rs.data.token)
      const rs1 = await axios.get('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${rs.data.token}` },
      });
      setUser(rs1.data);
      // console.log(rs1.data.username)
      toast.success(`ยินดีต้อนรับคุณ ${rs1.data.username}`,{
        autoClose:2000,
        position: "top-center"
      })
      navigate('/');
    } catch (err) {
      // setNotification({ message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง', type: 'error' });
      // toast.error(err.response.data.error)
      toast.error("ไม่พบชื่อผู้ใช้งาน")
      console.log(err.response.data.error);
    }
  };

  // useEffect(() => {
  //   if (notification.message) {
  //     const timer = setTimeout(() => {
  //       setNotification({ message: '', type: '' });
  //     }, 3000);
  //     return () => clearTimeout(timer); // Cleanup the timer
  //   }
  // }, [notification.message]);

  // const Notification = ({ message, type, onClose }) => {
  //   if (!message) return null;

  //   const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  //   return (
  //     <div className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${bgColor}`}>
  //       {message}
  //       <button className="ml-4 text-white" onClick={onClose}>x</button>
  //     </div>
  //   );
  // };

  return (
    <div className="card from-Rose-700">
      {/* <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })}
      /> */}
      <div className="card card-side bg-purple-100 shadow-xl mt-10 m-48">
        <Link to="/">
          <figure>
            <img
              src="/src/layout/ghost.png"
              alt="Movie"
              className="ml-20 w-2/4 mt-10"
            />
          </figure>
        </Link>
        <div className="card-body">
          <form className="flex flex-col gap-2" onSubmit={hdlSubmit}>
            <div className="text-3xl mb-5 ml-20 font-bold">Login</div>

            <label className="form-control w-full max-w-xs ml-20">
              <div className="label text-center">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                className="input input-bordered rounded w-full max-w-xs bg-white"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </label>

            <label className="form-control w-full max-w-xs ml-20">
              <div className="label text-center">
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

            <div className="flex gap-5 p-5 mb-10 ml-20">
              <button
                type="submit"
                className="btn w-64 rounded-full bg-purple-500 text-white"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
