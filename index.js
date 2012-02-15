//keep - mini in memery database

var fs = require('fs')
var queue = require('./queue')
var objects = require('ubelt/objects')
var mixins = [
    'each', 'map', 'filter', 'find', 'findKey', 'findReturn', 'mapToArray', 'mapKeys'
]
module.exports = function (file, cb) {
  if(!file) file == null, cb = file

  var out = fs.createWriteStream(file, {flags: 'a'})
  var save = file ? function (data, cb) {
    //append to file...
    out.write(data.map(JSON.stringify).join('\n')+'\n')
    out.once('drain', cb)
  } : function (data, cb) { 
    //in memory, but still act normal.
    process.nextTick(cb) 
  }

  var q = queue(save)

  var keep = {store: {}}

  keep.set = function (key, val, cb) {
    keep.store[key] = val
    q.push([key, val], cb)
    return keep
  }
  keep.save = function (obj) {
    objects.each(obj, function (v,k) {
      keep.set(k,v)
    })
    return keep
  }
  keep.rm = function (key, cb) {
    keep.set(key, null, cb)
    return keep
  }
  keep.get = function (key) {
    return keep.store[key]
  }

  function load (err, file) {
    if(err && err.code !== 'ENOENT')
      if(!cb) throw err; else cb(err)
    if(file)
      file.split('\n')
        .forEach(function (line) {
          if(line)
          try{ keep.set.apply(null,JSON.parse(line)) } catch (err) {console.error(line, '->', err)}
        })
  }

  if('function' !== typeof cb) {
    var r 
    try { r = fs.readFileSync(file, 'utf-8') }
    catch (err) { load(err, r); return keep }
    load(null, r)
  }
  else fs.readFile(file, 'utf-8', load)

  //mixin all the iterators from ubelt onto the store.

  objects.each(mixins, function (k) {
    keep[k] = function () {
      //this is a faster way to make arguments into an array.
      var l = arguments.length
      var args = new Array(l + 1)
      while(l--) args[l + 1] = arguments[l]
      args[0] = keep.store
      return objects[k].apply(null, args)
    }
  })

  return keep
}

if(!module.parent) {
  var keep = module.exports('/tmp/keep-demo')
  var i = 0
  setInterval(function () {
    keep.set(i ++, new Date())
  }, 1000)
}