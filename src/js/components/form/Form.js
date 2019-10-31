//TODO
//-General:
//Textarea
//Radio buttons (inline or stacked)
//Sets of checkboxes
//Validation/integration with react-advanced-forms
//Errors
//date/time controls? probably not
//
//-Layout/styling:
//disabled fields
//inline styles
//Legend as label for first field? (accessible). Not sure if this is possible to do automatically
//Buttons
//Tooltips
//Field info



import React from 'react';

import defaultStyles from './form.scss';

//Form components
import Group from './Group';
import Legend from './Legend';
import Row from './Row';
import Column from './Column';
import Field from './Field';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Checkboxes from './Checkboxes';
import Label from './Label';
import Button from './Button';
import Container from './Container';

//Helpers
import css from '@/helpers/css/class-list-to-string';
import combineProps from '@/helpers/react/combine-props';

//Consts
import {StyleContext} from './contexts';


//The component
const Form = React.forwardRef(function Form({children, styles, ...rest}, ref) {
  return <StyleContext.Provider value={styles}>
    <form {...combineProps({className: styles.form}, rest)} ref={ref}>
      {children}
    </form>
  </StyleContext.Provider>
});

Form.defaultProps = {
  styles: defaultStyles
};

export default Form;

//Add to forms namespace
Form.Group = Group;
Form.Legend = Legend;
Form.Row = Row;
Form.Column = Column;
Form.Field = Field;
Form.Input = Input;
Form.Textarea = Textarea;
Form.Select = Select;
Form.Checkboxes = Checkboxes;
Form.Label = Label;
Form.Button = Button;
Form.Container = Container;


export {Group, Legend, Row, Column, Field, Input, Textarea, Select, Checkboxes, Label, Button, Container};
