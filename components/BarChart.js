import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import {
  select,
  axisBottom,
  axisLeft,
  max,
  line,
  curveCardinal,
  extent,
  timeFormat,
  timeYear,
  format,
} from "d3";
import { scaleLinear, scaleTime } from "d3-scale";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const drawChart = ({ width, height, dataset, setDetailed }) => {
  const margin = { left: 40, right: 0, top: 30, bottom: 30 };

  const element = (type, className) => {
    const elem = select(`.${className}`);
    return elem.empty()
      ? select("#chart").append(type).attr("class", className)
      : elem;
  };

  const g = (cx) => element("g", cx);
  const path = (cx) => element("path", cx);

  const y = scaleLinear()
    .domain([0, max(dataset, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const x = scaleTime()
    .domain(extent(dataset, (d) => d.date))
    .range([margin.left, width - margin.right]);

  const yAxis = axisLeft()
    .scale(y)
    .tickFormat((amount) => format("~s")(amount));
  const xAxis = axisBottom()
    .scale(x)
    .tickFormat((date) =>
      timeYear(date) < date ? timeFormat("%b")(date) : timeFormat("%Y")(date)
    );

  g("y-axis")
    .transition()
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxis);
  g("x-axis")
    .attr("transform", `translate(${0}, ${height - margin.top})`)
    .call(xAxis);

  const bandWidth = (width - margin.left - margin.right) / dataset.length;
  g("daily")
    .attr("fill", "steelblue")
    .attr("opacity", "0.4")
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .transition()
    .attr("x", (d) => x(d.date))
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => y(0) - y(d.value))
    .attr("width", bandWidth);

  const chartline = line()
    .curve(curveCardinal)
    .x((d) => x(d.date))
    .y((d) => y(d.avg7));

  path("average7")
    .datum(dataset)
    .attr("stroke", "steelblue")
    .attr("stroke-width", "3")
    .attr("fill", "none")
    .transition()
    .attr("d", chartline);

  g("shadow")
    .attr("opacity", "0.0")
    .selectAll("rect")
    .data(dataset)
    .on("click", (d, i) => {
      setDetailed(i.date);
    })
    .join("rect")
    .attr("x", (d) => x(d.date))
    .attr("y", margin.bottom)
    .attr("height", y(0) - margin.bottom)
    .attr("width", bandWidth);
};

const BarChart = ({ dataset, dispatch }) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height] = useState(DEFAULT_HEIGHT);

  const [ref, bounds] = useMeasure();

  const setDetailed = (date) => dispatch({ type: "set_detailed", date });

  useEffect(() => {
    drawChart({ dataset, width, height, setDetailed });
  }, [width, height, dataset]);

  useEffect(() => {
    setWidth(bounds.width);
  }, [bounds]);

  return (
    <div ref={ref}>
      <svg width={width} height={height} id="chart" />
    </div>
  );
};

export default BarChart;
