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
  const [tooltipGDPText, setTooltipGDPText] = useState(null)
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
        .domain([d3.min(data, d => parseYear(d[0])), d3.timeDay.offset(d3.max(data, d => parseYear(d[0])), 75)])
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
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("width", 2.9)
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
      .attr("id", "x-axis")
      .call(xAxis)
      .append("text")
      .attr("x", width - padding)
      .attr("y", 40)
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");
      
      svg.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis)
      .append("text")
      .attr("transform", `translate(${padding / 2.5}, ${height / 1.7}) rotate(-90)`)
      .attr("text-anchor", "start")
      .attr("fill", "black")
      .attr("font-size", "1rem")
      .text("Gross Domestic Product");
      
      svg.append("text")
      .attr("x", width / 2)
      .attr("y", padding / 2 + 10)
      .attr("text-anchor", "middle")
      .text("United States GDP")
      .attr("id", "title")
      .attr("font-size", "2rem");
        
    }, [data])

    return (
      <div id="bar-chart">
        <svg ref={svgRef} width={width} height={height}>
        </svg>
        {tooltipYearText && (
          <div
            className='tooltip tick'
            id="tooltip"
            data-date={tooltipYearText}
            style={{ 
              left: tooltipPosition.x,
              width: tooltipWidth,
            }}
          >
            <p>{tooltipYearText}</p>
            <p>{tooltipGDPText}</p>
          </div>
        )}
      </div>
    )
}