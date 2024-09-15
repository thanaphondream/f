import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // นำเข้า Link จาก react-router-dom
// หน้าโชว์เกมทั้งหมด

export default function Product() {
  const [product, setProduct] = useState([]);
  const [typegames, setProductTypes] = useState([]);
  const [gameBytype, setGameByType] = useState([]);
  const { gametypeId } = useParams();
  const navigate = useNavigate();

  const hdltypesgmaes = (gametypeId) => {
    navigate(`/test/${gametypeId}`)
  }

  useEffect(() => {
    // const fetchProductsByType = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get(`http://localhost:8889/auth/typeId/${gametypeId}`, {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setGameByType(response.data);
    //   } catch (error) {
    //     console.error('Error fetching products by type:', error);
    //   }
    // };

    // fetchProductsByType(); 
    const getProList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8889/auth/type", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductTypes(response.data);
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };

    getProList(); // เรียกใช้งานเมื่อ component โหลดเสร็จสมบูรณ์

    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/product', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems(); // เรียกใช้งานเมื่อ component โหลดเสร็จสมบูรณ์
  }, []);

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <nav className="flex justify-center items-center pt-2">
            <div className="dropdown dropdown-hover px-20">
              <ul className="btn bg-red-100">ประเภทเกม</ul>
              <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
                {typegames && typegames.map((type) => (
                  // <li key={type.id} value={type.id} onClick={() => fetchProductsByType(type.id)}>
                   <li key={type.id} value={type.id} onClick={() => hdltypesgmaes(type.id)}> 
                    <a>{type.gametype_name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <strong>
        <div className='grid grid-cols-4 grid-rows-4 gap-8 pt-12'>
          {gameBytype&&product.map((item) => (
            <div key={item.id} className="card card-compact w-full bg-base-100 shadow-xl cursor-pointer active:shadow-lg active:translate-x-2 active:translate-y-2">
              <Link to={`/getproduct/${item.id}`}>
                <figure><img src={item.img} alt="game" className='px-10 pt-10' /></figure>
                <div className="card-body font-bold">
                  <h2 className="card-title">{item.game_name}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </strong>
    </div>
  );
}
