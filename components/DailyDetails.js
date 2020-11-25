const DailyDetails = (props) => {
  return (
    <div>
      <p className="text-center font-semibold text-lg mb-2">
        {props.date.toDateString()}
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
};

export default DailyDetails;
