import {useState, useEffect} from "react"
import './App.css'
import axios from "axios"

function App() {
  const [counter, setCounter]  = useState(0);
  const [usersInfo, setUsersInfo] = useState([]);
  const [nextPage, setNextPage] = useState(1)

  useEffect(() => {
    fetchRandomData().then((randomData) => {
      setUsersInfo(randomData)
    })
  }, [])

  const fetchRandomData = async (nextPage) => {
    const result = await axios.get(`https://randomuser.me/api?page=${nextPage}`);
    const { data } = result;
  
    return data.results;
  }

  const getUserName = (user) => {
    const  { name: { first, last }} = user;

    return `${first} ${last}`;
  }

  const getNextUser = async () => {
    const newPage = nextPage + 1;
    setNextPage(newPage)
    const nextUser = await fetchRandomData(nextPage);

    setUsersInfo([ ...usersInfo, ...nextUser ])
  }

  return (
    <div className="App">
      <p>
        {counter}
      </p>
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Increase Counter</button>
      <br/>
      <button onClick={() => {
        getNextUser();
      }}>Get Next User</button>
        {
          usersInfo.map((user, idx) => (
            <div key={idx}>
              <p>
                {getUserName(user)}
              </p>
              <img src={user.picture.thumbnail} />
            </div>
          ))
        }
    </div>
  );
}

export default App;
