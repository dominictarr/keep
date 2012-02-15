
var test = require('tap').test
var queue = require('../queue')

test('simple', function (test) {
  var r = Math.random()
  test.plan(3)
  var q = queue(function (data, cb) {
    test.ok(Array.isArray(data), 'data should be array')
    test.deepEqual(data, [r], 'data array should be correct')
    cb()
  })
  
  q.push(r, function () {
    test.ok(true)
    test.end()
  })
})



/*
  since save is now async, the second call will get passed two items. to save at once.
*/

test('3 lots', function (test) {
  console.log('START')
  var rs = []
  function rand() {
    var r = Math.random()
    rs.push(r)
    return r
  }
  test.plan(7)
  var q = queue(function (data, cb) {
    test.ok(Array.isArray(data), 'data should be array')
    data.forEach(function (k) {
      test.equal(k, rs.shift())
    })
    process.nextTick(cb)
  })
  
  q.push(rand(), function () {
    test.ok(true)
  })
  q.push(rand(), function () {
    test.ok(true)
  })
  q.push(rand(), function () {
    test.ok(true)
    test.end()
  })

  

})