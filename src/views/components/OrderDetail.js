/* eslint-disable no-unreachable */
/* eslint-disable no-duplicate-case */
import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardText, Row, Col, Table, Media, Nav, NavItem, NavLink, TabContent, TabPane, Badge, Navbar, Container, NavbarBrand, } from 'reactstrap';
import classnames from "classnames";
import CurrencyFormat from 'react-currency-format';
import ellipsize from 'ellipsize';

import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

const Ordertab = (props) => {

  
  const [activeTab, setActiveTab] = useState('1');


  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const paymentTermSelector = (data) => {
    switch (data) {
      case '0e97d641-ff67-43f1-babf-8fdc775e0c2b':
        return "Cash on Delivery"
        break;
      case '0e97d641-ff67-43f1-babf-8fdc775e0c2b':
        return "Cash on Delivery"
        break;
      case 'bb7ae845-f4c2-4990-87a5-e5898833c4c5':
        return "Client Will Pay Takyubin"
        break;
      case '834d1324-29d5-447c-b5f6-550d13539862':
        return "Credit Card 4%"
        break;
      case '87106896-1a8f-48b8-bae8-4561c609f4cb':
        return "Free Takyubin"
        break;
      case '8a53f286-f2ed-47d2-bc8b-a08fc3f442d2':
        return "Post Office"
        break;
      case 'd6470e53-27fb-4fef-9af7-8579fb7566ca':
        return "Walk In"
        break;
      default:
        return "None"
        break;
    }
  }

  const SagawaTime = (time) => {
    switch (time) {
      case '01':
        console.log(time)
        return '10am to 12pm'
        break;
      case '12':
        return '12pm to 2pm'
        break;
      case '14':
        return '2 to 4pm'
        break;
      case '16':
        return '4 to 6pm'
        break;
      case '04':
        return '6 to 9pm'
        break
      default:
        return 'None'
        break;
    }
  }

  return (
    <>
      <main className="Ordertab" >
        <section>
          <Navbar
            className="navbar-horizontal navbar-dark bg-info"
            expand="sm"
          >
            <Container>
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                Order Number
            </NavbarBrand>
              <span>
                {props.orderDetail.orderNumber}
              </span>
            </Container>
          </Navbar>
          <Container style={{ marginBottom: 15, marginTop: 15 }}>

            <Row >
              <Col xs="3">
                <Badge color="info" href="#pablo" className="text-capitalize">
                  {props.orderDetail.inventoryStatus}
                </Badge>
              </Col>
              <Col xs={{ size: "auto" }} style={{ fontSize: 14 }}>

                <span>
                  <li className="list-unstyled">
                    Customer
        </li>
                  <li className="list-unstyled">
                    {props.inflowCstData.name}
                  </li>
                </span>
              </Col>

            </Row>
            <Row>
              <Col Col xs="3">

                <Badge color="info" href="#pablo" className="text-capitalize">
                  {props.orderDetail.paymentStatus}
                </Badge>
              </Col>
              <Col xs={{ size: "auto" }} style={{ fontSize: 14 }}>

                <span>
                  <li className="list-unstyled">
                    Agent
        </li>
                  <li className="list-unstyled">
                    {props.inflowCstData.salesRep || "None"}
                  </li>
                </span>
              </Col>

            </Row>

          </Container>


          <Nav
            className="nav-fill flex-column flex-sm-row"
            id="tabs-text"
            pills
            role="tablist"
            expand="sm"

          >
            <Row>
              <NavItem style={{ marginBottom: "0" }}>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => { toggle('1'); }}
                  href="#pablo"
                  role="tab"
                >
                  Order
            </NavLink>
              </NavItem>

              <NavItem style={{ marginBottom: "0" }}>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => { toggle('2'); }}
                  href="#pablo"
                  role="tab"
                >
                  Details
            </NavLink>
              </NavItem>
            </Row>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">



                  <OrderDetailTable orderDetail={props.orderDetail} inflowCstData={props.inflowCstData} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="6">
                  <Card body>

                    <Row>
                      <Col>
                        <p><strong>Terms</strong></p>
                        <p>{paymentTermSelector(props.orderDetail.paymentTermsId)}</p>
                      </Col>
                      <Col>
                        <p><strong>Agent</strong></p>
                        <p>{props.orderDetail.salesRep}</p>
                      </Col>
                    </Row>
                    <Row>

                      <Col>
                        <p><strong>Sagawa</strong></p>
                        <p>{SagawaTime(props.orderDetail.customFields.custom1)}</p>
                      </Col>

                      <Col>
                        <p><strong>Order Code</strong></p>
                        <p className="text-uppercase">{props.orderDetail.customFields.custom3}</p>
                      </Col>
                    </Row>


                  </Card>
                </Col>
                <Col sm="6">
                  <Card body>
                    <CardTitle>English Address</CardTitle>
                    <CardText>{props.orderDetail.billingAddress !== null && Object.keys(props.orderDetail.billingAddress.address1) !== 0 ? `${props.orderDetail.billingAddress.postalCode} ${props.orderDetail.billingAddress.address1}` : "None"}</CardText>

                  </Card>
                </Col>
                <Col sm="6">
                  <Card body>
                    <CardTitle>Japanese Address</CardTitle>
                    <CardText>{props.orderDetail.shippingAddress !== null && Object.keys(props.orderDetail.shippingAddress.address1) !== 0 ? `${props.orderDetail.shippingAddress.postalCode} ${props.orderDetail.shippingAddress.address1}` : "None"}</CardText>

                  </Card>
                </Col>
              </Row>
            </TabPane>
          </TabContent>




        </section>
      </main>
    </>
  );
};

