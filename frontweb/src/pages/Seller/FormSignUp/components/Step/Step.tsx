import React, { useContext } from "react";
import { FormContext } from "../../Form";
import { StepOne, StepTwo, Success } from "../Forms";

function Step() {
  const { activeStepIndex }: any = useContext(FormContext);
  let stepContent;
  switch (activeStepIndex) {
    case 0:
      stepContent = <StepOne />;
      break;
    case 1:
      stepContent = <StepTwo />;
      break;
    case 2:
      stepContent = <Success />;
      break;
    default:
      break;
  }

  return <>{stepContent}</>;
}

export default Step;
