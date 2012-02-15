# keep

in memory db with append only format.

everything about keep is designed for simplicity.

##examples

```
var keep = requir('keep')
var db = keep(file) // load the data file syncronously

db.set('key', {whatever: 'value'}) 

var v = db.get('key') // retrive a value

db.rm('key') // same as db.set('key', null)

db.save({
  key1: 'value1', key2: 'value2'
})

```

query the database by iterating over the collection.
`keep` mixes in a set of iteration functions from [github.com/dominictarr/ubelt](ubelt)

```
function iterator (v, k) {...}
function test (v, k) {if(...) return true }

db.each(iterator)
db.map(iterator) //will return an object.
db.mapToArray(iterator) //will map to an array

db.find(test)
db.filter(test)

```

they all work pretty much as you would expect.