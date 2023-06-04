
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

export async function fetchPrivatelyOwnedFireArms(countryIdList) {
    console.log(countryIdList)
    const listOfRanking = []
    let taskList = []
    countryIdList.forEach(countryId => {
        const url = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=number_of_privately_owned_firearms_-_world_ranking&location_id=${countryId.id}&format=raw`;
        let result = axios.get(url)
            .then(result => {
                let finalResult = result.data.result;
                listOfRanking.push(finalResult)
            })
            .catch((error) => console.log(error))
        
        taskList.push(result)
    });
    await $.when.apply($, taskList).done(function(){
        console.log("done")
    })
    return listOfRanking
}