import React, { useState } from 'react';
import axios from 'axios';
import { Container, Table, Card, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { ApiURL } from '../../api';
import * as XLSX from 'xlsx'; // Import the xlsx library

const ProductReports = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'totalRevenue', direction: 'desc' });

  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const fetchReport = async () => {
    if (!selectedYear || !selectedMonth) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${ApiURL}/report/productReportByMonth`, {
        year: selectedYear,
        month: selectedMonth,
      });
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (key !== sortConfig.key) return null;
    return <span className="ms-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>;
  };

  const sortProducts = (products) => {
    const { key, direction } = sortConfig;
    return [...products].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (typeof aVal === 'number') {
        aVal = aVal ?? 0;
      } else {
        aVal = aVal ? aVal.toString().toLowerCase() : '';
      }

      if (typeof bVal === 'number') {
        bVal = bVal ?? 0;
      } else {
        bVal = bVal ? bVal.toString().toLowerCase() : '';
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const currencyFormat = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  const exportToExcel = () => {
    // Prepare data for Excel
    const productsData = reportData.flatMap((monthData) =>
      monthData.products.map((product) => ({
        'Product Name': product.name,
        'Total Revenue': currencyFormat(product.totalRevenue),
        // Uncomment below to include more columns
        // 'Unit Price': currencyFormat(product.price)
      }))
    );

    const ws = XLSX.utils.json_to_sheet(productsData);  // Convert JSON to worksheet
    const wb = XLSX.utils.book_new();  // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Product Report');  // Append the worksheet to the workbook

    // Generate and download the Excel file
    XLSX.writeFile(wb, `Product_Report_${selectedYear}_${selectedMonth}.xlsx`);
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white fw-bold fs-5">
          Product Reports
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="">Select Year</option>
                {years.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="">Select Month</option>
                {months.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Form.Select>
            </Col>

          </Row>

          <Row className="mb-4">
            <Col md={4}>
              <Button
                variant="primary"
                className="w-100"
                onClick={fetchReport}
                disabled={loading || !selectedYear || !selectedMonth}
                style={{
                  width: '100%',
                  backgroundColor: "#BD5525",
                  border: "#BD5525",
                  padding: '8px 16px',
                  fontSize: '14px'
                }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Generate Report'}
              </Button>
            </Col>
            <Col md={12}>
              <Button
                variant="success"
                onClick={exportToExcel}
                disabled={loading || reportData.length === 0}
                style={{
                  backgroundColor: '#28a745',
                  borderColor: '#28a745',
                }}
              >
                Export to Excel
              </Button>
            </Col>
          </Row>

          <Table striped bordered responsive hover>
            <thead className="table-light">
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Product Name {getSortIcon('name')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('totalRevenue')}>
                  Total Revenue {getSortIcon('totalRevenue')}
                </th>
              </tr>
            </thead>
            <tbody>
              {(!loading && reportData.length === 0) ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No data available. Please select year and month.
                  </td>
                </tr>
              ) : (
                reportData.map((monthData, mIndex) =>
                  sortProducts(monthData.products).map((product, pIndex) => (
                    <tr key={`${mIndex}-${pIndex}`}>
                      <td>{product.name}</td>
                      <td>{currencyFormat(product.totalRevenue)}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductReports;
