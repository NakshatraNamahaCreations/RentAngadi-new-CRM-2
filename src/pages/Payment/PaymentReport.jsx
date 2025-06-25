// import React, { useState, useEffect } from "react";
// import { Button, Card, Container, Form, Table } from "react-bootstrap";
// import moment from "moment";
// import { FaTrashAlt, FaFileExcel } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import Pagination from "../../components/Pagination";
// import axios from "axios";
// import { ApiURL } from "../../api";
// import { toast } from "react-hot-toast";

// const itemsPerPage = 10;

// const PaymentReport = () => {
//   const [payments, setPayments] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch payments on mount and when filters change
//   useEffect(() => {
//     fetchPayments();
//     // eslint-disable-next-line
//   }, []);

//   // Fetch payments from API
//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get(`${ApiURL}/payment/`);
//       if (res.status === 200) {
//         setPayments(res.data || []);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch payment reports.");
//     }
//   };

//   // Filter payments by search and date
//   const filteredPayments = payments.filter((payment) => {
//     const query = searchQuery.toLowerCase();
//     const isMatch =
//       (payment.quotationId?.quoteId || payment.quotationId || "")
//         .toString()
//         .toLowerCase()
//         .includes(query) ||
//       String(payment.totalAmount || payment.grandTotal || "").includes(query) ||
//       String(payment.advancedAmount || payment.advanceAmount || "").includes(query) ||
//       (payment.paymentMode || "").toLowerCase().includes(query) ||
//       (payment.paymentStatus || payment.status || "")
//         .toLowerCase()
//         .includes(query);

//     // Use createdAt or paymentDate
//     const paymentDate = payment.createdAt || payment.paymentDate;
//     const inDateRange =
//       (!fromDate || new Date(paymentDate) >= new Date(fromDate)) &&
//       (!toDate || new Date(paymentDate) <= new Date(toDate));

//     return isMatch && inDateRange;
//   });

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

