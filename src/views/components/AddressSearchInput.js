import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import './autosearch.css'
import {
 
  FormGroup, Input,
  
  
} from "reactstrap";


export const AddressInput = (props) => {
  const [addresses, setAddresses] = useState([]);
  const [value, setValue] = useState('')
  
 
  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = `${suggestion.postal_code} ${suggestion.prefecture} ${suggestion.city} ${suggestion.town}`;
    const matches = match(suggestionText, query);
    const parts = parse(suggestionText, matches);
  
    return (
      <span className={'suggestion-content ' + suggestion.postal_code}>
        <span className="form-control-alternative">
          {
            parts.map((part, index) => {
              const className = part.highlight ? 'highlight' : null;
  
              return (
                <span className={className} key={index}>{part.text}</span>
              );
            })
          }
        </span>
      </span>
    );
  }
  
  const onChange = (event, { newValue }) => {
    setValue(newValue)
  };

  const getAddressValue = address => {
    props.changeAddress(address)

    return ``;

  }

  const inputProps = {
    placeholder: 'Search Address',
    value,
    onChange: onChange,
    className: "form-control-alternative"
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    
    
    fetch(
      `https://ap-southeast-2.aws.webhooks.mongodb-stitch.com/api/client/v2.0/app/reactplugin-uxowx/service/AddressAPI/incoming_webhook/frontAddress?search=${value}*`,
      {
        method: "GET",
      }
    )
      .then((result) => result.json())
      .then((result) => {
        setAddresses(Array.from(result))
      })

      
        
        
  };

  

  const onSuggestionsClearRequested = () => {
    setAddresses([]);
  };

  const getAddresses = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    

    return inputValue
  };

  const renderInputComponent = inputProps => (
    
      <Input {...inputProps} />
     
   
  );


  return (
    <>
    <FormGroup className="mb-4">
      <Autosuggest
        suggestions={addresses}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getAddressValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
      />
      </FormGroup>
    </>
  );
};



export default AddressInput;