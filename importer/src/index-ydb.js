// const fs = require('fs');
import got from 'got';
// const got = require('got');
import jsdom from 'jsdom';
// const jsdom = require("jsdom");
import ydb from 'ydb-sdk';
// const ydb = require("ydb-sdk");
import crypto from 'node:crypto';
// const crypto = require('node:crypto');
import buffer from 'node:buffer';
import SqlString from 'sqlstring';
// const buffer = require('node:buffer');
// const {Ydb} = require("ydb-sdk");
import sleep from 'sleep';
const { Buffer } = buffer;
const { JSDOM } = jsdom;
const {randomBytes} = crypto;
const {Driver, getSACredentialsFromJson, IamAuthService, AnonymousAuthService, Types, TypedValues} = ydb;

const SYNTAX_V1 = '--!syntax_v1';

const olimpRoot = 'https://olimpiada.ru';
const olimUrl = olimpRoot + '/article/1043';

const daDataApi = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const daDataToken = "2854257e61265686ad6ebf61efc69c6021c3c46b";

const options = {
    key: 'y0_AgAAAAAHEm-DAATuwQAAAADRh0yNcEV-zbFgTWym-UfacGjcEqHI_kg',
    name: 'ydb-access-token',
    description: 'access token for YDB authentication',
    // endpoint: 'grpc://localhost:2136',
    // database: '/local',
    endpoint: 'grpcs://ydb.serverless.yandexcloud.net:2135',
    database: '/ru-central1/b1g1u4pj2btchab5s8fd/etn53majj6pmk2sqdrf7'
};

const months = {
    'янв': 1,
    'фев': 2,
    'мар': 3,
    'апр': 4,
    'май': 5,
    'июн': 6,
    'июл': 7,
    'авг': 8,
    'сен': 9,
    'окт': 10,
    'ноя': 11,
    'дек': 12
}

const getRandomId = function() {
    const buf = randomBytes(8);
    return buf.readBigUInt64BE(0);
}

const getMonth = function(month) {
    return months[month.trim().toLowerCase()];
}

const getYear = function (month) {
    if (month < 9)
        return 2023;
    else
        return 2022;
}

const whenRegexp = new RegExp('(До?\\s?)?(\\d{1,2})\\s?(.{3})?\\s?(\\.\\.\\.\\s?)?(\\d{1,2})?\\s?(.{3})?');
const parseWhen = function(when) {
    const matcher = when.match(whenRegexp);
    // console.log('Parsing ', when);
    let startDate = new Date(0);
    let endDate = new Date(0);
    if (when.toLowerCase().startsWith('отменено')) {
        startDate = new Date(0);
        endDate = new Date(0);
    } else if (when.toLowerCase().startsWith("до")) {
        const month = getMonth(matcher[3]);
        const year = getYear(month);
        startDate = new Date(Date.UTC(year, 9, 1));
        endDate = new Date(Date.UTC(year, month, matcher[2]));
    } else if (matcher[6] === undefined) {
        const month = getMonth(matcher[3]);
        const year = getYear(month);
        startDate = new Date(Date.UTC(year, month, matcher[2]));
        endDate = new Date(Date.UTC(year, month, matcher[2]));
    } else {
        const startMonth = matcher[3] === '...' ? getMonth(matcher[6]) : getMonth(matcher[3]);
        const startYear = getYear(startMonth);
        const startDay = matcher[2];
        const endMonth = getMonth(matcher[6]);
        const endYear = getYear(startMonth);
        const endDay = matcher[5];
        startDate = new Date(Date.UTC(startYear, startMonth, startDay));
        endDate = new Date(Date.UTC(endYear, endMonth, endDay));
    }
    // console.log('Parsed to ', startDate, ' and ', endDate);
    return {start: startDate, end: endDate}
}

const gradesRegexp = new RegExp('(\\d{1,2})?(.)?(\\d{2})?.*')
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const parseGrades = function(grades) {
    const matcher = grades.match(gradesRegexp);
    return range(parseInt(matcher[1]), parseInt(matcher[3]), 1);
}

const getHostDetails = function(host) {
    console.log("getHostDetails ", host);
    got.post(daDataApi, {
        json: {query: host.name, okved: ["85.22"]},
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + daDataToken
        },
        responseType: 'json'
    }).then(async response => {
        console.log("Got response ", response);
        const s = JSON.parse(response.body);
        if (s.suggestions.length > 0) {
            const suggested = s.suggestions[0];
            let updatedHost = {
                name: suggested.value,
                region: suggested.data.address.data.region,
                city: suggested.data.address.data.city,
                address: suggested.data.address.value
            }
            return {...host, ...updatedHost}
        } else
            return host;
    })
}

