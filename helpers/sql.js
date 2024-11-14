const { BadRequestError } = require("../expressError");

// Selective query updating helper function.
// This function is used to selectively update a given piece of data in SQL
// just like updating a certain user's last_name if they somehow got a name change.
//
// sqlForPartialUpdate(certainUserOBJ, OBJWithJSFieldsToDBColName)
// dataToUpdate = {Object} {firstField: newVal, secondField: newVal, ...}
// jsToSql = {Object} mapping of JS fields to column names. It's like a functionality from an ORM.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
