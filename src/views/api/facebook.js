export function facebookApi(page, id) {
    return new Promise(resolve => {
        fetch(
            `https://vercelapi.yehey.jp/api/facebook/${page}/${id}`,
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

const getId = async (id) => {
    let data;
    try {

        const ltdDataa = await facebookApi('ltd', id)
        if (Object.keys(ltdDataa) === 'error') {
            const cargoData = await facebookApi('cargo', id)
            if (Object.keys(cargoData) === 'error') {
                const repairData = await facebookApi('repair', id)
                if (Object.keys(repairData) === 'error') {
                    const yj2Data = await facebookApi('yj2', id)
                    if (Object.keys(yj2Data) === 'error') {
                        const fmData = await facebookApi('fast_rem', id)
                        if (Object.keys(fmData) === 'error') {
                            const yrData = await facebookApi('yehey_remit', id)
                            if (Object.keys(yrData) === 'error') {
                                return
                            } else {
                                data = yrData
                            }
                        } else {
                            data = fmData
                        }
                    } else {
                        data = yj2Data
                    }
                } else {
                    data = repairData
                }
            } else {
                data = cargoData
            }
        } else {
            data = ltdDataa
        }


    } catch (e) {
        console.log("Error", e);
    } finally {
        return data
    }
}