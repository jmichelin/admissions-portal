/* eslint-disable */
export function cleanMochaStackTrace (stackString, specLineOffset) {
  var matches = stackString
    .filter(function(line) {
      return line.match(/data:application\/javascript,/)
        && ! line.match(/^Context\.<anonymous>/)
    })
  return matches.map(trimLine).map(line => lineNumberReport(specLineOffset, line))
}

//
// Helpers
//
function trimLine (line) {
  return line.trim().replace(/[\)]*$/, '')
}

function lineNumberReport (specLineOffset, line) {
  var lineNo = getLineNum(line)

  var match = line.match(/^([^ @]+)[ @(]*?data:application\/javascript,/)

  var name = '???'
  if ( match ) {
    name = match[1]
      .replace('Object.', '')
      .replace('<anonymous>', '<spec>')
      .replace('{anonymous}()', '<spec>')
  }
  else if ( lineNo !== null && lineNo < specLineOffset ) {
    name = '<your solution code>'
  }
  else {
    name = '<spec>'
  }

  if ( lineNo !== null && lineNo > specLineOffset ) {
    lineNo -= specLineOffset
  }

  return `in ${ name } - line ${ lineNo }`
}

function getLineNum (str) {
  var match = str.match(/:(\d+):(\d+)$/)
  return match && Number(match[1])
}
