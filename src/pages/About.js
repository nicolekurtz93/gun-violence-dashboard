import React from "react";
import './styles/about.css';

function About() {
    return (
        <div className="d-flex justify-content-center">
            <div className="m-3 container about-container">
                <h1 className="text-center">About Gun Violence Dashboard</h1>
                <p className="">
                    The Gun Violence Dashboard was created to provide statics on gun violence worldwide,
                    with a focus on the United States. We chose this project because the issue of gun
                    violence continues to grow in our society, and we feel a tool to demonstrate the relationship
                    between gun policy and gun violence could be impactful.
                </p>
                <p>
                    The Homepage showcases a map of the United States where the fill of each State is determined
                    by average number of deaths due to firearms per 100,000 people. Users can see how this average
                    has changed over the years by selected from the year dropdown. When a user clicks on a state,
                    the state detail is filled with information such as: gun law grade, percentage of households with
                    a gun, and prohibited firearms/ammunition. Addtionally, there is a bar chart of the total number
                    of deaths per year.
                </p>
                <p>
                    On the Explore page, users can select a country from a searchable dropdown, which generates of page
                    of graphs about that country’s gun ownership, gun homicides, and gun violence over time.
                </p>
                <p>
                    The Compare page allows users to see the 5 highest ranked and 5 lowest ranked countries per category.
                    This page allows users to see how countries compare on gun issues.
                </p>
                <p>The data for the United States map was provided by
                    <a className="ms-1" href='https://datausa.io'>datausa.io</a>.
                    All other data was thanks to
                    <a className="ms-1" href="https://gunpolicy.org">GunPolicy.org</a>.
                </p>
            </div>
        </div>
    );
}

export default About;