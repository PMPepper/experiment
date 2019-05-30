import React from 'react';
import {getDisplayName} from 'recompose';


export default function numberOfColumns(PresentationalComponent) {

  function NumberOfColumns({one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, ...props}) {
    let columns = null;
    let name = null;

    if(one) {
      name = 'one';
      columns = 1;
    } else if(two) {
      name = 'two';
      columns = 2;
    } else if(three) {
      name = 'three';
      columns = 3;
    } else if(four) {
      name = 'four';
      columns = 4;
    } else if(five) {
      name = 'five';
      columns = 5;
    } else if(six) {
      name = 'six';
      columns = 6;
    } else if(seven) {
      name = 'seven';
      columns = 7;
    } else if(eight) {
      name = 'eight';
      columns = 8;
    } else if(nine) {
      name = 'nine';
      columns = 9;
    } else if(ten) {
      name = 'ten';
      columns = 10;
    } else if(eleven) {
      name = 'eleven';
      columns = 11;
    } else if(twelve) {
      name = 'twelve';
      columns = 12;
    } else if(thirteen) {
      name = 'thirteen';
      columns = 13;
    } else if(fourteen) {
      name = 'fourteen';
      columns = 14;
    } else if(fifteen) {
      name = 'fifteen';
      columns = 15;
    } else if(sixteen) {
      name = 'sixteen';
      columns = 16;
    }

    //TODO if in Debug mode, check that multiple column numbers aren't set!

    return <PresentationalComponent {...props} numberOfColumns={columns} columns={name} />
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
