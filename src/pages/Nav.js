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
    const { countryIds } = props;

    return (
        <><BrowserRouter>
            <nav className="navbar navbar-expand navbar-light text-align-center bg-primary align-items-center">
                <ul className="navbar-nav d-flex flex-wrap align-items-center text-align-center">

                    <li className="p-2 d-flex align-content-center">
                        <div className="d-flex text-align-center align-items-center text-white font-weight-bold">
                            Gun Violence Dashboard
                        </div>
                    </li>
                    <li className="nav-item p-2">
                        <Link className="nav-link text-white font-weight-bold" to="/">Home</Link>
                    </li>
                    <li className="nav-item p-2">
                        <Link className="nav-link text-white font-weight-bold" to="/explore/">Explore</Link>
                    </li>
                    <li className="nav-item p-2">
                        <Link className="nav-link text-white font-weight-bold" to="/compare-countries/">Compare Countries</Link>
                    </li>
                    <li className="nav-item p-2">
                        <Link className="nav-link text-white font-weight-bold" to="/about/">About</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route title='Homepage' path='/' index element={<Homepage />} />
                <Route title='Explore' path='/explore/' element={<Explore />} />
                <Route title='Compare-Countries' path='/compare-countries/' element={<CompareCountries countryIds={countryIds} />} />
                <Route title='About' path='/about/' element={<About />} />
            </Routes>
        </BrowserRouter></>
    );
};

export default Navbar;