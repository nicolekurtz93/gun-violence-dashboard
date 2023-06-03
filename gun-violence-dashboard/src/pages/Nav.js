import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Explore from "./Explore";
import Compare from "./Compare";
import About from "./About";
import 'bootstrap/dist/css/bootstrap.css';
import Ranking from "./Ranking";
import { useEffect, useState } from "react";
import {fetchCountryId, fetchPrivatelyOwnedFireArms} from "./Ranking.service"


export const Navbar = () => {
    const [countryId, setCountryIds] = useState([]);
    const [privatelyOwnedFireArms, setPrivatelyOwnedFireArms] = useState([]);
    useEffect(() => {
        fetchCountryId().then(result => {
            setCountryIds(result)
            fetchPrivatelyOwnedFireArms(result).then(result => {
                console.log(result)
                setPrivatelyOwnedFireArms(result)
                console.log(privatelyOwnedFireArms)
            }
            )
        })
    }, []);
    return (
        <><nav className="navbar navbar-expand navbar-light text-align-center bg-primary">
            <ul className="navbar-nav d-flex flex-wrap">
                <li className="logo">
                    <a className="nav-link text-white font-weight-bold" href="/">Gun Violence Dashboard</a>
                </li>
                <li className="nav-item p-2">
                    <a className="nav-link text-white font-weight-bold" href="/">Home</a>
                </li>
                <li className="nav-item p-2">
                    <a className="nav-link text-white font-weight-bold" href="/explore">Explore</a>
                </li>
                <li className="nav-item p-2">
                    <a className="nav-link text-white font-weight-bold" href="/compare">Compare</a>
                </li>
                <li className="nav-item p-2">
                    <a className="nav-link text-white font-weight-bold" href="/ranking">Ranking</a>
                </li>
                <li className="nav-item p-2">
                    <a className="nav-link text-white font-weight-bold" href="/about">About</a>
                </li>
            </ul>
        </nav>
            <BrowserRouter>
                <Routes>
                    <Route title='Homepage' path='/' element={<Homepage />} />
                    <Route title='Explore' path='/explore' element={<Explore />} />
                    <Route title='Comapre' path='/compare' element={<Compare />} />
                    <Route title='Comapre' path='/ranking' element={<Ranking privatelyOwnedFireArms={privatelyOwnedFireArms}/>} />
                    <Route title='About' path='/about' element={<About />} />
                </Routes>
            </BrowserRouter></>
    );
};

export default Navbar;