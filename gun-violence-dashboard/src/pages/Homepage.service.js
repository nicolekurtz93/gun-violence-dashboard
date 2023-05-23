
import axios from 'axios';
export function fetchAvgFatalityData(yearForData) {
    const url = `https://datausa.io/api/data/?drilldowns=State&measures=Firearm Fatalities&year=${yearForData}`;
    return axios.get(url)
        .then((data) => data.data.data)
        .catch((error) => console.log(error))
}

export async function fetchStateGrade(stateId) {
    const url = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=grading_state_gun_laws&location_id=${stateId}&format=raw`;
    return await axios.get(url)
        .then(result => result.data.result)
        .then(result => result.columnValue.split('')[1])
        .catch((error) => console.log(error))
}

export async function fetchProhibitedFireArms(stateId) {
    const url = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=prohibited_firearms_and_ammunition&location_id=${stateId}&format=raw`;
    return await axios.get(url)
        .then(result => result.data.result)
        .then(result => { return cleanUpGunPolicyDataNoDelimiter(result) })
        .catch((error) => console.log(error))
}

export async function fetchGunOwnershipLevels(stateId) {
    const url = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=average_gun_ownership_levels_by_us_state_and_decade&location_id=${stateId}&format=raw`;
    return await axios.get(url)
        .then(result => result.data.result)
        .then(result => { return cleanUpGunPolicyDataSemicolonDelimiter(result) })
        .catch((error) => console.log(error))
}

function cleanUpGunPolicyDataSemicolonDelimiter(data) {
    let splitData = data.columnValue.split(';');
    let finalResult = [];
    splitData.forEach(element => {
        if (element === '')
            return;
        if (element[0] === ' ') {
            element = element.substring(1);
        }
        element = element.split('{')[0];
        finalResult.push(element)
    });
    return finalResult;
}

function cleanUpGunPolicyDataNoDelimiter(data) {
    let result = data.columnValue.replace(/\{([^}]+)\}/g, "");
    // content is coming in with first word not capitalized, resolving that here:
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
}