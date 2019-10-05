SQL
===

SQL is a simple tool for building sql statement.

Examples
--------

### insert

``` {.javascript}
const sql = require('sql');

let [s, r] = sql.mysql.insert('table', {
    foo: 'foo',
    bar: 'bar'
});

// s: insert into `table`(`foo`, `bar`) values(:foo, :bar)
// r: { foo: 'foo', bar: 'bar' }
```

### delete

``` {.javascript}
const sql = require('sql')

let [s, r] = sql.mysql.delete('table', {
    foo: 'foo',
    bar: 'bar'
});

// s: delete from `table` where `foo` = :w_foo and `bar` = :w_bar 
// r: { w_foo: 'foo', w_bar: 'bar' }
```

### update

``` {.javascript}
const sql = require('sql');

let [s, r] = sql.mysql.update('table', {
    foo: 'foo'
}, {
    bar: 'bar'
});

// s: update `table` set `foo` = :s_foo where `bar` = :w_bar
// r: { s_foo: 'foo', w_bar: 'bar' }
```

### select

``` {.javascript}
const sql = require('sql');

let [s, r] = sql.mysql.select('table', {
    foo: 'foo',
    bar: 'bar',
    limit: [0, 10],
    order: ['id', 'desc']
});

// s: select * from `table` where `foo` = :w_foo and `bar` = :w_bar order by `id` desc limit 0, 10
// r: { w_foo: 'foo', w_bar: 'bar' }
```
