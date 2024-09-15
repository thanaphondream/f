import axios from 'axios';
import { useEffect, useState } from 'react';
import 'react-slideshow-image/dist/styles.css'
import { Link,useParams,useNavigate } from 'react-router-dom'; // นำเข้า Link จาก react-router-dom
import { Slide } from "react-slideshow-image"


export default function product() {
  const [product, setProduct] = useState([])
  const {gametypeId} =useParams();
  const [typegames, setProductTypes] = useState([])
  const navigate = useNavigate();
  


  useEffect(() => {
  

    const fetchProductsByType = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8889/auth/typeId/${gametypeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching products by type:', error);
        }
      };
      fetchProductsByType()

  }, [gametypeId]);
  useEffect(() => {
   
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

    getProList();


    // const fetchMenutems = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get('http://localhost:8889/auth/product', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setProduct(response.data);
    //   } catch (error) {
    //     console.error('Error fetching menutems:', error);
    //   }
    // };
    // fetchMenutems();

  }, []);

  return (
    <><div>
    
      <div className='mt-20 '>

      
      <Slide >
        {/* <div className="carousel w-full"> */}
          <div id="item1" className="each-slide-effect h-auto max-w-lg mx-auto">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png " className="w-full h-auto " />
          </div>
          <div id="item2" className="each-slide-effect h-auto w-[650px] mx-auto">
            <img src="https://www.riotgames.com/darkroom/1440/08bcc251757a1f64e30e0d7e8c513d35:be16374e056f8268996ef96555c7a113/wr-cb1-announcementarticle-banner-1920x1080.png" className="w-full" />
          </div>
          <div id="item3" className="each-slide-effect h-auto max-w-lg mx-auto">
            <img src="https://cdn.pixabay.com/photo/2021/08/28/09/27/pubg-mobile-logo-6580513_640.png" className="w-full" />
          </div>
          <div id="item4" className="each-slide-effect h-auto max-w-sm mx-auto">
            <img src="https://m.media-amazon.com/images/I/81ixy0U02AL.png" className="w-full" />
          </div>
        {/* </div> */}
      </Slide>
      <div>
      <div className="max-w-[80rem] mx-auto gap-5 flex flex-wrap mt-3 justify-around">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <nav className="flex justify-center items-center pt-2">
            <div className="dropdown dropdown-hover px-20">
              <ul className="btn bg-red-100">ประเภทเกม</ul>
              <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
                {typegames && typegames.map((type) => (
                  // <li key={type.id} value={type.id} onClick={() => fetchProductsByType(type.id)}>
                   <li key={type.id} value={type.id} onClick={() => navigate(`/test/${type.id}`)}> 
                    <a>{type.gametype_name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
 



</div>
  </div>
   
   


      <strong><div className='grid grid-cols-4 grid-rows-4 gap-8 pt-12'>
        {product.map((item) => (
          <div key={item.id} className="card card-compact w-full bg-base-100 shadow-xl cursor-pointer active:shadow-lg active:translate-x-2 active:translate-y-2">
            <Link to={`/getproduct/${item.id}`}>
              <figure><img src={item.img} alt="game" className='px-10 pt-10' /></figure>
              <div className="card-body font-bold">
                <h2 className="card-title ">{item.game_name}</h2>
              </div>
            </Link>
          </div>

        ))}
      </div>
      </strong>
    </div>
    </div>
     </>
  );

}