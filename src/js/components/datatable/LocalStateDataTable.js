import React from 'react';
import memoize from 'memoize-one';


import DataTable from './DataTable';


export default class LocalStateDataTable extends React.Component {

  setSortColumn = (columnName, desc = false) => {
    this.setState({
      sortColumnName: columnName,
      sortColumnDesc: desc,
    })
  }

  setPage = (page) => {
    this.setState({page})
  }

  render() {
    const props = this.props;

    return <DataTable
      {...props}
      {...this.state}

      setSortColumn={this.setSortColumn}
      setPage={this.setPage}

      //TODO pagination
    />
  }
}

function getColumnByName(columns, name) {
  return columns.find(column => (column.name === name)) || null;
}
