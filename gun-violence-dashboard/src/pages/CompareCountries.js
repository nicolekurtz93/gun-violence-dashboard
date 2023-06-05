import React, { useEffect, useState } from "react";
import { fetchPrivatelyOwnedFireArms } from './CompareCountries.service';
import $ from 'jquery';
import './styles/compareCountries.css'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

function CompareCountries(props) {
    const { countryIds } = props;
    let [endpointData, setEndpointData] = useState(null);
    let [category, setCategory] = useState({value: 'number_of_privately_owned_firearms', text: 'Privately Owned Firearms'})
    let [chartData, setChartData] = useState(undefined);
    let [chartOptions, setChartOptions] = useState(undefined);

    useEffect(() => {
        if ($('#country_ids options').length === 0) {
            countryIds.forEach((value, key) => {
                $('#country_ids').append($('<option>', {
                    value: key,
                    text: value
                }))
            })
        }
    }, [countryIds]);

    useEffect(() => {
        SetChartOptions();
        if (endpointData !== null) {
            $('.no-data p').remove();
            let data = []
            let labels = []
            let emptyData = []
            endpointData.forEach((value, key) => {
                console.log(value, key)
                if (value.size === 0 || (value.size === 1 && isNaN(value.values()[0])) ) {
                    emptyData.push(countryIds.get(key))
                }
                else {
                    let newLine = {
                        label: countryIds.get(key),
                        data: Array.from(value.values()).reverse(),
                        borderColor: setChartColors()
                    }
                    data.push(newLine)
                    if (Array.from(value.keys()).length > labels.length)
                        labels = Array.from(value.keys()).reverse()
                }
            });
            let tempchartData = {
                labels: labels,
                datasets: data
            }
            if (emptyData.length > 0) {
                    $('.no-data')
                        .append(`<p class='font-italic text-danger'>${emptyData.join(', ')} did not have data</p>`)
            }
            setChartData(tempchartData)
        }
    }, [endpointData])

    function SetChartOptions() {
        let tempOptions = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: category.text
                },
                legend: {
                    display: true,
                },
            },
        };
        setChartOptions(tempOptions);
    }

    function setChartColors() {
        const val1 = Math.random() * 255;
        const val2 = Math.random() * 255;
        const val3 = Math.random() * 255;
        return `rgba(${val1}, ${val2}, ${val3}, 1)`;
    }

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

    async function handleSubmission() {
        const selectedCountries = $('#country_ids_selected option').toArray().map(x => x.value);
        $('.no-data-elements').remove();
        fetchPrivatelyOwnedFireArms(selectedCountries, category.value).then(result => setEndpointData(result))
    }

    const handleCategorySelect = (event) => {
        const text = $('#chartCategory option:selected').text()
        setCategory({value: event.target.value, text: text})
    }
    return (
        <>
            <div className="m-4 d-flex justify-content-center">
                <h1 className="">Compare Countries</h1>
            </div>
            <div className="dropdown d-flex justify-content-center align-center">
                <label htmlFor="chartCategory" className="form-input align-self-center">Select Category:</label>
                <select className="form-control w-25 m-2" name="chartCategory" id="chartCategory" onChange={handleCategorySelect} >
                    <option className="dropdown-item text-center" href="#" value="number_of_privately_owned_firearms">Privately Owned Firearms</option>
                    <option className="dropdown-item text-center" href="#" value="total_number_of_gun_deaths">Total Number of Gun Deaths</option>
                    <option className="dropdown-item text-center" href="#" value="number_of_unintentional_gun_deaths">Unintentional Gun Deaths</option>
                </select>
            </div>
            <div className="d-flex justify-content-center m-4">
                <div>
                    <div>
                        <label htmlFor="country_ids" className="form-label">Country Options:</label>
                    </div>
                    <select name="country_ids" multiple="multiple" id="country_ids" className='styles'></select>
                </div>
                <div className="align-self-center">
                    <div className="row m-2">
                        <input type='button' value='Add Country >>' onClick={handleSelection} />
                    </div>
                    <div className="row m-2">
                        <input type='button' value='<< Remove Country' onClick={handleRemoval} />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="country_ids_selected" className="form-label">Countries to Compare:</label>
                    </div>
                    <select name="country_ids_selected" multiple="multiple" id="country_ids_selected" className='styles'></select>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div>
                    <input type='button' value='Compare' className="mt-4 btn btn-success" onClick={handleSubmission} />
                </div>
            </div>
            <div className="d-flex justify-content-center m-4">
                {chartData !== undefined ?
                    <Line data={chartData} options={chartOptions} id="compare-line-chart" /> : null}
            </div>
                <div className="no-data w-100 text-center"></div>
        </>
    );

}

export default CompareCountries;