import classnames from "classnames";

const CriteriaSwitch = ({ text, field, dispatch, isActive }) => {
  return (
    <div className="p-1 w-1/3 md:w-1/6">
      <button
        className={classnames(
          "w-full",
          "border-2",
          "border-gray-100",
          "rounded-md",
          "shadow-md",
          "font-semibold",
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

const CriteriaSwitchPanel = ({dispatch, active}) => {
  return (
    <div className="flex justify-around flex-wrap">
      <CriteriaSwitch
        text="Daily Tests"
        field="totalTestResultsIncrease"
        isActive={"totalTestResultsIncrease" === active}
        dispatch={dispatch}
      />
      <CriteriaSwitch
        text="Daily Cases"
        field="positiveIncrease"
        isActive={"positiveIncrease" === active}
        dispatch={dispatch}
      />
      <CriteriaSwitch
        text="Hospitalized"
        field="hospitalizedCurrently"
        isActive={"hospitalizedCurrently" === active}
        dispatch={dispatch}
      />
      <CriteriaSwitch
        text="in ICU"
        field="inIcuCurrently"
        isActive={"inIcuCurrently" === active}
        dispatch={dispatch}
      />
      <CriteriaSwitch
        text="on Ventilator"
        field="onVentilatorCurrently"
        isActive={"onVentilatorCurrently" === active}
        dispatch={dispatch}
      />
      <CriteriaSwitch
        text="Daily Deaths"
        field="deathIncrease"
        isActive={"deathIncrease" === active}
        dispatch={dispatch}
      />
    </div>
  );
};

export default CriteriaSwitchPanel;
