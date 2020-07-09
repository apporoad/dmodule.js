const sync = require('lisa.sync')
const path = require('path')
const fs = require('fs')
const DSON = require('dson.js')
const d = dson = DSON.DSON
const j = jvd = DSON.JVD
const hasha = require('hasha')

var meta = null

var getMeta = (p) => {
    if (meta)
        return meta
    var rp = path.join(p, 'meta.json')
    if (!fs.existsSync(rp)) {
        fs.writeFileSync(rp, '{}')
    }
    return meta || (meta = sync(path.join(p, 'meta.json')))
}

module.exports = {
    "@get": async (params, ctx, options) => {
        var meta = getMeta(options.staticPath)
        return await meta.get()
    },
    "@post": async (params, ctx, options) => {
        // 预处理，如果包含json节点，转换为params
        if (params.json) {
            params = JSON.parse(params.json)
        }
        //                  curl   -X POST -F "file=@doc.md"  http://localhost:10000/?name=test\&version=1.0.0  
        var meta = getMeta(options.staticPath)
        //check first
        var validator = d().expect({
            name: "!!&&?string"
            //,sha256 : "!!&?string"
        })
        var isPass = await validator.doTest(params)
        if (!isPass) {
            return {
                success: false,
                msg: 'params err :   { name :  xxxx ,  sha256 : xxxxx } '
            }
        }
        if (!ctx.request.files) {
            return {
                success: false,
                msg: 'where is  your file ???'
            }
        }
        var map = await meta.get()
        //校验版本冲突
        if (params.version) {
            var r = await d(params.name).where({
                    version: "?='" + params.version  + "'"
                }).count().print().test('?>0').doTest(map)
            if (r) {
                return {
                    success: false,
                    msg: `version ${params.version}  already exsits`
                }
            }
        }
        // now save file
        var file = ctx.request.files.file
        var newMeta = {
            name: params.name,
            version: params.version || Date.now(),
            uploadTime: new Date(),
            originFileName: file.name
        }
        //mkdir dmodules
        if(!fs.existsSync(path.join(options.staticPath,'dmodules'))){
            fs.mkdirSync(path.join(options.staticPath,'dmodules'))
        }
        newMeta.file =  'dmodules/'+ newMeta.name + '-' + newMeta.version + path.extname(file.name)
        var newMeta = Object.assign({}, params, newMeta)
        //here to save file
        const reader = fs.createReadStream(file.path);
        const upStream = fs.createWriteStream(path.join(options.staticPath, newMeta.file))
        reader.pipe(upStream)
        // sha256
        newMeta.sha256 = await hasha.fromFile(path.join(options.staticPath, newMeta.file), {
            algorithm: 'sha256'
        })

        meta.sync(data => {
            if (data[newMeta.name]) {
                data[newMeta.name].unshift(newMeta)
            } else {
                data[newMeta.name] = [newMeta]
            }
        })
        return {success : true , data : newMeta}

    }
}