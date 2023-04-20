import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import Topbar from "./TopBar";

function Layout() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("Dashboard");
  
  useEffect(() => {
    const path = location.pathname;
    let name = "";
    switch (path) {
      case "/":
        name = "Dashboard";
        break;
      case "/transactions":
        name = "Transactions";
        break;
      case "/Account":
        name = "Accounts";
        break;
      case "/reports":
        name = "Reports";
        break;
      case "/settings":
        name = "Settings";
        break;
      default:
        name = "Dashboard";
    }
    setCurrentPage(name);
  }, [location]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <Sidebar currentPage={currentPage} handleRefresh={handleRefresh} />
      <Topbar currentPage={currentPage} handleRefresh={handleRefresh} />
      <div style={{ marginLeft: "150px" }}>
        <Outlet />
      </div>
    </div>
    
  );
}
export default Layout;
