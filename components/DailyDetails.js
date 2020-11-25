const DataField = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p>{label}</p> <p>{value}</p>
    </div>
  );
};

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
            <DataField
              label="Tests Performed"
              value={props.totalTestResultsIncrease}
            />
            <DataField label="Positive Cases" value={props.positiveIncrease} />
            <DataField
              label="Currently Hospitalized"
              value={props.hospitalizedCurrently}
            />
            <DataField label="Currently in ICU" value={props.inIcuCurrently} />
            <DataField
              label="Currently on Ventilator"
              value={props.onVentilatorCurrently}
            />
            <DataField label="Deaths Increase" value={props.deathIncrease} />
          </div>
        </div>

        <div className="md:w-1/2 lg:w-full px-2">
          <p className="border-gray-400 border-b-2 font-semibold mt-4 mb-2 text-right">
            By this day cumulative
          </p>
          <div>
            <DataField label="Tests Performed" value={props.totalTestResults} />
            <DataField label="Positive Cases" value={props.positive} />
            <DataField label="Hospitalized" value={props.hospitalized} />
            <DataField label="in ICU" value={props.inIcuCumulative} />
            <DataField
              label="on Ventilator"
              value={props.onVentilatorCumulative}
            />
            <DataField label="Total Deaths" value={props.death} />
            <DataField label="Total Recovered" value={props.recovered} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDetails;
