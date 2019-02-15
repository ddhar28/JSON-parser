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

if(!inp.startsWith("null"))return null;
return [null,inp.slice(4)];
}


function numparser(inp){

  //if(!Number.isInteger(inp[0]*1) && inp[0]!='-') return null;
  //const re=/^((-?[^+0\"])|(-?[^+\"](0\.)))\d+/;
//((e|E)(+|-)?\d+)?

const re=/^-?(0(?=\.\d+)|[1-9]\d*)(\.\d+|)((e|E)(\+|-|)\d+|)/;
  if(!re.test(inp)) return null;
  return [re.exec(inp)[0]*1, inp.replace(re.exec(inp)[0],'')];
}


function strparser(inp){

  /*const re=/^\"(\\\")|[^\"].*\"/;
  let esc={'\':'\\', 'b':'\b', 't':'\t', '"':'\"', 'n':'\n', 'f':'\f', 'r':'\r', '/':'\/', 'u':'\u'};

  if(!re.test(inp)) return null;
  
  let match=re.exec(inp);
  console.log(match);
  match[0].replace(match[1],esc[match[1]]);
  return [match[0], inp.replace(re.exec(inp)[0],'')];*/

  if(!inp.startsWith('"'))return null;

  let esc={'\\':'\\', 'b':'\b', 't':'\t', '"':'"', 'n':'\n', 'f':'\f', 'r':'\r', '/':'/'};
  let back=inp.includes("\\");
  //console.log(back);
  if(!back){

    if(inp.slice(1).includes('"')){

      let val=inp.slice(0,inp.indexOf('"',1)+1);
      console.log(val);
      return [val.replace(/\"/g,''), inp.replace(val,'')];
    } 
    else return null;
  } 

  if(back){

    return [inp.replace]
  }
}


function boolparser(inp){

  let bool=true;
  if(inp.startsWith('"')) return null;

  if(inp.startsWith("false")) bool=false;
  else if(!inp.startsWith("true")) return null;

  return [bool,inp.replace(bool,'')];
}


prompt(function(input){

  console.log("null : ", nullparser(input));
  console.log("num : ", numparser(input));
  console.log("string : ", strparser(input));
  console.log("bool : ", boolparser(input));
  
  process.exit();
})

