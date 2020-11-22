import Head from "next/head";
import { useEffect, useState, useReducer } from "react";
import useMeasure from "react-use-measure";
import { select, axisBottom, axisLeft, max, line, curveCardinal } from "d3";
import { scaleLinear, scaleTime } from "d3-scale";
import classnames from "classnames";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const drawLine = ({ width, height, dataset }) => {
  const margin = { left: 60, right: 20, top: 30, bottom: 30 };

  const element = (type, className) => {
    const elem = select(`.${className}`);
    return elem.empty()
      ? select("#chart").append(type).attr("class", className)
      : elem;
  };

  const g = (cx) => element("g", cx);
  const path = (cx) => element("path", cx);

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

const CriteriaSwitch = ({ text, field, dispatch, state }) => {
  return (
    <div className="p-1 w-1/3 md:w-1/6">
      <button
        className={classnames(
          "w-full",
          "border",
          "rounded-lg",
          "border-gray-800",
          "font-semibold",
          "hover:bg-gray-500",
          "hover:text-white",
          {
            "text-white": state.field === field,
            "bg-gray-800": state.field === field,
          }
        )}
        onClick={() => dispatch({ type: field })}
      >
        {text}
      </button>
    </div>
  );
};

export default function Home({ dataset }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height] = useState(DEFAULT_HEIGHT);

  const [ref, bounds] = useMeasure();

  const [current, setCurrent] = useState(dataset[0]);

  const selectCriteria = (field) =>
    dataset.map((d, i) => {
      let avg7 =
        dataset
          .slice(i, Math.min(i + 7, dataset.length))
          .reduce((a, c) => a + c[field], 0) / 7;
      if (i > dataset.length - 7) {
        avg7 +=
          (dataset[dataset.length - 1][field] * (i - dataset.length + 7)) / 7;
      }
      return {
        date: new Date(d.dateChecked),
        value: d[field],
        avg7,
      };
    });

  const initialState = {
    field: "positiveIncrease",
    data: selectCriteria("positiveIncrease"),
  };

  const criteriaReducer = (state, action) => {
    switch (action.type) {
      case "positiveIncrease":
        return {
          field: "positiveIncrease",
          data: selectCriteria("positiveIncrease"),
        };
      case "deathIncrease":
        return {
          field: "deathIncrease",
          data: selectCriteria("deathIncrease"),
        };
      case "hospitalizedCurrently":
        return {
          field: "hospitalizedCurrently",
          data: selectCriteria("hospitalizedCurrently"),
        };
      case "inIcuCurrently":
        return {
          field: "inIcuCurrently",
          data: selectCriteria("inIcuCurrently"),
        };
      case "onVentilatorCurrently":
        return {
          field: "onVentilatorCurrently",
          data: selectCriteria("onVentilatorCurrently"),
        };
      case "totalTestResultsIncrease":
        return {
          field: "totalTestResultsIncrease",
          data: selectCriteria("totalTestResultsIncrease"),
        };
      default:
        throw new Error("Unexpected action", action);
    }
  };

  const [state, dispatch] = useReducer(criteriaReducer, initialState);

  useEffect(() => {
    drawLine({ dataset: state.data, width, height });
  }, [width, height, state]);

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
                  <CriteriaSwitch
                    text="Daily Tests"
                    field="totalTestResultsIncrease"
                    dispatch={dispatch}
                    state={state}
                  />
                  <CriteriaSwitch
                    text="Daily Cases"
                    field="positiveIncrease"
                    dispatch={dispatch}
                    state={state}
                  />
                  <CriteriaSwitch
                    text="Hospitalized"
                    field="hospitalizedCurrently"
                    dispatch={dispatch}
                    state={state}
                  />
                  <CriteriaSwitch
                    text="in ICU"
                    field="inIcuCurrently"
                    dispatch={dispatch}
                    state={state}
                  />
                  <CriteriaSwitch
                    text="on Ventilator"
                    field="onVentilatorCurrently"
                    dispatch={dispatch}
                    state={state}
                  />
                  <CriteriaSwitch
                    text="Daily Deaths"
                    field="deathIncrease"
                    dispatch={dispatch}
                    state={state}
                  />
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
