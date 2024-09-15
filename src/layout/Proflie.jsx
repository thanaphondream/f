import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
//แก้ไข-ประวัติ

const guestNav = [{ to: "/" }];

const userNav = [
  { to: "/", text: "Home" },
  { to: "/", text: "Home" },
];

export default function profile() {
  // const [product, setProduct] = useState([]);
  const { user, logout } = useAuth();
  const finalNav = user?.id ? userNav : guestNav;

  // const fetchProducts = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://localhost:8000/auth/order', {
  //       headers: { Authorization: Bearer ${token} }
  //     });
  //     setProduct(response.data);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // }

  // fetchProducts();

  const navigate = useNavigate();

  const hdlUpdate = () => {
    navigate("/Updateprofile");
  };
  const hdlOrder = () => {
    navigate("/history");
  };

  return (
    <div className="text-center pt-10">
      <a className="link link-hover mb-12" onClick={hdlUpdate}>
        แก้ไขบัญชี
      </a>
      <hr className="border-t border-gray-500 my-3  justify-center flex m-36 " />
      <a className="link link-hover" onClick={hdlOrder}>
        ประวัติการสั่งซื้อ
      </a>
      {/* <table className="table flex table-zebra">
        <tbody>
        <product key={item.id} item={item}/>
        <th><figure><img src={item.url} alt="book" className='px-10 pt-10 max-w-xs max-h-xs' /></figure></th>
                <th>{item.name}</th> 
                <th>{item.price}</th>
        </tbody>
      </table> */}
    </div>
  );
}