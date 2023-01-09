import { FormikContext } from "formik";
import { createContext, useState } from "react";
import NavbarUrubuy from "../../../components/Navbar/NavbarUrubuy";
import Step from "./components/Step/Step";
import Stepper from "./components/Stepper";

export const FormContext: any = createContext(FormikContext);

function Form() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <>
      <NavbarUrubuy />
      <FormContext.Provider value={{ activeStepIndex, setActiveStepIndex, formData, setFormData }}>
        <div className="flex flex-col items-center justify-start w-screen h-screen">
          <Stepper />
          <Step />
        </div>
      </FormContext.Provider>
    </>
  );
}

export default Form;
