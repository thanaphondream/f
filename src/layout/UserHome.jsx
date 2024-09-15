import axios from "axios";
import { useEffect, useState } from "react";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import { Link } from "react-router-dom";
import Product from "./game";

export default function UserHome() {
  const [user, setUsers] = useState([]);

  useEffect(() => {
    const run = async () => {
      let token = localStorage.getItem("token");
      const rs = await axios.get("http://localhost:8889/admin/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(rs.data.user);
    };
    run();
  }, []);

  return (
    <>
      <div className="mt-20 ">
        <Slide>
          {/* <div className="carousel w-full"> */}
          <div id="item1" className="each-slide-effect h-auto max-w-lg mx-auto">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png "
              className="w-full h-auto "
            />
          </div>
          <div
            id="item2"
            className="each-slide-effect h-auto w-[650px] mx-auto"
          >
            <img
              src="https://www.riotgames.com/darkroom/1440/08bcc251757a1f64e30e0d7e8c513d35:be16374e056f8268996ef96555c7a113/wr-cb1-announcementarticle-banner-1920x1080.png"
              className="w-full"
            />
          </div>
          <div id="item3" className="each-slide-effect h-auto max-w-lg mx-auto">
            <img
              src="https://cdn.pixabay.com/photo/2021/08/28/09/27/pubg-mobile-logo-6580513_640.png"
              className="w-full"
            />
          </div>
          <div id="item4" className="each-slide-effect h-auto max-w-sm mx-auto">
            <img
              src="https://m.media-amazon.com/images/I/81ixy0U02AL.png"
              className="w-full"
            />
          </div>
          {/* </div> */}
        </Slide>
        <div>
          <div className="max-w-[80rem] mx-auto gap-5 flex flex-wrap mt-3 justify-around">
            <Product />
          </div>
        </div>
      </div>
    </>
  );
}
