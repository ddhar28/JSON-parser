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
    let val="", isescape=false
    let str=inp.slice(1)

    while(str[0]!='"'){

        if(isescape==true){

            if(dict[str[0]]==undefined) return null
            val+=dict[str[0]]
            isescape=false
            str=str.slice(1)
            continue
        }
            
        if(str[0]=='\\') isescape=true;
        //else if(str[0]=='"' && isescape==false) return null;
        else val+=str[0]
        str=str.slice(1)
    }

    console.log(val);
    return [val.slice(1,val.length-1),inp.replace(val,'')];
}


function boolparser(inp){
  if (inp.startsWith("false")) return [false, inp.slice(5)]
  if (inp.startsWith("true")) return [true, inp.slice(4)]

  return null
}


prompt(function(input){

  console.log("null : ", nullparser(input));
  console.log("num : ", numparser(input));
  console.log("string : ", strparser(input));
  console.log("bool : ", boolparser(input));
  
  process.exit();
})

