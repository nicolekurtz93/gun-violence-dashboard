import React, { useEffect, useState } from "react";
import { fetchCountryId, fetchPrivatelyOwnedFireArms } from './Ranking.service';

function Ranking(prop) {
    const privatelyOwnedFireArms = prop;

    useEffect(() => {
        /*
        fetchCountryId().then(result => {
            setCountryIds(result)
            fetchPrivatelyOwnedFireArms(result).then(result => {
                console.log(result)
                setPrivatelyOwnedFireArms(result)
                console.log(privatelyOwnedFireArms)
            }
            )
        }) */
    }, []);
    return (
        <>
            <h1>This is the Ranking Page</h1>
            <div>
                {privatelyOwnedFireArms[0]}
            </div>
        </>
    );
}

export default Ranking;