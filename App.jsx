import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const API_URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const width = 900;
const height = 460;
const padding = 60;
const tooltipWidth = 125;

export default function App() {
  const [data, setData] = useState([])
  const [tooltipYearText, setTooltipYearText] = useState(null)
  const [tooltipGDPrText, setTooltipGDPText] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const svgRef = useRef()

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

    function handleMouseOver(event, year, gdp) {
      const formattedGDP = gdp.toLocaleString()
      const tooltipYear = year
      const tooltipGDP = `$${formattedGDP} Billion`
      const rect = event.target.getBoundingClientRect()
      const x = rect.left + rect.width + 25;
      const y = rect.top;
      setTooltipYearText(tooltipYear)
      setTooltipGDPText(tooltipGDP)
      setTooltipPosition({ x: x, y: y })
    }

    function handleMouseOut() {
      setTooltipYearText(null)
      setTooltipGDPText(null)
    }

    const parseYear = d3.timeParse('%Y-%m-%d');

    useEffect(() => {
      if (data.length === 0) return;

      const svg = d3.select(svgRef.current);

      const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => parseYear(d[0])))
        .range([padding, width - padding]);
        
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([height - padding, padding]);


      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)

      svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(parseYear(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", 2.5)
        .attr("height", (d) => height - padding - yScale(d[1]))
        .attr("fill", "#36aeff")
        .attr("class", "bar")
        .on("mouseover", function(event, d) {
          const year = d[0];
          const gdp = d[1];
          handleMouseOver(event, year, gdp);
        })
        .on("mouseout", handleMouseOut);

      svg.append("g")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis);

      svg.append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);
      
    }, [data])



  
    return (
      <div id="bar-chart">
        <h1 id='title'>United States GDP</h1>
        <svg ref={svgRef} width={width} height={height}>
            {/* {data.map((d, i) => {
                const year = d[0];
                const gdp = d[1];

                return (
                    <g key={i}>
                        <rect
                          x={xScale(parseYear(year))} 
                          y={yScale(gdp)}
                          width={3.5}
                          height={2 * gdp}
                          fill='#36aeff'
                          className='bar'
                          onMouseOver={(event) => handleMouseOver(event, year, gdp)}
                          onMouseOut={handleMouseOut}
                          >
                        </rect>
                    </g>
                )
            })} */}
            {/* <g
              ref={node => d3.select(node).call(xAxis)}
            ></g>
            <g
              ref={node => d3.select(node).call(yAxis)}
            ></g> */}
        </svg>
        {tooltipYearText && (
          <div
            className='tooltip'
            style={{ 
              left: tooltipPosition.x,
              width: tooltipWidth,
            }}
          >
            <p>{tooltipYearText}</p>
            <p>{tooltipGDPrText}</p>
          </div>
        )}
      </div>
    )
}