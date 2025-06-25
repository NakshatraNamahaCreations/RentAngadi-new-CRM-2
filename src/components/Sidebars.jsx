// import { Link, useLocation } from "react-router-dom";
// import {
//   FaClipboardList,
//   FaTags,
//   FaBoxOpen,
//   FaUserFriends,
//   FaShoppingBag,
//   FaCalendarAlt,
//   FaFileInvoiceDollar,
//   FaFileContract,
//   FaChartBar,
//   FaTools,
// } from "react-icons/fa";
// import {
//   MdDashboard,
//   MdInventory,
//   MdOutlineSupportAgent,
// } from "react-icons/md";
// import logo from "../assets/RentangadiLogo1.png";

// const Sidebars = () => {
//   const location = useLocation();

//   // const menuItems = [
//   //   { name: "Dashboard", path: "/dashboard", icon: MdDashboard },

//   //   { name: "Master", path: "/master", icon: FaClipboardList },
//   //   { name: "Banner", path: "/banner", icon: FaTags },
//   //   {
//   //     name: "Product Management",
//   //     path: "/product-management",
//   //     icon: FaBoxOpen,
//   //   },
//   //   { name: "Clients", path: "/client", icon: FaUserFriends },
//   //   { name: "Orders", path: "/orders", icon: FaShoppingBag },
//   //   {
//   //     name: "Enquiry List",
//   //     path: "/enquiry-list",
//   //     icon: MdOutlineSupportAgent,
//   //   },
//   //   {
//   //     name: "Enquiry Calendar",
//   //     path: "/enquiry-calender",
//   //     icon: FaCalendarAlt,
//   //   },
//   //   { name: "Quotation", path: "/quotation", icon: FaFileInvoiceDollar },
//   //   {
//   //     name: "Terms & Conditions",
//   //     path: "/terms-conditions",
//   //     icon: FaFileContract,
//   //   },
//   //   { name: "Payment Report", path: "/payment-report", icon: FaChartBar },
//   //   {
//   //     name: "Refurbishment Report",
//   //     path: "/refurbihsment-report",
//   //     icon: FaTools,
//   //   },
//   //   {
//   //     name: "Inventory Product List",
//   //     path: "/inventory-product-list",
//   //     icon: MdInventory,
//   //   },
//   // ];

//     const menuItems = [
//     { name: "Dashboard", path: "/dashboard", icon: MdDashboard },

//     { name: "Master", path: "/master", icon: FaClipboardList },
//     { name: "Banner", path: "/banner", icon: FaTags },
//     {
//       name: "Product Management",
//       path: "/product-management",
//       icon: FaBoxOpen,
//     },
//     { name: "Clients", path: "/client", icon: FaUserFriends },
//     {
//       name: "Enquiry List",
//       path: "/enquiry-list",
//       icon: MdOutlineSupportAgent,
//     },
//     {
//       name: "Enquiry Calendar",
//       path: "/enquiry-calender",
//       icon: FaCalendarAlt,
//     },
//     { name: "Quotation", path: "/quotation", icon: FaFileInvoiceDollar },
//     { name: "Orders", path: "/orders", icon: FaShoppingBag },
//     {
//       name: "Terms & Conditions",
//       path: "/terms-conditions",
//       icon: FaFileContract,
//     },
//     { name: "Payment Report", path: "/payment-report", icon: FaChartBar },
//     {
//       name: "Refurbishment Report",
//       path: "/refurbihsment-report",
//       icon: FaTools,
//     },
//     {
//       name: "Inventory Product List",
//       path: "/inventory-product-list",
//       icon: MdInventory,
//     },
//   ];

//   const isActiveLink = (path) => {
//     return location.pathname.includes(path);
//   };

//   return (
//     <div
//       className="flex-column flex-shrink-0 p-3 vh-100 position-fixed sidebar-scroll"
//       style={{
//         width: "20%",
//         zIndex: 1,
//         background: "#323D4F",
//         overflowY: "auto",
//         overflowX: "hidden",
//       }}
//     >
//       <div className="w-100 d-flex justify-content-center">
//         <Link to="/dashboard">
//           <img
//             src={logo}
//             alt="logo"
//             style={{ width: "120px" }}
//             className="mx-auto"
//           />
//         </Link>
//       </div>

