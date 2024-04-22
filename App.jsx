import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const API_URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const width = 900;
const height = 464;

export default function App() {
    const [data, setData] = useState([])

    useEffect(() => {
      async function getData() {
        try {
          const response = await fetch(API_URL)
          const data = await response.json()
          setData(data.data)
        }
        catch (error) {
          console.error(error)
        }
      }
  
      getData()
    }, [])
  
    return (
      <div id="bar-chart">
        <h1 id='title'>United States GDP</h1>
        <svg width={width} height={height}>
            {data.map((d, i) => {
                const year = d[0];
                const gdp = d[1];
                return (
                    <g key={i}>
                        <rect
                            x={i * 4.1} 
                            y={height - 1 * gdp / 24}
                            width={4}
                            height={2 * gdp}
                            fill='#36aeff'
                            className='bar'
                        >
                        </rect>
                    </g>
                )
            })}
        </svg>
      </div>
    )
}