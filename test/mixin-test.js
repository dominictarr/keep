
var test = require('tap').test
var keep = require('../')
var fs = require('fs')

function init(file) {
  try {
	fs.unlinkSync(file)
  } catch (e) {}
  return keep(file)
}

test('simple', function (t) {
  
  var db = init('/tmp/keep-test')

  db.set('hello', {whatever: 10})

  db.set('goodbye', {woaehu: 4620})

  db.each(console.log)

  console.log(db)
  t.end()
})