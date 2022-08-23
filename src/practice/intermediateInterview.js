import { useState, useEffect } from "react"
import './App.css'
import axios from "axios"

function App() {
  const [usersData, setUsersData] = useState([])
  const [flattenedLocations, setFlattenedLocations] = useState({ headers: [], data: [] })
  const [sortingDirection, setSortingDirection] = useState({})
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    fetchUsersData().then((data) => {
      setUsersData(data);
      const ourFlattenedLocations = flattenLocations(data.map(({location}) => location))
      setFlattenedLocations(ourFlattenedLocations);
      const { headers } = ourFlattenedLocations;
      const ourSortingDirections = {}

      for (const header of headers) {
        ourSortingDirections[header] = 1;
      }

      setSortingDirection(ourSortingDirections)
    })
  }, [])

  const fetchUsersData = async () => {
    const { data } = await axios.get(`https://randomuser.me/api/?results=20`);
    
    return data.results
  }

  const flattenLocations = (locations) => {
    const location = locations[0];
    const flattenedLocationHeaders = extractObjectKeys(location);
    const data = [];

    for (const { street, coordinates, timezone, ...rest } of locations) {
      data.push({
        ...rest,
        number: street.number,
        name: street.name,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        offset: timezone.offset,
        description: timezone.description
      })
    }

    return {
      headers: flattenedLocationHeaders,
      data
    }
  }

  const extractObjectKeys = (obj) => {
    let objKeys = [];

    Object.keys(obj).forEach(objKey => {
      const value = obj[objKey];

      if (typeof value !== 'object') {
        objKeys.push(objKey)
      } else {
        objKeys = [...objKeys, ...extractObjectKeys(value)]
      }
    })

    return objKeys;
  }

  const sortColumn = (header) => {
    const newFlattenedLocations = {
      ...flattenedLocations,
      data: [...flattenedLocations.data]
    }

    const currentDirection = sortingDirection[header];
    const sortedData = sortData(newFlattenedLocations.data, header, currentDirection);
    newFlattenedLocations.data = sortedData;

    const newSortingDirection = {
      ...sortingDirection,
      [header]: (currentDirection === 1 ? -1 : 1)
    }

    setSortingDirection(newSortingDirection)
    setFlattenedLocations(newFlattenedLocations)
  }

  const sortData = (data, header, currentDirection) => {
    const sorted = data.sort((a, b) => {
      const valA = a[header];
      const valB = b[header];

      if (currentDirection === 1) {
        if (valA < valB) return -1;
        if (valB > valA) return 1;

        return 0;
      } else {
        if (valA > valB) return -1;
        if (valB < valA) return 1;

        return 0;
      }
    })

    return sorted;
  }

  const getFilteredRows = (rows, filterKey) => {
    // return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(filterKey));
    return rows.filter((row) => Object.values(row).some(s => ('' + s).toLowerCase().includes(filterKey)))
  }

  return (
    <div className="App">
        {
          usersData.map((user, idx) => (
            <div key={idx}>
              {user.name.first}
            </div>
          ))
        }
        <div>
          <input value={inputValue} onChange={(e) => {
            setInputValue(e.target.value)
          }} />
          <table>
            <thead>
              <tr>
                {
                  flattenedLocations.headers.map((header, idx) => (
                    <th key={idx} onClick={() => {sortColumn(header)}}>{header}</th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {getFilteredRows(flattenedLocations.data, inputValue).map((location, locationIdx) => (
                <tr key={locationIdx}>
                  {flattenedLocations.headers.map((header, headerIdx) => (
                    <td key={headerIdx}>
                      {location[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}

export default App;