//       <ul className="nav flex-column mt-2">
//         {menuItems.map((item, index) => (
//           <li key={index} className="nav-item my-1">
//             <Link
//               to={item.path}
//               className={`${
//                 isActiveLink(item.path) ? "bg-dark text-dark" : ""
//               } nav-link d-flex align-items-center text-white`}
//             >
//               <item.icon className="me-2" />
//               {item.name}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebars;



import { Link, useLocation } from "react-router-dom";
import {
  FaClipboardList,
  FaTags,
  FaBoxOpen,
  FaUserFriends,
  FaShoppingBag,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaFileContract,
  FaChartBar,
  FaTools,
  FaChartLine,
} from "react-icons/fa";
import {
  MdDashboard,
  MdInventory,
  MdOutlineSupportAgent,
} from "react-icons/md";
import logo from "../assets/RentangadiLogo1.png";

const Sidebars = () => {
  const location = useLocation();

  // const menuItems = [
  //   { name: "Dashboard", path: "/dashboard", icon: MdDashboard },

  //   { name: "Master", path: "/master", icon: FaClipboardList },
  //   { name: "Banner", path: "/banner", icon: FaTags },
  //   {
  //     name: "Product Management",
  //     path: "/product-management",
  //     icon: FaBoxOpen,
  //   },
  //   { name: "Clients", path: "/client", icon: FaUserFriends },
  //   { name: "Orders", path: "/orders", icon: FaShoppingBag },
  //   {
  //     name: "Enquiry List",
  //     path: "/enquiry-list",
  //     icon: MdOutlineSupportAgent,
  //   },
  //   {
  //     name: "Enquiry Calendar",
  //     path: "/enquiry-calender",
  //     icon: FaCalendarAlt,
  //   },
  //   { name: "Quotation", path: "/quotation", icon: FaFileInvoiceDollar },
  //   {
  //     name: "Terms & Conditions",
  //     path: "/terms-conditions",
  //     icon: FaFileContract,
  //   },
  //   { name: "Payment Report", path: "/payment-report", icon: FaChartBar },
  //   {
  //     name: "Refurbishment Report",
  //     path: "/refurbihsment-report",
  //     icon: FaTools,
  //   },
  //   {
  //     name: "Inventory Product List",
  //     path: "/inventory-product-list",
  //     icon: MdInventory,
  //   },
  // ];

    const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: MdDashboard },

    { name: "Master", path: "/master", icon: FaClipboardList },
    { name: "Banner", path: "/banner", icon: FaTags },
    {
      name: "Product Management",
      path: "/product-management",
      icon: FaBoxOpen,
    },
    { name: "Clients", path: "/client", icon: FaUserFriends },
    {
      name: "Enquiry List",
      path: "/enquiry-list",
      icon: MdOutlineSupportAgent,
    },
    {
      name: "Enquiry Calendar",
      path: "/enquiry-calender",
      icon: FaCalendarAlt,
    },
    { name: "Quotation", path: "/quotation", icon: FaFileInvoiceDollar },
    { name: "Orders", path: "/orders", icon: FaShoppingBag },
    {
      name: "Terms & Conditions",
      path: "/terms-conditions",
      icon: FaFileContract,
    },
    { name: "Payment Report", path: "/payment-report", icon: FaChartBar },
    {
      name: "Refurbishment Report",
      path: "/refurbihsment-report",
      icon: FaTools,
    },
    {
      name: "Inventory Product List",
      path: "/inventory-product-list",
      icon: MdInventory,
    },
    {
      name: "Product Reports",
      path: "/product-reports",
      icon: FaChartLine,
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div
      className="flex-column flex-shrink-0 p-3 vh-100 position-fixed sidebar-scroll"
      style={{
        width: "20%",
        zIndex: 1,
        background: "#323D4F",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="w-100 d-flex justify-content-center">
        <Link to="/dashboard">
          <img
            src={logo}
            alt="logo"
            style={{ width: "120px" }}
            className="mx-auto"
          />
        </Link>
      </div>

      <ul className="nav flex-column mt-2">
        {menuItems.map((item, index) => (
          <li key={index} className="nav-item my-1">
            <Link
              to={item.path}
              className={`${
                isActiveLink(item.path) ? "bg-dark text-dark" : ""
              } nav-link d-flex align-items-center text-white`}
            >
              <item.icon className="me-2" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebars;