//   // Row selection
//   const handleSelectRow = (id) => {
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (
//       selectedRows.length === currentItems.length &&
//       currentItems.length > 0
//     ) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(currentItems.map((p) => p._id || p.id));
//     }
//   };

//   // Delete selected payments
//   const handleDeleteSelected = async () => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedRows.length} selected payment(s)?`
//       )
//     )
//       return;
//     try {
//       await Promise.all(
//         selectedRows.map((id) =>
//           axios.delete(`${ApiURL}/payment/${id}`)
//         )
//       );
//       toast.success("Selected payments deleted.");
//       fetchPayments();
//       setSelectedRows([]);
//     } catch {
//       toast.error("Failed to delete selected payments.");
//     }
//   };

//   // Export to Excel
//   const handleExportToExcel = () => {
//     const exportData = filteredPayments.map((payment) => ({
//       "Payment Date": moment(payment.createdAt || payment.paymentDate).format(
//         "MM/DD/YYYY hh:mm A"
//       ),
//       "Payment ID": payment._id || payment.id,
//       "Quotation ID": payment.quotationId?.quoteId || payment.quotationId || "N/A",
//       "Grand Total": payment.totalAmount || payment.grandTotal,
//       "Advance Amount": payment.advancedAmount || payment.advanceAmount,
//       "Payment Mode": payment.paymentMode,
//       "Status": payment.paymentStatus || payment.status || "Confirm",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const file = new Blob([excelBuffer], {
//       type: "application/octet-stream",
//     });
//     saveAs(file, "Payment_Report.xlsx");
//   };

//   // Date filter effect
//   useEffect(() => {
//     setCurrentPage(1);
//     setSelectedRows([]);
//   }, [searchQuery, fromDate, toDate]);

//   return (
//     <Container style={{ background: "#F4F4F4", paddingBlock: "20px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between mb-3">
//         <div className="d-flex gap-2">
//           <Form.Control
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             size="sm"
//             style={{ fontSize: "12px" }}
//           />
//           <Form.Control
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             size="sm"
//             style={{ fontSize: "12px" }}
//           />
//         </div>
//         <div className="d-flex gap-2">
//           {filteredPayments.length > 0 && (
//             <Button
//               variant="success"
//               size="sm"
//               onClick={handleExportToExcel}
//               style={{ fontSize: "12px", padding: "6px 12px" }}
//             >
//               <FaFileExcel className="me-1" />
//               Export to Excel
//             </Button>
//           )}
//           {selectedRows.length > 0 && (
//             <Button
//               variant="outline-danger"
//               size="sm"
//               onClick={handleDeleteSelected}
//               style={{ fontSize: "12px", padding: "6px 12px" }}
//             >
//               <FaTrashAlt className="me-1" />
//               Delete {selectedRows.length} Selected
//             </Button>
//           )}
//         </div>
//       </div>

//       <Form.Control
//         type="text"
//         placeholder="Search by Quotation ID, Amount, Mode, Status"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="shadow-sm"
//         style={{ width: "300px", fontSize: "12px", marginBottom: "10px" }}
//       />

//       {/* Payment Table */}
//       <Card className="border-0 shadow-sm">
//         <div
//           className="table-responsive bg-white rounded-lg"
//           style={{ maxHeight: "65vh", overflowY: "auto" }}
//         >
//           <Table className="table table-hover align-middle">
//             <thead
//               className="text-white text-center"
//               style={{ backgroundColor: "#323D4F", fontSize: "12px" }}
//             >
//               <tr>
//                 <th style={{ width: "5%" }}>
//                   <Form.Check
//                     type="checkbox"
//                     checked={
//                       selectedRows.length === currentItems.length &&
//                       currentItems.length > 0
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//                 <th>Payment Date</th>
//                 <th>Payment ID</th>
//                 <th>Quotation ID</th>
//                 <th>Grand Total</th>
//                 <th>Advance Amount</th>
//                 <th>Payment Mode</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((payment) => {
//                 const id = payment._id || payment.id;
//                 return (
//                   <tr key={id} className="text-center">
//                     <td>
//                       <Form.Check
//                         type="checkbox"
//                         checked={selectedRows.includes(id)}
//                         onChange={() => handleSelectRow(id)}
//                       />
//                     </td>
//                     <td style={{ fontSize: "12px" }}>
//                       {moment(payment.createdAt || payment.paymentDate).format(
//                         "MM/DD/YYYY hh:mm A"
//                       )}
//                     </td>
//                     <td style={{ fontSize: "12px" }}>{id}</td>
//                     <td style={{ fontSize: "12px" }}>
//                       {payment.quotationId?.quoteId ||
//                         payment.quotationId ||
//                         "N/A"}
//                     </td>
//                     <td style={{ fontSize: "12px" }}>
//                       {payment.totalAmount || payment.grandTotal}
//                     </td>
//                     <td style={{ fontSize: "12px" }}>
//                       {payment.advancedAmount || payment.advanceAmount}
//                     </td>
//                     <td style={{ fontSize: "12px" }}>
//                       {payment.paymentMode}
//                     </td>
//                     <td style={{ fontSize: "12px" }}>
//                       {payment.paymentStatus || payment.status || "Confirm"}
//                     </td>
//                   </tr>
//                 );
//               })}
//               {currentItems.length === 0 && (
//                 <tr>
//                   <td colSpan="8" className="text-center text-muted">
//                     No payment records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>
//         <Pagination
//           totalItems={filteredPayments.length}
//           itemsPerPage={itemsPerPage}
//           currentPage={currentPage}
//           onPageChange={setCurrentPage}
//         />
//       </Card>
//     </Container>
//   );
// };

// export default PaymentReport;

import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import moment from "moment";
import { FaTrashAlt, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { ApiURL } from "../../api";
import { toast } from "react-hot-toast";

const itemsPerPage = 10;

const PaymentReport = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const today = moment().format("YYYY-MM-DD");
  const twoMonthsAgo = moment().subtract(2, "months").format("YYYY-MM-DD");

  // Fetch payments on mount and when filters change
  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${ApiURL}/payment/`);
      if (res.status === 200) {
        setPayments(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch payment reports.");
    }
  };

  // Filter payments by search and date
  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    const isMatch =
      (payment.quotationId?.quoteId || payment.quotationId || "")
        .toString()
        .toLowerCase()
        .includes(query) ||
      String(payment.totalAmount || payment.grandTotal || "").includes(query) ||
      String(payment.advancedAmount || payment.advanceAmount || "").includes(
        query
      ) ||
      (payment.paymentMode || "").toLowerCase().includes(query) ||
      (payment.paymentStatus || payment.status || "")
        .toLowerCase()
        .includes(query);

    // Use createdAt or paymentDate
    const paymentDate = payment.createdAt || payment.paymentDate;
    const inDateRange =
      (!fromDate || new Date(paymentDate) >= new Date(fromDate)) &&
      (!toDate || new Date(paymentDate) <= new Date(toDate));

    return isMatch && inDateRange;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Row selection
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (
      selectedRows.length === currentItems.length &&
      currentItems.length > 0
    ) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((p) => p._id || p.id));
    }
  };

  // Delete selected payments
  const handleDeleteSelected = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.length} selected payment(s)?`
      )
    )
      return;
    try {
      await Promise.all(
        selectedRows.map((id) => axios.delete(`${ApiURL}/payment/${id}`))
      );
      toast.success("Selected payments deleted.");
      fetchPayments();
      setSelectedRows([]);
    } catch {
      toast.error("Failed to delete selected payments.");
    }
  };

  // Export to Excel
  const handleExportToExcel = () => {
    const exportData = filteredPayments.map((payment) => ({
      "Payment Date": moment(payment.createdAt || payment.paymentDate).format(
        "MM/DD/YYYY hh:mm A"
      ),
      "Payment ID": payment._id || payment.id,
      "Quotation ID":
        payment.quotationId?.quoteId || payment.quotationId || "N/A",
      "Grand Total": payment.totalAmount || payment.grandTotal,
      "Advance Amount": payment.advancedAmount || payment.advanceAmount,
      "Payment Mode": payment.paymentMode,
      Status: payment.paymentStatus || payment.status || "Confirm",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(file, "Payment_Report.xlsx");
  };

  // Date filter effect
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [searchQuery, fromDate, toDate]);

  return (
    <Container style={{ background: "#F4F4F4", paddingBlock: "20px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Quotation ID, Amount, Mode, Status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="shadow-sm"
          style={{ width: "300px", fontSize: "12px", marginBottom: "10px" }}
        />
        <div className="d-flex gap-2">
          <Form.Control
            type="date"
            value={fromDate}
            min={twoMonthsAgo}
            max={today}
            onChange={(e) => setFromDate(e.target.value)}
            size="sm"
            style={{ fontSize: "12px" }}
          />
          <Form.Control
            type="date"
            value={toDate}
            min={twoMonthsAgo}
            max={today}
            onChange={(e) => setToDate(e.target.value)}
            size="sm"
            style={{ fontSize: "12px" }}
          />
        </div>

      
      </div>

      {/* Payment Table */}
      <Card className="border-0 shadow-sm">
        <div
          className="table-responsive bg-white rounded-lg"
          style={{ maxHeight: "65vh", overflowY: "auto" }}
        >
          <Table className="table table-hover align-middle">
            <thead
              className="text-white text-center"
              style={{ backgroundColor: "#323D4F", fontSize: "12px" }}
            >
              <tr>
                <th style={{ width: "5%" }}>
                  <Form.Check
                    type="checkbox"
                    checked={
                      selectedRows.length === currentItems.length &&
                      currentItems.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Payment Date</th>
                <th>Payment ID</th>
                <th>Quotation ID</th>
                <th>Grand Total</th>
                <th>Advance Amount</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((payment) => {
                const id = payment._id || payment.id;
                return (
                  <tr key={id} className="text-center">
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedRows.includes(id)}
                        onChange={() => handleSelectRow(id)}
                      />
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {moment(payment.createdAt || payment.paymentDate).format(
                        "MM/DD/YYYY hh:mm A"
                      )}
                    </td>
                    <td style={{ fontSize: "12px" }}>{id}</td>
                    <td style={{ fontSize: "12px" }}>
                      {payment.quotationId?.quoteId ||
                        payment.quotationId ||
                        "N/A"}
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {payment.totalAmount || payment.grandTotal}
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {payment.advancedAmount || payment.advanceAmount}
                    </td>
                    <td style={{ fontSize: "12px" }}>{payment.paymentMode}</td>
                    <td style={{ fontSize: "12px" }}>
                      {payment.paymentStatus || payment.status || "Confirm"}
                    </td>
                  </tr>
                );
              })}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <Pagination
          totalItems={filteredPayments.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Card>
    </Container>
  );
};

export default PaymentReport;
