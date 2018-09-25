function LightEnum(members, extractorFn, indexReverse = true){
    this._forwards = members
    extractorFn = extractorFn || function(a){return a}
    this._extractorFn = extractorFn
    this._backwards = {}
    if(indexReverse){
        for(var i in members){
            this._backwards[extractorFn(members[i])] = i
        }
    }
    this.enums = {
        forEach: _forEach.bind(this),
        map: _map.bind(this)
    }
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