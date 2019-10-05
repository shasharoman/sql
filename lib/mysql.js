const _ = require('lodash');

exports.insert = insert;
exports.delete = del;
exports.update = update;
exports.select = select;
exports.count = count;

function insert(table, o) {
    if (_.isEmpty(o)) {
        throw new Error('o cannot be empty');
    }

    table = wrap(table);

    let sql = `insert into ${table}(${_.map(_.keys(o), wrap).join(', ')}) values(:${_.keys(o).join(', :')})`;

    return [sql, o];
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

    let [ss, sr] = set(update);
    let [ws, wr] = where(query);

    let sql = `update ${table} ${ss} ${ws}`;
    return [sql, _.assign({}, sr, wr)];
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

function set(o) {
    let set = _.map(_.keys(o), item => `${wrap(item)} = :s_${item}`);
    let sql = `set ${set.join(', ')}`;

    return [sql, _.mapKeys(o, (index, key) => `s_${key}`)];
}

function where(o) {
    let inQuery = _.pickBy(o, item => _.isArray(item));
    let where = _.map(_.keys(_.omit(o, _.keys(inQuery))), item => `${wrap(item)} = :w_${item}`);
    _.each(_.keys(inQuery), item => {
        where.push(`${wrap(item)} in (:w_${item})`);
    });

    let sql = _.isEmpty(where) ? '' : `where ${where.join(' and ')}`;

    return [sql, _.mapKeys(o, (index, key) => `w_${key}`)];
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
    return `limit ${offset}, ${cnt}`;
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

    if (keyword.indexOf('``') !== 0) {
        return `\`${keyword}\``;
    }

    return keyword;
}