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
import {Trans} from '@lingui/macro';
import {I18n} from '@lingui/react';
import { Form as AForm } from 'react-advanced-form'

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


import css from '@/helpers/css/class-list-to-string';

export const ColumnsContext = React.createContext(null);


//The component
export default class Form extends React.Component {

  render() {
    const {children, styles} = this.props;

    return <ColumnsContext.Provider value={null}>
      <AForm className={styles.form} action={(...args) => {console.log('Form action: ', args)}}>
        {children}
      </AForm>
    </ColumnsContext.Provider>
  }
}

Form.defaultProps = {
  styles: defaultStyles
};

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


export {Group, Legend, Row, Column, Field, Input, Textarea, Select, Checkboxes, Label};