const fixHosts = async function(driver) {
    driver.tableClient.withSession(async (session) => {
        const queryForHosts = `${SYNTAX_V1}
SELECT id, name, city FROM hosts;`;
        // console.log("checking host ", host);
        const {resultSets} = await session.executeQuery(queryForHosts);
        for (const res of resultSets[0].rows) {
            let hostId = Buffer.from(res.items[0].uint64Value.toBytesBE()).readBigUInt64BE(0);
            let name = res.items[1].textValue;
            let address = res.items[2].textValue
            let host = {
                id: hostId,
                name: name
            }
            if (address == null) {
                const resp = await got.post(daDataApi, {
                    json: {query: host.name},
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": "Token " + daDataToken
                    }
                }).json();
                console.log("Got resp ", resp);
                // got.post(daDataApi, {
                //     json: {query: host.name, okved: ["85.22"]},
                //     headers: {
                //         "Content-Type": "application/json",
                //         "Accept": "application/json",
                //         "Authorization": "Token " + daDataToken
                //     },
                //     responseType: 'json'
                // }).then(async response => {
                //     console.log("Got response ", response);
                //     const s = JSON.parse(response.body);
                if (resp.suggestions.length === 1) {
                    const suggested = resp.suggestions[0];
                    let updatedHost = {
                        name: suggested.value,
                        region: suggested.data.address.data.region,
                        city: suggested.data.address.data.city,
                        address: suggested.data.address.value
                    }
                    console.log("Should update host ", host.name , " with " , updatedHost);
                    const updateHost = `${SYNTAX_V1}
UPSERT INTO hosts (id, name, region, city, address) VALUES(${hostId}, "${SqlString.escape(updatedHost.name)}", "${updatedHost.region}", "${updatedHost.city}", "${updatedHost.address}");`;
                    // console.log("checking host ", host);
                    await session.executeQuery(updateHost);
//                     const updateHostLinks = `${SYNTAX_V1}
// UPDATE hosts (id, name, region, city, address) VALUES(${hostId}, "${SqlString.escape(updatedHost.name)}", "${updatedHost.region}", "${updatedHost.city}", "${updatedHost.address}");`;
                    // console.log("checking host ", host);
                    // await session.executeQuery(updateHost);
                    // return {...host, ...updatedHost}
                } else if (resp.suggestions.length === 0)
                    console.log("no need to update host ", host.name);
                else
                    console.log("for ", host.name, " too many choices");
                        // return host;
                // })
                // let updatedHost = await getHostDetails(host);
                // console.log("res is ", updatedHost);
                sleep.msleep(500);
            }
        }
//         if (resultSets[0].rows.length > 0) {
//             hostId = Buffer.from(resultSets[0].rows[0].items[0].uint64Value.toBytesBE()).readBigUInt64BE(0);
//         } else {
//             // sleep.msleep(300);
//             const insertHost = `${SYNTAX_V1}
// UPSERT INTO hosts (id, name) VALUES(${hostId}, "${SqlString.escape(host)}");`;
//             await session.executeQuery(insertHost);
//         }
    })
}
const getList = async function(olimpUrl, driver) {
    let olimps = [];
    got(olimpUrl).then(async response => {
        const dom = new JSDOM(response.body);
        let allCounter = 0;
        for (const table of dom.window.document.querySelectorAll('.note_table')) {
            for (const body of table.querySelectorAll('tbody')) {
                if (body.querySelectorAll('tr').item(0).getElementsByTagName("td").length === 3)
                    continue;
                let rows = body.querySelectorAll('tr')

                let counter = 0;
                for (let i = 1; i < rows.length; i++) {
                    let cols = rows.item(i).getElementsByTagName('td');
                    let name = cols.item(0).getElementsByTagName('a').item(0).text;
                    let url = olimpRoot + cols.item(0).getElementsByTagName('a').item(0).href;
                    let rating = cols.item(1).getElementsByTagName('p').item(0).textContent
                    let classname = '';
                    let level = '';
                    let profiles = '';
                    if (cols.length === 4) {
                        classname = cols.item(2).getElementsByTagName('p').item(0).textContent
                        level = cols.item(3).getElementsByTagName('p').item(0).textContent
                        profiles = classname;
                    } else if (cols.length === 5) {
                        classname = cols.item(3).getElementsByTagName('p').item(0).textContent
                        level = cols.item(4).getElementsByTagName('p').item(0).textContent
                        profiles = cols.item(2).getElementsByTagName('p').item(0).textContent;
                    }
                    let ol = {
                        id: getRandomId(),
                        name: name,
                        fetchUrl: url,
                        rating: rating,
                        classess: classname.includes(',') ? classname.split(', ') : [classname],
                        profiles: profiles.includes(',') ? profiles.split(', ') : [profiles],
                        level: level,
                        events: [],
                        host: [],
                        grades: null
                    };
                    olimps.push(ol);
                    await driver.tableClient.withSession(async (session) => {
                        // console.log(ol);
                        const queryForOlimp = `${SYNTAX_V1}
DECLARE $name AS Utf8;
SELECT id, name FROM olimpiads WHERE name = $name;`;
                        // console.log('Making a simple select... with', queryForOlimp);
                        const preparedQuery = await session.prepareQuery(queryForOlimp);
                        const {resultSets} = await session.executeQuery(preparedQuery, {'$name': TypedValues.utf8(ol.name)});
                        if (resultSets[0].rows.length > 0) {
                            ol.id = Buffer.from(resultSets[0].rows[0].items[0].uint64Value.toBytesBE()).readBigUInt64BE(0);
                        } else {
                            // sleep.msleep(300);
                            const insertOlimp = `${SYNTAX_V1}
UPSERT INTO olimpiads (id, name, url, rating, level) VALUES(${ol.id}, "${ol.name}", "${ol.fetchUrl}", ${ol.rating}, ${ol.level});`;
                            // console.log('Making an upsert...');
                            await session.executeQuery(insertOlimp);
                        }
                        // sleep.msleep(500);
                        for (const clazz of ol.classess) {
                            // console.log('query for ', clazz);
                            let classId = getRandomId();
                            const queryForClass = `${SYNTAX_V1}
SELECT id, name FROM classes WHERE name = "${clazz}";`;
                            // console.log('Making a simple select... with', queryForClass);
                            const {resultSets} = await session.executeQuery(queryForClass);
                            if (resultSets[0].rows.length > 0) {
                                classId = Buffer.from(resultSets[0].rows[0].items[0].uint64Value.toBytesBE()).readBigUInt64BE(0);
                            } else {
                                // sleep.msleep(300);
                                const insertClass = `${SYNTAX_V1}
UPSERT INTO classes (id, name) VALUES(${classId}, "${clazz}");`;
                                // console.log('Making an class upsert...');
                                await session.executeQuery(insertClass);
                            }
                            // sleep.msleep(500);
                            const attachClassToOlimp = `${SYNTAX_V1}
UPSERT INTO olimpiad_classes (id, olimpiad, class) VALUES(${getRandomId()}, ${ol.id}, ${classId});`;
                            // console.log('Making an class attach upsert...');
                            await session.executeQuery(attachClassToOlimp);
                            // sleep.msleep(500);
                        }
                        for (const profile of ol.profiles) {
                            // console.log('query for ', profile);
                            let profileId = getRandomId();
                            const queryForProfile = `${SYNTAX_V1}
SELECT id, name FROM classes WHERE name = "${profile}";`;
                            // console.log('Making a simple select... with', queryForProfile);
                            const {resultSets} = await session.executeQuery(queryForProfile);
                            if (resultSets[0].rows.length > 0) {
                                profileId = Buffer.from(resultSets[0].rows[0].items[0].uint64Value.toBytesBE()).readBigUInt64BE(0);
                            } else {
                                // sleep.msleep(300);
                                const insertProfile = `${SYNTAX_V1}
UPSERT INTO profile (id, name) VALUES(${profileId}, "${profile}");`;
                                // console.log('Making an profile upsert...');
                                await session.executeQuery(insertProfile);
                            }
                            // sleep.msleep(500);
                            const attachProfileToOlimp = `${SYNTAX_V1}
UPSERT INTO olimpiad_profiles (id, olimpiad, profile) VALUES(${getRandomId()}, ${ol.id}, ${profileId});`;
                            // console.log('Making a profile attach upsert...');
                            await session.executeQuery(attachProfileToOlimp);
                            // sleep.msleep(500);
                        }
                    });
                    let enriched = await enrichDescription(ol, driver);
                    olimps.push(enriched)
                    // process.exit(0);
                    counter++;
                    allCounter++;
                }
                console.log(table.previousElementSibling.textContent, counter);
            }
        }
        console.log("total: ", allCounter);
        await driver.destroy();
        return olimps;
    }).catch(err => {
        console.log(err);
    });
}

