'use strict';

const QueryCheck = require('../src/querycheck.js');

const vars = {
    now: {
        isWeekday: true,
        isHoliday: false,
        isoDate: "2020-05-21",
        isoTime: "13:59:48",
        isoDateTime: "2020-05-21T13:59:48"
    },
    myString: "this is a string",
    myStringFlavor: "strawberry",
    myStringPrime: "prime number 137",
    myInt: 137,
    myIntAsString: "137",
    myFloat: 137.12345,
    myBoolTrue: true,
    myBoolFalse: false,
    myNull: null,
    myArrayOfInts: [10, 20, 30, 40, 50],
    myArrayOfStrings: ["vanilla", "strawberry", "chocolate"],
    myArrayOfObjects: [{x: 10, y: 11}, {x: 20, y: 21}, {x: 40, y: 41}],
    mySimpleObject: {x: 30, y: 31},
    myLookup: {
        0: "zero",
        "1": "one",
        user: "maurice"
    },
    lookupKey: "user",
    myObject: {
        userName: "maurice",
        firstName: "First",
        lastName: "Last"
    }
};


function simpleTests(strictMode) {

    describe('Simple tests', () => {

        test('$eq short syntax // string == string', () => {
            const qc = new QueryCheck({ myString: "this is a string" });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq with null value // null == null', () => {
            const qc = new QueryCheck({ myNull: null });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq with null value // string != null', () => {
            const qc = new QueryCheck({ myString: null });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeFalsy();
        });

        test('$eq short syntax sub-variable // string == string', () => {
            const qc = new QueryCheck({ "myObject.userName": "maurice" });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax non-existant sub-variable // undefined == string', () => {
            const qc = new QueryCheck({ "myObject.myUndefined": "some string" });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).not.toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$eq short syntax non-existant sub-variable // undefined == null', () => {
            const qc = new QueryCheck({ "myObject.myUndefined": null });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq short syntax non-existant sub-variable // undefined == null with setUndefinedEqualsNull(true)', () => {
            const qc = new QueryCheck({ "myObject.myUndefined": null });
            qc.setStrictMode(strictMode);
            qc.setUndefinedEqualsNull(true);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // int[137] == int[137]', () => {
            const qc = new QueryCheck({ myInt: 137 });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // int[137] == string["137"]', () => {
            const qc = new QueryCheck({ myInt: "137" });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$eq short syntax // string["137"] == int[137]', () => {
            const qc = new QueryCheck({ myIntAsString: 137 });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$eq short syntax // float[137.12345] == float[137.12345', () => {
            const qc = new QueryCheck({ myFloat: 137.12345 });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // float[137.12345] == string["137.12345"]', () => {
            const qc = new QueryCheck({ myFloat: "137.12345" });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$eq short syntax // object == object', () => {
            const qc = new QueryCheck({ mySimpleObject: {x: 30, y: 31} });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // string == null', () => {
            const qc = new QueryCheck({ myString: null });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq short syntax // null == ""', () => {
            const qc = new QueryCheck({ myNull: "" });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq short syntax // undefined == ""', () => {
            const qc = new QueryCheck({ myUndefined: "" });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).not.toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$eq short syntax // undefined == null', () => {
            const qc = new QueryCheck({ myUndefined: null });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq short syntax // undefined == null with setUndefinedEqualsNull(true)', () => {
            const qc = new QueryCheck({ myUndefined: null });
            qc.setStrictMode(strictMode);
            qc.setUndefinedEqualsNull(true);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // array[1] == object', () => {
            const qc = new QueryCheck({ "myArrayOfObjects[1]": {x: 20, y: 21} });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // array[1].x == int', () => {
            const qc = new QueryCheck({ "myArrayOfObjects[1].x": 20 });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // array[20] == null with setUndefinedEqualsNull(true)', () => {
            const qc = new QueryCheck({ "myArrayOfObjects[20]": null });
            qc.setStrictMode(strictMode);
            qc.setUndefinedEqualsNull(true);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // array[20].a.b.c.d == null with setUndefinedEqualsNull(true)', () => {
            const qc = new QueryCheck({ "myArrayOfObjects[20].a.b.c.d": null });
            qc.setStrictMode(strictMode);
            qc.setUndefinedEqualsNull(true);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // myNull.but.this.does.not.exist == null with setUndefinedEqualsNull(true)', () => {
            const qc = new QueryCheck({ "myNull.but.this.does.not.exist": null });
            qc.setStrictMode(strictMode);
            qc.setUndefinedEqualsNull(true);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq short syntax // myInt.but.this.does.not.exist == null with setUndefinedEqualsNull(true)', () => {
            const qc = new QueryCheck({ "myInt.but.this.does.not.exist": null });
            qc.setStrictMode(strictMode);
            qc.setUndefinedEqualsNull(true);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq full syntax // string == different string', () => {
            const qc = new QueryCheck({ myString: { "$eq": "this is a different string" } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq full syntax // int == null', () => {
            const qc = new QueryCheck({ myInt: { "$eq": null } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq full syntax // int == null', () => {
            const qc = new QueryCheck({ myInt: { "$eq": null } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq full syntax // array == array', () => {
            const qc = new QueryCheck({ myArrayOfInts: { "$eq": [10, 20, 30, 40, 50] } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq full syntax // array == other array', () => {
            const qc = new QueryCheck({ myArrayOfInts: { "$eq": [17] } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$eq full syntax // array of int == int (included in array)', () => {
            const qc = new QueryCheck({ myArrayOfInts: { "$eq": 30 } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq full syntax // array of objects == object (included in array)', () => {
            const qc = new QueryCheck({ myArrayOfObjects: { "$eq": {x: 10, y: 11} } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$eq full syntax // array of strings == string (included in array)', () => {
            const qc = new QueryCheck({ myArrayOfStrings: { "$eq": "vanilla" } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });


        test('$in full syntax // int $in array', () => {
            const qc = new QueryCheck({ myInt: { "$in": ["A", "B", 137] } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$in full syntax // int $in array (but int not included)', () => {
            const qc = new QueryCheck({ myInt: { "$in": ["A", "B"] } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$not full syntax // $not { myInt == 138 }', () => {
            const qc = new QueryCheck({ myInt: {"$not": { "$eq": 138 } } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$not full syntax // $not { int $in array (but int not included) }', () => {
            const qc = new QueryCheck({ myInt: {"$not": { "$in": ["A", "B"] } } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$ne full syntax // int != different int', () => {
            const qc = new QueryCheck({ myInt: { "$ne": 138 } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$ne full syntax // string != different string', () => {
            const qc = new QueryCheck({ myString: { "$ne": "hello world" } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$ne full syntax // int[137] != string["138"]', () => {
            const qc = new QueryCheck({ myInt: {"$ne": "138"} });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).toBeTruthy();
            } else {
                expect(qc.test(vars)).toBeTruthy();
            }
        });

        test('$ne full syntax // int[137] != string["137"]', () => {
            const qc = new QueryCheck({ myInt: {"$ne": "137"} });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).toBeFalsy();
            } else {
                expect(qc.test(vars)).toBeTruthy();
            }
        });

        test('$gt full syntax // int[137] > int[136]', () => {
            const qc = new QueryCheck({ myInt: { "$gt": 136 } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$gt full syntax // int[137] > string["136"]', () => {
            const qc = new QueryCheck({ myInt: { "$gt": "136" } });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$gt full syntax // int[137] > int[138]', () => {
            const qc = new QueryCheck({ myInt: { "$gt": 138 } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$gt full syntax // int[137] > string["138"]', () => {
            const qc = new QueryCheck({ myInt: { "$gt": "138" } });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).not.toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$lt full syntax // int[137] < int[138]', () => {
            const qc = new QueryCheck({ myInt: { "$lt": 138 } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$lt full syntax // int[137] < string["138"]', () => {
            const qc = new QueryCheck({ myInt: { "$lt": "138" } });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$lt full syntax // int[137] < int[136]', () => {
            const qc = new QueryCheck({ myInt: { "$lt": 136 } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$lt full syntax // int[137] < string["136"]', () => {
            const qc = new QueryCheck({ myInt: { "$lt": "136" } });
            qc.setStrictMode(strictMode);
            if (!strictMode) {
                expect(qc.test(vars)).not.toBeTruthy();
            } else {
                expect(() => qc.test(vars)).toThrow(TypeError);
            }
        });

        test('$regex full syntax // string matches other string', () => {
            const qc = new QueryCheck({ myString: { "$regex": "^this is a" } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$regex full syntax // string does not match other STRING', () => {
            const qc = new QueryCheck({ myString: { "$regex": "^THIS IS A" } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$regex full syntax // string matches other STRING with option case-insensitive', () => {
            const qc = new QueryCheck({ myString: { "$regex": "^THIS IS A", "$options": "i" } });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('test with null input data', () => {
            const qc = new QueryCheck({ myString: "this is a string" });
            qc.setStrictMode(strictMode);
            if (strictMode) {
                expect(() => qc.test(null)).toThrow(TypeError);
            } else {
                expect(qc.test(null)).toBeFalsy();
            }
        });

        test('test with non-hash data (array)', () => {
            const qc = new QueryCheck({ myString: "this is a string" });
            qc.setStrictMode(strictMode);
            if (strictMode) {
                expect(() => qc.test([])).toThrow(TypeError);
            } else {
                expect(qc.test([])).toBeFalsy();
            }
        });

        test('test with non-hash data (string)', () => {
            const qc = new QueryCheck({ myString: "this is a string" });
            qc.setStrictMode(strictMode);
            if (strictMode) {
                expect(() => qc.test("not an object")).toThrow(TypeError);
            } else {
                expect(qc.test("not an object")).toBeFalsy();
            }
        });

        test('test with non-hash data (number)', () => {
            const qc = new QueryCheck({ myString: "this is a string" });
            qc.setStrictMode(strictMode);
            if (strictMode) {
                expect(() => qc.test(42)).toThrow(TypeError);
            } else {
                expect(qc.test(42)).toBeFalsy();
            }
        });

        test('test with non-hash data (boolean)', () => {
            const qc = new QueryCheck({ myString: "this is a string" });
            qc.setStrictMode(strictMode);
            if (strictMode) {
                expect(() => qc.test(true)).toThrow(TypeError);
            } else {
                expect(qc.test(true)).toBeFalsy();
            }
        });

        test('test with non-hash data (undefined)', () => {
            const qc = new QueryCheck({ myString: "this is a string" });
            qc.setStrictMode(strictMode);
            if (strictMode) {
                expect(() => qc.test(undefined)).toThrow(TypeError);
            } else {
                expect(qc.test(undefined)).toBeFalsy();
            }
        });

    });
}


function combinedTests(strictMode) {

    describe('Combined tests', () => {

        test('ANDed short syntax', () => {
            const qc = new QueryCheck({ myString: "this is a string", myInt: 137 });
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('ANDed full syntax', () => {
            const qc = new QueryCheck({"$and": [{myString: "this is a string"}, {myInt: 137}]});
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('ORed full syntax // true', () => {
            const qc = new QueryCheck({"$or": [{myString: "this is a different string"}, {myInt: 137}]});
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('ORed full syntax // false', () => {
            const qc = new QueryCheck({"$or": [{myString: "this is a different string"}, {myInt: 138}]});
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('AND with sub-OR full syntax', () => {
            const qc = new QueryCheck(
                {"$and": [
                    {"$or": [
                        {myString: "this is a different string"},
                        {myInt: 137}
                    ]},
                    {"$or": [
                        {myBoolTrue: true},
                        {myInt: 138}
                    ]},
                ]}
            );
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('implicit AND with $in, $not, $gt and $lt (opening hours 1)', () => {

            const qc = new QueryCheck(
                {
                    "now.isoDate": {"$in": ["2019-12-25", "2019-12-26", "2019-12-31", "2020-01-01"]},
                    "now.isoTime": {"$not": {"$gt": "10:00", "$lt": "18:00"}}
                }
            );
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();

        });

        test('implicit AND with $in, $not, $gt and $lt (opening hours 2)', () => {

            const qc = new QueryCheck(
                {
                    "now.isoDate": {"$in": ["2019-12-25", "2019-12-26", "2019-12-31", "2020-01-01", "2020-05-21"]},
                    "now.isoTime": {"$not": {"$gt": "10:00", "$lt": "12:00"}}
                }
            );
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();

        });

    });
}


let opEvalFuncs = {
    '$time': timeFunc,
    '$concat': concatFunc,
    '$lookup': lookupFunc,
    '$var': varFunc,
};

function timeFunc(params, data) {
    const dateFns = require('date-fns');

    let result = null;
    let dateLocal = null;

    if (params.date !== undefined) {
        params.date = opEvaluator.apply(this, [params.date, data]);
    }

    if (typeof(params.date) == 'string') {
        if (typeof(params.inputFormat) == 'string' && params.inputFormat != '') {
            dateLocal = dateFns.parse(params.date, params.inputFormat, new Date());
        } else {
            dateLocal = dateFns.parseISO(params.date);
        }
    } else {
        dateLocal = new Date();
    }

    if (params.sub) {
        result = dateFns.sub(dateLocal, params.sub);
    } else if (params.add) {
        result = dateFns.add(dateLocal, params.add);
    } else {
        result = dateLocal;
    }

    if (typeof(params.format) != 'string') {
        // default to ISO 8601 format
        params.format = 'yyyy-MM-dd\'T\'HH:mm:ss';
    }

    if (params.format) {
        result = dateFns.format(result, params.format);
    }

    return result;
}

function concatFunc(params, data) {
    if (!Array.isArray(params)) {
        return '';
    }

    let str = '';
    for (let item of params) {
        str += String(opEvaluator.apply(this, [item, data]));
    }
    return str;
}

function lookupFunc(params, data) {
    params.default = params.default || null;

    if (typeof(params.key) === 'undefined') {
        return params.default;
    }

    params.key = opEvaluator.apply(this, [params.key, data]);

    if (typeof(params.map) === 'undefined' || params.map === null || typeof(params.map) !== 'object') {
        return params.default;
    }

    params.map = opEvaluator.apply(this, [params.map, data]);

    return params.map[params.key] || params.default;
}

function varFunc(params, data) {
    if (typeof(params) == 'string') {
        // shortcut syntax {"$var": "varName"}
        params = {name: params};
    } else if (typeof(params.name) === 'undefined') {
        return undefined;
    }

    return this.getVariableValue(params.name, data);
}

function opEvaluator(operand, data) {
    const isObject = typeof(operand) === 'object' && !Array.isArray(operand) && operand !== null;
    if (!isObject) {
        return operand;
    }

    const firstKey = Object.keys(operand)[0];
    if (firstKey in opEvalFuncs) {
        return opEvalFuncs[firstKey].apply(this, [operand[firstKey], data])
    }

    return operand;
}


function extendingTests(strictMode) {

    describe('Operand evaluator tests', () => {

        test('$time function returns given date', () => {
            const qc = new QueryCheck({ "now.isoDateTime": {"$time": {"date": "2020-05-21T13:59:48"} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$time function returns given date using different input format', () => {
            const qc = new QueryCheck({ "now.isoDateTime": {"$time": {"date": "21.05.2020, 13:59:48", "inputFormat": "dd.MM.yyyy, HH:mm:ss"} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$time function returns modified date (-2 days and -3 hours)', () => {
            const qc = new QueryCheck({ "now.isoDateTime": {"$time": {"date": "2020-05-23T16:59:48", "sub": {"days": 2, "hours": 3}} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$time function cascading (+10 days and -10 days)', () => {
            const qc = new QueryCheck({ "now.isoDateTime": {"$time": {"date": {"$time": {"date": "2020-05-21T13:59:48", "sub": {"days": 10}}}, "add": {"days": 10}} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$time function cascading (+10 days and -10 days) combined with $var function', () => {
            const qc = new QueryCheck({ "now.isoDateTime": {"$time": {"date": {"$time": {"date": {"$var": {"name": "now.isoDateTime"}}, "sub": {"days": 10}}}, "add": {"days": 10}} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$concat function with string and $var (all of type string)', () => {
            const qc = new QueryCheck({ "now.isoDateTime": {"$concat": [{"$var": {"name": "now.isoDate"}}, "T", {"$var": {"name": "now.isoTime"}}] }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$concat function with string and $var (with string casting)', () => {
            const qc = new QueryCheck({ "myStringPrime": {"$concat": ["prime", " ", "number", " ", {"$var": {"name": "myInt"}}] }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$lookup function with static map/key (key exists)', () => {
            const qc = new QueryCheck({ "myObject.userName": {"$lookup": {"map": {"this": "is", "a": "lookup", "user": "maurice"}, "key": "user", "default": null} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$lookup function with variable map/key (key exists)', () => {
            const qc = new QueryCheck({ "myObject.userName": {"$lookup": {"map": {"$var": "myLookup"}, "key": {"$var": "lookupKey"}, "default": null} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

        test('$lookup function with variable map and static key (where key does not exist)', () => {
            const qc = new QueryCheck({ "myObject.userName": {"$lookup": {"map": {"$var": "myLookup"}, "key": "non-existant"} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).not.toBeTruthy();
        });

        test('$lookup function with variable map and static key (where key does not exist but default matches)', () => {
            const qc = new QueryCheck({ "myObject.userName": {"$lookup": {"map": {"$var": "myLookup"}, "key": "non-existant", "default": "maurice"} }});
            qc.setOperandEvaluator(opEvaluator);
            qc.setStrictMode(strictMode);
            expect(qc.test(vars)).toBeTruthy();
        });

    });
}


describe('Testing in STANDARD mode', () => {
    simpleTests(false);
    combinedTests(false);
    extendingTests(false);
});

describe('Testing in STRICT mode', () => {
    simpleTests(true);
    combinedTests(true);
    extendingTests(true);
});

/**/
