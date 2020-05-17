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
    placeholder: 'Search Address',
    value,
    onChange: onChange,
    className: "form-control-alternative"
  };

  const onSuggestionsFetchRequested = ({ value }) => {

    async function getInflowData(value) {
      const response = await fetch(`https://cloudapi.inflowinventory.com/11b89fbf-18bc-4c00-bfff-cf416f56e1a0/customers?filter[smart]=${value}&include=addresses&count=15`, {
        method: "GET",
       
        
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer T5LXHGqawsCr8RwnCj-VjDaoA1dRcZbOvy1x3dg9EPU",
          Accept: "application/json;version=2020-01-30",
        },
      });
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
      <FormGroup className="mb-4">
        <Autosuggest
          suggestions={client}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getClientValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          renderInputComponent={renderInputComponent}
        />
      </FormGroup>
    </>
  );
};



export default SearchClient;



