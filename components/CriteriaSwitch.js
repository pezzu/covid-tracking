import classnames from "classnames";
import { useContext } from "react";

import { ChartContext } from "../app/chart-context";

const CriteriaSwitch = ({ text, field, isActive }) => {
  const dispatch = useContext(ChartContext);

  return (
    <div className="p-1 w-1/3 md:w-1/6">
      <button
        className={classnames(
          "w-full",
          "h-full",
          "border-2",
          "border-gray-100",
          "rounded-md",
          "shadow-md",
          "font-semibold",
          "text-sm",
          "p-2",
          "hover:border-gray-700",
          {
            "text-white": isActive,
            "bg-gray-800": isActive,
          }
        )}
        onClick={() => dispatch({ type: "change_criteria", field })}
      >
        {text}
      </button>
    </div>
  );
};

const CriteriaSwitchPanel = ({ active }) => {
  return (
    <div className="flex justify-around flex-wrap">
      <CriteriaSwitch
        text="Daily Tests"
        field="totalTestResultsIncrease"
        isActive={"totalTestResultsIncrease" === active}
      />
      <CriteriaSwitch
        text="Daily Cases"
        field="positiveIncrease"
        isActive={"positiveIncrease" === active}
      />
      <CriteriaSwitch
        text="Hospitalized"
        field="hospitalizedCurrently"
        isActive={"hospitalizedCurrently" === active}
      />
      <CriteriaSwitch
        text="in ICU"
        field="inIcuCurrently"
        isActive={"inIcuCurrently" === active}
      />
      <CriteriaSwitch
        text="on Ventilator"
        field="onVentilatorCurrently"
        isActive={"onVentilatorCurrently" === active}
      />
      <CriteriaSwitch
        text="Daily Deaths"
        field="deathIncrease"
        isActive={"deathIncrease" === active}
      />
    </div>
  );
};

export default CriteriaSwitchPanel;
