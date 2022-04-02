function isNumeric(str) {
  if (typeof str === "number") return true; // we only process strings!
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && !isNaN(parseFloat(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
  ); // ...and ensure strings of whitespace fail
}

/**
 *
 * @param {number} errCode
 * @param {string} errCodeTxt
 * @param {string} msg
 * @param  {...string} details
 * @returns
 */
function getErrResObj(errCode, errCodeTxt, msg, ...details) {
  return {
    error: {
      code: errCode,
      codeText: errCodeTxt,
      message: msg,
      details: details?.length > 0 ? details : [msg]
    }
  };
}

export { isNumeric, getErrResObj };
