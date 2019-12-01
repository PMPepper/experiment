import React from 'react';

//Components
import Form from '@/components/form/Form';

//Consts
const FormValidationContext = React.createContext(null);
FormValidationContext.displayName = 'FormValidationContext';


//The component
const FormValidation = React.forwardRef(function FormValidation({children, state}, ref) {
  const form = React.Children.only(children);

  return <FormValidationContext value={}>
    {React.cloneElement(form, {ref})}
  </FormValidationContext>
});


export default FormValidation;

//Add to forms namespace
const Group = FormValidation.Group = Group;
const Legend = FormValidation.Legend = Legend;
const Row = FormValidation.Row = Row;
const Column = FormValidation.Column = Column;
const Field = FormValidation.Field = Field;
const Input = FormValidation.Input = Input;
const Textarea = FormValidation.Textarea = Textarea;
const Select = FormValidation.Select = Select;
const Checkboxes = FormValidation.Checkboxes = Checkboxes;
const Label = FormValidation.Label = Label;
const Button = FormValidation.Button = Button;
const Container = FormValidation.Container = Container;
const Output = FormValidation.Output = Output;

export {Group, Legend, Row, Column, Field, Input, Textarea, Select, Checkboxes, Label, Button, Container, Output};
