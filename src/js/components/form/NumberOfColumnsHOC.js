import React from 'react';
import {getDisplayName} from 'recompose';

import {ColumnsContext} from './Form';


export default function numberOfColumns(PresentationalComponent) {

  function NumberOfColumns({wide, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, ...props}) {
    let columns = null;
    let numberOfColumns = null;

    if(one) {
      columns = 'one';
      numberOfColumns = 1;
    } else if(two) {
      columns = 'two';
      numberOfColumns = 2;
    } else if(three) {
      columns = 'three';
      numberOfColumns = 3;
    } else if(four) {
      columns = 'four';
      numberOfColumns = 4;
    } else if(five) {
      columns = 'five';
      numberOfColumns = 5;
    } else if(six) {
      columns = 'six';
      numberOfColumns = 6;
    } else if(seven) {
      columns = 'seven';
      numberOfColumns = 7;
    } else if(eight) {
      columns = 'eight';
      numberOfColumns = 8;
    } else if(nine) {
      columns = 'nine';
      numberOfColumns = 9;
    } else if(ten) {
      columns = 'ten';
      numberOfColumns = 10;
    } else if(eleven) {
      columns = 'eleven';
      numberOfColumns = 11;
    } else if(twelve) {
      columns = 'twelve';
      numberOfColumns = 12;
    } else if(thirteen) {
      columns = 'thirteen';
      numberOfColumns = 13;
    } else if(fourteen) {
      columns = 'fourteen';
      numberOfColumns = 14;
    } else if(fifteen) {
      columns = 'fifteen';
      numberOfColumns = 15;
    } else if(sixteen) {
      columns = 'sixteen';
      numberOfColumns = 16;
    }

    //TODO if in Debug mode, check that multiple column numbers aren't set!
    return <ColumnsContext.Consumer>{(parentColumns) => (
      <ColumnsContext.Provider value={{wide, numberOfColumns, columns, parentColumns}}>
        <PresentationalComponent {...props} />
      </ColumnsContext.Provider>
    )}</ColumnsContext.Consumer>
  }

  NumberOfColumns.displayName = `${NumberOfColumns.name}(${getDisplayName(PresentationalComponent)})`;


  return NumberOfColumns;

}

export function numberToName(number) {
  switch(number) {
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    case 5:
      return 'five';
    case 6:
      return 'six';
    case 7:
      return 'seven';
    case 8:
      return 'eight';
    case 9:
      return 'nine';
    case 10:
      return 'ten';
    case 11:
      return 'eleven';
    case 12:
      return 'twelve';
    case 13:
      return 'thirteen';
    case 14:
      return 'fourteen';
    case 15:
      return 'fifteen';
    case 16:
      return 'sixteen';
  }

  return null;
}
