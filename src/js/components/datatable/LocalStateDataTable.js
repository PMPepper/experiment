import React from 'react';
import memoize from 'memoize-one';


import DataTable from './DataTable';


export default class LocalStateDataTable extends React.Component {

  setSortColumn = (columnName, desc = false) => {
    this.setState({
      sortColumnName: columnName,
      sortColumnAsc: desc,
    })
  }

  render() {
    const props = this.props;

    return <DataTable
      {...props}
      {...this.state}

      setSortColumn={this.setSortColumn}

      //TODO pagination
    />
  }
}

function getColumnByName(columns, name) {
  return columns.find(column => (column.name === name)) || null;
}
