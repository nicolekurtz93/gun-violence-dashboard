import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

// TODO:
// dropdown of countries (need api to get country ids)
// on dropdown select, hit api to get data for selected country

// for gun ownership, show a histograph if multiple years, or a single number. 

function Explore() {
  const [gunsOwned, setGunsOwned] = useState('');
  const [country, setCountry] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ 'value': '1', 'label': 'Afghanistan' });
  const locationsUrl = '/index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getlocations&format=raw';
  let gunsOwnedUrl = `index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=number_of_privately_owned_firearms&location_id=${selectedLocation.value}&format=raw`;

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
      const fetchData = async () => {
        try {
          const response = await axios.get(gunsOwnedUrl);
          setGunsOwned(formatGunOwnershipData(response.data.result.columnValue));
          setCountry(response.data.result.location);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [selectedLocation, gunsOwnedUrl]);

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  return (
    <div className='d-flex flex-column justify-content-center align-items-center m-2'>
      <h1>Explore By Location</h1>
      <h2>{country}</h2>

      <Select
        options={locations}
        value={selectedLocation}
        onChange={handleLocationChange}
        placeholder="Select a location"
        isSearchable
      />
      <div className='d-flex justify-content-between'>
        <div>
          <h3>Gun Ownership</h3> 
          {gunsOwned}
        </div>
        <div>
          <h3>Gun Deaths</h3> 
          {gunsOwned}
        </div>
      </div>
    </div>
  );
}

export default Explore;
