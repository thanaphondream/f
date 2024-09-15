import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const guestNav = [{ to: "/" }];

const userNav = [{ to: "/", text: "Home" }];
// const adminNav = [
//   {to: '/' ,text:'Home'},
//   {to: '/newType' ,text:'new type'}
// ]

export default function HeaderAdmin() {
  const { user, logout } = useAuth();
  const finalNav = user?.id ? userNav : guestNav;

  const navigate = useNavigate();

  const hdlLogout = () => {
    logout();
    toast.success("ออกจากระบบเรียบร้อย",{
      autoClose:2000,
      position:'top-center'
    })
    navigate("/");
  };
const hdlHome = () => {
  navigate("/home")
}
  const hdltypesgmaes = () => {
    navigate("/typegames");
  };
  const hdlUser = () => {
    navigate("/customer");
  };

  const hdlPro = () => {
    navigate("/newpro");
  };
  const hdlPoint = () => {
    navigate("/createpoint");
  };

  const hdlorder = () => {
    navigate("/orderadmin");
  };
  const hdlEditadmin = () => {
    navigate("/editadmin");
  };

  return (
    <ul>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={hdltypesgmaes}>จัดการประเภทสินค้า</a>
              </li>
              {/* <li><a onClick={hdlNewtype}>Add Type</a></li> */}
              <li>
                <a onClick={hdlPoint}>จัดการPoint</a>
              </li>
              <li>
                <a onClick={hdlPro}>จัดการสินค้า</a>
              </li>
              <li>
                <a onClick={hdlorder}>จัดการคำสั่งซื้อ</a>
              </li>
              <li>
                <a onClick={hdlUser}>ผู้ใช้งาน</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl" onClick={hdlEditadmin}>ADMIN</a>
        </div>
        <div className="navbar-center hidden lg:flex ">
          <ul className="menu menu-horizontal px-1 ">
          <li>
              <a onClick={hdlHome}>หน้าหลัก</a>
            </li>
            <li>
              <a onClick={hdltypesgmaes}>หมวดหมู่เกม</a>
            </li>
            {/* <li><a onClick={hdlNewtype}>Add Type</a></li> */}
            <li>
              <a onClick={hdlPoint}>เพิ่มพ้อย</a>
            </li>
            <li>
              <a onClick={hdlPro}>เพิ่มเกม</a>
            </li>
            <li>
              <a onClick={hdlorder}>คำสั่งซื้อ</a>
            </li>
            <li>
              <a onClick={hdlUser}>ผู้ใช้งาน</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {user?.id && (
            <li className="bg-red-500 rounded-lg">
              <Link to="#" onClick={hdlLogout}>
                logout
              </Link>
            </li>
          )}
        </div>
      </div>

      {/* {finalNav.map( el => (
        <li key={el.to} ><Link to={el.to}>{el.text}</Link>
        </li>
      ))} */}
    </ul>
  );
}
