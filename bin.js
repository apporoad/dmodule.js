#! /usr/bin/env node

const program = require('commander')
const child_process = require('child_process')
const path = require('path')
const fs = require('fs')


program.version(require('./package.json').version)

program.command('serve')
.description( 'start dmodule server')
.option('-m,--mount <mount>')
.option('-p --port [value]', '端口号，默认是11546')
.action((options) => {
    var apiPath = path.join(__dirname , 'api')
    var sPath = path.resolve( process.cwd(), options.mount || '.')
    var port = options.port || '11546'
    var cmd =  `aok ${apiPath}  -s  ${sPath}  -p ${port}`
    var aokProcess = child_process.exec( cmd, (err,out,stdErr)=>{
            if(err){
                console.log('执行aok出错： ' + cmd)
                console.log("如果没有安装aok.js 请执行 sudo npm install  -g aok.js")
            }else{
                console.log(out)
                run(ws,static)
            }
        })

        aokProcess.stdout.on('data', function (data) {
            console.log(data);
        })
        aokProcess.stderr.on('data', function (data) {
            //console.log('error in aok: ' + data);
        })
        
  })

program.command('publish' , 'publish local modules to server')
.option('-n,--module <module>')
.action((options)=>{
    var workspace = path.resolve( process.cwd(), options.mount || '.')
    var dmoduleJson = path.join(workspace , 'dmodule.json')
    if(!fs.existsSync(dmoduleJson)){
        console.log('publish failed :  need dmodule.json in your workspace : ' + workspace)
        return
    }
    //todo
})
program .parse(process.argv)




//  child_process.exec(`ldl ${rPath} ${ws} --type ${type}` , (err,out,stdErr)=>{
//             //console.log(stdErr)
//             if(err){
//                 console.log(`下载远程文件出错： ldl ${rPath} ${ws} --type ${type}`)
//                 console.log("如果没有安装lisa.dl 请执行 npm i -g lisa.dl")
//             }else{
//                 console.log(out)
//                 run(ws,static)
//             }
//         })