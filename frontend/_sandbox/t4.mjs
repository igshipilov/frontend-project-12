import React from "react";
import * as yup from "yup";

export default function StepByStepForm() {
  const [myForm, setMyForm] = useState({});

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setMyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const form1schema = yup.object({
    company_name: yup.string().required(),
  });

  function Step1Form() {
    return (
      <Formik validationSchema={form1schema}>
        {({
          touched,
          isValid,
          isInvalid,
          errors,
          handleBlur,
          handleChange,
          values,
          validateForm,
        }) => (
          <Form noValidate className="formstep1">
            <Form.Group controlId="addCompany">
              <Form.Label>Company Name*</Form.Label>
              <Form.Control
                name="company_name"
                type="text"
                value={myForm.company_name}
                onChange={(e) => {
                  handleChange(e);
                  handleInput(e);
                }}
                isInvalid={!!errors.company_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.company_name}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="step-progress-btn">
              <Button variant="primary" onClick={() => validateForm()}>
                Validate
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  return <div>Step1Form()</div>;
}