const OrderDetailTable = (props) => {
  const [OrderData, setOrderData] = useState([]);

  
  const salesOrderId = props.orderDetail.salesOrderId


  useEffect(() => {
    console.log("orderDetailData", OrderData.lines)
    console.log("orderDetailData2", props.orderDetail.lines)
    setOrderData(props.orderDetail)
  }, [OrderData.lines, props.orderDetail, salesOrderId]);

  return (
    <Table className="align-items-center" responsive>
      <thead className="thead-light">
        <tr>
          <th scope="col">Item <Badge color="primary">{props.orderDetail.lines.length}</Badge></th>
          <th scope="col"></th>
        </tr>
      </thead>

      <tbody>

        {props.orderDetail.lines && props.orderDetail.lines.length > 0
          ? props.orderDetail.lines.map(item => {
            return <tr key={item.salesOrderLineId}>
              <th scope="row">
                <Media>
                  <Media left href="#">
                    <Media />
                    <div

                      href="#pablo"
                      onClick={e => e.preventDefault()}
                    >
                      <img
                        alt="..."
                        width="45" height="45"
                        src={item.product.defaultImage !== null && Object.keys(item.product.defaultImage.thumbUrl).length !== 0 ? item.product.defaultImage.thumbUrl : "https://www.emobooks.com/image/cache/placeholder-200x200.png"}
                      />

                    </div>
                  </Media>
                  <Media body >
                    <Media heading style={{ fontSize: 15 }}>
                      {item.product.name}
                    </Media>
                    <div style={{ fontSize: 10 }}>
                      <li className="list-unstyled">
                        {ellipsize(item.description, 60)}
                      </li>
                      <li className="list-unstyled" style={{ fontSize: 17 }}>
                        <Badge color="secondary">
                          <CurrencyFormat value={parseInt(item.quantity.standardQuantity)} displayType={'text'} thousandSeparator={true} prefix={'‎'} />
                        </Badge>
                      </li>
                    </div>
                  </Media>


                </Media>
                <span className="mb-0 text-sm">
                  <Row>





                  </Row>
                  <Row>

                  </Row>
                </span>
              </th>


              <td>
                <CurrencyFormat value={parseInt(item.subTotal)} displayType={'text'} thousandSeparator={true}
                  prefix={'¥‎'} />
              </td>

            </tr>;
          })
          : <Loader type="Grid" color="#00BFFF" height={80} width={80} />}




      </tbody>
    </Table>

  )
}

export default Ordertab;