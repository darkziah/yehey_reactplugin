import React, { useEffect, useState, createRef } from 'react';
import './App.css';
import Front from "@frontapp/plugin-sdk";


import SearchInflow from "./views/SearchInflow"
import Plugin from "./views/Plugin"

function App() {
  const [hasRecord, setHasRecord] = useState(false);
  const [frontData, setfrontData] = useState({});
  const [frontId, setfrontId] = useState('');
  const [inFlowRecord, setinFlowRecord] = useState({});

  const refFromCreateRef = createRef()

  if (!refFromCreateRef.current) {
    refFromCreateRef.current = hasRecord
  }

  async function getInflowId(value) {
    const response = await fetch(`https://ap-southeast-2.aws.webhooks.mongodb-stitch.com/api/client/v2.0/app/reactplugin-uxowx/service/AddressAPI/incoming_webhook/getInflowId?frontId=${value}`, {});
    const json = await response.json();

    if (Object.keys(json).length === 0) {
      setHasRecord(false)
    } else {
      setinFlowRecord(json[0])
      setHasRecord(true)
    }
    return json;
  }

  const LinkedDone = () => {
    getInflowId(frontId)
  }


  useEffect(() => {
    const Process = (value) => {
      setfrontData(value)
      if (value.recipient.handle) {
        setfrontId(value.recipient.handle)
        getInflowId(value.recipient.handle).then(data => {
        console.log("ID",value.recipient.handle)
        });
      }
    }

    Front.contextUpdates.subscribe(context => {
      switch (context.type) {
        case 'noConversation':
          console.log('No conversation selected');
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


  }, [frontId]);

  if (refFromCreateRef.current) {


    return (
      <>
        <Plugin frontData={frontData}/>
      </>
    )
  } else {
    return (
      <>
        {console.log(frontId)}
        <SearchInflow frontId={frontId}  LinkedDone={LinkedDone}/>
      </>
    )
  };
}



export default App;
