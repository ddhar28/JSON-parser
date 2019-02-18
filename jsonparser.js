'use strict';

function prompt(callback) {
  let stdin = process.stdin
  let stdout = process.stdout
  
  stdin.resume()
    //stdout.write(question)
  
  stdin.once('data', function (data) {
    callback(data.toString().trim())
  })
}

function nullparser(inp){
  if (!inp.startsWith("null")) return null
  return [null,inp.slice(4)]
}


function numparser(inp){
  let result
  return (result = inp.match(/^-?(0(?=\.\d+)|[1-9]\d*)(\.\d+|)((e|E)(\+|-|)\d+|)/)) &&
    [result[0] * 1, inp.slice(result[0].length)]
}


function strparser(inp){
  if(!inp.startsWith('"')) return null
  //const re=/"([^"\\]*|([^"\\]*(\\("|\\|\/|t|b|n|f|r))*)[^"\\]*|)"/;
 
  let dict={ '\\':'\\', '/':'/','"':'\"', 'b':'\b', 't':'\t', 'n':'\n', 'f':'\f', 'r':'\r'}
  let val='"', index=1
  let str=inp.slice(1)

  while(str[0]!='"'){

    if(str[0]=='\\'){

      if(dict[str[1]]==undefined) return null
      val+=dict[str[1]]
      index+=2
      str=str.slice(2)
      if(str.indexOf('"')==-1) return null
      continue
    }

    val+=str[0];index++  
    str=str.slice(1)
    if(str.length==0) return null
  }

  if(str.length>=1) val+='"';index++
  //console.log(val)
  if(val.length==1 || (val.length>1 && val[val.length-1]!='"')) return null  
  return [val.slice(1,val.length-1 ),inp.slice(index)]
}


function boolparser(inp){
  if (inp.startsWith("false")) return [false, inp.slice(5)]
  if (inp.startsWith("true")) return [true, inp.slice(4)]

  return null
}


prompt(function(input){
  let parser=[nullparser, boolparser, numparser, strparser]
  let result=null
  for(let func of parser){

    if(!result) result=func(input) 
    else break
  }
  console.log(result?result:"Invalid JSON")  
  process.exit();
})

