#! /usr/bin/env node

const program = require('commander')
const child_process = require('child_process')
const path = require('path')
const fs = require('fs')


program.version(require('./package.json').version)

program.command('serve')
    .description('start dmodule server')
    .option('-m,--mount <mount>')
    .option('-p --port [value]', '端口号，默认是11546')
    .action((options) => {
        var apiPath = path.join(__dirname, 'api')
        var sPath = path.resolve(process.cwd(), options.mount || '.')
        var port = options.port || '11546'
        var cmd = `aok ${apiPath}  -s  ${sPath}  -p ${port}`
        var aokProcess = child_process.exec(cmd, (err, out, stdErr) => {
            if (err) {
                console.log('执行aok出错： ' + cmd)
                console.log("如果没有安装aok.js 请执行 sudo npm install  -g aok.js")
            } else {
                console.log(out)
                run(ws, static)
            }
        })

        aokProcess.stdout.on('data', function (data) {
            console.log(data);
        })
        aokProcess.stderr.on('data', function (data) {
            //console.log('error in aok: ' + data);
        })

    })

program.command('publish')
    .description('publish local modules to server')
    .option('-n,--module <module>')
    .option('-v,--ver <ver>')
    .option('-s,--server <server>')
    .action((options) => {
        var workspace = path.resolve(process.cwd(), options.mount || '.')
        var dmoduleJson = path.join(workspace, 'dmodule.json')
        if (!fs.existsSync(dmoduleJson)) {
            console.log('publish failed :  need dmodule.json in your workspace : ' + workspace)
            return
        }
        //todo
    })

program.command('init')
    .description('init dmodule, just like npm init')
    .option('-n,--module <module>')
    .option('-v,--ver <ver>')
    .action(options => {
        var m = options.module
        var v = options.ver || '1.0.0'
        var filePath = process.cwd() + '/dmodule.json'
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({
                server: null,
                version: null,
                mode: "dev"
            }))
            console.log('dmodule.json init success : ' + filePath)
        }
        var dmoduleDir = process.cwd() + '/dmodules'
        if (!fs.existsSync(dmoduleDir)) {
            fs.mkdirSync(dmoduleDir)
            console.log('dmodules  init sucess : ' + dmoduleDir)
        }
        if (m) {
            var mPath = dmoduleDir + '/' + (options.ver ?  m + '_' + options.ver : m)
            if (!fs.existsSync(mPath)) {
                fs.mkdirSync(mPath)
                fs.writeFileSync(mPath + '/package.json', JSON.stringify({
                    "name": m,
                    "version": v,
                    "description": "inited module",
                    "main": "index.js",
                    "author": "love",
                    "license": "MIT"
                }))
                console.log(`module <${m}> init success :` + mPath)
            }else{
                console.log(`module <${m}>  version <${v}> already inited `)
            }
        }

    })

program.parse(process.argv)




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