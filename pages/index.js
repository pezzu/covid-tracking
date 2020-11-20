import Head from "next/head";

import { useEffect, useState, useReducer } from "react";
import useMeasure from "react-use-measure";
import { select, axisBottom, axisLeft, max } from "d3";
import { scaleLinear, scaleTime } from "d3-scale";

const X_MARGIN = 60;
const Y_MARGIN = 50;

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const drawLine = ({ width, height, dataset }) => {
  const g = (cx) => {
    const group = select(`.${cx}`);
    return group.empty()
      ? select("#chart").append("g").attr("class", cx)
      : group;
  };

  const y = scaleLinear()
    .domain([0, max(dataset.map((it) => it.value)) * 1.1])
    .range([height - Y_MARGIN, Y_MARGIN]);

  const x = scaleTime()
    .domain([dataset[dataset.length - 1].date, dataset[0].date])
    .range([X_MARGIN, width - X_MARGIN]);

  const yAxis = axisLeft().scale(y);
  const xAxis = axisBottom().scale(x);

  g("y-axis")
    .transition()
    .attr("transform", `translate(${X_MARGIN}, ${0})`)
    .call(yAxis);
  g("x-axis")
    .attr("transform", `translate(${0}, ${height - Y_MARGIN})`)
    .call(xAxis);

  const bandWidth = (width - 2 * X_MARGIN) / dataset.length;
  g("daily")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .transition()
    .attr("x", (d) => x(d.date))
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => y(0) - y(d.value))
    .attr("width", bandWidth);
};

function Details(props) {
  return (
    <div>
      <p>{new Date(props.dateChecked).toDateString()}</p>

      <p>Daily Tests: {props.totalTestResultsIncrease}</p>
      <p>Daily Cases: {props.positiveIncrease}</p>
      <p>Currently Hospitalized: {props.hospitalizedCurrently}</p>
      <p>Currently in ICU: {props.inIcuCurrently}</p>
      <p>Currently on Ventilator: {props.onVentilatorCurrently}</p>
      <p>Daily Deaths: {props.deathIncrease}</p>

      <p>Total Tests: {props.totalTestResults}</p>
      <p>Total Cases: {props.positive}</p>
      <p>Total Hospitalizations: {props.hospitalized}</p>
      <p>Total in ICU: {props.inIcuCumulative}</p>
      <p>Total on Ventilator: {props.onVentilatorCumulative}</p>
      <p>Total Deaths: {props.death}</p>
      <p>Recovered: {props.recovered}</p>
    </div>
  );
}

const dateFormat = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export default function Home({ dataset }) {
  const [width] = useState(DEFAULT_WIDTH);
  const [height] = useState(DEFAULT_HEIGHT);

  const [current, setCurrent] = useState(dataset[0]);

  const initialState = {
    field: "positiveIncrease",
  };

  const fieldReducer = (state, action) => {
    switch (action.type) {
      case "daily_cases":
        return { ...state, field: "positiveIncrease" };
      case "daily_death":
        return { ...state, field: "deathIncrease" };
      case "hospitalized":
        return { ...state, field: "hospitalizedCurrently" };
      case "in_ICU":
        return { ...state, field: "inIcuCurrently" };
      case "on_ventilator":
        return { ...state, field: "onVentilatorCurrently" };
      case "daily_tests":
        return { ...state, field: "totalTestResultsIncrease" };
      default:
        throw new Error("Unexpected action", action);
    }
  };

  const [state, dispatch] = useReducer(fieldReducer, initialState);

  useEffect(() => {
    const data = dataset.map((entry) => ({
      date: new Date(entry.dateChecked),
      value: entry[state.field],
    }));
    drawLine({ dataset: data, width, height });
  }, [dataset, width, height, state]);

  const [ref, bounds] = useMeasure();

  return (
    <div>
      <Head>
        <title>Covid Tracking Data Visualisation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="min-w-screen min-h-screen bg-gray-100 flex flex-wrap content-around justify-center px-5 py-5">
          <div className="bg-white text-grey-800 rounded shadow-xl py-5 px-5 w-full lg:w-10/12 xl:w-3/4 flex">
            <div className="flex flex-col">
              <div className="flex justify-between px-12">
                <button onClick={() => dispatch({ type: "daily_tests" })}>
                  Daily Tests
                </button>
                <button onClick={() => dispatch({ type: "daily_cases" })}>
                  Daily Cases
                </button>
                <button onClick={() => dispatch({ type: "hospitalized" })}>
                  Hospitalized
                </button>
                <button onClick={() => dispatch({ type: "in_ICU" })}>
                  in ICU
                </button>
                <button onClick={() => dispatch({ type: "on_ventilator" })}>
                  on Ventilator
                </button>
                <button onClick={() => dispatch({ type: "daily_death" })}>
                  Daily Deaths
                </button>
              </div>
              <div className="flex items-end" ref={ref}>
                <svg width={width} height={height} id="chart" />
              </div>
              <div className="flex justify-center">
                {dateFormat(dataset[dataset.length - 1].dateChecked)} -{" "}
                {dateFormat(dataset[0].dateChecked)}
              </div>
            </div>
            <Details {...current} />
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://api.covidtracking.com/v1/us/daily.json");
  const dataset = await res.json();

  return {
    props: {
      dataset,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 600 seconds
    revalidate: 600, // In seconds
  };
}
