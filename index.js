const utils = require('lisa.utils')

function DModule(){
    var _this = this
    var _config = null
    this.config = (conf)=>{
        //todo
    }
    this.import = this.require = this.load = (module,options)=>{

    }
}


module.exports = function(config){
    var dm = new DModule()
    dm.config(config)
    return dm
}