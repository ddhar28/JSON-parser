'use strict'

function nullparser (inp) {
  if (!inp.startsWith('null')) return null; return [null, inp.slice(4)]
}

function numparser (inp) {
  let result
  return (result = inp.match(/^-?(0(?=\.\d+)|[1-9]\d*|0{1})(\.\d+|)((e|E)(\+|-|)\d+|)/)) && [+result[0], inp.slice(result[0].length)]
}

function hex (inp) {
  let result = []
  for (let i = 0; i <= inp.length; i++) { result.push(inp.charCodeAt(i).toString(16)) }
  return result.join('')
}

function strparser (inp) {
  if (!inp.startsWith('"')) return null
  let dict = { '\\': '\\', '/': '/', '"': '"', 'b': '\b', 't': '\t', 'n': '\n', 'f': '\f', 'r': '\r' }
  let val = '"'; let str = inp.slice(1)
  while (str[0] !== '"') {
    if (str[0] === '\t' || str[0] === '\n') return null
    if (str[0] === '\\') {
      if (dict[str[1]] === undefined && str[1] !== 'u') return null
      if (str[1] === 'u') {
        if (str.slice(2).length <= 4) return null
        val += hex(str.slice(2, 6)); str = str.slice(6)
        continue
      }
      val += dict[str[1]]; str = str.slice(2)
      if (str.indexOf('"') === -1) return null
      continue
    }
    val += str[0]; str = str.slice(1)
    if (str.length === 0) return null
  }

  if (str.length >= 1) val += '"'
  if (val.length === 1 || (val.length > 1 && val[val.length - 1] !== '"')) return null
  return [val.slice(1, val.length - 1), str.slice(1)]
}

function boolparser (inp) {
  if (inp.startsWith('false')) return [false, inp.slice(5)]
  if (inp.startsWith('true')) return [true, inp.slice(4)]
  return null
}

function spaceparse (inp) {
  while (inp[0] === ' ' || inp[0] === '\n' || inp[0] === '\t') inp = inp.slice(1)
  return inp
}

function arrparser (inp) {
  if (!inp.startsWith('[')) return null
  let val = []; let str = spaceparse(inp.slice(1)); let result; let iscomma = true
  if (str[0] === ']') return [val, str.slice(1)]
  while (str[0] !== ']') {
    if (str[0] === ',' && iscomma) return null
    if (str[0] === ',') {
      iscomma = true; str = spaceparse(str.slice(1))
      if (!str.length) return null
      continue
    }
    if (!iscomma) return null
    iscomma = false; result = parse(str)
    if (!result) return null
    val.push(result[0]); str = spaceparse(result[1])
    continue
  }
  if (iscomma) return null
  return [val, str.slice(1)]
}

function objparser (inp) {
  if (!inp.startsWith('{')) return null
  let obj = {}; let val; let key; let iscolon = false; let iscomma = true
  let str = spaceparse(inp.slice(1)); let record = 1
  if (str[0] === '}') return [obj, str.slice(1)]
  while (str[0] !== '}') {
    if (str[0] === ',' && iscomma) return null
    if (str[0] === ':' && iscolon) return null
    if (iscolon && record) return null
    if (str[0] !== ',' && str[0] !== ':') {
      if (!iscomma) return null
      if (!iscolon) {
        key = strparser(str)
        if (!key) return null
        obj[key[0]] = null; str = spaceparse(key[1]); record = 0
      }
      if (iscolon) {
        val = parse(str)
        if (!val) return null
        obj[key[0]] = val[0]; str = spaceparse(val[1])
        iscolon = false; iscomma = false; record = 1
      } continue
    }
    if (str[0] === ',') iscomma = true
    if (str[0] === ':') iscolon = true
    str = spaceparse(str.slice(1))
    if (!str.length) return null
  }
  if (iscomma || iscolon || !record) return null
  return [obj, str.slice(1)]
}

function parse (inp) {
  let parser = [nullparser, boolparser, numparser, strparser, arrparser, objparser]; let result = null
  for (let func of parser) {
    if (!result) result = func(inp); else break
  }
  return result
}

function main (input) {
  let fs = require('fs'); let result
  fs.readFile(input, 'utf8', function (err, data) {
    if (err) return console.log(err)
    if (!data.startsWith('[') && !data.startsWith('{')) result = null; else result = parse(data)
    console.log(result && spaceparse(result[1]) === '' ? JSON.stringify(result[0]) : 'Invalid JSON')
  })
}
main('test/pass1.json')
