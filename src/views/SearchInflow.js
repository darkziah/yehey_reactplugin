import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  Container,
  Row,
  Col
} from "reactstrap";

import SearchClient from '../views/components/InflowSearch'
import * as Icon from 'react-bootstrap-icons';
import { facebookApi } from '../views/api/facebook'


function SearchInflow(props) {
  const [hasClient, setHasClient] = useState(false);
  const [clientData, setclientData] = useState({});


  const fromSearch = (value) => {
    if (value.length === 0) {
      setHasClient(false)
    } else {
      setHasClient(true)
      setclientData(value)
    }

  }

  const linkAccount = () => {

    async function registerFbId(value) {

      switch (value.type) {
        case 'facebook':
          const urlfb = `https://ap-southeast-2.aws.webhooks.mongodb-stitch.com/api/client/v2.0/app/reactplugin-uxowx/service/AddressAPI/incoming_webhook/insertFBid`;
          const responsefb = await fetch(`${urlfb}?fid=${value.fid}&inflowId=${value.inFlowId}&pageName=${value.page.name}&pageId=${value.page.id}&type=${value.type}`, {
            method: 'POST',
          });
          if (responsefb.ok) return await props.LinkedDone(props.frontId)
          throw new Error(responsefb.status)

        case 'email':
          const urlemail = `https://ap-southeast-2.aws.webhooks.mongodb-stitch.com/api/client/v2.0/app/reactplugin-uxowx/service/AddressAPI/incoming_webhook/insertEmail`;
          const responseemail = await fetch(`${urlemail}?fid=${value.fid}&inflowId=${value.inFlowId}&type=${value.type}`, {
            method: 'POST',
          });
          if (responseemail.ok) return props.LinkedDone(props.frontId)
          throw new Error(responseemail.status)

        default:
          break;
      }



    }

    async function getFBid(value) {

      if (value.includes("@")) {
        registerFbId({ fid: props.frontId, inFlowId: clientData.customerId, type: 'email' })
        return
      } else {
        const response = await getId(props.frontId)
        const json = await response.json();



        if (Object.keys(json).length === 0) {
          registerFbId({ fid: props.frontId, inFlowId: clientData.customerId, type: 'email' })
          return
        } else {
          const options = json.data.map(function (row) {
            return { fid: row.id, inFlowId: clientData.customerId, page: row.page, type: 'facebook' }
          })
          options.map((val) => {
            if (val.length !== 0) {
              registerFbId(val)
            }
            return val

          })
        }
        return json;
      }



    }



    getFBid(props.frontId)
  }


  const getId = async (id) => {
    let data;
    try {
      props.loadingText('Getting Id from LTD')
      const ltdData = await facebookApi('ltd', id)
      if (Object.keys(ltdData)[0] === 'error') {
        props.loadingText('Getting Id from Cargo')
        const cargoData = await facebookApi('cargo', id)
        if (Object.keys(cargoData)[0] === 'error') {
          props.loadingText('Getting Id from Gadget Repair')
          const repairData = await facebookApi('repair', id)
          if (Object.keys(repairData)[0] === 'error') {
            props.loadingText('Getting Id from Yehey Japan 2')
            const yj2Data = await facebookApi('yj2', id)
            if (Object.keys(yj2Data)[0] === 'error') {
              props.loadingText('Getting Id from Fast Remittance')
              const fmData = await facebookApi('fast_rem', id)
              if (Object.keys(fmData)[0] === 'error') {
                props.loadingText('Getting Id from Yehey Remit')
                const yrData = await facebookApi('yehey_remit', id)
                if (Object.keys(yrData)[0] === 'error') {
                  return
                } else {
                  props.loadingText('Loading Client')
                  data = yrData
                }
              } else {
                props.loadingText('Loading Client')
                data = fmData
              }
            } else {
              props.loadingText('Loading Client')
              data = yj2Data
            }
          } else {
            props.loadingText('Loading Client')
            data = repairData
          }
        } else {
          props.loadingText('Loading Client')
          data = cargoData
        }
      } else {
        props.loadingText('Loading Client')
        data = ltdData
      }


    } catch (e) {
      console.log("Error", e);
    } finally {
      return data
    }
  }

  return (
    <>
      <div className="shape shape-style-1 shape-default alpha-4">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <Container className="pt-lg-7">
        <Row className="justify-content-center">
          <Col lg="5">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form">
                  <div className="text-center">
                    <SearchClient getData={fromSearch} />
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {hasClient ?
          <div style={{ "paddingTop": 30 }}>
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <Row>
                      <Col className="text-center">
                        <span className="font-weight-bold mb-0">
                          {clientData.name}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center">
                        <span className="mb-0">
                          {clientData.phone}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-left">
                        <span className="mb-0">
                          English
                              </span>
                      </Col>
                      <Col className="text-right">
                        <span className="mb-0">
                          Japanese
                              </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-left">
                        <span className="mb-0">
                          {clientData.addresses.length === 0 ? "" : clientData.addresses[0].address.postalCode}
                        </span>
                      </Col>
                      <Col className="text-right">
                        <span className="mb-0">
                          {clientData.addresses.length === 0 ? "" : clientData.addresses[1].address.postalCode}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-left">
                        <span className="mb-0">
                          {clientData.addresses.length === 0 ? "" : clientData.addresses[0].address.address1}
                        </span>
                      </Col>
                      <Col className="text-right">
                        <span className="mb-0">
                          {clientData.addresses.length === 0 ? "" : clientData.addresses[1].address.address1}
                        </span>
                      </Col>
                    </Row>
                    <span />
                    <Row>
                      <Col className="text-center" style={{ "paddingTop": 100 }}>
                        <Button onClick={linkAccount}>
                          <div>
                            <Icon.Link size={32} />
                            <span>Link</span>
                          </div>
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div> : <></>}
      </Container>
    </>
  );
};

export default SearchInflow