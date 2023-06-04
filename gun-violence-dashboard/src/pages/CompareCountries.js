import React, { useEffect, useState } from "react";
import { fetchCountryId, fetchPrivatelyOwnedFireArms } from './CompareCountries.service';
import $ from 'jquery';
import './styles/compareCountries.css'

function CompareCountries(props) {
    const { countryIds } = props;

    countryIds.forEach((value, key) => {
        $('#country_ids').append($('<option>', {
            value: key,
            text: value
        }))
    })

    const sortAlphabeticalOrder = function (selection) {
        $(selection).find(
            $('option'))
                .sort(function (current, next) {
                    const currentValue = current.text;
                    const nextValue = next.text;
                    if (currentValue < nextValue) {
                        return -1;
                    }
                    if (currentValue > nextValue) {
                        return 1;
                    }
                    return 0;
                })
    }

    function handleSelection() {
        const value = $('#country_ids option:selected');
        console.log(value)
        $('#country_ids').find("option:selected").remove();
        value.appendTo('#country_ids_selected')
        sortAlphabeticalOrder('#country_ids_selected')
    }

    function handleRemoval() {
        $('#country_ids_selected option:selected').remove().appendTo('#country_ids');
        sortAlphabeticalOrder('#country_ids')
    }
    return (
        <>
            <h1>This is the Ranking Page</h1>
            <div className="d-flex justify-content-center">
                <div>
                    <select name="country_ids" multiple="multiple" id="country_ids" className='styles'></select>
                </div>
                <div className="align-self-center">
                    <div className="row m-2">
                        <input type='button' value='Add Country >>' onClick={handleSelection} />
                    </div>
                    <div className="row m-2">
                        <input type='button' value='Remove Country <<' onClick={handleRemoval} />
                    </div>
                </div>
                <div>
                    <select name="country_ids_selected" multiple="multiple" id="country_ids_selected" className='styles'></select>
                </div>
            </div>
        </>
    );

}

export default CompareCountries;