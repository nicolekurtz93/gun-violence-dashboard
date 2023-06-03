import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import React from 'react';
import { Bar } from 'react-chartjs-2';

function Explore() {
  const [gunsOwnedData, setGunsOwnedData] = useState([]);
  const [gunsOwnedYears, setGunsOwnedYears] = useState([]);
  const [country, setCountry] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ 'value': '1', 'label': 'Afghanistan' });
  const locationsUrl = '/index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getlocations&format=raw';

  function formatGunOwnershipData(data) {
    let formattedData = data.replace(/\{[^}]+\}|\^/g, '');
    formattedData = formattedData.split(';');

    return formattedData

  }

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const gunsOwnedUrl = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=number_of_privately_owned_firearms&location_id=${selectedLocation.value}&format=raw`;

      axios
        .get(gunsOwnedUrl)
        .then((response) => {
          const formattedData = formatGunOwnershipData(response.data.result.columnValue);
          let years = formattedData.map(str => str.split(':')[0]);
          let data = formattedData.map(str => str.split(':')[1]);

          years = years.filter(str => str !== "" && str !== undefined);
          years = years.map(str => parseInt(str.replace(/[, ]/g, ""), 10));

          data = data.filter(str => str !== "" && str !== undefined);
          data = data.map(str => parseInt(str.replace(/[, ]/g, ""), 10));

          setCountry(response.data.result.location);
          setGunsOwnedYears(years);
          setGunsOwnedData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedLocation]);

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  const options = {
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


  const data = {
    labels: gunsOwnedYears,
    datasets: [
      {
        label: 'Privately Owned Guns',
        data: gunsOwnedData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };


  return (
    <div className='d-flex flex-column justify-content-center align-items-center m-2'>
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
      <div className='d-flex justify-content-between'>
        <div>
          <h3>Gun Ownership</h3>
          <Bar options={options} data={data} />
        </div>
        <div>
          <h3>Gun Deaths</h3>
        </div>
      </div>

    </div>
  );
}

export default Explore;
