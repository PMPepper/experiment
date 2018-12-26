import React from 'react';
import memoize from 'memoize-one';


import DataTable from './DataTable';


export default class LocalStateDataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortColumnName: null,
      sortColumnDesc: false,

      page: props.page || 1,

      expandedRows: props.expandedRows ? {...props.expandedRows} : {},
      selectedRows: props.selectedRows ? {...props.selectedRows} : {},
      disabledRows: props.disabledRows ? {...props.disabledRows} : {},
    };
  }

  setSortColumn = (columnName, desc = false) => {
    this.setState({
      sortColumnName: columnName,
      sortColumnDesc: desc,
    })
  }

  setPage = (page) => {
    this.setState({page})
  }

  setRowExpanded = (id, isExpanded) => {
    this.setState({
      expandedRows: {
        ...this.state.expandedRows,
        [id]: !!isExpanded
      }
    });
  }

  setRowsExpanded = (rowsExpanded) => {
    this.setState({
      expandedRows: {
        ...this.state.expandedRows,
        ...rowsExpanded
      }
    });
  }

  setRowSelected = (id, isSelected) => {
    this.setState({
      selectedRows: {
        ...this.state.selectedRows,
        [id]: !!isSelected
      }
    });
  }

  setRowsSelected = (rowsSelected) => {
    this.setState({
      selectedRows: {
        ...this.state.selectedRows,
        ...rowsSelected
      }
    });
  }

  setRowDisabled = (id, isDisabled) => {
    this.setState({
      disabledRows: {
        ...this.state.disabledRows,
        [id]: !!isDisabled
      }
    });
  }

  setRowsDisabled = (rowsDisabled) => {
    this.setState({
      disabledRows: {
        ...this.state.disabledRows,
        ...rowsDisabled
      }
    });
  }

  render() {
    const props = this.props;

    return <DataTable
      {...props}
      {...this.state}

      setSortColumn={this.setSortColumn}
      setPage={this.setPage}

      setRowExpanded={this.setRowExpanded}
      setRowsExpanded={this.setRowsExpanded}
      setRowSelected={this.setRowSelected}
      setRowsSelected={this.setRowsSelected}
      setRowDisabled={this.setRowDisabled}
      setRowsDisabled={this.setRowsDisabled}
    />
  }
}

function getColumnByName(columns, name) {
  return columns.find(column => (column.name === name)) || null;
}
