//
// Version 1.0
//
// Adapting excel-js to simplified version
//
declare namespace ExcelScript {

    // copy of Excel.InsertShiftDirection
    enum InsertShiftDirection { down = "Down", right = "Right"}    

    // copy of Excel.GroupOption
    enum GroupOption { byRows = "ByRows", byColumns = "ByColumns"}
 
    interface RangeFill extends Excel.RangeFill {
        setColor( value:string ):void
    }

    interface RangeFormat extends Excel.RangeFormat {
        getFill():ExcelScript.RangeFill
    }

    interface Range extends Excel.Range {

        getColumn( id: number  ): ExcelScript.Range
        getRowIndex():number
        getValues():[any]
        getCell(row:number, col:number):ExcelScript.Range
        getAddress():string
        getValue():any
        setValue( value:any ):void
        insert( direction: InsertShiftDirection): ExcelScript.Range;
        setFormulaLocal( formula:string ): void
        getFormat():ExcelScript.RangeFormat // Excel.RangeFormat
        setNumberFormatLocal( format:string ): void

    }

    interface Table extends Excel.Table {

        getRowCount():number
        getRange(address?:string):ExcelScript.Range
        setName( name:string ):void
        getSort():Excel.TableSort
        getWorksheet(): ExcelScript.Worksheet

        addRow(index?: number, values?: (boolean | string | number)[]): void;
        addRows(index?: number, values?: (boolean | string | number)[][]): void;
    }

    interface Worksheet extends Excel.Worksheet { 

        getTable(name: string): ExcelScript.Table|undefined
        getRange(address?:string):ExcelScript.Range
        getTables(): Array<Table>
        getCell(row:number, col:number):ExcelScript.Range
    }

    interface Workbook extends Excel.Workbook {

        getWorksheet(name: string): ExcelScript.Worksheet
        getActiveWorksheet(): ExcelScript.Worksheet
        getTable(name: string): ExcelScript.Table|undefined

    }

} 

