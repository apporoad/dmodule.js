# dmodule.js
dynamic module ，　动态模块，分布式模块，支持模块序列化，支持模块版本管理



## run serve

```bash
npm i -g dmodule.js
npm i -g aok.js

mkdir modules
dmodule serve -m modules -p 11546
```

### moudule management

project1

```bash
mdkir -p /tmp/yourProject1
cd /tmp/yourRroject1

mkdir  dmodules

cat << EOF > dmodules/test.js
console.log('test loaded')
exports.test = ()=>{ console.log('hello hello good day') }
EOF

npm i dmodule.js
vim run.js
```

```js
var D = require('dmodule.js')('http://localhost:11546/')

D.import('test').then(module=>{
    module.test()
})
```

publish packages

```bash
dmodule  publish
```



project2

```bash
mdkir -p /tmp/yourProject2
cd /tmp/yourRroject2

mkdir  dmodules

cat << EOF > dmodules/demo.js
console.log('demo loaded')
exports.test = ()=>{ console.log('hello ni hao') }
EOF

npm i dmodule.js
vim run.js
```

```js
var D = require('dmodule.js')('http://localhost:11546/')

//采用版本
D.use()

D.load('demo').then(module=>{
    module.test()
})
D.require('test','demo').then((testModule,demoModule)=>{
    testMdoule.test()
    demoModule.test()
})
```



### version management

version1

```bash
mkdir -p dmodules/yourModule1

cat << EOF > dmodules/yourModule1/index.js
console.log('module version 1 loaded')
exports.test = ()=>{ console.log('hello hello i am version 1') }
EOF

# create package.json  just like npm package
cat << EOF > dmodules/yourModule1/package.json
{
  "name": "youModule",
  "version": "1.0.0",
  "description": "test module",
  "main": "index.js",
  "author": "apporoad",
  "license": "MIT"
}
EOF

```

version 2

```bash
mkdir -p dmodules/yourModule2

cat << EOF > dmodules/yourModule2/index.js
console.log('module version 2 loaded')
exports.test = ()=>{ console.log('hello hello i am version 2') }
EOF

# create package.json  just like npm package
cat << EOF > dmodules/yourModule2/package.json
{
  "name": "youModule",
  "version": "2.0.0",
  "description": "test module",
  "main": "index.js",
  "author": "apporoad",
  "license": "MIT"
}
EOF

```

```js
var D = require('dmodule.js')('http://localhost:11546/')

D.require({
    name : 'yourModule',
    version : '1.0.0'
},{
    name : 'yourModule',
    version : '2.0.0'
}).then((m1,m2)=>{
    m1.test()
    m2.test()
})
```




### how to debug
```bash
curl  http://localhost:10000/  -X POST -F "file=@doc.md"
```


### ps
1. 冲突提示，本地模块与远端模块冲突