const mysql = require('../lib/mysql');
const expect = require('chai').expect;

describe('mysql', () => {
    it('insert', () => {
        let o = {
            foo: 1,
            bar: 2
        };

        let [s, r] = mysql.insert('demo', o);
        expect(s).to.be.equal('insert into `demo`(`foo`, `bar`) values(:foo, :bar)');
        expect(r).to.be.deep.equal(o);
    });

    it('insert, empty throw', () => {
        expect(() => mysql.insert('demo', {})).to.be.throw();
    });

    it('delete', () => {
        let [s, r] = mysql.delete('demo', {
            foo: 1,
            bar: 2
        });
        expect(s).to.be.equal('delete from `demo` where `foo` = :w_foo and `bar` = :w_bar ');
        expect(r).to.be.deep.equal({
            w_foo: 1,
            w_bar: 2
        });
    });

    it('delete, limit', () => {
        let [s, r] = mysql.delete('demo', {
            foo: 1,
            bar: 2,
            limit: [0, 1]
        });
        expect(s).to.be.equal('delete from `demo` where `foo` = :w_foo and `bar` = :w_bar limit 0, 1');
        expect(r).to.be.deep.equal({
            w_foo: 1,
            w_bar: 2
        });
    });

    it('delete, no where', () => {
        let [s, r] = mysql.delete('demo', {});
        expect(s).to.be.equal('delete from `demo`  ');
        expect(r).to.be.deep.equal({});
    });

    it('update', () => {
        let [s, r] = mysql.update('demo', {
            foo: 1
        }, {
            bar: 1
        });
        expect(s).to.be.equal('update `demo` set `foo` = :s_foo where `bar` = :w_bar');
        expect(r).to.be.deep.equal({
            s_foo: 1,
            w_bar: 1
        });
    });

    it('update, same field in set and where', () => {
        let update = {
            foo: 1
        };

        let [s, r] = mysql.update('demo', update, update);
        expect(s).to.be.equal('update `demo` set `foo` = :s_foo where `foo` = :w_foo');
        expect(r).to.be.deep.equal({
            s_foo: 1,
            w_foo: 1
        });
    });

    it('update, empty throw', () => {
        expect(() => mysql.update('demo', {})).to.be.throw();
    });

    it('update, no query', () => {
        expect(() => mysql.update('demo', {
            foo: 1
        }, {})).to.be.throw();
    });

    it('select', () => {
        let [s, r] = mysql.select('demo', {
            foo: 1,
            bar: 2
        });
        expect(s).to.be.equal('select * from `demo` where `foo` = :w_foo and `bar` = :w_bar  ');
        expect(r).to.be.deep.equal({
            w_foo: 1,
            w_bar: 2
        });
    });

    it('select, order by', () => {
        let [s, r] = mysql.select('demo', {
            foo: 1,
            bar: 2,
            order: ['id', 'desc']
        });
        expect(s).to.be.equal('select * from `demo` where `foo` = :w_foo and `bar` = :w_bar order by `id` desc ');
        expect(r).to.be.deep.equal({
            w_foo: 1,
            w_bar: 2
        });
    });

    it('select, limit', () => {
        let [s, r] = mysql.select('demo', {
            foo: 1,
            bar: 2,
            order: ['id', 'desc'],
            limit: [0, 10]
        });
        expect(s).to.be.equal('select * from `demo` where `foo` = :w_foo and `bar` = :w_bar order by `id` desc limit 0, 10');
        expect(r).to.be.deep.equal({
            w_foo: 1,
            w_bar: 2
        });
    });

    it('select, array field', () => {
        let [s, r] = mysql.select('demo', {
            foo: 1,
            bar: [1, 2]
        });
        expect(s).to.be.equal('select * from `demo` where `foo` = :w_foo and `bar` in (:w_bar)  ');
        expect(r).to.be.deep.equal({
            w_foo: 1,
            w_bar: [1, 2]
        });
    });

    it('select, fields', () => {
        let [s, r] = mysql.select('demo', {
            foo: 1,
        }, ['id', 'name']);
        expect(s).to.be.equal('select `id`, `name` from `demo` where `foo` = :w_foo  ');
        expect(r).to.be.deep.equal({
            w_foo: 1
        });
    });

    it('count', () => {
        let [s, r] = mysql.count('demo', {
            foo: 1,
        });
        expect(s).to.be.equal('select count(*) as count from `demo` where `foo` = :w_foo');
        expect(r).to.be.deep.equal({
            w_foo: 1
        });
    });
});