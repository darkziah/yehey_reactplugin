import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import _ from "lodash";

// reactstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  TabContent,
  TabPane,
  Navbar,
  NavbarBrand,
  Modal,
  Input,
  FormGroup,
  Badge,
  UncontrolledTooltip,
  
} from "reactstrap";

import {
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";

import classnames from "classnames";

import { ToastContainer, toast } from "react-toastify";
import AddressInput from "./components/AddressSearchInput";

import OrderListTab from "./components/OrderList";
import OrderDetailTab from "./components/OrderDetail.js";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "react-avatar";


import { arrowForwardCircle } from "ionicons/icons";

// Modals

const Plugin = (props) => {
  const [ActiveTab, setActiveTab] = useState("InflowDetail");
  const [inFlowAPI_URL] = useState(
    "https://cloudapi.inflowinventory.com/11b89fbf-18bc-4c00-bfff-cf416f56e1a0/"
  );
  const [frontData, setfrontData] = useState(props.frontData);
  const [frontContactData, setfrontContactData] = useState({});
  const [inflowCstData, setinflowCstData] = useState(props.custData);
  const [orderData, setorderData] = useState([]);
  const [FrontAvatar, setFrontAvatar] = useState();
  const [orderDetailData, setorderDetailData] = useState();
  const [editRemarks, setEditRemarks] = useState(false);
  const [EditName, setEditName] = useState(false);
  const [EditPhone, setEditPhone] = useState(false);
  const [EditAddress, setEditAddress] = useState(false);
  const [NameHover, setNameHover] = useState(false);
  const [PhoneHover, setPhoneHover] = useState(false);
  const [AddressHover, setAddressHover] = useState(false);
  const [hasDataOrderDetail, sethasDataOrderDetail] = useState(false);
  const [inflowId, setinflowId] = useState(props.frontId.id);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    //Get Avatar
    fetch(`https://api.yehey.jp/frontapp/avatar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ avatar: props.FrontContactData.avatar_url }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.blob();
      })
      .then((result) => {
        console.log("avatar", result);

        if (result) {
          const url = URL.createObjectURL(result);
          console.log("url", url);
          setFrontAvatar(url);
        } else {
          setFrontAvatar(false);
        }

        return result;
      })
      .catch((e) => {
        console.log("avatar-error", e);
      });
  }, [props.frontId, props.custData, props.FrontContactData]);

  const setOrderDetailData = (data) => {
    console.log("PeofileORD", data);
    setorderDetailData(data);
    sethasDataOrderDetail(true);
  };

  const editActiveTab = (tab) => {
    setActiveTab(tab);
  };

  /* Notify if Submited */

  let notifyId = null;

  const notifyInflowSubmit = () => (notifyId = toast.info("Processing..."));
  const notifyInflowSubmitSucc = () =>
    toast.update(notifyId, {
      render: "Submit Success",
      type: toast.TYPE.SUCCESS,
    });

  const notifyInflowSubmitFail = (error) =>
    toast.update(notifyId, {
      render: `Submit Failed
            ${error}`,
      type: toast.TYPE.ERROR,
      autoClose: 3000,
    });

  const submitInflowData = () => {
    notifyInflowSubmit();

    /**
         * fetch(`${inFlowAPI_URL}customers`, {
          method: "PUT", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer T5LXHGqawsCr8RwnCj-VjDaoA1dRcZbOvy1x3dg9EPU",
            Accept: "application/json;version=2020-01-30",
          },
          body: JSON.stringify(inflowCstData),
        }) 
        **/
    console.log("toSendJ", JSON.stringify(inflowCstData));
    console.log("toSend", inflowCstData);
    fetch(`https://api.yehey.jp/inflow/customers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(inflowCstData),
    })
      .then((result) => result.json())
      .then((result) => {
        if (Object.keys(result)[0] === "errors") {
          notifyInflowSubmitFail(result.errors[0].status);
        } else {
          notifyInflowSubmitSucc();
        }
      })
      .catch(function (e) {
        notifyInflowSubmitFail(e);
      });
  };

  const editAddressModal = (val, index, type) => {
    const address = inflowCstData.addresses;

    switch (type) {
      case "address":
        address[index].address.address1 = val;
        console.log(address);
        setinflowCstData({
          ...inflowCstData,
          addresses: address,
        });
        console.log(inflowCstData);
        break;
      case "postal":
        address[index].address.postalCode = val;
        console.log(address);
        setinflowCstData({
          ...inflowCstData,
          addresses: address,
        });
        console.log(inflowCstData);
        break;
    }
  };

  const setAddress = (address) => {
    const fixadd = address.town.replace(/ *\([^)]*\) */g, "").replace(/,/g, "");
    const fixaddj = address.town_kanji
      .replace(/ *\（[^)]*\） */g, "")
      .replace(/,/g, "");

    setinflowCstData((prevState, props) => ({
      inflowCstData: {
        ...inflowCstData,
        addresses: [
          {
            ...inflowCstData.addresses[0],
            address: {
              ...inflowCstData.addresses[0].address,
              postalCode: address.postal_code,
              address1: `${address.prefecture}, ${address.city}, ${fixadd}`,
            },
          },
          {
            ...inflowCstData.addresses[1],
            address: {
              ...inflowCstData.addresses[1].address,
              postalCode: address.postal_code,
              address1: `${address.prefecture_kanji}, ${address.city_kanji}, ${fixaddj}`,
            },
          },
        ],
      },
    }));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <TabContent activeTab={ActiveTab}>
        <TabPane tabId="InflowDetail">
          <main className="profile-page">
            <section
              className="section-profile-cover section-shaped my-0"
              style={{ height: "200px" }}
            >
              {/* Circles background */}

              <div className="shape shape-style-1 shape-default alpha-4">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              {/* SVG separator */}
              <div className="separator separator-bottom separator-skew">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="fill-white"
                    points="2560 0 2560 100 0 100"
                  />
                </svg>
              </div>
            </section>
            <section className="section">
              <Container>
                <Card className="card-profile shadow mt--300">
                  <div className="px-4">
                    <Row className="justify-content-center">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            {Avatar ? (
                              <img
                                alt="..."
                                className="rounded-circle"
                                src={FrontAvatar}
                              />
                            ) : (
                              <Avatar
                                name={inflowCstData.name || "None"}
                                size={150}
                                round="20px"
                              />
                            )}
                          </a>
                        </div>
                      </Col>
                      <Col
                        className="order-lg-3 text-lg-right align-self-lg-center"
                        lg="4"
                      >
                        <div className="card-profile-actions py-4 mt-lg-0"></div>
                      </Col>
                    </Row>
                    <div className="text-center mt-5">
                      {/* Client Name */}

                      <h3
                        onMouseEnter={() => setNameHover(true)}
                        onMouseLeave={() => setNameHover(false)}
                      >
                        {inflowCstData.name || <Skeleton />}
                        {NameHover && (
                          <>
                            <Badge
                              pill
                              id="tooltipEditName"
                              style={{
                                fontSize: 14,
                                backgroundColor: "transparent",
                              }}
                              onClick={() => setEditName(true)}
                            >
                              <i className="fa fa-pencil"></i>
                            </Badge>
                            <UncontrolledTooltip
                              delay={0}
                              placement="top"
                              target="tooltipEditName"
                            >
                              Edit
                            </UncontrolledTooltip>
                          </>
                        )}
                      </h3>
                      <Modal
                        className="modal-dialog-centered"
                        isOpen={EditName}
                        toggle={() => setEditName(false)}
                      >
                        <div className="modal-header">
                          <h6 className="modal-title" id="modal-title-default">
                            Edit Client Name
                          </h6>
                          <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setEditName(false)}
                          >
                            <span aria-hidden={true}>×</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <FormGroup className="mb-4">
                            <Input
                              className="form-control-alternative"
                              id="exampleFormControlInput1"
                              placeholder="Name"
                              type="name"
                              value={inflowCstData.name || ""}
                              onChange={(e) =>
                                setinflowCstData({
                                  ...inflowCstData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </div>
                        <div className="modal-footer">
                          <Button
                            color="primary"
                            type="button"
                            onClick={() => {
                              setEditName(false);
                              submitInflowData();
                            }}
                          >
                            Save changes
                          </Button>
                          <Button
                            className="ml-auto"
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setEditName(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </Modal>

                      <div className="h6 font-weight-300">
                        {props.frontId || <Skeleton />}
                      </div>
                      <div
                        className="h6 mt-4"
                        onMouseEnter={() => setPhoneHover(true)}
                        onMouseLeave={() => setPhoneHover(false)}
                      >
                        <i className="ni business_briefcase-24 mr-2" />
                        {inflowCstData.phone || "No Phone" || <Skeleton />}
                        {PhoneHover && (
                          <>
                            <Badge
                              pill
                              id="tooltipEditPhone"
                              style={{
                                fontSize: 14,
                                backgroundColor: "transparent",
                              }}
                              onClick={() => setEditPhone(true)}
                            >
                              <i className="fa fa-pencil"></i>
                            </Badge>
                            <UncontrolledTooltip
                              delay={0}
                              placement="top"
                              target="tooltipEditPhone"
                            >
                              Edit
                            </UncontrolledTooltip>
                          </>
                        )}
                      </div>
                      <Modal
                        className="modal-dialog-centered"
                        isOpen={EditPhone}
                        toggle={() => setEditPhone(true)}
                      >
                        <div className="modal-header">
                          <h6
                            className="modal-edit-Phone"
                            id="modal-title-phone"
                          >
                            Edit Client Phone
                          </h6>
                          <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setEditPhone(false)}
                          >
                            <span aria-hidden={true}>×</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <FormGroup className="mb-4">
                            <Input
                              className="form-control-alternative"
                              id="inflowPhoneEdit"
                              placeholder="Phone"
                              type="phone"
                              value={inflowCstData.phone || ""}
                              onChange={(e) =>
                                setinflowCstData({
                                  ...inflowCstData,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </div>
                        <div className="modal-footer">
                          <Button
                            color="primary"
                            type="button"
                            onClick={() => {
                              setEditPhone(false);
                              submitInflowData();
                            }}
                          >
                            Save changes
                          </Button>
                          <Button
                            className="ml-auto"
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setEditPhone(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </Modal>
                      <div>
                        <i className="ni education_hat mr-2 justify-content-center" />
                        <Row onMouseLeave={() => setAddressHover(false)}>
                          {(inflowCstData.addresses || []).map(
                            (item, index) => (
                              <>
                                <Col
                                  key={index}
                                  onMouseEnter={() => setAddressHover(true)}
                                >
                                  <span>
                                    {item.address.postalCode || <Skeleton />}{" "}
                                    {item.address.address1 || <Skeleton />}
                                  </span>
                                </Col>
                                {AddressHover && (
                                  <>
                                    <Badge
                                      pill
                                      id="tooltipEditPhone"
                                      style={{
                                        fontSize: 14,
                                        backgroundColor: "transparent",
                                      }}
                                      onClick={() => setEditAddress(true)}
                                    >
                                      <i className="fa fa-pencil"></i>
                                    </Badge>
                                    <UncontrolledTooltip
                                      delay={0}
                                      placement="top"
                                      target="tooltipEditPhone"
                                    >
                                      Edit
                                    </UncontrolledTooltip>
                                  </>
                                )}
                              </>
                            )
                          )}
                          <Modal
                            className="modal-dialog-centered"
                            isOpen={EditAddress}
                            toggle={() => setEditAddress(false)}
                          >
                            <div className="modal-header">
                              <h6
                                className="modal-edit-Address"
                                id="modal-title-address"
                              >
                                Edit Client Address
                              </h6>
                              <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setEditAddress(true)}
                              >
                                <span aria-hidden={true}>×</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <FormGroup className="mb-4">
                                <Row className="justify-content-center">
                                  <AddressInput changeAddress={setAddress} />
                                </Row>
                                {(inflowCstData.addresses || []).map(
                                  (item, index) => (
                                    <>
                                      {index === 0 ? (
                                        <span>English</span>
                                      ) : (
                                        <span>Japanese</span>
                                      )}
                                      <Input
                                        className="form-control-alternative"
                                        id={"P" + item.customerAddressId}
                                        placeholder="Address"
                                        type="address"
                                        value={item.address.postalCode || ""}
                                        onChange={(e) =>
                                          editAddressModal(
                                            e.target.value,
                                            index,
                                            "postal"
                                          )
                                        }
                                      />
                                      <Input
                                        className="form-control-alternative"
                                        id={"A" + item.customerAddressId}
                                        placeholder="Address"
                                        type="address"
                                        value={item.address.address1 || ""}
                                        onChange={(e) =>
                                          editAddressModal(
                                            e.target.value,
                                            index,
                                            "address"
                                          )
                                        }
                                      />
                                    </>
                                  )
                                )}
                              </FormGroup>
                            </div>
                            <div className="modal-footer">
                              <Button
                                color="primary"
                                type="button"
                                onClick={() => {
                                  setEditAddress(false);
                                  submitInflowData();
                                }}
                              >
                                Save changes
                              </Button>
                              <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setEditAddress(false)}
                              >
                                Close
                              </Button>
                            </div>
                          </Modal>

                          <Col className="order-lg-1" lg="4">
                            <div className="card-profile-stats d-flex justify-content-center">
                              {(
                                <div>
                                  <span className="heading">
                                    {props.custOrderData.length || 0}
                                  </span>
                                  <span className="description">Orders</span>
                                </div>
                              ) || <Skeleton />}

                              <div>
                                <Button
                                  className={"mb-sm-3 mb-md-0"}
                                  onClick={(e) => setActiveTab("OrderListTab")}
                                  href="#pablo"
                                  role="tab"
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <div className="mt-5 py-5 border-top text-center">
                      <Row className="justify-content-center">
                        <Col lg="9">
                          <p>{inflowCstData.remarks}</p>
                          <a href="#pablo" onClick={() => setEditRemarks(true)}>
                            Remarks
                          </a>
                        </Col>
                        <Col md="4">
                          <Modal
                            className="modal-dialog-centered"
                            isOpen={editRemarks}
                            toggle={() => setEditRemarks(true)}
                          >
                            <div className="modal-header">
                              <h6
                                className="modal-title"
                                id="modal-title-default"
                              >
                                Edit Remarks
                              </h6>
                              <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setEditRemarks(false)}
                              >
                                <span aria-hidden={true}>×</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <FormGroup className="mb-4">
                                <Input
                                  className="form-control-alternative"
                                  cols="80"
                                  name="name"
                                  placeholder={
                                    inflowCstData.remarks || "Add remarks..."
                                  }
                                  rows="4"
                                  type="textarea"
                                  value={inflowCstData.remarks || ""}
                                  onChange={(e) =>
                                    setinflowCstData({
                                      ...inflowCstData,
                                      remarks: e.target.value,
                                    })
                                  }
                                />
                              </FormGroup>
                            </div>
                            <div className="modal-footer">
                              <Button
                                color="primary"
                                type="button"
                                onClick={() => {
                                  setEditRemarks(false);
                                  submitInflowData();
                                }}
                              >
                                Save changes
                              </Button>
                              <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setEditRemarks(false)}
                              >
                                Close
                              </Button>
                            </div>
                          </Modal>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card>
              </Container>
            </section>
          </main>
        </TabPane>

        <TabPane tabId="OrderListTab">
          <Navbar className="navbar-dark bg-default" expand="sm">
            <Container>
              <NavbarBrand
                className={"mb-sm-3 mb-md-0"}
                onClick={(e) => setActiveTab("InflowDetail")}
                href="#pablo"
                role="tab"
              >
                <i className="ni ni-bold-left mr-2" />
                Back
              </NavbarBrand>
            </Container>
          </Navbar>
          <OrderListTab
            setOrderDetailData={setOrderDetailData}
            inflowCstData={props.custData}
            frontData={frontData}
            orderData={props.custOrderData}
            editActiveTab={editActiveTab}
          />
        </TabPane>
        <TabPane tabId="OrderDetailTab">
          <Navbar className="navbar-dark bg-default" expand="sm">
            <Container>
              <NavbarBrand
                className={classnames("mb-sm-3 mb-md-0", {})}
                onClick={(e) => setActiveTab("OrderListTab")}
                href="#pablo"
                role="tab"
              >
                <i className="ni ni-bold-left mr-2" />
                Back
              </NavbarBrand>
            </Container>
          </Navbar>

          {hasDataOrderDetail ? (
            <OrderDetailTab
              orderDetail={orderDetailData}
              inflowCstData={props.custData}
            />
          ) : (
            <div />
          )}
        </TabPane>
      </TabContent>
     
    </>
  );
};

export default Plugin;
