import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import React from 'react';
import { Bar } from 'react-chartjs-2';

function Explore() {
    const [gunsOwnedData, setGunsOwnedData] = useState([]);
    const [gunsOwnedYears, setGunsOwnedYears] = useState([]);
    const [gunsOwnedGlossary, setGunsOwnedGlossary] = useState("");
    const [gunDeathsData, setGunDeathsData] = useState([]);
    const [gunDeathsYears, setGunDeathsYears] = useState([]);
    const [gunDeathsGlossary, setGunDeathsGlossary] = useState("");
    const [prohibitedFirearms, setProhibitedFirearms] = useState([]);
    const [prohibitionsGlossary, setProhibitionsGlossary] = useState("");
    const [smallArmsManufactured, setSmallArmsManufactured] = useState({ 'years': '', 'data': [] });
    const [smallArmsGlossary, setSmallArmsGlossary] = useState("");

    const [country, setCountry] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({ 'value': '3', 'label': 'Albania' });

    const locationsUrl = '/index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getlocations&format=raw';
    const gunsOwnedUrl = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=number_of_privately_owned_firearms&location_id=${selectedLocation.value}&format=raw`;
    const gunDeathsUrl = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=total_number_of_gun_deaths&location_id=${selectedLocation.value}&format=raw`;
    const prohibitedFirearmsUrl = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=prohibited_firearms_and_ammunition&location_id=${selectedLocation.value}&format=raw`
    const smallArmsManufacturersUrl = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=number_of_small_arms_manufactured&location_id=${selectedLocation.value}&format=raw`

    function cleanData(data) {
        let cleanedData = data.replace(/\{[^}]+\}|\^/g, '');
        cleanedData = cleanedData.split(';');

        return cleanedData

    }

    const fetchLocations = () => {
        axios
            .get(locationsUrl)
            .then((response) => {
                const locationObjects = response.data.locations.map((location) => ({
                    value: location.location_id,
                    label: location.name
                }));
                setLocations(locationObjects);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchGunDeaths = useCallback(() => {
        axios
            .get(gunDeathsUrl)
            .then((response) => {
                const cleanedData = cleanData(response.data.result.columnValue);

                let years = cleanedData.map(str => str.split(':')[0]);
                let data = cleanedData.map(str => str.split(':')[1]);

                years = years.filter(str => str !== "" && str !== undefined);
                years = years.map(str => parseInt(str.replace(/[, ]/g, ""), 10));

                data = data.filter(str => str !== "" && str !== undefined);
                data = data.map(str => parseInt(str.replace(/[, ]/g, ""), 10));

                setGunDeathsYears(years);
                setGunDeathsData(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [gunDeathsUrl]);

    const fetchGunsOwned = useCallback(() => {
        axios
            .get(gunsOwnedUrl)
            .then((response) => {
                const cleanedData = cleanData(response.data.result.columnValue);
                let years = [];
                let data = [];

                if (cleanedData[0].includes(':')) {
                    years = cleanedData.map(str => str.split(':')[0]);
                    data = cleanedData.map(str => str.split(':')[1]);
                    years = years.filter(str => str !== "" && str !== undefined);
                    data = data.filter(str => str !== "" && str !== undefined);
                    years = years.map(str => parseInt(str.replace(/[, ]/g, ""), 10));
                    data = data.map(str => parseInt(str.replace(/[, ]/g, ""), 10));
                } else {
                    years = cleanedData[0];
                    data = []
                }

                setCountry(response.data.result.location);
                setGunsOwnedYears(years);
                setGunsOwnedData(data);

            })
            .catch((error) => {
                console.error(error);
            });
    }, [gunsOwnedUrl]);

    const fetchProhibitions = useCallback(() => {
        axios
            .get(prohibitedFirearmsUrl)
            .then((response) => {
                const cleanedData = cleanData(response.data.result.columnValue)
                console.log(cleanedData)
                setProhibitedFirearms(cleanedData[0]);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [prohibitedFirearmsUrl]);

    const handleLocationChange = (selectedOption) => {
        setSelectedLocation(selectedOption);
    };

    const fetchSmallArms = useCallback(() => {
        axios
            .get(smallArmsManufacturersUrl)
            .then((response) => {
                const cleanedData = cleanData(response.data.result.columnValue);
                let years = [];
                let data = [];

                if (cleanedData[0].includes(':')) {
                    years = cleanedData.map(str => str.split(':')[0]);
                    data = cleanedData.map(str => str.split(':')[1]);
                    years = years.filter(str => str !== "" && str !== undefined);
                    data = data.filter(str => str !== "" && str !== undefined);
                    years = years.map(str => parseInt(str.replace(/[, ]/g, ""), 10));
                    data = data.map(str => parseInt(str.replace(/[, ]/g, ""), 10));
                } else {
                    years = cleanedData[0];
                    data = []
                }

                setSmallArmsManufactured({ 'years': years, 'data': data })
                console.log(smallArmsManufactured)

            })
            .catch((error) => {
                console.error(error);
            });
    }, [smallArmsManufacturersUrl]);

    const fetchGlossaryData = useCallback(() => {
        const categories = [
            "number_of_privately_owned_firearms",
            "total_number_of_gun_deaths",
            "prohibited_firearms_and_ammunition",
            "number_of_small_arms_manufactured"
        ];
        const glossaries = [
            setGunsOwnedGlossary,
            setGunDeathsGlossary,
            setProhibitionsGlossary,
            setSmallArmsGlossary
        ];

        categories.forEach((category, index) => {
            let glossaryUrl = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getglossarydata&category=${category}&location_id=${selectedLocation.value}&format=raw`;

            axios
                .get(glossaryUrl)
                .then((response) => {
                    console.log(response.data.result);
                    const cleanedData = cleanData(response.data.result.content);
                    glossaries[index](cleanedData[0]);
                    console.log(cleanedData[0]);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }, [selectedLocation.value]);

    useEffect(() => {
        fetchLocations();
        fetchGunsOwned(selectedLocation);
        fetchGunDeaths();
        fetchProhibitions();
        fetchSmallArms();
        fetchGlossaryData();
    }, [fetchGlossaryData, fetchGunDeaths, fetchGunsOwned, fetchProhibitions, fetchSmallArms, selectedLocation]);

    const gunsOwnedChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            title: {
                display: false,
            },
        },
    };

    const gunsOwnedChartData = {
        labels: gunsOwnedYears,
        datasets: [
            {
                label: 'Number of Privately Owned Guns',
                data: gunsOwnedData,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const gunDeathsChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            title: {
                display: false,
            },
        },
    };

    const gunDeathsChartData = {
        labels: gunDeathsYears,
        datasets: [
            {
                label: 'Number of Gun Deaths',
                data: gunDeathsData,
                backgroundColor: '#ff0018',
            },
        ],
    };

    const smallArmsChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            title: {
                display: false,
            },
        },
    };

    const smallArmsChartData = {
        labels: smallArmsManufactured.years,
        datasets: [
            {
                label: 'Number of Small Arms Manufactured',
                data: smallArmsManufactured.data,
                backgroundColor: '#ff0018',
            },
        ],
    };

    function noDataAvailable() {
        return (
            <div className="d-flex align-items-center justify-content-center bg-secondary text-white mt-4" style={{ height: "100px" }}>
                <p className="text-center">No data available</p>
            </div>
        );
    }

    function renderProhibitons() {
        if (prohibitedFirearms) {
            return (
                <div>
                    <blockquote className="blockquote blockquote-custom bg-white px-3 pt-4">
                        <div className="blockquote-custom-icon bg-info shadow-1-strong">
                            <i className="fa fa-quote-left text-white"></i>
                        </div>
                        <p className="mb-0 mt-2 font-italic text-capitalize">"{String(prohibitedFirearms).trim()}"</p>
                    </blockquote>
                </div>
            );
        }

        return noDataAvailable();
    }

    function renderGunsOwnedChart() {
        if (gunsOwnedData.length >= 1) {
            return (<Bar options={gunsOwnedChartOptions} data={gunsOwnedChartData}></Bar>);
        } else {
            return (<p>No yearly data available. Estimated numbers: {gunsOwnedYears.length >= 1 ? gunsOwnedYears : "None available"}</p>)
        }
    }

    function renderGunDeathsChart() {
        if (gunDeathsData.length >= 1) {
            return (<Bar options={gunDeathsChartOptions} data={gunDeathsChartData}></Bar>);
        } else {
            return noDataAvailable();
        }
    }

    function renderSmallArmsChart() {
        if (smallArmsManufactured.data.length >= 1) {
            return (<Bar options={smallArmsChartOptions} data={smallArmsChartData}></Bar>);
        } else {
            return noDataAvailable();
        }
    }

    return (
        <div className='d-flex flex-column align-items-center m-4'>
            <h1>Explore By Location</h1>
            <h2>{country}</h2>
            <Select
                aria-label='countrySelector'
                options={locations}
                value={selectedLocation}
                onChange={handleLocationChange}
                placeholder="Select a location"
                isSearchable
            />
            <div className='d-flex flex-row justify-content-center w-75 mt-4'>
                <div className='w-25 m-4'>
                    {renderGunsOwnedChart()}
                </div>
                <div className='w-25 m-4'>
                    <h3>Gun Ownership</h3>
                    <p dangerouslySetInnerHTML={{ __html: gunsOwnedGlossary }}></p>
                </div>

            </div>
            <div className='d-flex flex-row justify-content-center w-75 mt-4'>
                <div className='w-25 m-4'>
                    <h3>Gun Deaths</h3>
                    <p dangerouslySetInnerHTML={{ __html: gunDeathsGlossary }}></p>
                </div>
                <div className='w-25 m-4'>

                    {renderGunDeathsChart()}
                </div>

            </div>
            <div className='d-flex flex-row justify-content-center w-75 mt-4'>
                <div className='w-25 m-4'>

                    {renderProhibitons()}
                </div>
                <div className='w-25 m-4'>
                    <h3>Prohitbited Firearms and Ammunition</h3>
                    <p dangerouslySetInnerHTML={{ __html: prohibitionsGlossary }}></p>
                </div>
            </div>

            <div className='d-flex flex-row justify-content-center w-75 mt-4'>
                <div className='w-25 m-4'>
                    <h3>Small Arms Manufactured</h3>
                    <p dangerouslySetInnerHTML={{ __html: smallArmsGlossary }}></p>
                </div>
                <div className='w-25 m-4'>

                    {renderSmallArmsChart()}
                </div>
            </div>
        </div>
    );
}

export default Explore;
