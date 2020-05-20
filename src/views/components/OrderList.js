/* eslint-disable no-unreachable */
import React, { useEffect } from 'react';
import { CardText, Table, Media } from 'reactstrap';
import Moment from 'react-moment';
import CurrencyFormat from 'react-currency-format';

const Ordertab = (props) => {
  const customerId = props.inflowCstData.customerId



  const setOrderDetail = data => {
    console.log('setOrderDetail', data)
    props.setOrderDetailData(data)
    props.editActiveTab('OrderDetailTab')
  }

  const setOrderType = (type) => {
    switch (type) {
      case 'box':
        return 'Box'
        break;
      case 'pc':
        return 'PC'
        break;
      case 'pc rep':
        return 'Rep'
        break;
      case 'box nc':
        return 'Box NC'
        break;
      case 'pc nc':
        return 'PC NC'
        break;
      default:
        return ''
        break;
    }

  }

  useEffect(() => {

  }, [customerId]);


  return (
    <>
      <main className="Ordertab">
        <section>

          <Table className="align-items-center" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col" xs={{ size: "auto" }}>Order #</th>

                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Type</th>
                <th scope="col">Amount</th>
                <th scope="col"></th>


              </tr>
            </thead>

            <tbody>



              {(props.orderData).map(item => (

                <tr key={item.salesOrderId}>
                  <th scope="row">
                    <Media className="align-items-center">

                      <span className="mb-0 text-sm">
                        {item.orderNumber}
                      </span>

                    </Media>
                  </th>
                  <td onClick={(e) => (setOrderDetail(item))}>

                    <Timecheck time={item.invoicedDate} />

                  </td>
                  <td onClick={(e) => (setOrderDetail(item))}>
                    <span className="mb-0 text-sm">
                      {item.inventoryStatus}
                    </span>
                  </td>
                  <td onClick={(e) => (setOrderDetail(item))}>
                    <span className="mb-0 text-sm">
                      {setOrderType(item.customFields.custom3)}
                    </span>
                  </td>
                  <td onClick={(e) => (setOrderDetail(item))}><CurrencyFormat value={parseInt(item.total)} displayType={'text'} thousandSeparator={true} prefix={'¥‎'} /></td>

                  <td onClick={(e) => (setOrderDetail(item))}>
                    <i className="ni ni-bold-right" ></i>
                  </td>


                </tr>


              ))}
            </tbody>
          </Table>


        </section>
      </main>
    </>
  );
};

const Timecheck = (time) => {
  const check = (time) => {
    if (!time) {
      return (
        <CardText tag="div">No Date</CardText>
      );
    } else {
      return (
        <Moment format="YYYY/MM/DD">
          {time}
        </Moment>
      )
    }
  }

  return (
    <>
      {check(time.time)}
    </>
  )

}


export default Ordertab;