import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { ImageApiURL } from "../../api";

const QuotationInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  // Get quotation data from navigation state
  console.log("Quotation data:", location.state);
  const quotation = location.state?.quotation;
  const items = location.state?.items || [];
  const productDates = location.state?.productDates || {};


  if (!quotation) {
    return (
      <div className="container my-5">
        <h3>No Quotation Data Provided</h3>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity * (item.days || 1),
    0
  );
  const transport = Number(quotation.transportcharge || 0);
  const manpower = Number(quotation.labourecharge || 0);
  const discountPercent = Number(quotation.discount || 0);
  const gstPercent = Number(quotation.GST || 0);

  const afterCharges = subtotal + transport + manpower;
  const discountAmt = afterCharges * (discountPercent / 100);
  const afterDiscount = afterCharges - discountAmt;
  const gstAmt = afterDiscount * (gstPercent / 100);
  const grandTotal = Math.round(afterDiscount + gstAmt);

  // PDF Download
  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const options = {
      margin: [0.5, 0.5, 0.8, 0.5],
      filename: `Quotation_${quotation.quoteId || "invoice"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="container my-5">
      <div ref={invoiceRef} style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
        {/* Header */}
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>
          Quotation
        </h2>
        {/* Download Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary mt-4" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div>
            <strong>Client Name:</strong> {quotation.clientName}
          </div>
          <div>
            <strong>Contact Number:</strong> {quotation.clientNo}
          </div>
          <div>
            <strong>Executive Name:</strong> {quotation.executivename}
          </div>
          <div>
            <strong>Client address:</strong> {quotation.placeaddress}
          </div>
          <div>
            <strong>Venue Address:</strong> {quotation.address}
          </div>
          {/* <div>
            <strong>Status:</strong> {quotation.status}
          </div> */}
        </div>

        {/* Product Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Product</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Slot</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Image</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Price(Rs)</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Qty</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Days</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Total(Rs)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((product, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{product.productName}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{productDates[product.productId]?.productSlot ||
                  quotation?.quoteTime}
                  {"    "}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {product.image ? (
                    <img
                      src={
                        product.image
                          ? `${ImageApiURL}/product/${product.image}`
                          : "https://cdn-icons-png.flaticon.com/512/1532/1532801.png"
                      }
                      alt={product.productName}
                      style={{ width: 50, height: 50, objectFit: "contain" }}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {product.pricePerUnit}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{product.quantity}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{product.days}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {(product.pricePerUnit * product.quantity * (product.days || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        <div className="d-flex justify-content-between mb-2">
          <span style={{ fontWeight: "600" }}>Products Total:</span>
          <span style={{ fontWeight: "600" }}>
            ₹
            {/* {items
                .reduce((sum, item) => sum + (item.amount || 0), 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
            {items
              .reduce((sum, item) => sum + (item.amount * item?.days || 0), 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        {/* {quotation?.discount != 0 && <div className="d-flex justify-content-between mb-2">
            <span>Discount ({(quotation.discount || 0).toFixed(2)}%):</span>
            <span>{(quotation.discount || 0).toFixed(2)}</span>
          </div>} */}
        <div className="d-flex justify-content-between mb-2">
          <span>Transportation:</span>
          <span>₹{(quotation.transportcharge || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Manpower Charge:</span>
          <span>₹{(quotation.labourecharge || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="d-flex justify-content-between mb-2" style={{ fontWeight: "600" }}>
          <span>Total amount:</span>
          <span>₹{(quotation.totalWithCharges || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        {quotation?.discount != 0 && <div className="d-flex justify-content-between mb-2">
          <span>Discount ({(quotation.discount || 0).toFixed(2)}%):</span>
          <span>-₹{(quotation.discount / 100 * quotation.totalWithCharges).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>}
        {quotation?.discount != 0 && <div className="d-flex justify-content-between mb-2" style={{ fontWeight: "600" }}>
          <span>Total amount after discount:</span>
          <span>₹{(quotation.afterDiscount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>}
        {/* <div className="d-flex justify-content-between mb-2">
            <span>Round Off:</span>
            <span>
              ₹{(quotation.adjustments || quotation.roundOff || 0).toFixed(2)}
            </span>
          </div> */}
        <div className="d-flex justify-content-between mb-2">
          <span>GST ({(quotation?.GST || 0).toFixed(2)}%):</span>
          <span>₹{(quotation?.gstAmt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <hr style={{ borderColor: "#e0e0e0" }} />
        <div
          className="d-flex justify-content-between"
          style={{ fontSize: "18px", fontWeight: "700", color: "#34495e" }}
        >
          <span>Grand Total:</span>
          {/* <span>
              ₹
              {(quotation.GrandTotal || quotation.grandTotal || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span> */}
          <span>
            ₹{(quotation?.finalTotal ?? 0)
              .toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
          </span>
        </div>
      </div>

    </div>
  );
};

export default QuotationInvoice;