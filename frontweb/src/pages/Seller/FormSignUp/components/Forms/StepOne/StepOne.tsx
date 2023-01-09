import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState, useEffect } from "react";
import { FormContext } from "../../../Form";
import * as yup from "yup";

function StepOne() {
  const { activeStepIndex, setActiveStepIndex, formData, setFormData }: any = useContext(FormContext);

  const renderError: any = (
    message:
      | number
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined,
  ) => <p className="italic text-red-600">{message}</p>;

  const ValidationSchema = yup.object().shape({
    ci: yup.string().required(),
  });

  return (
    <Formik
      initialValues={{
        ci: "",
      }}
      validationSchema={ValidationSchema}
      onSubmit={(values) => {
        const data = { ...formData, ...values };
        setFormData(data);
        setActiveStepIndex(activeStepIndex + 1);
        localStorage.setItem("personalId", values.ci as string);
      }}
    >
      <Form className="flex flex-col items-center justify-center">
        <div className="self-center mb-2 text-2xl font-medium">
          Bienvenido a ser parte de la comunidad de vendedores de UruBuy! <br />
          Para continuar, necesitamos validar tu identidad.
        </div>
        <div className="flex flex-col items-start mt-6 mb-2">
          <label className="font-medium text-gray-900">Cédula de identidad</label>
          <Field name="ci" className="p-2 border-2 rounded-md" placeholder="12345678" />
        </div>
        <ErrorMessage name="ci" render={renderError} />
        <button className="p-2 my-2 font-medium text-white bg-indigo-500 rounded-md" type="submit">
          Siguiente
        </button>
        <img
          src="https://img.freepik.com/vector-gratis/proceso-entrevista-trabajo-contratacion-nuevos-empleados-personaje-dibujos-animados-especialista-recursos-humanos-hablando-nuevo-candidato-reclutamiento-empleo-ilustracion-concepto-headhunting_335657-2034.jpg?w=826&t=st=1668132757~exp=1668133357~hmac=0e12722944bc7dbe82094ceadad1b80c270ab67aabae07ee47f7dd35ddd81490"
          className="mb-6 mt4 w-1/2 ..."
        />
      </Form>
    </Formik>
  );
}

export default StepOne;
