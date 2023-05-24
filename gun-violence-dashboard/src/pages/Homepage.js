import React, { useEffect, useState } from "react";
import USAMap from "react-usa-map";
import axios from 'axios';
import states from '../constants/map_constants';
import stateIds from "../constants/state_ids";
import { fetchAvgFatalityData, fetchStateGrade, fetchGunOwnershipLevels, fetchProhibitedFireArms } from '../pages/Homepage.service'
import $ from 'jquery';
import ReactDom from 'react-dom';
import './styles/homepage.css';

function Homepage() {
    const [avgStateGunViolence, setAvgStateGunViolence] = useState([]);
    const [yearForData, setYearForData] = useState('2021')

    let stateAbbreviationConversion = new Map(states);
    let stateIdsForGunPolicyEndpoint = new Map(stateIds);
    const mapOfAverages = new Map();
    const gunLawUrl = 'https://giffords.org/lawcenter/gun-laws/states/'

    $('.us-state-map').attr('width', '100%');

    useEffect(() => {
        fetchAvgFatalityData(yearForData).then((result) => setAvgStateGunViolence(result))
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
                setStateFill(st, colorMap);
            })
            giveStatesTitles();
        }
        return colorMap
    }

    const handleSelect = (event) => {
        setYearForData(event.target.value)
    }

    function setStateFill(st, colorMap) {
        const stateName = st['State'];
        // Opacity must be between 0 and 1, to do this I am taking the fatality
        // dividing it by 100 so it is a decimal, keeping it to 4 decimal places, 
        // and to make the opacity more visible, I chose to multiply by 4. 
        const opacity = Number((st['Firearm Fatalities'] / 100)).toFixed(4) * 4;
        const abbreviation = stateAbbreviationConversion.get(stateName);
        if (abbreviation === null || abbreviation === '') {
            console.log("ERROR", st);
        }
        else {
            let fill = `rgba(240 , 0, 0, ${opacity} )`;
            colorMap[abbreviation] = {
                fill: fill,
                clickHandler: setClickBehaviorForState(gunLawUrl + stateName, stateName)
            };
        }
        mapOfAverages.set(stateName, st['Firearm Fatalities'].toFixed(2));
    }

    function setClickBehaviorForState(gunLawUrl, stateName) {
        return (event) => {
            const stateId = stateIdsForGunPolicyEndpoint.get(stateName);

            $('#card-title').text(`${stateName} Gun Detail`)
            $('.card-api-details').hide();
            $('#loader').toggle();

            let grade = fetchStateGrade(stateId)
                .then(result => {
                    $('.card-gun-grade')
                        .children('p.detail-header').text(`Giffords State Gun Law Grade:`)
                    $('.card-gun-grade')
                        .children('p.detail-text').text(result)
                })

            let ownership = fetchGunOwnershipLevels(stateId).then(results => {
                $('.card-household')
                    .children('.detail-header')
                    .text(`\nPercentage of households with a gun: `)
                results.forEach(result =>
                    $('.card-household')
                        .children('.detail-text')
                        .text(`${result}`))
            })

            let prohib = fetchProhibitedFireArms(stateId).then(results => {
                $('.card-prohibited')
                    .children('.detail-header')
                    .text(`\nProhibited Firearm and Ammunition: `)
                $('.card-prohibited')
                    .children('.detail-text')
                    .text(`${results}`)
            })

            prohib.then(ownership.then(grade.finally(x => {
                $('#loader').toggle()
                $('.card-api-details').show()
            })))

            $('.card-link').html(``)
            $('.card-link')
                .append($('<a></a>')
                    .attr('href', gunLawUrl)
                    .html(`Learn more about ${stateName}'s Gun Policies`))


        };
    }

    return (
        <>
            <div className="m-3">
                <h1 className="text-center">Number of deaths due to firearms per 100,000 population in the US</h1>
            </div>
            <div className="dropdown d-flex justify-content-center align-center">
                <label htmlFor="fatalityYear" className="form-input align-self-center">Select Year:</label>
                <select className="form-control w-25 m-2" name="fatalityYear" id="fatalityYear" onChange={handleSelect}>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2021</option>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2020</option>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2019</option>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2018</option>
                    <option className="dropdown-item text-center" href="#" onSelect={handleSelect}>2017</option>
                </select>
            </div>
            <div className="homepage-container d-flex justify-content-center">
                <div className="d-flex justify-content-center mt-4 align-self-center">
                    <USAMap
                        id='usaMap'
                        customize={formatStates()}
                        defaultFill='rgba(240 , 0, 0, 1)'
                        title='Number of deaths due to firearms per 100,000 population in the US' />

                </div>
                <div className="m-5 card align-self-center p-2">
                    <div className="card-body">
                        <h2 className="card-title" id="card-title">State Detail</h2>
                        <img
                            id="loader"
                            src={require("../loader.gif")}
                            alt="gif of a loading element"
                        />
                        <div className="card-api-details">
                            <div className="card-text" id="card-text">Select a state to see more details about their firearm statistics.</div>
                            <div className="card-link"></div>
                            <div className="card-gun-grade">
                                <p className="detail-header"></p>
                                <p className="detail-text"></p>
                            </div>
                            <div className="card-household">
                                <p className="detail-header"></p>
                                <p className="detail-text"></p>
                            </div>
                            <div className="card-prohibited">
                                <p className="detail-header"></p>
                                <p className="detail-text"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Homepage;

