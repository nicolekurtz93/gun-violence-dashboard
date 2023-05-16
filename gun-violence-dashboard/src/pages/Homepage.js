import React, { useEffect, useState } from "react";
import USAMap from "react-usa-map";
import axios from 'axios';
import states from '../components/map_constants'

function Homepage() {
    const [avgStateGunViolence, setAvgStateGunViolence] = useState([]);
    let stateAbbreviationConversion = new Map(states);
    const mapOfAverages = new Map();
    useEffect(() => {
        async function fetchAvgData() {
            const url = 'https://datausa.io/api/data/?drilldowns=State&measures=Firearm Fatalities&year=2021';
            return axios.get(url)
                .then((data) => setAvgStateGunViolence(data.data.data))
                .catch((error) => console.log(error))
        }
        fetchAvgData()

    }, []);

    const giveStatesTitles = () => {
        const map = document.querySelector('.us-state-map')
        const mapTitles = map.querySelectorAll('title');
        mapTitles.forEach((mapTitle) => {
            let fatalityValue = mapOfAverages.get(mapTitle.textContent);
            if (fatalityValue)
                mapTitle.textContent = `The average Firearm Fatality for ${mapTitle.textContent} is ${String(fatalityValue)}`;
        })
    }

    const formatStates = () => {
        let colorMap = {};
        if (avgStateGunViolence.length > 0) {
            avgStateGunViolence.forEach((st) => {
                const opacity = Number((st['Firearm Fatalities'] / 100)).toFixed(4) * 4;
                const abbreviation = stateAbbreviationConversion.get(st['State']);
                if (abbreviation === null || abbreviation === '') {
                    console.log("ERROR", st)
                }
                else {
                    let fill = `rgba(240 , 0, 0, ${opacity} )`
                    colorMap[abbreviation] = {
                        fill: fill,
                    }
                }
                mapOfAverages.set(st['State'], st['Firearm Fatalities'].toFixed(4));
            })
            giveStatesTitles();
        }
        return colorMap
    }

    return (
        <>
            <div className="d-flex justify-content-center m-3">
                <h1 className="text-align-center">Number of deaths due to firearms per 100,000 population in the US</h1>
            </div> 
            <div className="d-flex justify-content-center">
                <USAMap 
                customize={formatStates()} 
                defaultFill = 'rgba(240 , 0, 0, 1)'
                title='Number of deaths due to firearms per 100,000 population in the US' />
                
            </div>
        </>
    );
}

export default Homepage;