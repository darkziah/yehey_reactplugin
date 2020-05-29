import React, { useEffect, useState } from 'react';
import './App.css';
import Front from "@frontapp/plugin-sdk";
import { IonLoading } from '@ionic/react';


import SearchInflow from "./views/SearchInflow"
import Plugin from "./views/Plugin"

import { getInflowId, getCustDetail, getCustOrder, getFrontContactData } from './views/api/data'



function App() {
  const [FrontId, setFrontId] = useState(''); // facebook id or front id
  const [pluginData, setpluginData] = useState({}); // plugin record of Facebook id
  const [hasRecord, setHasRecord] = useState(false); // changing search to plugin
  const [frontData, setfrontData] = useState(); //for avatar frontdata
  const [custOrderData, setcustOrderData] = useState();
  const [FrontContactData, setFrontContactData] = useState();

  const [custData, setcustData] = useState({});
  const [showLoading, setShowLoading] = useState(true);

  // if counter is changed, than fn will be updated with new counter value
  const fn = React.useCallback(() => {
    Front.contextUpdates.subscribe(context => {
      switch (context.type) {
        case 'noConversation':
          console.log('No conversation selected');
          break;
        case 'singleConversation':
          setfrontData(context.conversation)
          setFrontId(context.conversation.recipient.handle)
          break;
        case 'multiConversations':
          console.log('Multiple conversations selected', context.conversations);
          break;
        default:
          console.error(`Unsupported context type: ${context.type}`);
          break;
      }
    });

  }, [FrontId]);

  // if counter is changed, than fn will not be updated and counter will be always 1 inside fn
  /*const fnBad = useCallback(() => {
      setCounter(counter + 1);
    }, []);*/
  const prevFrontIdRef = React.useRef();
  // if fn or counter is changed, than useEffect will rerun
  useEffect(() => {
    prevFrontIdRef.current = FrontId;
    if (!(FrontId === prevFrontIdRef.current)) return; // this will stop the loop if counter is even


    fn();
  }, [prevFrontIdRef, fn]);

  useEffect(() => {
    prevFrontIdRef.current = FrontId;

  });


  const prevFrontId = prevFrontIdRef.current;


  useEffect(() => {
    if (prevFrontId === FrontId) {
      return;
    } else {
      frontidChecker(FrontId)
      return;
    }

  }, [FrontId]);


  const LinkedDone = () => {
    setShowLoading(true)
    frontidChecker(FrontId)
  }


  async function frontidChecker(id) {

    const data = await getInflowId(id)
    if (!data) {
      console.log('data false', data)
      setHasRecord(false)
      setShowLoading(false)
      return
    } else {
      console.log('data', data)

      const proc = await Process(data)

      if(proc){
        setHasRecord(true)
        setShowLoading(false)
        return
      }
      
      
      
    }



  }


  async function Process(data){

    const custData = await getCustDetail(data.inflowId)
    const custOrderData = await getCustOrder(data.inflowId)
    const getFContactData = await getFrontContactData(frontData)
    
      setcustOrderData(custOrderData)
      setcustData(custData)
      setFrontContactData(getFContactData)
      setpluginData(data)
     

    return new Promise(resolve => {
    
      if(custOrderData){
        resolve(true)
      }
    })
  }



  // this will be infinite loop because fn is always changing with new counter value
  /*useEffect(() => {
    fn();
  }, [fn]);*/

  return (
    <div>
      <IonLoading
        cssClass='my-custom-class'
        isOpen={showLoading}
        message={'Please wait...'}
        
      />

      {hasRecord ? <Plugin FrontContactData={FrontContactData} custOrderData={custOrderData} custData={custData} pluginData={pluginData} frontId={FrontId} /> : <SearchInflow frontId={FrontId} LinkedDone={LinkedDone} />}
    </div>
  );
}

export default App;
