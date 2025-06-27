import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { ImageApiURL } from "../../api";

const QuotationInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity * (item.days || 1), 0);
  const transport = Number(quotation.transportcharge || 0);
  const manpower = Number(quotation.labourecharge || 0);
  const discountPercent = Number(quotation.discount || 0);
  const gstPercent = Number(quotation.GST || 0);

  const afterCharges = subtotal + transport + manpower;
  const discountAmt = afterCharges * (discountPercent / 100);
  const afterDiscount = afterCharges - discountAmt;
  const gstAmt = afterDiscount * (gstPercent / 100);
  const grandTotal = Math.round(afterDiscount + gstAmt);

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
      <div ref={invoiceRef} style={{ background: "#fff", padding: 24, borderRadius: 0, fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Quotation Invoice</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Company Name</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.executivename}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Client Name</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.clientName}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Occasion</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.occasion}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Venue</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.address}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Delivery Date & time</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.deliveryDateTime}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Dismantle Date & time</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.dismantleDateTime}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Manpower Support</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.manpowerSupport}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Additional Logistics Support</td><td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.additionalLogisticsSupport}</td>
            </tr>
          </tbody>
        </table>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: '13px' }}>
          <thead style={{ backgroundColor: '#2F75B5', color: '#fff' }}>
            <tr>
              <th style={{ border: "1px solid #666", padding: 8 }}>Sl No</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>Elements</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>Price per Unit</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>No of units</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>No of days</th>
              <th style={{ border: "1px solid #666", padding: 8 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((product, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #666", padding: 8 }}>{idx + 1}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.productName}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.price}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.quantity}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.days}</td>
                <td style={{ border: "1px solid #666", padding: 8 }}>{product.price * product.quantity * product.days}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ maxWidth: 300, marginLeft: 'auto', fontSize: '13px' }}>
          <div className="d-flex justify-content-between mb-2"><span>Total Before Discount</span><span>₹{subtotal}</span></div>
          <div className="d-flex justify-content-between mb-2"><span>Discount {discountPercent}%</span><span>-₹{discountAmt.toFixed(2)}</span></div>
          <div className="d-flex justify-content-between mb-2"><span>Total After Discount</span><span>₹{afterDiscount.toFixed(2)}</span></div>
          <div className="d-flex justify-content-between mb-2"><span>Transportation</span><span>₹{transport}</span></div>
          <div className="d-flex justify-content-between mb-2"><span>Manpower Cost</span><span>₹{manpower}</span></div>
          <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 600 }}><span>Total</span><span>₹{afterCharges.toFixed(2)}</span></div>
          <div className="d-flex justify-content-between mb-2"><span>GST {gstPercent}%</span><span>₹{gstAmt.toFixed(2)}</span></div>
          <div className="d-flex justify-content-between" style={{ fontWeight: '700', fontSize: 14, background: '#D9D9D9', padding: '4px', marginTop: '4px' }}><span>GRAND TOTAL</span><span>₹{grandTotal}</span></div>
        </div>

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

        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default QuotationInvoice;
