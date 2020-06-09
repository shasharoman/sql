const psql = require('../lib/psql');
const expect = require('chai').expect;

describe('psql', () => {
    it('insert', () => {
        let o = {
            foo: 1,
            bar: 2
        };

        let [s, r] = psql.insert('demo', o);
        expect(s).to.be.equal('insert into "demo"("foo", "bar") values($1, $2)');
        expect(r).to.be.deep.equal([1, 2]);
    });

    it('insert, empty throw', () => {
        expect(() => psql.insert('demo', {})).to.be.throw();
    });

    it('insert return', () => {
        let o = {
            foo: 1,
            bar: 2
        };

        let [s, r] = psql.insertReturn('demo', o);
        expect(s).to.be.equal('insert into "demo"("foo", "bar") values($1, $2) returning "id"');
        expect(r).to.be.deep.equal([1, 2]);
    });

    it('delete', () => {
        let [s, r] = psql.delete('demo', {
            foo: 1,
            bar: 2
        });
        expect(s).to.be.equal('delete from "demo" where "foo" = $1 and "bar" = $2 ');
        expect(r).to.be.deep.equal([1, 2]);
    });

    it('delete, limit', () => {
        let [s, r] = psql.delete('demo', {
            foo: 1,
            bar: 2,
            limit: [0, 1]
        });
        expect(s).to.be.equal('delete from "demo" where "foo" = $1 and "bar" = $2 limit 0, 1');
        expect(r).to.be.deep.equal([1, 2]);
    });

    it('delete, no where', () => {
        let [s, r] = psql.delete('demo', {});
        expect(s).to.be.equal('delete from "demo"  ');
        expect(r).to.be.deep.equal([]);
    });

    it('update', () => {
        let [s, r] = psql.update('demo', {
            foo: 1
        }, {
            bar: 1
        });
        expect(s).to.be.equal('update "demo" set "foo" = $1 where "bar" = $2');
        expect(r).to.be.deep.equal([1, 1]);
    });

    it('update, same field in set and where', () => {
        let update = {
            foo: 1
        };

        let [s, r] = psql.update('demo', update, update);
        expect(s).to.be.equal('update "demo" set "foo" = $1 where "foo" = $2');
        expect(r).to.be.deep.equal([1, 1]);
    });

    it('update, empty throw', () => {
        expect(() => psql.update('demo', {})).to.be.throw();
    });

    it('update, no query', () => {
        expect(() => psql.update('demo', {
            foo: 1
        }, {})).to.be.throw();
    });

    it('select', () => {
        let [s, r] = psql.select('demo', {
            foo: 1,
            bar: 2
        });
        expect(s).to.be.equal('select * from "demo" where "foo" = $1 and "bar" = $2  ');
        expect(r).to.be.deep.equal([1, 2]);
    });

    it('select, order by', () => {
        let [s, r] = psql.select('demo', {
            foo: 1,
            bar: 2,
            order: ['id', 'desc']
        });
        expect(s).to.be.equal('select * from "demo" where "foo" = $1 and "bar" = $2 order by "id" desc ');
        expect(r).to.be.deep.equal([1, 2]);
    });

    it('select, limit', () => {
        let [s, r] = psql.select('demo', {
            foo: 1,
            bar: 2,
            order: ['id', 'desc'],
            limit: [0, 10]
        });
        expect(s).to.be.equal('select * from "demo" where "foo" = $1 and "bar" = $2 order by "id" desc limit 0, 10');
        expect(r).to.be.deep.equal([1, 2]);
    });

    it('select, array field', () => {
        let [s, r] = psql.select('demo', {
            foo: 1,
            bar: [1, 2]
        });
        expect(s).to.be.equal('select * from "demo" where "foo" = $1 and "bar" in ($2, $3)  ');
        expect(r).to.be.deep.equal([1, 1, 2]);
    });

    it('select, fields', () => {
        let [s, r] = psql.select('demo', {
            foo: 1,
        }, ['id', 'name']);
        expect(s).to.be.equal('select "id", "name" from "demo" where "foo" = $1  ');
        expect(r).to.be.deep.equal([1]);
    });

    it('count', () => {
        let [s, r] = psql.count('demo', {
            foo: 1,
        });
        expect(s).to.be.equal('select count(*) as count from "demo" where "foo" = $1');
        expect(r).to.be.deep.equal([1]);
    });
});