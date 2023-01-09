import React, { useContext, useEffect } from "react";
import { FormContext } from "../Form";

function Stepper() {
  const { activeStepIndex }: any = useContext(FormContext);
  useEffect(() => {
    const stepperItems = document.querySelectorAll(".stepper-item");
    stepperItems.forEach((step, i) => {
      if (i <= activeStepIndex) {
        step.classList.add("bg-indigo-500", "text-white");
      } else {
        step.classList.remove("bg-indigo-500", "text-white");
      }
    });
  }, [activeStepIndex]);
  return (
    <div className="flex flex-row items-center justify-center w-2/3 px-32 py-16">
      <div className="w-8 h-8 font-medium text-center border-2 rounded-full stepper-item">1</div>
      <div className="flex-auto border-t-2"></div>
      <div className="w-8 h-8 font-medium text-center border-2 rounded-full stepper-item">2</div>
      <div className="flex-auto border-t-2"></div>
      <div className="w-8 h-8 font-medium text-center border-2 rounded-full stepper-item">3</div>
    </div>
  );
}

export default Stepper;
