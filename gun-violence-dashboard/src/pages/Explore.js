import { useEffect, useState } from 'react';
import axios from 'axios';

// TODO:
// dropdown of countries (need api to get country ids)
// on dropdown select, hit api to get data for selected country

function Explore () {

    const [gunsOwned, setGunsOwned] = useState([]);
    // const [search, setSearch] = useState('');

    useEffect(() => {
      axios
        .get('index.php?option=com_api&app=gpodatapage&clientid=306&key=b7bb356715bf99d6d04e75d266d689db&resource=getcategorydata&category=number_of_privately_owned_firearms&location_id=1&format=raw')
        .then((response) => {
          console.log(response.data)
          setGunsOwned(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
    // const handleChange = (event) => {
    //   setInput(event.target.value);
    // };
  
    // const handleSubmit = (event) => {
    //   event.preventDefault();
    //   setSearch(input.toLowerCase());
    // };
  
    // function executeSearch() {
    //   let results = characters.filter((character) => {
    //     if (character.fullName.toLowerCase().includes(search)) {
    //       character.alt = `picture of ${character.fullName}`
    //       return character;
    //     }
    //     return '';
    //   })
    // };

    return (
      <div className='d-flex flex-column justify-content-center align-items-center m-2'>
      <h1>country name</h1>
      <div>{gunsOwned}</div>
    </div>
    );
}

export default Explore;
