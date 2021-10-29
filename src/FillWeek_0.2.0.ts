function main(workbook: ExcelScript.Workbook, week: WeekData) {
  if (!week) {
    console.log("ERROR: week is undefined!");
    return false;
  }
  if (!week.id) {
    console.log("ERROR: week.id is undefined!");
    return false
  }
  console.log(`INFO: processing_ ${week.id}`)

  if (!week.year) {
    console.log(`INFO: week.year not provided! use year ${DEFAULT_YEAR}`);
    week.year = DEFAULT_YEAR
  }
  
  const sheetName = `Resources ${week.year}`

  const resSheet = workbook.getWorksheet(sheetName)
  if (!resSheet) {
    console.log(`ERROR: sheet '${sheetName}' not found!`);
    return false;
  }

  const week_table = resSheet.getTable(week.id)
  if (!week_table) {
    console.log(`ERROR: table not found for key: ${week.id}`);
    return false;
  }

  const resCount = week_table.getRowCount()
  console.log(`INFO: resource #: ${resCount}`)

  const weekRange = week_table.getRange()

  const startIndex = weekRange.getRowIndex() + ROW_OFFSET_FROM_SHEET_TOP
  const resStartAddress = `B${startIndex}:B${resCount+startIndex+1}`
  
  console.log(
    `INFO: start row #: ${startIndex} - address ${resStartAddress}`)

  const resRange = resSheet.getRange(resStartAddress)

  const resValues = resRange.getValues() as string[][]
  //const weekValues = weekRange.getValues() as string[][]
  
  week.resources.forEach(res => {
    if (!res.mail) {
      console.log('ERROR: resource mail is undefined!');
      return;
    }

    const resIndex = getResIndex(resValues, res)
    if (resIndex < 0) {
      console.log(`WARN: resource ${res.mail} not found in sheet!`)
      return
    }

    const rowIndex = resIndex + ROW_OFFSET_FROM_TABLE_TOP

    console.log(`INFO: resource ${res.mail} found at row: ${rowIndex}`)
    //console.log(`TRACE: resource ${JSON.stringify(res)}`)

    if (res.overtimes!==undefined && res.overtimes!==null) {
      setHoursValue( weekRange.getCell(rowIndex, 0), res, 'overtimes' )
    }
    if (res.hoursoff!==undefined && res.hoursoff!==null) {
      setHoursValue( weekRange.getCell(rowIndex, 1), res, 'hoursoff' )
    }
    if (res.absences!==undefined && res.absences!==null) {
      setHoursValue( weekRange.getCell(rowIndex, 2), res, 'absences' )
    }
  })

  return true
}

const ROW_OFFSET_FROM_TABLE_TOP = 1
const ROW_OFFSET_FROM_SHEET_TOP = 2
const DEFAULT_YEAR = 2021

const setHoursValue = ( cell:ExcelScript.Range, res:Resource, property:keyof Resource ) => {
  const prevValue = cell.getValue()
  const newValue = res[property]

  
  if( typeof(prevValue)==='number' ) {
    if (prevValue === newValue) {
      console.log(`INFO: update '${property}' with value  ${prevValue} at ${cell.getAddress()} skipped! no change detected`)
      return false
    }
    if ( !res.forceUpdate && prevValue !== newValue ) {
      console.log( `WARN: already present '${property}' with value '${prevValue}' at ${cell.getAddress()} - update to ${newValue} skipped!`)
      return false
    }
  }
  
  // console.log(`previous '${property}' value: '${prevValue}' type: '${typeof prevValue}' null:${prevValue === null} undefined: ${prevValue === undefined}` )
  console.log(`INFO: set '${property}' to value '${newValue}' at ${cell.getAddress()}`)
  cell.setValue( newValue )
  return true
}

const getResIndex = (range: string[][], res: Resource) =>
  range
    //.map(row => {console.log(row); return row; })
    .map(row => row[0])
    .map(n => n.trim())
    .map(n => n.toUpperCase())
    .findIndex(n => n === res.mail.toUpperCase())

// @Deprecated
const getResIndexByName = (range: string[][], name: string) =>
  range
    //.map(row => {console.log(row); return row; })
    .map(row => row[0])
    .map(n => n.replace(/\s/g, ''))
    .map(n => n.toUpperCase())
    .findIndex(n => n === name)

// @Deprecated
function getResName(res: Resource) {
  if (!res.name) {
    console.log("resource 'name' is undefined");
    return;
  }

  const [name, surname] = res.name.trim().toUpperCase().split(' ')
  if (!name || !surname) {
    console.log(`resource 'name' ${res.name} is not valid!`)
    return
  }

  return `${surname}${name}`
}

interface Resource {
  name: string,
  mail: string,

  forceUpdate?:boolean
  overtimes?: number,
  hoursoff?: number,
  absences?: number
}

interface WeekData {
  id: string,
  year?: number
  resources: Array<Resource>
}