const enrichDescription = async function(ol, driver) {
    // console.log('called with', ol)
    got(ol.fetchUrl).then(async response => {
        const dom = new JSDOM(response.body);
        let content = dom.window.document.querySelectorAll('.main-content').item(0);//.forEach(content => {
        if (content === null)
            return ol;
        let left = content.querySelectorAll('.left').item(0);
        ol.grades = parseGrades(left.querySelectorAll('.classes_types_a').item(0).textContent);
        let activities = left.querySelectorAll('.events_for_activity')
        if (activities.length > 0) {
            let timetable = activities.item(0).querySelectorAll('tbody').item(0);
            timetable.querySelectorAll('tr').forEach(evt => {
                if (evt.className === 'alahomora')
                    return;
                let col = evt.getElementsByTagName('td');
                let what = evt.querySelectorAll('.event_name').item(0).textContent;
                let when = col.item(1).querySelectorAll('a').item(0).textContent;
                if (!(when === undefined) && !(when === '')) {
                    let parsedWhen = parseWhen(when)
                    parsedWhen['what'] = what;
                    ol.events.push(parsedWhen)
                }
            });
        }
        left.querySelectorAll('.contacts').forEach(contact => {
            let span = contact.getElementsByTagName('span');
            if (span.length > 0) {
                if (span.item(0).textContent.toLowerCase().startsWith('организатор')) {
                    contact.querySelectorAll('a').forEach(host => {
                        ol.host.push(host.textContent.replace('→','').trim());
                    })
                }
            }
        });
        // });
        await driver.tableClient.withSession(async (session) => {
            // console.log(ol);
            for (const i in ol.grades) {
                const queryForGrade = `${SYNTAX_V1}
SELECT id FROM olimpiad_grades WHERE olimpiad = ${ol.id} AND grade = ${ol.grades[i]};`;
                const {resultSets} = await session.executeQuery(queryForGrade);
                if (resultSets[0].rows.length === 0) {
                    // sleep.msleep(300);
                    const insertGrade = `${SYNTAX_V1}
UPSERT INTO olimpiad_grades (id, olimpiad, grade) VALUES(${getRandomId()}, ${ol.id}, ${ol.grades[i]});`;
                    // console.log('Making an grade upsert...', insertGrade, ol.grades[i] );
                    await session.executeQuery(insertGrade);
                }
                // sleep.msleep(500);
            }
            // sleep.msleep(300);
            for (const host of ol.host) {
                // console.log('query for ', host);
                let hostId = getRandomId();
                const queryForHost = `${SYNTAX_V1}
SELECT id, name FROM hosts WHERE name = "${SqlString.escape(host)}";`;
                // console.log("checking host ", host);
                const {resultSets} = await session.executeQuery(queryForHost);
                if (resultSets[0].rows.length > 0) {
                    hostId = Buffer.from(resultSets[0].rows[0].items[0].uint64Value.toBytesBE()).readBigUInt64BE(0);
                } else {
                    // sleep.msleep(300);
                    const insertHost = `${SYNTAX_V1}
UPSERT INTO hosts (id, name) VALUES(${hostId}, "${SqlString.escape(host)}");`;
                    await session.executeQuery(insertHost);
                }
                // sleep.msleep(500);
                const attachHostToOlimp = `${SYNTAX_V1}
UPSERT INTO olimpiad_hosts (id, olimpiad, host) VALUES(${getRandomId()}, ${ol.id}, ${hostId});`;
                await session.executeQuery(attachHostToOlimp);
                // sleep.msleep(250);
            }
            for (const event of ol.events) {
                let eventId = getRandomId();
                const queryForEvent = `${SYNTAX_V1}
SELECT id, name FROM events WHERE name = "${event.name}" AND olimpiad = ${ol.id};`;
                const {resultSets} = await session.executeQuery(queryForEvent);
                // console.log("checking event ", event, " => ", resultSets);
                if (resultSets[0].rows.length === 0) {
                    // console.log("should insert event", event);
                    // sleep.msleep(300);
//                     const insertEvent = `${SYNTAX_V1}
//                     DECLARE $id as Uint64;
//                     DECLARE $olimpId as Uint64;
//                     DECLARE $name as Utf8;
//                     DECLARE $start AS Date;
//                     DECLARE $end AS Date;
// UPSERT INTO events (id, olimpiad, name, start, end) VALUES($id, $olimpId, $name, $start, $end);`;
                    const insertEvent = `${SYNTAX_V1}
UPSERT INTO events (id, olimpiad, name, start, end) VALUES(${eventId}, ${ol.id}, "${event.what}", Date("${event.start.toISOString().split('T')[0]}"), Date("${event.end.toISOString().split('T')[0]}"));`;
//                     const insertEvent = `${SYNTAX_V1}
// UPSERT INTO events (id, olimpiad, name, start, end) VALUES($id, $olimpId, $name, $start, $end);`;
//                     const preparedQuery = await session.prepareQuery(insertEvent);
                    // UPSERT INTO events (id, olimpiad, name, start, end) VALUES(${eventId}, ${ol.id}, "${event.name}", ${event.start}, ${event.end});`;
                    // console.log('Making an event upsert...', insertEvent, event);
                    const params = {
                        '$id': TypedValues.uint64(eventId),
                        '$olimpId': TypedValues.uint64(ol.id),
                        '$name': TypedValues.utf8(event.what),
                        '$start': TypedValues.date(event.start),
                        '$end': TypedValues.date(event.end)
                    };
                    // console.log("using params", params);
                    await session.executeQuery(insertEvent);//, params);
                    // console.log("after insert ", res);
                }
                sleep.msleep(100);
            }
        });
        sleep.msleep(750);
        // console.log(ol);
        // console.log(ol.name+";"+ol.fetchUrl+";"+ol.rating+";"+ol.classess+";"+ol.level+";"+ol.grades+";"+ol.host+";"+ol.events)
        // console.log('Done with ', ol.fetchUrl)
        // console.log(',');
        // process.exit(0);
        return ol;
    }).catch(err => {
        console.log(ol.fetchUrl);
        console.log(err);
    });
}
// got('https://olimpiada.ru/activity/177').then(response => {
//     let events = [];
//     const dom = new JSDOM(response.body);
//     dom.window.document.querySelectorAll('.main-content').forEach(content => {
//         let left = content.querySelectorAll('.left').item(0);
//         let grades = left.querySelectorAll('.classes_types_a').item(0).textContent;
//         let timetable = left.querySelectorAll('.events_for_activity').item(0).querySelectorAll('tbody').item(0);
//         timetable.querySelectorAll('tr').forEach(evt => {
//             let col = evt.getElementsByTagName('td');
//             let what = evt.querySelectorAll('.event_name').item(0).textContent;
//             let when = col.item(1).querySelectorAll('a').item(0).textContent;
//             events.push({
//                 what: what,
//                 when: when
//             })
//         });
//         let host = left.querySelectorAll('.contacts').item(0).getElementsByTagName('a').item(0).textContent.replace('→','').trim()
//         console.log(host)
//     });
// }).catch(err => {
//     console.log(err);
// });
//     await new Promise(r => setTimeout(r, 2000));
// }
const initDriver = async function () {
    console.log('Driver initializing...');
    const accessToken = options.key;
    const saCredentials = getSACredentialsFromJson('key.json');
    const authService = new IamAuthService(saCredentials);    // const authService = new TokenAuthService(accessToken);
    let endpoint = options.endpoint;
    let database = options.database;
    // for local machine
    // const driver = new Driver({endpoint, database, authService: new AnonymousAuthService()});
    // for managed ydb
    const driver = new Driver({endpoint, database, authService, poolSettings: {minLimit: 0, maxLimit: 1}});
    const timeout = 10000;
    if (!await driver.ready(timeout)) {
        console.log(`Driver has not become ready in ${timeout}ms!`);
        process.exit(1);
    }
//     await driver.tableClient.withSession(async (session) => {
//         const queryForOlimp = `${SYNTAX_V1}
// SELECT id,
//        name
// FROM olimpiads
// WHERE name = "Турнир имени М.В. Ломонос";`;
//         console.log('Making a simple select... with', queryForOlimp);
//         const {resultSets} = await session.executeQuery(queryForOlimp);
//         console.log(resultSets[0]);
//         console.log(resultSets[0].rows[0].items[0].uint64Value)
//         console.log(resultSets[0].rows[1].items)
//         console.log(resultSets[0].rows[2].items)
//         for (const r in resultSets[0].rows) {
//             console.log(r);
//         }
//         console.log(Buffer.from(resultSets[0].rows[0].items[0].uint64Value.toBytesBE()).readBigUInt64BE(0));
//     });
    console.log('Done');
    // driver.destroy();
    return driver;
}

const start = async function() {
    const driver = await initDriver();
    await getList(olimUrl, driver);
    await fixHosts(driver);
}

start();