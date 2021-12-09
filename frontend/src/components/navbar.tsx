import React from "react";
import { HomeOutlined } from '@ant-design/icons'

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/">
        <div className="nav-logo">
          <HomeOutlined className="home" />
        </div>
      </a>
      <div className="nav-title">
        <h1>Birdie SWE Intern test</h1>
      </div>
    </nav>
  );
};

export default Navbar;