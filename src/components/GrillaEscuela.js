import React, { useState ,useEffect,useRef,useCallback, useMemo} from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Plugin, Template, TemplateConnector, TemplatePlaceholder,
} from '@devexpress/dx-react-core';
import { EditingState ,
  RowDetailState, 
    SortingState,
    IntegratedSorting ,
    FilteringState,
    DataTypeProvider,
    IntegratedFiltering,
    TreeDataState,
    CustomTreeData,
    SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
} from '@devexpress/dx-react-grid';
import { Loading } from '../theme-sources/material-ui/components/loading';
import { GridExporter } from '@devexpress/dx-react-grid-export';  
import {
  Grid,
  Table,
  TableHeaderRow,
  
  TableGroupRow,
    GroupingPanel,
    TableSummaryRow,
    TableSelection,
    DragDropProvider,
    TableFilterRow,
    Toolbar,
    ExportPanel,
    TableRowDetail,
    TableTreeColumn,
    PagingPanel,
    TableColumnVisibility,
    ColumnChooser
} from '@devexpress/dx-react-grid-material-ui';


//import DateFnsUtils from '@date-io/date-fns'
import { get } from "../services/Axios1";
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import DateRange from '@material-ui/icons/DateRange';
import * as PropTypes from 'prop-types';
import saveAs from 'file-saver';

const FilterIcon = ({ type, ...restProps }) => {
  if (type === 'month') return <DateRange {...restProps} />;
  return <TableFilterRow.Icon type={type} {...restProps} />;
};

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
  },
  numericInput: {
    fontSize: '14px',
    textAlign: 'right',
    width: '100%',
  },
});

const CurrencyEditorBase = ({ value, onValueChange, classes }) => {
  const handleChange = (event) => {
    const { value: targetValue } = event.target;
    if (targetValue.trim() === '') {
      onValueChange();
      return;
    }
    onValueChange(parseInt(targetValue, 10));
  };
  return (
    <Input
      type="number"
      classes={{
        input: classes.numericInput,
        root: classes.root,
      }}
      fullWidth
      value={value === undefined ? '' : value}
      inputProps={{
        min: 0,
        placeholder: 'Filter...',
      }}
      onChange={handleChange}
    />
  );
};

CurrencyEditorBase.propTypes = {
  value: PropTypes.number,
  onValueChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

CurrencyEditorBase.defaultProps = {
  value: undefined,
};

const CurrencyEditor = withStyles(styles)(CurrencyEditorBase)

const RowDetail = ({ row }) => (
row.escuelas.map((data,i)=>{
  return(
   
    <div>
    
   {data.nombre}
  </div>
  )
})

);


export default () => {

  const exporterRef = useRef(null);

  const startExport = useCallback(() => {
    exporterRef.current.exportGrid();
  }, [exporterRef]);
  const [selection, setSelection] = useState([]);
     
      const onSave = (workbook) => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
        });
      };

  const URL='https://secretaria-educacion.herokuapp.com/api/escuela/all';
  const [rows,setRows] = useState([]);
  const getData = async () => {
    const  {list} = await get(URL);
    setRows(list);
    setLoading(false);
    }
    useMemo(()=>{
      getData()
     console.log("paso por aca")
},[]);
const [columns] = useState([
  { name: 'idEscuela', title: 'Id' },
  { name: 'diegep', title: 'DIEGEP' },
  { name: 'nombre', title: 'Nombre' },
  { name: 'suvencion', title: 'Suvencion' },
  { name: 'calle', title: 'Calle' },
  { name: 'numero', title: 'Numero' },
  { name: 'localidad', title: 'Localidad' },

  
 ]);
 const [expandedRowIds, setExpandedRowIds] = useState([]);
 const [sorting, setSorting] = useState([{ columnName: 'nombre', direction: 'asc' }]);
 const [dateColumns] = useState([]);
 const [dateFilterOperations] = useState(['month', 'contains', 'startsWith', 'endsWith']);
 const [currencyColumns] = useState(['legajo']);
 const [currencyFilterOperations] = useState([
     'equal',
     'notEqual',
     'greaterThan',
     'greaterThanOrEqual',
     'lessThan',
     'lessThanOrEqual',
 ]);
 const [pageSizes] = useState([5, 10, 15, 0]);
 const [loading, setLoading] = useState(true);
 
 const [filteringColumnExtensions] = useState([]);
const [hiddenColumnNames, setHiddenColumnNames] = useState(['calle','numero','localidad']);

  return (
    <Paper>
      <Grid
        rows={rows}
        columns={columns}
        
      >
        <PagingState
             defaultCurrentPage={0}
             defaultPageSize={5}
          />
          {/*<SelectionState
            selection={selection}
            onSelectionChange={setSelection}
          />*/}
          <IntegratedPaging />
          {/*<IntegratedSelection />*/}
          
        <RowDetailState
          expandedRowIds={expandedRowIds}
          onExpandedRowIdsChange={setExpandedRowIds}
        />

        <SortingState
          sorting={sorting}
          onSortingChange={setSorting}
        />
         <IntegratedSorting />
         <DataTypeProvider
          for={dateColumns}
          availableFilterOperations={dateFilterOperations}
        />
        <DataTypeProvider
          for={currencyColumns}
          availableFilterOperations={currencyFilterOperations}
          editorComponent={CurrencyEditor}
        />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering columnExtensions={filteringColumnExtensions} />
       
        <Table />
        <TableHeaderRow />

      
 <TableFilterRow
          showFilterSelector
          iconComponent={FilterIcon}
          messages={{ month: 'Mes igual',
                    contains: 'Contiene' ,
                    notContains: 'No contiene',
                    equal:'Igual',
                    notEqual: 'No es igual' ,
                    endsWith:'Termina con',
                    startsWith: 'Empieza',
                    greaterThan: 'Mayor ',
                    lessThan:'Menor ',
                    lessThanOrEqual:'Menor o igual',
                    greaterThanOrEqual:'Mayor igual'
                     }}
        />
         <TableColumnVisibility
          hiddenColumnNames={hiddenColumnNames}
          onHiddenColumnNamesChange={setHiddenColumnNames}
        />
        
          {/*<TableSelection showSelectAll  />*/}
          <PagingPanel
          pageSizes={pageSizes}
          messages={{rowsPerPage:"Lineas por página"}}
          />
      
         <Toolbar />
         <h4>Escuelas</h4>
         <ColumnChooser messages={{showColumnChooser:"Ver columnas"}} />
        <ExportPanel
          messages={{
            showExportMenu:"Exportar",
            exportAll:"Exportar todo",
            exportSelected:"Exportar seleccíon" 
          }}
        startExport={startExport}/>

       
      </Grid>
      {loading && <Loading />}
      <GridExporter
        ref={exporterRef}
        rows={rows}
        columns={columns}
       
        selection={selection}
        sorting={sorting}
        onSave={onSave}
      />
    </Paper>
  );
};