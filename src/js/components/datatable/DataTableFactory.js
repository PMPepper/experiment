import React from 'react';
import memoize from 'memoize-one';

import DataTable from './DataTable';



export default function dataTableFactory(defaultColumns) {
  return class extends React.Component {

    getColumns = memoize((columns) => {
      if(!columns || !(columns instanceof Array) || columns.length === 0) {
        return defaultColumns;
      }

      return columns.map(column => {
        if(typeof(column) === 'string') {
          return defaultColumns.find(defaultColumn => (defaultColumn.name === column))
        }

        return column;
      }).filter(column => (!!column));
    });

    render() {
      const props = this.props;

      return <DataTable {...props} columns={this.getColumns(props.columns)} />
    }
  }
}
