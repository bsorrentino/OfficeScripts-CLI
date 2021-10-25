function main(workbook: ExcelScript.Workbook, week: WeekData) {
  if (!week) {
    console.log("week is undefined!");
    return false;
  }
  if (!week.id) {
    console.log("week.id is undefined!");
    return false
  }
  if (!week.year) {
    console.log(`week.year not provided! use year ${DEFAULT_YEAR}`);
    week.year = DEFAULT_YEAR
  }

  const sheetName = `Resources ${week.year}`

  const resSheet = workbook.getWorksheet(sheetName)
  if (!resSheet) {
    console.log(`sheet '${sheetName}' not found!`);
    return false;
  }

  const week_table = resSheet.getTable(week.id)
  if (!week_table) {
    console.log(`table not found for key: ${week.id}`);
    return false;
  }

  const resCount = week_table.getRowCount()
  console.log(`resource #: ${resCount}`)

  const weekRange = week_table.getRange()

  const startIndex = weekRange.getRowIndex() + ROW_OFFSET_FROM_SHEET_TOP
  const resStartAddress = `A${startIndex}:A${resCount+startIndex+1}`
  
  console.log(
    `start row #: ${startIndex} - address ${resStartAddress}`)

  const resRange = resSheet.getRange(resStartAddress)

  const values = resRange.getValues() as string[][]
  
  week.resources.forEach(res => {
    if (!res.mail) {
      console.log('resource mail is undefined!');
      return;
    }

    const resIndex = getResIndex(values, res)
    if (resIndex < 0) {
      console.log(`resource ${res.mail} not found in sheet!`)
      return
    }

    const rowIndex = resIndex + ROW_OFFSET_FROM_TABLE_TOP

    console.log(`resource ${res.mail} found at row: ${rowIndex}`)

    if (res.overtimes!==undefined) {
      weekRange.getCell(rowIndex, 0).setValue(res.overtimes)
    }
    if (res.hoursoff!==undefined) {
      weekRange.getCell(rowIndex, 1).setValue(res.hoursoff)
    }
    if (res.absences!==undefined) {
      weekRange.getCell(rowIndex, 2).setValue(res.absences)
    }
  })

  return true
}

const ROW_OFFSET_FROM_TABLE_TOP = 1
const ROW_OFFSET_FROM_SHEET_TOP = 2
const DEFAULT_YEAR = 2021

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

  overtimes?: number,
  hoursoff?: number,
  absences?: number
}

interface WeekData {
  id: string,
  year?: number
  resources: Array<Resource>
}