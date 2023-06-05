
import axios from 'axios';
import $ from 'jquery'

export async function fetchCountryId() {
    const url = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getlocations&format=raw`;
    return axios.get(url)
        .then(result => {
            const finalResult = result.data.locations;
            let mapResult = new Map();
            finalResult.map(x => mapResult.set(x.id, x.name));
            return (mapResult);
        })
        .catch((error) => console.log(error))
}

export async function fetchPrivatelyOwnedFireArms(countryIdList, category) {
    let listOfRanking = new Map();
    let promises = []
    await countryIdList.forEach(async countryId => {

        const url = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=${category}&location_id=${parseInt(countryId)}&format=raw`;
        let response = axios.get(url)
            .then(result => {
                let finalResult = cleanUpEndpointDataForLineChart(result.data.result);
                listOfRanking.set(countryId, finalResult)
            })
            .catch((error) => console.log(error))
        promises.push(response);
    });
    return Promise.all(promises).then(() => { return listOfRanking });
}

function cleanUpEndpointDataForLineChart(data) {
    // remove annotations
    let result = data.columnValue.replace(/\{([^}]+)\}/g, "");
    let arrayResult = result.split(';');
    let finalResultMap = new Map();
    arrayResult.forEach(element => {
        if (element === undefined || element === '')
            return;
        let splitElement = element.split(':')
        splitElement = splitElement.map(value => {
            if (value !== '' && value !== undefined) {
                if (value[0] === ' ') {
                    value = value.substring(1);
                }
                value = value.replace(/,/g, "")
                return value;
            }
        })

        finalResultMap.set(splitElement[0], Number(splitElement[1]))
    });
    return finalResultMap;
}