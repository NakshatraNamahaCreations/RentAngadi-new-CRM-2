import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { ApiURL, ImageApiURL } from "../../api";
import { Button } from "react-bootstrap";
import axios from 'axios';
import { safeNumber } from "../../utils/numberUtils";
import { parseDate } from "../../utils/parseDates";

const QuotationInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();
  const { id } = useParams();

  const [quotation, setQuotation] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ApiURL}/quotations/getquotation/${id}`);
        console.clear();
        console.log(`Fetched quote: `, res.data.quoteData);
        const quoteData = res.data.quoteData;

        const enrichedItems = (quoteData.slots?.[0]?.Products || []).map(prod => {
          const start = parseDate(prod.productQuoteDate || quoteData.quoteDate);
          const end = parseDate(prod.productEndDate || quoteData.endDate);

          let days = 1;
          if (start && end) {
            const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            days = isNaN(diff) || diff < 1 ? 1 : diff;
          }

          const price = Number(prod.price) || 0;
          const qty = Number(prod.quantity) || 0;
          const total = price * qty * days;

          return {
            ...prod,
            days,
            pricePerUnit: price,
            amount: total,
          };
        });

        quoteData.slots[0].Products = enrichedItems;

        const productsTotal = enrichedItems.reduce(
          (sum, item) => sum + ((item.pricePerUnit || 0) * (item.quantity || 0) * (item.days || 1)),
          0
        );
        const transport = Number(quoteData.transportcharge || 0);
        const manpower = Number(quoteData.labourecharge || 0);
        const discountPercent = Number(quoteData.discount || 0);
        const gstPercent = Number(quoteData.GST || 0);

        const discountAmt = discountPercent ? (discountPercent / 100 * productsTotal) : 0;
        const afterDiscount = productsTotal - discountAmt;
        const totalWithCharges = afterDiscount + transport + manpower;
        const allSubTotal = totalWithCharges + safeNumber(quoteData?.refurbishment);
        const gstAmt = gstPercent ? (gstPercent / 100 * allSubTotal) : 0;
        const finalTotal = allSubTotal + gstAmt;

        const enrichedQuote = ({ ...quoteData, allProductsTotal: productsTotal, discountAmt, afterDiscount, totalWithCharges, allSubTotal, gstAmt, finalTotal });

        setQuotation(enrichedQuote);
        setItems(enrichedItems);
      } catch (error) {
        console.error("Error fetching quotation:", error);
        setQuotation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id]);

  if (loading) return <div className="container my-5"><h4>Loading Quotation Invoice...</h4></div>;
  if (!quotation) return <div className="container my-5"><h4>No quotation found</h4><Button onClick={() => navigate(-1)}>Go Back</Button></div>;

  const makeSafe = (val, fallback = "NA") => {
    if (!val && val !== 0) return fallback;
    return String(val).trim().replace(/[\/\\?%*:|"<>]/g, "").replace(/\s+/g, "_").slice(0, 120) || fallback;
  };

  const buildFilename = (parts = [], ext = "pdf") => {
    const name = parts.map((p) => makeSafe(p)).join("-").replace(/_+/g, "_");
    return `${name}.${ext}`;
  };

  const formatDateToMonthName = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${day} ${months[month - 1].slice(0, 3)} `;
  };

  // ONLY CHANGE: PERFECT PDF WITH NO CUT ROWS
  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;

    await Promise.all(
      Array.from(element.querySelectorAll("img")).map(img =>
        img.complete ? null : new Promise(r => { img.onload = r; img.onerror = r; })
      )
    );

    const table = element.querySelector("#productsTable");
    const tbody = table?.querySelector("tbody");
    const rows = Array.from(tbody?.querySelectorAll("tr") || []);
    const breakers = [];
    let heightUsed = 0;
    const pageLimit = 1050; // A4 safe height in pixels

    rows.forEach((row, i) => {
      if (i === 0) return;
      const h = row.offsetHeight || 65;
      heightUsed += h;
      if (heightUsed > pageLimit) {
        const breaker = document.createElement("tr");
        breaker.className = "pdf-break";
        breaker.innerHTML = `<td colspan="8" style="padding:0; border:none; height:0;"></td>`;
        tbody.insertBefore(breaker, row);
        breakers.push(breaker);
        heightUsed = h;
      }
    });

    await new Promise(r => setTimeout(r, 100));

    const filename = buildFilename([
      formatDateToMonthName(quotation.quoteDate),
      formatDateToMonthName(quotation.endDate),
      quotation?.executivename,
      quotation?.address,
      quotation?.clientName,
    ]);

    const options = {
      margin: [5, 5, 5, 5],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(options).from(element).save().then(() => {
      breakers.forEach(b => b.remove());
    });
  };

  return (
    <>
      {/* YOUR ORIGINAL BUTTON - VISIBLE & WORKING */}
      <div style={{ textAlign: 'right', padding: '10px 24px 0 0', background: '#f8f9fa' }}>
        <Button
          onClick={handleDownloadPDF}
          variant="success"
          size="lg"
          style={{ fontWeight: '600' }}
        >
          Download Quotation
        </Button>
      </div>

      {/* YOUR ORIGINAL INVOICE - 100% UNCHANGED + ID + CLASS */}
      <div
        ref={invoiceRef}
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 0,
          fontFamily: "Arial, sans-serif",
          margin: "20px auto",
          maxWidth: "900px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Quotation</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Company Name</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.clientName}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Client Name</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.executivename}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Slot</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.quoteTime}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Venue</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.address}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Delivery Date</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.quoteDate}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Dismantle Date</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.endDate}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>InchargeName</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.inchargeName || "N/A"}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 600 }}>Rent Angadi Point of Contact</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{quotation.inchargePhone || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        <table id="productsTable" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: '11.5px' }}>
          <thead style={{ backgroundColor: '#2F75B5', color: '#fff' }}>
            <tr>
              <th style={{ border: "1px solid #666", padding: "6px", width: "35px" }}>S.No</th>
              <th style={{ border: "1px solid #666", padding: "6px" }}>Product Name</th>
              <th style={{ border: "1px solid #666", padding: "6px", width: "110px" }}>Slot</th>
              <th style={{ border: "1px solid #666", padding: "6px", width: "60px" }}>Image</th>
              <th style={{ border: "1px solid #666", padding: "6px", width: "70px", textAlign: "right" }}>Price per Unit</th>
              <th style={{ border: "1px solid #666", padding: "6px", width: "45px" }}>No of units</th>
              <th style={{ border: "1px solid #666", padding: "6px", width: "45px" }}>No of days</th>
              <th style={{ border: "1px solid #666", padding: "6px", width: "85px", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((product, idx) => (
              <tr key={idx} className="no-split-row">
                <td style={{ border: "1px solid #666", padding: "6px", textAlign: "center" }}>{idx + 1}</td>
                <td style={{ border: "1px solid #666", padding: "6px" }}>{product.productName}</td>
                <td style={{ border: "1px solid #666", padding: "6px", fontSize: "10px" }}>{product.productSlot || quotation?.quoteTime}</td>
                <td style={{ border: "1px solid #666", padding: "4px", textAlign: "center" }}>
                  {product.ProductIcon && (
                    <img
                      src={`${ImageApiURL}/product/${product.ProductIcon}`}
                      alt={product.productName}
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td style={{ border: "1px solid #666", padding: "6px", textAlign: "right" }}>₹{Number(product.price).toLocaleString()}</td>
                <td style={{ border: "1px solid #666", padding: "6px", textAlign: "center" }}>{product.quantity}</td>
                <td style={{ border: "1px solid #666", padding: "6px", textAlign: "center" }}>{product.days}</td>
                <td style={{ border: "1px solid #666", padding: "6px", textAlign: "right" }}>
                  ₹{(product.pricePerUnit * product.quantity * product.days).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* YOUR ORIGINAL TOTALS - 100% SAME */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>
                {quotation?.discount != 0 ? "Total Amount before discount" : "Total amount"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{quotation?.allProductsTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            {quotation?.discount != 0 && (
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Discount ({quotation?.discount}%)</td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                  -₹{quotation?.discountAmt?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
            {quotation?.discount != 0 && (
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Total Amount After Discount</td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                  ₹{quotation?.afterDiscount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Transportation</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{quotation?.transportcharge?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Manpower Charge</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{quotation?.labourecharge?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Reupholestry</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{(quotation.refurbishment || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Sub-Total</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                ₹{(quotation.allSubTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
            {quotation?.GST != 0 && quotation?.GST > 0 && (
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>GST ({quotation?.GST}%)</td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                  ₹{quotation?.gstAmt?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold", backgroundColor: "#f8f9fa" }}>Grand Total</td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right", backgroundColor: "#f8f9fa" }}>
                ₹{quotation?.finalTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* <div style={{ fontSize: "11px", marginTop: 30 }}> */}
        <div className="notes-section" style={{ fontSize: "11px", marginTop: 30 }}>
          <strong>Note:</strong>
          <ol style={{ paddingLeft: 16 }}>
            <li>Additional elements would be charged on actuals, transportation would be additional.</li>
            <li>100% Payment for confirmation of event.</li>
            <li>Costing is merely for estimation purposes. Requirements are blocked post payment in full.</li>
            <li>If inventory is not reserved with payments, we are not committed to keep it.</li>
            <li><strong>The nature of the rental industry that our furniture is frequently moved and transported, which can lead to scratches on glass, minor chipping of paintwork, & minor stains etc. We ask you to visit the warehouse to inspect blocked furniture if you wish.</strong></li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default QuotationInvoice;