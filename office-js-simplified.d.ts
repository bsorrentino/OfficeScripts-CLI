//
// Version 1.0
//
// Adapting excel-js to simplified version
//
declare namespace ExcelScript {


    interface Range extends Excel.Range {

        getRowIndex():number
        getValues():any
        getCell(row:number, col:number):Range
        getAddress():string
        getValue():any
        setValue( value:any ):void

    }

    interface Table extends Excel.Table {

        getRowCount():number
        getRange(address?:string):Range
        setName( name:string ):void

    }

    interface Worksheet extends Excel.Worksheet { 

        getTable(name: string): Table
        getRange(address?:string):Range
        getTables(): Array<Table>

    }

    interface Workbook extends Excel.Workbook {

        getWorksheet(name: string): Worksheet
        getActiveWorksheet(): Worksheet

    }

} 