import './App.css';
import { fetchCountryId } from './pages/CompareCountries.service';
import Navbar from './pages/Nav';
import React, {useState, useEffect} from 'react';

function App() {
    const [countryIds, setCountryIds] = useState([])

    useEffect(() => {
        fetchCountryId().then(result => {
            setCountryIds(result)
        })
    }, []);

  return (
    <Navbar countryIds={countryIds} />
  );
}

export default App;
