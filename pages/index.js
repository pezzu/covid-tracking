import Head from "next/head";

import { useEffect, useState, useReducer } from "react";
import useMeasure from "react-use-measure";
import { select, axisBottom, axisLeft, max } from "d3";
import { scaleLinear, scaleTime } from "d3-scale";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const drawLine = ({ width, height, dataset }) => {
  const margin = { left: 60, right: 20, top: 30, bottom: 30 };
  const g = (cx) => {
    const group = select(`.${cx}`);
    return group.empty()
      ? select("#chart").append("g").attr("class", cx)
      : group;
  };

  const y = scaleLinear()
    .domain([0, max(dataset.map((it) => it.value)) * 1.1])
    .range([height - margin.top, margin.bottom]);

  const x = scaleTime()
    .domain([dataset[dataset.length - 1].date, dataset[0].date])
    .range([margin.left, width - margin.right]);

  const yAxis = axisLeft().scale(y);
  const xAxis = axisBottom().scale(x);

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
      <p className="text-center font-semibold text-lg mb-2">
        {new Date(props.dateChecked).toDateString()}
      </p>

      <div className="flex flex-col md:flex-row lg:flex-col px-2">
        <div className="md:w-1/2 lg:w-full px-2">
          <p className="border-gray-400 border-b-2 font-semibold mt-4 mb-2 text-right">
            On this day
          </p>
          <div>
            <div className="flex justify-between">
              <p>Tests Performed:</p> <p>{props.totalTestResultsIncrease}</p>
            </div>
            <div className="flex justify-between">
              <p>Positive Cases:</p> <p>{props.positiveIncrease}</p>
            </div>
            <div className="flex justify-between">
              <p>Currently Hospitalized:</p>{" "}
              <p>{props.hospitalizedCurrently}</p>
            </div>
            <div className="flex justify-between">
              <p>Currently in ICU:</p> <p>{props.inIcuCurrently}</p>
            </div>
            <div className="flex justify-between">
              <p>Currently on Ventilator:</p>{" "}
              <p>{props.onVentilatorCurrently}</p>
            </div>
            <div className="flex justify-between">
              <p>Deaths Increase:</p> <p>{props.deathIncrease}</p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 lg:w-full px-2">
          <p className="border-gray-400 border-b-2 font-semibold mt-4 mb-2 text-right">
            By this day cumulative
          </p>
          <div>
            <div className="flex justify-between">
              <p>Tests Performed:</p> <p>{props.totalTestResults}</p>
            </div>
            <div className="flex justify-between">
              <p>Positive Cases:</p> <p>{props.positive}</p>
            </div>
            <div className="flex justify-between">
              <p>Hospitalized:</p> <p>{props.hospitalized}</p>
            </div>
            <div className="flex justify-between">
              <p>in ICU:</p> <p>{props.inIcuCumulative}</p>
            </div>
            <div className="flex justify-between">
              <p>on Ventilator:</p> <p>{props.onVentilatorCumulative}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Deaths:</p> <p>{props.death}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Recovered:</p> <p>{props.recovered}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const dateFormat = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export default function Home({ dataset }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height] = useState(DEFAULT_HEIGHT);

  const [ref, bounds] = useMeasure();

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

  useEffect(() => {
    setWidth(bounds.width);
  }, [bounds]);

  return (
    <div>
      <Head>
        <title>Covid Tracking Data Visualisation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="min-w-screen min-h-screen bg-gray-100 text-gray-900 flex flex-wrap content-around justify-center px-3 py-3">
          <div className="bg-white text-grey-800 rounded shadow-xl py-3 px-3 w-full xl:max-w-6xl">
            <h1 className="text-center font-semibold text-3xl mb-5 mx-2">
              COVID-19 in the United States
            </h1>
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-col lg:w-3/4">
                <div className="flex justify-around flex-wrap">
                  <button
                    className="w-1/3 md:w-1/6"
                    onClick={() => dispatch({ type: "daily_tests" })}
                  >
                    Daily Tests
                  </button>
                  <button
                    className="w-1/3 md:w-1/6"
                    onClick={() => dispatch({ type: "daily_cases" })}
                  >
                    Daily Cases
                  </button>
                  <button
                    className="w-1/3 md:w-1/6"
                    onClick={() => dispatch({ type: "hospitalized" })}
                  >
                    Hospitalized
                  </button>
                  <button
                    className="w-1/3 md:w-1/6"
                    onClick={() => dispatch({ type: "in_ICU" })}
                  >
                    in ICU
                  </button>
                  <button
                    className="w-1/3 md:w-1/6"
                    onClick={() => dispatch({ type: "on_ventilator" })}
                  >
                    on Ventilator
                  </button>
                  <button
                    className="w-1/3 md:w-1/6"
                    onClick={() => dispatch({ type: "daily_death" })}
                  >
                    Daily Deaths
                  </button>
                </div>
                <div className="" ref={ref}>
                  <svg width={width} height={height} id="chart" />
                </div>
                <div className="text-center text-xl">
                  {dateFormat(dataset[dataset.length - 1].dateChecked)} -{" "}
                  {dateFormat(dataset[0].dateChecked)}
                </div>
              </div>
              <div className="lg:w-1/4 lg:pl-3 mt-5">
                <Details {...current} />
              </div>
            </div>
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
