const _ = require('lodash');

exports.insert = insert;
exports.insertReturn = insertReturn;
exports.delete = del;
exports.update = update;
exports.select = select;
exports.count = count;

function insert(table, o) {
    if (_.isEmpty(o)) {
        throw new Error('o cannot be empty');
    }

    table = wrap(table);

    let cnt = 1;

    let values = [];
    let replace = _.map(_.keys(o), item => {
        values.push(o[item]);
        return `$${cnt++}`;
    });

    let sql = `insert into ${table}(${_.map(_.keys(o), wrap).join(', ')}) values(${replace.join(', ')})`;

    return [sql, values];
}

function insertReturn(table, o, field = 'id') {
    let [sql, values] = insert(table, o);

    sql += ` returning "${field}"`;

    return [sql, values];
}

function del(table, query) {
    table = wrap(table);

    let ls = limit(query.limit);
    delete query.limit;

    let [ws, wr] = where(query);

    let sql = `delete from ${table} ${ws} ${ls}`;
    return [sql, wr];
}

function update(table, update, query) {
    if (_.isEmpty(update)) {
        throw new Error('update cannot be empty');
    }
    if (_.isEmpty(query)) {
        throw new Error('query cannot be empty');
    }

    table = wrap(table);

    let [ss, sr, scnt] = set(update);
    let [ws, wr] = where(query, scnt);

    let sql = `update ${table} ${ss} ${ws}`;
    return [sql, sr.concat(wr)];
}

function select(table, query, fields = ['*']) {
    table = wrap(table);
    fields = _.map(fields, wrap);

    let ls = limit(query.limit);
    delete query.limit;

    let os = orderBy(query.order);
    delete query.order;

    let [ws, wr] = where(query);
    let sql = `select ${fields.join(', ')} from ${table} ${ws} ${os} ${ls}`;
    return [sql, wr];
}

function count(table, query) {
    table = wrap(table);

    let [ws, wr] = where(query);
    let sql = `select count(*) as count from ${table} ${ws}`;

    return [sql, wr];
}

function set(o, cnt = 1) {
    let values = [];

    let set = _.map(_.keys(o), item => {
        values.push(o[item]);
        return `${wrap(item)} = $${cnt++}`;
    });
    let sql = `set ${set.join(', ')}`;

    return [sql, values, cnt];
}

function where(o, cnt = 1) {
    let values = [];
    let inQuery = _.pickBy(o, item => _.isArray(item));

    let where = _.map(_.keys(_.omit(o, _.keys(inQuery))), item => {
        values.push(o[item]);
        return `${wrap(item)} = $${cnt++}`;
    });

    _.each(_.keys(inQuery), item => {
        let replace = _.map(o[item], item => {
            values.push(item);
            return `$${cnt++}`;
        });

        where.push(`${wrap(item)} in (${replace.join(', ')})`);
    });

    let sql = _.isEmpty(where) ? '' : `where ${where.join(' and ')}`;

    return [sql, values, cnt];
}

function limit(array) {
    if (_.isEmpty(array)) {
        return '';
    }

    array = _.map(array, item => Number(item));
    if (_.some(array, item => _.isNaN(item))) {
        return '';
    }

    let [offset, cnt] = array;
    return `limit ${cnt} offset ${offset}`;
}

function orderBy(array) {
    if (_.isEmpty(array)) {
        return '';
    }

    let order = [];
    _.each(_.chunk(array, 2), item => {
        let [field, type] = item;
        order.push(`${wrap(field)} ${type === 'asc' ? 'asc' : 'desc'}`);
    });

    return `order by ${order.join(', ')}`;
}

// avoid conflicts with reserved words
function wrap(keyword) {
    if (keyword === '*') {
        return keyword;
    }

    if (keyword.indexOf('"') !== 0) {
        return `"${keyword}"`;
    }

    return keyword;
}