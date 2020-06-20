import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  Row,
  Col,
  Container
} from "reactstrap";

import _ from "lodash";

import SearchClient from './components/InflowSearch2'
import * as Icon from 'react-bootstrap-icons';
import { facebookApi } from './api/facebook'

import { IonIcon, IonButton, IonText, IonContent, IonSearchbar, IonPage, IonRow, IonCol, IonCard, IonSpinner, IonCardHeader, IonBadge, IonThumbnail, IonCardTitle, IonCardContent, IonCardSubtitle } from '@ionic/react';

import { phonePortrait, linkOutline } from 'ionicons/icons';

import "./SearchInflow.css"

function SearchInflow(props) {
  const [hasClient, setHasClient] = useState(false);
  const [clientData, setclientData] = useState({});
  const [clients, setClients] = useState();
  const [clientName, setClientName] = useState();
  const [clientPhone, setClientPhone] = useState();
  const [loading, setLoading] = useState(false);





  const fromSearch = (value) => {
    if (value.length === 0) {
      setHasClient(false)
    } else {
      setHasClient(true)
      setclientData(value)
    }

  }

  const linkAccount = (clientd) => {

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
        registerFbId({ fid: props.frontId, inFlowId: clientd.customerId, type: 'email' })
        return
      } else {
        const data = await getId(props.frontId);
        console.log('getFbid', data);

        if (data) {
          const options = data.data.map(function (row) {
            return { fid: row.id, inFlowId: clientd.customerId, page: row.page, type: 'facebook' }
          })
          options.map((val) => {
            if (val.length !== 0) {
              registerFbId(val)
            }
            return val

          })
        }




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
      console.log('getid', data);
      return data
    }
  }

  async function getInflowData(value) {
    setLoading(true)
    const response = await fetch(
      `https://api.yehey.jp/inflow/customers/search/${value}`,
      {
        method: "GET",

      }
    );
    const json = await response.json();

    setClients(Array.from(json))
    setLoading(false)
    return json;
  }

  useEffect(() => {
    if (clientName === "") {
      return;
    } else {
      getInflowData(clientName);

      return;
    }
  }, [clientName, clientPhone]);

  async function prepLink(value) {
    if(value){
      setclientData(value)
      linkAccount(value)

    }
  }

  return (

    <>
      <IonCard>
        <IonSearchbar mode="ios" placeholder="Name" animated onIonChange={e => setClientName(e.detail.value)} ></IonSearchbar>
        <IonSearchbar mode="ios" disabled={true} search-icon={phonePortrait} type="number" placeholder="Phone" animated onChange={e => e}></IonSearchbar>
      </IonCard>

      {loading ? <Loading /> : <></>}

      {(clients || [])
        .map((client, index) => {


          return (
            <>
              <IonRow key={"R" + client.customerId}>
                <IonCol key={"C" + client.customerId}>
                  <IonCard key={client.customerId} >
                    <IonCardHeader>

                      <IonCardTitle>{client.name}</IonCardTitle>
                      <IonText>{_.get(client, 'phone', 'No Phone Number')}</IonText>
                      <IonCardSubtitle>
                        <IonRow>
                          <IonCol>
                            Englsih
                          </IonCol>
                          <IonCol>
                            Japanese
                          </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                              <IonText>{_.get(client, 'addresses[0].address.postalCode', '')}</IonText>
                              
                              <p>{_.get(client, 'addresses[0].address.address1', '')}</p>
                                
                               
                            </IonCol>
                            <IonCol>
                              <IonText>{_.get(client, 'addresses[1].address.postalCode', '')}</IonText>
                              
                              <p>{_.get(client, 'addresses[1].address.address1', '')}</p>
                              </IonCol>
                        </IonRow>
                     


                      </IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                      <IonButton className="linkButton" color="medium" shape="round" onClick={e => prepLink(client)}>
                        <IonIcon slot="start" icon={linkOutline} />
                        Link
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </>
          );
             
         
        })}


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
                        {_.get(clientData, 'addresses[0].address.postalCode', '')}
                      </span>
                    </Col>
                    <Col className="text-right">
                      <span className="mb-0">
                        {_.get(clientData, 'addresses[1].address.postalCode', '')}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-left">
                      <span className="mb-0">
                        {_.get(clientData, 'addresses[0].address.address1', '')}
                      </span>
                    </Col>
                    <Col className="text-right">
                      <span className="mb-0">
                        {_.get(clientData, 'addresses[1].address.address1', '')}
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

    </>
  );
};


const Loading = () => {
  return (
    <IonRow>
      <IonCol>
        <IonSpinner name="crescent" />
      </IonCol>
    </IonRow>
  );
};

const cardAddress = (address) => {

}
export default SearchInflow