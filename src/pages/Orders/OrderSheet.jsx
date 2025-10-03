import React, { useRef } from "react";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { ImageApiURL } from "../../api";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

const OrderSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const order = location.state?.order;
  const items = location.state?.items || [];
  const productDates = location.state?.productDates || {};

  console.log(`order from state: `, order);

  if (!order) {
    return (
      <div className="container my-5">
        <h3>No Order Data Provided</h3>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>
          Go Back
        </button>
      </div>
    );
  }

  // // Calculate products total
  // const productsTotal = items.reduce((sum, item) => sum + (item.amount * item.days || 0), 0);
  // const transport = Number(order.transportcharge || 0);
  // const manpower = Number(order.labourecharge || 0);
  // const discountPercent = Number(order.discount || 0);
  // const gstPercent = Number(order.GST || 0);

  // // Calculate totals in the new order
  // const discountAmt = discountPercent ? (discountPercent / 100 * productsTotal) : 0;
  // const afterDiscount = productsTotal - discountAmt;
  // const totalWithCharges = afterDiscount + transport + manpower;
  // const gstAmt = gstPercent ? (gstPercent / 100 * totalWithCharges) : 0;
  // const finalTotal = Math.round(totalWithCharges + gstAmt);

  const makeSafe = (val, fallback = "NA") => {
    if (!val && val !== 0) return fallback;
    return String(val)
      .trim()
      .replace(/[\/\\?%*:|"<>]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 120) || fallback;
  };

  // build filename from an array of parts and return with extension
  const buildFilename = (parts = [], ext = "pdf") => {
    const name = parts.map((p) => makeSafe(p)).join("-").replace(/_+/g, "_");
    return `${name}.${ext}`;
  };

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const filename = buildFilename([
      formatDateToMonthName(order.slots[0]?.quoteDate),
      formatDateToMonthName(order.slots[0]?.endDate),
      order?.executivename,
      order?.Address,
      order?.clientName,
    ]);
    const options = {
      margin: [0.05, 0.05, 0.05, 0.05],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  const formatDateToMonthName = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${day} ${months[month - 1].slice(0, 3)} `;
  };

  const startStr = order?.slots?.[0]?.quoteDate || order?.quoteDate;
  const endStr = order?.slots?.[0]?.endDate || order?.endDate;
  const startMoment = startStr ? moment(startStr, "DD-MM-YYYY", true) : null;
  const endMoment = endStr ? moment(endStr, "DD-MM-YYYY", true) : null;
  const numDays = startMoment && endMoment && startMoment.isValid() && endMoment.isValid()
    ? Math.max(1, endMoment.diff(startMoment, "days") + 1)
    : 1;

  return (
    <div className="container my-5">
      <Button
        onClick={handleDownloadPDF}
        variant="success"
        className="my-1 d-flex ms-auto"
      >
        Download Order Sheet
      </Button>
      <div className="no-print" ref={invoiceRef} style={{ background: "#fff", padding: 24, borderRadius: 0, fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Order Sheet</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Company Name</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order.clientName}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Client Name</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order.executivename}</td>
            </tr>
            <tr>
              {/* <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Occasion</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order.occasion}</td> */}
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Slot</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order?.slots[0]?.slotName}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Venue</td><td colSpan="3" style={{ border: '1px solid #ccc', padding: '6px' }}>{order.Address}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Delivery Date</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order?.slots[0]?.quoteDate}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Dismantle Date</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order?.slots[0]?.endDate}</td>
              {/* <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>No of days</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{numDays}</td> */}
            </tr>
            {/* <tr>
            </tr> */}
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>InchargeName</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order.inchargeName || "N/A"}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>InchargePhone</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order.inchargePhone || "N/A"}</td>
            </tr>
            <tr>
              {/* <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Additional Logistics Support</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{order.additionalLogisticsSupport}</td> */}
            </tr>
          </tbody>
        </table>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: '13px' }}>
          <thead style={{ backgroundColor: '#2F75B5', color: '#fff' }}>
            <tr>
              <th style={{ border: "1px solid #666", padding: 8, width: '50px' }}>S.No</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>Product Name</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>Slot</th>
              <th style={{ border: "1px solid #666", padding: 8, width: '80px' }}>Image</th>
              {/* <th style={{ border: "1px solid #666", padding: 8 }}>Price per Unit</th> */}
              <th style={{ border: "1px solid #666", padding: 8 }}>No of units</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>No of days</th>
              {/* <th style={{ border: "1px solid #666", padding: 8, textAlign: "right" }}>Amount</th> */}
            </tr>
          </thead>
          <tbody>
            {items.map((product, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #666", padding: 8 }}>{idx + 1}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.productName}</td>
                {/* <td style={{ border: "1px solid #666", padding: 8 }}>{productDates[product.productId]?.productSlot || order?.quoteTime}</td> */}
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.productSlot || order?.quoteTime}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>
                  {product.image && (
                    <img
                      src={`${ImageApiURL}/product/${product.image}`}
                      alt={product.productName}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                {/* <td style={{ border: "1px solid #666", padding: 8 }}>{product.pricePerUnit}</td> */}
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.quantity}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.days}</td>
                {/* <td style={{ border: "1px solid #666", padding: 8, textAlign: "right" }}>{product.amount * product.days}</td> */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>{order?.discount != 0 ? "Total Amount before discount" : "Total amount"}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{order?.discount != 0 ? (order?.allProductsTotal || productsTotal)?.toLocaleString(undefined, { minimumFractionDigits: 2 }) : productsTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            {order?.discount != 0 && (
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Discount ({order?.discount}%)</td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                  -₹{(order?.discountAmt || (order?.discount / 100) * productsTotal)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
            {order?.discount != 0 && (<tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Total Amount After Discount</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{(order?.afterDiscount || (productsTotal - ((order?.discount || 0) / 100) * productsTotal))?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>)}
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Transportation</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{order?.transportcharge?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Manpower Charge</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{order?.labourecharge?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Reupholestry</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{(order.refurbishmentAmount || order.refurbishment || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            {order?.GST != 0 && order?.GST > 0 && (
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>GST ({order?.GST}%)</td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                  ₹{(order?.gstAmt || ((order?.GST || 0) / 100) * (productsTotal - ((order?.discount || 0) / 100) * productsTotal + (order?.transportcharge || 0) + (order?.labourecharge || 0) + (order?.refurbishmentAmount || order?.refurbishment || 0)))?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold", backgroundColor: "#f8f9fa" }}>Grand Total</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right", backgroundColor: "#f8f9fa" }}>
                ₹{(order?.finalTotal || Math.round((productsTotal - ((order?.discount || 0) / 100) * productsTotal + (order?.transportcharge || 0) + (order?.labourecharge || 0) + (order?.refurbishmentAmount || order?.refurbishment || 0)) * (1 + (order?.GST || 0)/100)))?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table> */}

        <div style={{ fontSize: "11px", marginTop: 30 }}>
          <strong>Note:</strong>
          <ol style={{ paddingLeft: 16 }}>
            <li>Additional elements would be charged on actuals, transportation would be additional.</li>
            <li>100% Payment for confirmation of event.</li>
            <li>Costing is merely for estimation purposes. Requirements are blocked post payment in full.</li>
            <li>If inventory is not reserved with payments, we are not committed to keep it.</li>
            <li><strong>The nature of the rental industry that our furniture is frequently moved and transported, which can lead to scratches on glass, minor chipping of paintwork, & minor stains etc. We ask you to visit the warehouse to inspect blocked furniture if you wish.</strong></li>
          </ol>
        </div>

        {/* <div style={{ textAlign: 'right', marginTop: 20 }}> */}
        {/* <button className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default OrderSheet;
