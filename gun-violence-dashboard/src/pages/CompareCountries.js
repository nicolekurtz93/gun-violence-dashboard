import React, { useEffect, useState } from "react";
import { fetchCountryId, fetchPrivatelyOwnedFireArms } from './CompareCountries.service';
import $ from 'jquery';
import './styles/compareCountries.css'

function CompareCountries() {
    const [countryIds, setCountryIds] = useState([]);

    useEffect(() => {
        fetchCountryId().then(result => {
            setCountryIds(result);
        })
    }, []);

    useEffect(() => {
        console.log('ids', countryIds)
        countryIds.forEach((value, key) => {
            $('#county_ids').append($('<option>', {
                value: key,
                text: value
            }))
        })
    }, [countryIds])
    return (
        <>
            <h1>This is the Ranking Page</h1>
            <div className="container h-100">
                <select name="county_ids" multiple="multiple" id="county_ids"></select>
            </div>
        </>
    );
}

export default CompareCountries;