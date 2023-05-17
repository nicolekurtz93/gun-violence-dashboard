import React, { useEffect, useState } from "react";
import USAMap from "react-usa-map";
import axios from 'axios';
import states from '../constants/map_constants'

function Homepage() {
    const [avgStateGunViolence, setAvgStateGunViolence] = useState([]);
    const [yearForData, setYearForData] = useState([])
    let stateAbbreviationConversion = new Map(states);
    const mapOfAverages = new Map();
    const gunLawUrl = 'https://giffords.org/lawcenter/gun-laws/states/'

    useEffect(() => {
        async function fetchAvgData() {
            const url = `https://datausa.io/api/data/?drilldowns=State&measures=Firearm Fatalities&year=${yearForData}`;
            return axios.get(url)
                .then((data) => setAvgStateGunViolence(data.data.data))
                .catch((error) => console.log(error))
        }

        fetchAvgData()

    }, [yearForData]);

    const giveStatesTitles = () => {
        const map = document.querySelector('.us-state-map')
        const mapTitles = map.querySelectorAll('title');
        mapTitles.forEach((mapTitle) => {
            let fatalityValue = mapOfAverages.get(mapTitle.textContent);
            if (fatalityValue)
                mapTitle.textContent = `Average Firearm Fatality for ${mapTitle.textContent}: ${String(fatalityValue)}`;
        })
    }

    const formatStates = () => {
        let colorMap = {};
        if (avgStateGunViolence.length > 0) {
            avgStateGunViolence.forEach((st) => {
                const stateName = st['State']
                const opacity = Number((st['Firearm Fatalities'] / 100)).toFixed(4) * 4;
                const abbreviation = stateAbbreviationConversion.get(stateName);
                if (abbreviation === null || abbreviation === '') {
                    console.log("ERROR", st)
                }
                else {
                    let fill = `rgba(240 , 0, 0, ${opacity} )`
                    colorMap[abbreviation] = {
                        fill: fill,
                        clickHandler: (event) => window.location.href = gunLawUrl + stateName
                    }
                }
                mapOfAverages.set(stateName, st['Firearm Fatalities'].toFixed(4));
            })
            giveStatesTitles();
        }
        return colorMap
    }

    const handleSelect = (event) => {
        // yearForData = event.target.value;
        setYearForData(event.target.value)
    }

    return (
        <>
            <div className="m-3">
                <h1 className="text-center">Number of deaths due to firearms per 100,000 population in the US</h1>
                <h2 className="text-center text-muted">Hover over state to see fatality averages</h2>
                <h2 className="text-center text-muted">Click on state to learn more about its gun laws</h2>
            </div>
            <div className="dropdown d-flex justify-content-center">
                <select className="form-control w-25" onChange={handleSelect}>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect} >2021</option>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2020</option>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2019</option>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2018</option>
                </select>
            </div>
            <div className="d-flex justify-content-center mt-4">
                <USAMap
                    customize={formatStates()}
                    defaultFill='rgba(240 , 0, 0, 1)'
                    title='Number of deaths due to firearms per 100,000 population in the US' />

            </div>
            <div className="container-fluid">
            </div>
        </>
    );
}

export default Homepage;