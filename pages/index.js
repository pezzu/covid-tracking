import Head from "next/head";
import { useReducer } from "react";

import BarChart from "../components/BarChart";
import CriteriaSwitchPanel from "../components/CriteriaSwitch";
import DailyDetails from "../components/DailyDetails";

const dateFormat = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export default function Home({ dataset }) {
  dataset = dataset.map((d) => ({ ...d, date: new Date(d.dateChecked) }));

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
        date: d.date,
        value: d[field],
        avg7,
      };
    });

  const initialState = {
    field: "positiveIncrease",
    data: selectCriteria("positiveIncrease"),
    detailed: dataset[0],
  };

  const criteriaReducer = (state, action) => {
    switch (action.type) {
      case "change_criteria":
        return {
          ...state,
          field: action.field,
          data: selectCriteria(action.field),
        };
      case "set_detailed":
        return {
          ...state,
          detailed: dataset.find(
            (d) => d.date.getTime() === action.date.getTime()
          ),
        };
      default:
        throw new Error("Unexpected action", action);
    }
  };

  const [state, dispatch] = useReducer(criteriaReducer, initialState);

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
                <CriteriaSwitchPanel active={state.field} dispatch={dispatch} />
                <BarChart dataset={state.data} dispatch={dispatch} />
                <div className="text-center text-xl">
                  {dateFormat(dataset[dataset.length - 1].dateChecked)} -{" "}
                  {dateFormat(dataset[0].dateChecked)}
                </div>
              </div>
              <div className="lg:w-1/4 lg:pl-3 mt-5">
                <DailyDetails {...state.detailed} />
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
