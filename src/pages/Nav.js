import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Homepage from "./Homepage";
import Explore from "./Explore";
import Compare from "./Compare";
import About from "./About";
import 'bootstrap/dist/css/bootstrap.css';
import { fetchCountryId } from "./CompareCountries.service";
import CompareCountries from "./CompareCountries";


export const Navbar = (props) => {
    const {countryIds} = props;

    return (
        <><BrowserRouter>
        <nav className="navbar navbar-expand navbar-light text-align-center bg-primary">
        <ul className="navbar-nav d-flex flex-wrap"> 
            <li className="nav-item p-2">
                <Link className="nav-link text-white font-weight-bold" to="/gun-violence-dashboard">Home</Link>
            </li>
            <li className="nav-item p-2">
                <Link className="nav-link text-white font-weight-bold" to="/gun-violence-dashboard/explore/">Explore</Link>
            </li>
            <li className="nav-item p-2">
                <Link className="nav-link text-white font-weight-bold" to="/gun-violence-dashboard/compare/">Compare</Link>
            </li>
            <li className="nav-item p-2">
                <Link className="nav-link text-white font-weight-bold" to="/gun-violence-dashboard/compare-countries/">Compare Countries</Link>
            </li>
            <li className="nav-item p-2">
                <Link className="nav-link text-white font-weight-bold" to="/gun-violence-dashboard/about/">About</Link>
            </li>
            </ul>
        </nav>
                <Routes>
                    <Route title='Homepage' path='/gun-violence-dashboard/' index element={<Homepage />} />
                    <Route title='Explore' path='/gun-violence-dashboard/explore/' element={<Explore />} />
                    <Route title='Compare' path='/gun-violence-dashboard/compare/' element={<Compare />} />
                    <Route title='Compare-Countries' path='/gun-violence-dashboard/compare-countries/' element={<CompareCountries countryIds={countryIds} />} />
                    <Route title='About' path='/gun-violence-dashboard/about/' element={<About />} />
                </Routes>
            </BrowserRouter></>
    );
};

export default Navbar;