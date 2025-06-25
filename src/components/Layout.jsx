import { useState } from "react";
import Sidebars from "./Sidebars";
import Header from "./Header";

const Layout = ({ children }) => {

  return (
    <>
    
      <div className="d-flex hide-scrollbar ">
        <div className="col-md-2">
          <Sidebars />
        </div>
        <div className="col-md-10">
          <div className="flex-grow-1 ms-5" style={{ marginLeft: "320px" }}>
            <Header />
            <div className="px-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
