/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { usePDF } from "react-to-pdf";
import "../component/invoice.css";
import "../component/invoice.css";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import { Tilt } from "react-tilt";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { img } from "framer-motion/client";

function Invoice() {
  const defaultOptions = {
    reverse: false, // reverse the tilt direction
    max: 6, // max tilt rotation (degrees)
    perspective: 2000, // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1, // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000, // Speed of the enter/exit transition
    transition: false, // Set a transition on enter/exit.
    axis: null, // What axis should be disabled. Can be X or Y.
    reset: true, // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
  };
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    contact: "",
    trn: "",
    carName: "",
    carReg: "",
  });
  const [invoiceType, setInvoiceType] = useState("Invoice");
  const [invoice] = useState({
    date: new Date().toISOString().split("T")[0],
    number: `AD${Math.floor(10000 + Math.random() * 9000)}`,
  });
  const menuRef = useRef(null);
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // const [isPdfMode, setIsPdfMode] = useState(false);
  // const generatePdf = () => {
  //   setIsPdfMode(true);
  //   setTimeout(() => {
  //     // Logic to render/download the PDF
  //     setIsPdfMode(false);
  //   }, 1000); // Reset after PDF is generated
  // };

  const [showPreview, setShowPreview] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "Invoice.pdf" });
  const [isOpen, setIsOpen] = useState(false);

  const [services, setServices] = useState([
    { description: "", unitPrice: "", quantity: "", discount: "" },
  ]);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isServiceEdited, setIsServiceEdited] = useState(false);
  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);

    setErrors((prevErrors) => {
      if (!prevErrors[index]) return prevErrors; // No errors to update

      const updatedErrors = { ...prevErrors };
      delete updatedErrors[index][field];

      // If no errors remain for this index, remove it completely
      if (Object.keys(updatedErrors[index]).length === 0) {
        delete updatedErrors[index];
      }

      return updatedErrors;
    });

    setIsServiceEdited(true);
  };

  const handleAddService = () => {
    const currentService = services[serviceIndex];
    const newErrors = { ...errors }; // Keep previous errors

    // Validate only the last added service
    const indexErrors = {};
    if (!currentService.description)
      indexErrors.description = "Description is required.";
    if (!currentService.unitPrice)
      indexErrors.unitPrice = "Unit Price is required.";
    if (!currentService.quantity)
      indexErrors.quantity = "Quantity is required.";

    // If there are errors, assign them to the current index
    if (Object.keys(indexErrors).length > 0) {
      newErrors[serviceIndex] = indexErrors;
      setErrors(newErrors);
      return;
    }

    // Clear errors for the current index after successful validation
    delete newErrors[serviceIndex];
    setErrors(newErrors);

    if (serviceIndex === services.length - 1) {
      // Add a new service if we are on the last one
      setServices((prev) => [
        ...prev,
        { description: "", unitPrice: "", quantity: "", discount: "" },
      ]);
      setServiceIndex(services.length);
    } else {
      // Editing an existing service
      const updatedServices = [...services];
      updatedServices[serviceIndex] = currentService;
      setServices(updatedServices);
    }

    setIsServiceEdited(false);
  };

  const handleRemoveService = () => {
    if (services.length > 1) {
      setServices((prev) => {
        const updatedServices = prev.filter((_, i) => i !== serviceIndex);
        const newIndex = Math.max(serviceIndex - 1, 0);
        setServiceIndex(newIndex);
        return updatedServices;
      });
    }
  };

  const handleNext = () => {
    if (serviceIndex < services.length - 1) {
      setServiceIndex(serviceIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (serviceIndex > 0) {
      setServiceIndex(serviceIndex - 1);
    }
  };

  // Use the current service from services or the new empty service for adding
  const currentService = services[serviceIndex] || service;

  const calculateSubtotal = () => {
    return services.reduce((sum, service) => {
      return (
        sum +
        (parseFloat(service.unitPrice) || 0) *
          (parseFloat(service.quantity) || 0)
      );
    }, 0);
  };

  const calculateTotal = () => {
    return services.reduce((sum, service) => {
      const price =
        (parseFloat(service.unitPrice) || 0) *
        (parseFloat(service.quantity) || 0);
      const discount = parseFloat(service.discount) || 0;
      return sum + price - discount;
    }, 0);
  };

  //  if (!showPreview) return null;

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="container">
      <header className="invoice-header">
        <Tilt options={defaultOptions}>
          <div className="company-header">
            <img src="public/headerLogo (1).png" alt="Company Logo" />
            <h1 style={{ color: "white" }}>Car A I D Repair Service Dubai</h1>
          </div>
        </Tilt>
      </header>

      <Tilt
        className="input-sub-container customer-details"
        options={defaultOptions}
      >
        <h2 className="sub-heading heading">Customer Details</h2>
        <div className="label-input">
          <h3>Customer Name</h3>
          <div className="input-container">
            <input
              type="text"
              placeholder="Customer Name"
              value={customer.name}
              onChange={(e) => handleCustomerChange("name", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="label-input">
          <h3>Email</h3>
          <div className="input-container">
            <input
              type="email"
              placeholder="abc@gmail.com"
              value={customer.email}
              onChange={(e) => handleCustomerChange("email", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="label-input">
          <h3>Contact</h3>
          <div className="input-container">
            <input
              type="text"
              placeholder="971 12-345-6789"
              value={customer.contact}
              onChange={(e) => handleCustomerChange("contact", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="label-input">
          <h3>TRN #</h3>
          <div className="input-container">
            <input
              type="text"
              placeholder="123456789012345"
              value={customer.trn}
              onChange={(e) => handleCustomerChange("trn", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="label-input">
          <h3>Car Reg #</h3>
          <div className="input-container">
            <input
              type="text"
              placeholder="D 12345"
              value={customer.carReg}
              onChange={(e) => handleCustomerChange("carReg", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="label-input">
          <h3>Car Name</h3>
          <div className="input-container">
            <input
              type="text"
              placeholder="Nissan "
              value={customer.carName}
              onChange={(e) => handleCustomerChange("carName", e.target.value)}
              required
            />
          </div>
        </div>
      </Tilt>

      <div className="services-container ">
        <div
          className="service-input-container right-section"
          options={defaultOptions}
        >
          <Tilt className="service-row services" options={defaultOptions}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className="sub-heading heading">Service Details</h2>
              <select
                className="invoice-type-dropdown"
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
              >
                <option value="Invoice">Invoice</option>
                <option value="Quotation">Quotation</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                placeholder="Description"
                value={services[serviceIndex].description}
                onChange={(e) =>
                  handleServiceChange(
                    serviceIndex,
                    "description",
                    e.target.value
                  )
                }
                style={{
                  border: errors[serviceIndex]?.description
                    ? "2px solid red"
                    : "1px solid #ccc",
                }}
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={services[serviceIndex].unitPrice}
                onChange={(e) =>
                  handleServiceChange(serviceIndex, "unitPrice", e.target.value)
                }
                style={{
                  border: errors[serviceIndex]?.unitPrice
                    ? "2px solid red"
                    : "1px solid #ccc",
                }}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={services[serviceIndex].quantity}
                onChange={(e) =>
                  handleServiceChange(serviceIndex, "quantity", e.target.value)
                }
                style={{
                  border: errors[serviceIndex]?.quantity
                    ? "2px solid red"
                    : "1px solid #ccc",
                }}
              />

              <input
                type="number"
                placeholder="Discount (Optional)"
                value={services[serviceIndex].discount}
                onChange={(e) =>
                  handleServiceChange(serviceIndex, "discount", e.target.value)
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                position: "absolute",
                bottom: "26px",
                right: "24%",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  borderRadius: "50px",
                  height: "45px",
                  width: "45px",
                  color: "#333",
                  fontSize: "20px",
                }}
                className="icon-button "
                onClick={handlePrevious}
                disabled={serviceIndex === 0}
              >
                <TbPlayerTrackPrevFilled />
              </button>
              <div className="button-container ref={menuRef}">
                <button
                  style={{
                    fontWeight: "700",
                    fontSize: "30px",
                    color: "#303642",
                  }}
                  className="main-button"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {serviceIndex}{" "}
                </button>{" "}
                <div className={`arc-buttons ${isOpen ? "show" : ""}`}>
                  <button
                    data-tooltip="Cancel"
                    className="icon-button remove-service"
                    onClick={handleRemoveService}
                    disabled={services.length === 1}
                  >
                    <ImCross />
                  </button>

                  <button
                    className="icon-button add-service"
                    onClick={handleAddService}
                    disabled={!isServiceEdited}
                    data-tooltip="Add Service"
                  >
                    <FaPlus />
                  </button>

                  <button
                    className="icon-button preview"
                    data-tooltip="Preview"
                    onClick={togglePreview}
                  >
                    <IoEyeSharp />
                  </button>
                </div>
              </div>
              <button
                style={{
                  borderRadius: "50px",
                  height: "45px",
                  width: "45px",
                  color: "#333",
                  fontSize: "20px",
                }}
                className="icon-button "
                onClick={handleNext}
                disabled={serviceIndex === services.length - 1}
              >
                <TbPlayerTrackNextFilled />
              </button>
            </div>
            <div className="buttons"></div>
          </Tilt>

          <Tilt className="summary" options={defaultOptions}>
            <div className="service-input-container">
              <div className="service-container">
                <h3>Subtotal</h3>
                <input
                  type="text"
                  placeholder="Subtotal"
                  value={`$${calculateSubtotal().toFixed(2)}`}
                  readOnly
                />
              </div>
              <div className="service-container">
                <h3>Total</h3>

                <input
                  type="text"
                  placeholder="Total"
                  value={`$${calculateTotal().toFixed(2)}`}
                  readOnly
                />
              </div>
            </div>
          </Tilt>
        </div>
      </div>
      {/* Full-screen preview with blurred background */}
      {showPreview && (
        <div className="modal-overlay">
          <div className="invoice-preview" ref={targetRef}>
            {/* <div className="invoice-container">
              <header className="invoice-header">
                <div className="header-left">
                  <h1>CAR A I D AUTO MOBILE REPAIR SERVICE LLC</h1>
                </div>
                <div className="header-right">
                  <p>Manager: Mr Sheraz Hassan</p>
                  <p>Mobile: 0559521526, 0551729296</p>
                  <p>TRN: 104676144900003</p>
                  <p>Email: Caraid321@gmail.com</p>
                  <p>Address: Dubai, Al Quoz Industrial Area 1, UAE</p>
                </div>
              </header>

              <section className="invoice-to">
                <div className="invoice-to-left">
                  <h2>Invoice To:</h2>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) =>
                      handleCustomerChange("name", e.target.value)
                    }
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={customer.contact}
                    onChange={(e) =>
                      handleCustomerChange("contact", e.target.value)
                    }
                    placeholder="contact"
                  />
                  <input
                    type="text"
                    value={customer.trn}
                    onChange={(e) =>
                      handleCustomerChange("trn", e.target.value)
                    }
                    placeholder="123456789012345"
                  />
                  <input
                    type="text"
                    value={customer.carReg}
                    onChange={(e) =>
                      handleCustomerChange("carReg", e.target.value)
                    }
                    placeholder="Car Reg. #"
                  />
                  <input
                    type="text"
                    value={customer.carName}
                    onChange={(e) =>
                      handleCustomerChange("carName", e.target.value)
                    }
                    placeholder="Car Name"
                  />
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) =>
                      handleCustomerChange("email", e.target.value)
                    }
                    placeholder="Email"
                  />
                </div>

                <div className="invoice-to-right">
                  <div className="invoice-info">
                    <p>Date: {invoice.date}</p>
                    <p>Invoice No.: {invoice.number}</p>
                  </div>
                </div>
              </section>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>SL.</th>
                    <th>Description</th>
                    <th>QTY</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          style={{
                            border: errors[index]?.description
                              ? "2px solid red"
                              : "1px solid #ccc",
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={service.quantity}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          style={{
                            border: errors[index]?.quantity
                              ? "2px solid red"
                              : "1px solid #ccc",
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={service.unitPrice}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "unitPrice",
                              e.target.value
                            )
                          }
                          style={{
                            border: errors[index]?.unitPrice
                              ? "2px solid red"
                              : "1px solid #ccc",
                          }}
                        />
                      </td>
                      <td>
                        {(
                          (parseFloat(service.unitPrice) || 0) *
                          (parseFloat(service.quantity) || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <section className="invoice-summary">
                <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                <p>Discount: ${calculateTotal() - calculateSubtotal()}</p>
                <p className="total">Total: ${calculateTotal().toFixed(2)}</p>
              </section>

              <footer className="invoice-footer">
                <div className="footer-left">
                  <img
                    src="24-7-logo.png"
                    alt="24/7 Emergency Services"
                    className="emergency-logo"
                  />
                  <p>Service we provide:</p>
                  <ul>
                    <li>Auto Mechanical Repair & Maintenance</li>
                    <li>Auto Electrical Repair & Maintenance</li>
                    <li>Auto Body Shop & Many More Services</li>
                    <li>Auto Mobile Service 24/7 Doorstep</li>
                  </ul>
                </div>
                <div className="footer-right">
                  <p>Thank you for choosing Car Aid Auto Repair Dubai!</p>
                </div>
              </footer>
            </div> */}
            <img src="public/Invoice-template.png" alt="Company Logo" />

            <button onClick={() => toPDF()}>Download PDF</button>
            <button onClick={togglePreview}>Close Preview</button>
          </div>
          <button
            style={{
              position: "absolute",
              right: "5%",
              background: "white",
              height: "40px",
              width: "40px",
              alignContent: "center",
              flexWrap: "wrap",
              display: "flex",
            }}
            className="no-print icon-button add-service hidden"
            data-tooltip="Add Service"
            onClick={handleAddService}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default Invoice;
