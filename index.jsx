import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
// import * as d3 from 'd3';

function App() {
  // const [data, setData] = useState(null)

  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  //       const data = await response.json()
  //       console.log(data)
  //       setData(data)
  //     }
  //     catch (error) {
  //       console.error(error)
  //     }
  //   }

  //   getData()
  // }, [])

  return (
    <h1>Hello World</h1>
  )
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
