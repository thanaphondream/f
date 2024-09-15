import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import React, { useState } from "react";
import { toast } from 'react-toastify';

const guestNav = [
  { to: '/login', text: 'Login' },
  { to: '/register', text: 'Register' },

];

const userNav = [
  { to: '/', text: 'Home' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const finalNav = user?.id ? userNav : guestNav;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // Added state for dropdown visibility

  const handleSearch = () => {
    const params = searchTerm.split(" ");
    const searchKey = params[0];
    const encodedSearchKey = encodeURIComponent(searchKey);

    fetch(`http://localhost:8889/auth/getProductBySearch/?params=${encodedSearchKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSearchResult(data.product);
        setShowDropdown(data.product.length > 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const navigate = useNavigate();

  const hdlLogout = () => {
    logout();
    toast.success("ออกจากระบบเรียบร้อย", {
      autoClose:2000,
      position: 'top-center'
    }
    )
    navigate('/');
  };

  const hdlprofile = () => {
    if (user?.id) {
      navigate('/profile');
    } else {
      navigate('/userhome'); // Redirect guests to the login page
    }
  };

  return (
    <div className="p-5 navbar bg-gradient-to-r from-black via-gray-200 to-gray-50 text-white">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={hdlprofile}> {user?.id ? user.username : 'Guest'}</a>
      </div>
      {user?.id && (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="input input-bordered flex items-center gap-2"
          >
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch();
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {showDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu w-full bg-base-100 rounded-box"
            >
              {searchResult.map((product) => (
                <li key={product.id}>
                  <a href={`/getproduct/${product.id}`}>{product.game_name}</a>
                </li>
              ))}
              {searchResult.length === 0 && <li>No results found</li>}
            </ul>
          )}
        </div>
      )}

      <div className="flex-none">
        <ul className="menu menu-horizontal text-gray-950">
          {finalNav.map((el) => (
            <li key={el.to}>
              <Link to={el.to}>{el.text}</Link>
            </li>
          ))}
          {user?.id && (
            <li className='bg-red-500 rounded-lg'>
              <Link to='#' onClick={hdlLogout}>Logout</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
