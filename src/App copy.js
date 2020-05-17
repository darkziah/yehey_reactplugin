import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Front from "@frontapp/plugin-sdk";



function App() {
 const [isConv, setisConv] = useState(false);
 const [hasRecord, setHasRecord] = useState();
 const [frontData, setfrontData] = useState({});
 const [frontId, setfrontId] = useState('');
 const [inFlowRecord, setinFlowRecord] = useState({});

 async function getInflowId(value) {
  const response = await fetch(`https://ap-southeast-2.aws.webhooks.mongodb-stitch.com/api/client/v2.0/app/reactplugin-uxowx/service/AddressAPI/incoming_webhook/getInflowId?frontId=${value}`, {});
  const json = await response.json();

  if(Object.keys(json).length === 0 ){
    setHasRecord(false)  
  } else {
    setinFlowRecord(json[0])
    console.log('true')
    setHasRecord(true)
  }
  return json;
}
 

  useEffect(() => {
    const Process = (value) => {
      setisConv(true)
      setfrontData(value)
      if(value.recipient.handle.length){
         getInflowId(value.recipient.handle).then(data => {
          
        });
      }
    }

    Front.contextUpdates.subscribe(context => {
      switch(context.type) {
        case 'noConversation':
          console.log('No conversation selected');
          setisConv(false)
          break;
        case 'singleConversation':
          console.log('Selected conversation:', context.conversation);
          
          
          
          Process(context.conversation)
          
          break;
        case 'multiConversations':
          console.log('Multiple conversations selected', context.conversations);
          break;
        default:
          console.error(`Unsupported context type: ${context.type}`);
          break;
      }
    });

    
  }, []);
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        
        {hasRecord ? <></> : <a
          className="App-link"
        >
          Learn React
        </a> }
      </header>
    </div>
  );
}

export default App;
