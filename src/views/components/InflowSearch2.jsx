import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './autosearch.css'
import {

  FormGroup, Input,


} from "reactstrap";

import {
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap";
import { IonSearchbar, IonRow, IonCol, IonCard,  } from '@ionic/react';

export const SearchClient = (props) => {
  const [client, setClient] = useState([]);
  const [value, setValue] = useState('')



  const renderSuggestion = (suggestion, { query }) => {
    const name = suggestion.name;
    let phone;
    const addresses = suggestion.addresses;
    let engAddress;
    let engPostal;
   
    if (suggestion.phone === null) {
      phone = 'No Contact'
    } else {
      phone = suggestion.phone
    }
    if (addresses.length === 0) {
      engAddress = 'No Address';
      engPostal = 'No Postal';

    } else {

      engAddress = `${addresses[0].address.address1}`
      engPostal = addresses[0].address.postalCode
    }

   


    return (
      <>
        <div style={{ width: "100%" }}>
          <span >
            <Card>
              <CardBody>
                <Row>
                  <Col className="text-left col-6">
                    <span className="font-weight-bold mb-0">
                      {name}
                    </span>
                  </Col>
                  <Col className="text-right col-6">
                    <span className="mb-0">{engPostal}</span>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-left col-6">
                    <span className="mb-0">{phone}</span>
                  </Col>
                  <Col className="text-right col-6">
                    <span className="mb-0">{engAddress}</span>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </span>
        </div>
      </>
    );
  }

  const onChange = (event, { newValue }) => {
    setValue(newValue)
  };

  const getClientValue = data => {
    props.getData(data)

    return ``;

  }

  const inputProps = {
    placeholder: 'Search Client',
    value,
    onChange: onChange,
    className: "form-control-alternative"
  };

  const onSuggestionsFetchRequested = ({ value }) => {

    async function getInflowData(value) {
      const response = await fetch(
        `https://api.yehey.jp/inflow/customers/search/${value}`,
        {
            method: "GET",
           
        }
    );
      const json = await response.json();

      setClient(Array.from(json))
      return json;
    }

    getInflowData(value);

  };





  const onSuggestionsClearRequested = () => {
    setClient([]);
  };

  const renderInputComponent = inputProps => (

    <Input {...inputProps} />


  );


  return (
    <>
      <IonSearchbar value={"searchText"} onIonChange={e => e}></IonSearchbar>
    </>
  );
};



export default SearchClient;