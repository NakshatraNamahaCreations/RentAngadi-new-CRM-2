import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
} from "react-bootstrap";
import axios from "axios";
import Select from "react-select"; // Import react-select
import { ApiURL } from "../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const InventoryProduct = () => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [dismantleDate, setDismantleDate] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiURL}/product/getProducts`);
        const productOptions = response.data.Product.map((product) => ({
          value: product._id,
          label: product.ProductName,
        }));
        setProducts(productOptions);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle product selection
  const handleProductSelect = (selectedOptions) => {
    setSelectedProducts(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  // Handle fetching inventory based on selected products and dates
  const handleFetchInventory = async () => {
    if (!deliveryDate || !dismantleDate) {
      alert("Please select both Delivery Date and Dismantle Date.");
      return;
    }

    try {
      const response = await axios.get(`${ApiURL}/inventory/filter/`, {
        params: {
          startDate: format(deliveryDate, 'dd-MM-yyyy'),
          endDate: format(dismantleDate, 'dd-MM-yyyy'),
          products: selectedProducts.join(","),
        },
      });
      setInventory(response.data.stock);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  return (
    <Container className="my-4">
      <Card className="shadow-sm p-4">
        <h5 className="mb-4 text-dark">Filter Inventory</h5>
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Group controlId="deliveryDate">
              <Form.Label style={{ fontSize: "14px" }}>
                Delivery Date
              </Form.Label>
              {/* <Form.Control
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                size="sm"
              /> */}
              <DatePicker
                selected={deliveryDate} // Default to initial quoteDate
                onChange={(date) => {
                  setDeliveryDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="DD/MM/YYYY"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="dismantleDate">
              <Form.Label style={{ fontSize: "14px" }}>
                Dismantle Date
              </Form.Label>
              <DatePicker
                selected={dismantleDate} // Default to initial quoteDate
                onChange={(date) => {
                  setDismantleDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="DD/MM/YYYY"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            {/* Product selection */}
            <h6 className="text-dark">Select Products</h6>
            <Select
              isMulti
              options={products}
              value={products.filter((product) =>
                selectedProducts.includes(product.value)
              )}
              onChange={handleProductSelect}
              placeholder="Select products"
              getOptionLabel={(e) => e.label}
              getOptionValue={(e) => e.value}
            />
          </Col>
        </Row>

        <div className="w-25 d-flex justify-content-end">
          <Button
            variant="success"
            size="sm"
            className="w-100"
            onClick={handleFetchInventory}
          >
            Fetch Filtered Inventory
          </Button>
        </div>

        {/* Display the selected inventory */}
        {inventory.length > 0 && (
          <Row className="mt-4">
            <Col md={12}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Available Stock</th>
                    <th>Reserved Stock</th>
                    <th>Total Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td>{item.availableStock}</td>
                      <td>{item.reservedStock}</td>
                      <td>{item.totalStock}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </Card>
    </Container>
  );
};

export default InventoryProduct;
