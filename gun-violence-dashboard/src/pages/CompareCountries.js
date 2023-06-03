import React, { useEffect, useState } from "react";
import { fetchCountryId, fetchPrivatelyOwnedFireArms } from './CompareCountries.service';
import $ from 'jquery'

function CompareCountries() {
    const [countryIds, setCountryIds] = useState([]);

    useEffect(() => {
        fetchCountryId().then(result => {
            setCountryIds(result)
            console.log(countryIds)
        })
    }, []);
    return (
        <>
            <h1>This is the Ranking Page</h1>
            <div>
                <select name="county_ids" multiple="multiple" id="county_ids"></select>
            </div>
        </>
    );
}

export default CompareCountries;