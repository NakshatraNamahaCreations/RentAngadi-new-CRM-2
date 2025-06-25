import React, { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Card,
  InputGroup,
} from "react-bootstrap";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { ApiURL } from "../../api";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState({
    companyName: "",
    contactPersonNumber: "",
    email: "",
    address: "",
  });

  const [executives, setExecutives] = useState([{ name: "", phone: "" }]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleExecutiveChange = (index, field, value) => {
    const updated = [...executives];
    updated[index][field] = value;
    setExecutives(updated);
  };

  const addExecutive = () => {
    setExecutives([...executives, { name: "", phone: "" }]);
  };

  const removeExecutive = (index) => {
    const updated = executives.filter((_, i) => i !== index);
    setExecutives(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Prepare data for API
    const payload = {
      clientName: client.companyName,
      phoneNumber: client.contactPersonNumber,
      email: client.email,
      address: client.address,
      executives: executives.map((exec) => ({
        name: exec.name,
        phoneNumber: exec.phone,
      })),
    };

    try {
      const res = await axios.post(`${ApiURL}/client/addClients`, payload);
      if (res.status === 200) {
        setSuccessMessage("✅ Client added successfully!");
        setClient({
          companyName: "",
          contactPersonNumber: "",
          email: "",
          address: "",
        });
        setExecutives([{ name: "", phone: "" }]);
        setTimeout(() => {
          setSuccessMessage(""), 3000;
          navigate("/client");
        });
      } else {
        setErrorMessage("Failed to add client. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to add client. Please try again.");
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 rounded-4">
        <div
          className="py-3 px-4 rounded-top"
          style={{
            background: "linear-gradient(90deg, #323D4F,rgb(154, 155, 156))",
            color: "#fff",
          }}
        >
          <h4 className="mb-0 text-center">Add New Client</h4>
        </div>

        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit} style={{ fontSize: "14px" }}>
            <Form.Group className="mb-3">
              <Form.Label>🏢 Company Name *</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={client.companyName}
                onChange={handleClientChange}
                required
                className="rounded-3 shadow-sm"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label> Executives *</Form.Label>
              {executives.map((exec, index) => (
                <Row key={index} className="mb-2 align-items-center">
                  <Col md={5}>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Full Name"
                      value={exec.name}
                      onChange={(e) =>
                        handleExecutiveChange(index, "name", e.target.value)
                      }
                      className="rounded-3 shadow-sm"
                    />
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={exec.phone}
                      onChange={(e) =>
                        handleExecutiveChange(index, "phone", e.target.value)
                      }
                      className="rounded-3 shadow-sm"
                    />
                  </Col>
                  <Col md={2} className="text-center">
                    {executives.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeExecutive(index)}
                        className="rounded-circle"
                      >
                        <FaTrashAlt />
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}

              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-success"
                  className="d-flex align-items-center gap-2"
                  onClick={addExecutive}
                >
                  <FaPlusCircle />
                  Add Executive
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>📞 Contact Person Number </Form.Label>
              <Form.Control
                type="tel"
                name="contactPersonNumber"
                value={client.contactPersonNumber}
                onChange={handleClientChange}
                // required
                className="rounded-3 shadow-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>📧 Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={client.email}
                onChange={handleClientChange}
                className="rounded-3 shadow-sm"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>🏠 Address </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={client.address}
                onChange={handleClientChange}
                // required
                className="rounded-3 shadow-sm"
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-2 rounded-3"
              style={{
                fontSize: "15px",
                fontWeight: "500",
                backgroundColor: "#323D4F",
                border: "none",
              }}
            >
              Add Client
            </Button>

            {successMessage && (
              <div
                className="text-success text-center mt-3 fade-in"
                style={{ fontSize: "13px", transition: "opacity 0.5s ease-in" }}
              >
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div
                className="text-danger text-center mt-3 fade-in"
                style={{ fontSize: "13px", transition: "opacity 0.5s ease-in" }}
              >
                {errorMessage}
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddClient;
