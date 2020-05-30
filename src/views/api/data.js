const FrontAPIToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsicHJpdmF0ZToqIiwic2hhcmVkOioiLCJwcm92aXNpb25pbmciXSwiaWF0IjoxNTgzMTI0NzE2LCJpc3MiOiJmcm9udCIsInN1YiI6ImpwbWQiLCJqdGkiOiI0NGMyYjgxOGNkMGQ2Y2NmIn0.wK8kzIPIZINy4G38-1pY9WANYAcFkCzw_MieJ93RrpY";
const inFlowAPI_URL = "https://cloudapi.inflowinventory.com/11b89fbf-18bc-4c00-bfff-cf416f56e1a0/";


export function getInflowId(value) {
    return new Promise(resolve => {
        fetch(`https://ap-southeast-2.aws.webhooks.mongodb-stitch.com/api/client/v2.0/app/reactplugin-uxowx/service/AddressAPI/incoming_webhook/getInflowId?frontId=${value}`, {})
            .then((result) => result.json())
            .then((result) => {
                if (Object.keys(result).length === 0) {
                    console.log('getInflowId', false)

                    resolve(false);
                    return
                } else {
                    console.log('getInflowId', result[0])

                    resolve(result[0]);
                    return
                }
            })
    })
}


export function getCustDetailInflow(id) {
    return new Promise(resolve => {
        fetch(
            `${inFlowAPI_URL}customers/${id}?include=addresses&include=pricingScheme&include=defaultLocation&include=taxingScheme&include=defaultPaymentTerms`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer T5LXHGqawsCr8RwnCj-VjDaoA1dRcZbOvy1x3dg9EPU",
                    Accept: "application/json;version=2020-01-30",
                },
            }
        )
            .then((result) => result.json())
            .then((result) => {
                resolve(result);
                return
            })
    })
}

export function getCustDetail(id) {
    return new Promise(resolve => {
        fetch(
            `https://vercelapi.yehey.jp/api/inflow/customers/${id}`,
            {
                method: "GET",
               
            }
        )
            .then((result) => result.json())
            .then((result) => {
                resolve(result);
                return
            })
    })
}

export function getCustOrder(id) {
    return new Promise(resolve => {
        fetch(
            `https://vercelapi.yehey.jp/api/inflow/sales-orders/${id}`,
            {
                method: "GET",
            }
        )
            .then((result) => result.json())
            .then((result) => {
                resolve(result);
                return
            })
    })
}

export function getCustOrderInflow(id) {
    return new Promise(resolve => {
        fetch(
            `${inFlowAPI_URL}sales-orders?filter[customerId]=${id}&include=lines.product.defaultImage`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer T5LXHGqawsCr8RwnCj-VjDaoA1dRcZbOvy1x3dg9EPU",
                    Accept: "application/json;version=2020-01-30",
                },
            }
        )
            .then((result) => result.json())
            .then((result) => {
                resolve(result);
                return
            })
    })
}

export function getFrontContactData(frontData) {
    let id;
    if(frontData.type === 'email'){
        id = `alt:email:${frontData.recipient.handle}`
    }else {
        id = `alt:facebook:${frontData.recipient.handle}`
    }

    return new Promise(resolve => {
        fetch(
            `https://vercelapi.yehey.jp/api/front/context/${id}`,
            {
                method: "GET", // or 'PUT'
                headers: {
                    Authorization: FrontAPIToken,
                },
            }
        )
            .then((result) => result.json())
            .then((result) => {
                resolve(result);
                return
            })
    })
    
}

export function getFrontAvatar(frontData) {
    return new Promise(resolve => {
        fetch(
            `https://api2.frontapp.com/contacts/${frontData.recipient.contact.id}`,
            {
                method: "GET", // or 'PUT'
                headers: {
                    Authorization: FrontAPIToken,
                },
            }
        )
            .then((result) => result.json())
            .then((result) => {

                return fetch(result.avatar_url, {
                    method: "GET",
                    headers: {
                        Authorization: FrontAPIToken,
                    },
                })
                    .then((result) => result.json())
                    .then((result) => {
                        const url = URL.createObjectURL(result);
                        resolve(url);
                        return
                    })
            })
    })
}

export function getFrontAvatar2(frontData) {
    return new Promise(resolve => {
        fetch(frontData.avatar_url, {
                    method: "GET",
                    headers: {
                        Authorization: FrontAPIToken,
                    },
                })
                    .then((result) => result.json())
                    .then((result) => { 
                        
                        resolve(result);
                        return result
                    })
            })
 
}

export function submitInflowData(inflowCstData) {
    return new Promise(resolve => {
        fetch(`${inFlowAPI_URL}customers`, {
            method: "PUT", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer T5LXHGqawsCr8RwnCj-VjDaoA1dRcZbOvy1x3dg9EPU",
                Accept: "application/json;version=2020-01-30",
            },
            body: JSON.stringify(inflowCstData),
        })
            .then((result) => result.json())
            .then((result) => {


                resolve(result);
                return

            })
    })
}