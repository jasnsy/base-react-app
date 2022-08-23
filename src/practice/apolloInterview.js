
import React, { useState } from "react";
// Create a star rating application

// 1. Shows default given rating (e.g. Given 3 it displays 3 yellow stars and 2 black stars)
// 2. On click increments stars and resets back to 1 after 5 stars
// 3. Should have a on change callback that logs the current rating when changed

// Follow up questions:
// 1. What kind of tests would you write?
// 2. How do you make it production ready? Accessibility? Performance?

// Yellow star html: <img className="star" src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" />
// Black star html: <img className="star" src="https://cdn-icons-png.flaticon.com/512/1828/1828961.png" />

const StarRating = (props) => {
  const { rating, handleClick } = props;

  const makeRating = () => {
    let arr = [];

    for (let i = 0; i < 5; i++) {
      
      if(rating > i) {
        arr.push(<img className="star" style={{width: "40px"}} src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" />)
      } else {
        arr.push(<img className="star" style={{width: "40px"}} src="https://cdn-icons-png.flaticon.com/512/1828/1828961.png" />)
      }
    }

    return arr;
  }
  
  return (
    <div>
      {makeRating()}
    </div>
  );
};

const App = () => {
  const [starRating, setStarRating] = React.useState(1);

  const handleClick = () => {
    let currStarRating = starRating;
    currStarRating++

    if (currStarRating > 5) {
      setStarRating(1)
    } else {
      setStarRating(currStarRating)
    }

    console.log(currStarRating)
  }

  return (
    <div>
      <h3>Example</h3>
      <img src="https://res.cloudinary.com/do4uptd5d/image/upload/v1602103325/StarRatingExample_ztr8du.gif" alt="example" width="220" />
    
      <h3>Solution</h3>
      <div onClick={handleClick}>
        <StarRating rating={starRating} />
      </div>
    </div>
  );
};

export default App;
