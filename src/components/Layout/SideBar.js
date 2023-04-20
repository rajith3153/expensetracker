import React from "react";
import {
  FaNewspaper,
  FaExchangeAlt,
  FaCreditCard,
  FaChartLine,
  FaSyncAlt,
  FaCog,
} from "react-icons/fa";
import "../style.css";

function Sidebar({ currentPage, handleRefresh }) {
  return (
    <nav
      className="navbar bg-light position-fixed border h-100 flex-column align-items-start mt-5 sticky-top"
      style={{ top: "6px", left: 0 }}
    >
      <div className="nav flex-column mr-auto py-2 justify-content-center">
        <a
          href="/"
          className={`nav-link pb-3 text-center ${
            currentPage === "Dashboard" ? "active-link" : ""
          }`}
          active={currentPage === "Dashboard"}
        >
          <FaNewspaper />
          <br />
          Dashboard
        </a>
        <a
          href="/transactions"
          className={`nav-link pb-3 text-center nav-link  ${
            currentPage === "Transactions" ? "active-link" : ""
          }`}
          active={currentPage === "Transactions"}
        >
          <FaExchangeAlt />
          <br />
          Transactions
        </a>
        <a
          href="/Account"
          className={`nav-link pb-3 text-center ${
            currentPage === "Accounts" ? "active-link" : ""
          }`}
          active={currentPage === "Accounts"}
        >
          <FaCreditCard />
          <br />
          Accounts
        </a>
        <a
          href="/reports"
          className={`nav-link pb-3 text-center ${
            currentPage === "Reports" ? "active-link" : ""
          }`}
          active={currentPage === "Reports"}
        >
          <FaChartLine />
          <br />
          Reports
        </a>
        <a
          href="/settings"
          className={`nav-link pb-3 text-center ${
            currentPage === "Settings" ? "active-link" : ""
          }`}
        >
          <FaCog />
          <br />
          Settings
        </a>
        <a onClick={handleRefresh} className="nav-link pb-3 text-center">
          <FaSyncAlt />
          <br />
          Refresh
        </a>
      </div>
    </nav>
  );
}

export default Sidebar;
