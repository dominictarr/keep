

var EventEmitter = require('events').EventEmitter

module.exports = function Queue (write) {
  var emitter = new EventEmitter()
  var queue = []
  var cbs = []
  var ready = true
  emitter.push = function (data, cb) {
    queue.push(data)
    if(cb) cbs.push(cb)
    //save in the next tick, incase there are more things to be pushed this tick.
    process.nextTick(save)
  }
  function save() {
    if(!ready) return
    if(!queue.length) return
    ready = false
    var callbacks = cbs
    var toWrite = queue
    queue = []
    cbs = []

    write(toWrite, function (err) {
      callbacks.forEach(function(cb) { cb(err) })
      if(err) emitter.emit('error', err)
      ready = true
      save()
    })

  }
  return emitter
}