import React, { useEffect, useState } from "react";
import { fetchCountryId, fetchPrivatelyOwnedFireArms } from './CompareCountries.service';
import $ from 'jquery';
import './styles/compareCountries.css'

function CompareCountries(props) {
    const { countryIds } = props;
    const [privatelyOwnedFireArms, setPrivatelyOwnedFireArms] = useState([])


    useEffect(() => {
        console.log('adding')
        countryIds.forEach((value, key) => {
            $('#country_ids').append($('<option>', {
                value: key,
                text: value
            }))
        })
    }, [countryIds]);

    const sortAlphabeticalOrder = function (selection) {
        const selected = $(`${selection} option`);

        var sortedResult = selected.sort(function (current, next) {
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

        $(`${selection} option`).remove()
        $(selection).html(sortedResult)
    }

    function handleSelection() {
        $('#country_ids option:selected').remove().appendTo('#country_ids_selected');
        sortAlphabeticalOrder('#country_ids_selected')
    }

    function handleRemoval() {
        $('#country_ids_selected option:selected').remove().appendTo('#country_ids');
        sortAlphabeticalOrder('#country_ids')
    }

    function handleSubmission() {
        const selectedCountries = $('#country_ids_selected option').toArray().map(x => x.value);

        fetchPrivatelyOwnedFireArms(selectedCountries)
            .then(result => setPrivatelyOwnedFireArms(result))
    }
    return (
        <>
            <div className="d-flex justify-content-center m-4">
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
            <div className="d-flex justify-content-center">
                <div>
                    <input type='button' value='Compare' className="mt-4 btn btn-success" onClick={handleSubmission} />
                </div>
            </div>
            <div>
                {privatelyOwnedFireArms ? privatelyOwnedFireArms.toString() : null}
            </div>
        </>
    );

}

export default CompareCountries;