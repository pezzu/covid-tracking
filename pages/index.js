import Head from "next/head";
import { useReducer } from "react";

import BarChart from "../components/BarChart";
import CriteriaSwitchPanel from "../components/CriteriaSwitch";
import DailyDetails from "../components/DailyDetails";

import { ChartContext } from "../app/chart-context";

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

      <div className="min-w-screen min-h-screen bg-gray-100 text-gray-900 flex flex-wrap content-around justify-center px-3">
        <div className="bg-white text-grey-800 rounded shadow-xl px-3 w-full xl:max-w-6xl">
          <header className="text-center font-semibold text-3xl mb-5 mx-2 border-b-2">
            COVID-19 in the United States
          </header>
          <main className="flex flex-col lg:flex-row">
            <div className="flex flex-col lg:w-3/4">
              <ChartContext.Provider value={dispatch}>
                <CriteriaSwitchPanel active={state.field} />
                <BarChart dataset={state.data} />
              </ChartContext.Provider>
              <div className="text-center text-xl">
                {dateFormat(dataset[dataset.length - 1].dateChecked)} -{" "}
                {dateFormat(dataset[0].dateChecked)}
              </div>
            </div>
            <div className="lg:w-1/4 lg:pl-3 mt-5 pt-2 border-t-2 lg:border-0 lg:border-t-0 lg:pt-0 lg:-mt-5 flex flex-col justify-center">
              <DailyDetails {...state.detailed} />
            </div>
          </main>
          <footer className="mt-4 border-t-2 text-center py-2">
            <div className="flex flex-wrap justify-evenly">
              <div className="w-full md:w-1/2 flex flex-row justify-evenly">
                <a
                  href="https://github.com/pezzu/covid-tracking/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-8 w-16"
                    src="/github.svg"
                    alt="Github Logo"
                  />
                </a>
                <a
                  href="https://covidtracking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-8 w-25"
                    src="/covidtracking.svg"
                    alt="The Covid Tracking Project Logo"
                  />
                </a>
              </div>
              <div className="w-full md:w-1/2 flex flex-row justify-evenly">
                <a
                  href="https://nextjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-8 w-20"
                    src="/nextjs.svg"
                    alt="Next.js Logo"
                  />
                </a>
                <a
                  href="https://vercel.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-8 w-20"
                    src="/vercel.svg"
                    alt="Vercel Logo"
                  />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
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
