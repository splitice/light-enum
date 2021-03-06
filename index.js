function LightEnum(members, extractorFn, indexReverse){
    indexReverse = indexReverse === undefined ? true : indexReverse
    
    this._forwards = members
    extractorFn = extractorFn || function(a){return a}
    this._extractorFn = extractorFn
    this._backwards = {}
    if(indexReverse){
        let isNumeric = true
        for(var i in members){
            const key = extractorFn(members[i])
            isNumeric &= !Number.isNaN(key)
            this._backwards[key] = i
        }
        if(isNumeric){
            const keys = Object.keys(this._backwards)
            if(Math.max(...keys) == (keys.length - 1) && Math.min(...keys) == 0){
                const _backwards = this._backwards
                this._backwards = new Array(keys.length)
                for(var i in _backwards){
                    this._backwards[i] = _backwards[i]
                }
            }
        }
    }
    this.enums = {
        forEach: _forEach.bind(this),
        map: _map.bind(this)
    }

    this.enums[Symbol.iterator] = function(){
        // get the properties of the object 
        let properties = Object.keys(members);
        let count = 0;
        // set to true when the loop is done 
        isDone = false;
   
        // define the next method, need for iterator 
        let next = () => {
           // control on last property reach 
           if(count >= properties.length){
              isDone = true;
           }
           const key = properties[count++]
           return {done:isDone, value: {key, value: isDone?undefined:extractorFn(members[key])}};
        }
   
        // return the next method used to iterate 
        return {next};
     };
}
function _forEach(cb){
    for(var i in this._forwards){
        cb(this.get(i))
    }
}
function _map(cb){
    var ret = []
    for(var i in this._forwards){
        ret.push(cb(this.get(i)))
    }
    return ret
}
LightEnum.prototype.get = function(i){
    let v = this._forwards[i]
    if(v !== undefined){
        return {key: i, value: this._extractorFn(v)}
    }
    v = this._backwards[i]
    if(v !== undefined){
        return {key: v, value: i}
    }
}

module.exports = LightEnum
