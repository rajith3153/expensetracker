import React from "react";
import { AiFillDollarCircle } from "react-icons/ai";

function Topbar({ currentPage, handleRefresh }) {
  return (
    <nav className="navbar sticky-top justify-content-between" style={{ backgroundColor: "#3F51B5" }}>
      <div className="d-flex align-items-center" style={{ marginLeft: "40px" }}>
        <AiFillDollarCircle size={45} />
        <span className="my-custom-text pl-3" style={{ paddingLeft: "30px" }}>{currentPage}</span>
      </div>
    </nav>
  );
}

export default Topbar;
