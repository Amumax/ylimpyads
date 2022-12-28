// const fs = require('fs');
import got from 'got';
// const got = require('got');
import jsdom from 'jsdom';
// const jsdom = require("jsdom");
import pg from 'pg';
import crypto from 'node:crypto';
// const crypto = require('node:crypto');
import buffer from 'node:buffer';
import SqlString from 'sqlstring';
// const buffer = require('node:buffer');
import sleep from 'sleep';
const { Buffer } = buffer;
const { JSDOM } = jsdom;
const {randomBytes} = crypto;

const olimpRoot = 'https://olimpiada.ru';
const olimUrl = olimpRoot + '/article/1043';

const daDataApi = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const daDataToken = "2854257e61265686ad6ebf61efc69c6021c3c46b";

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
    const buf = randomBytes(4);
    return buf.readUInt32BE(0);
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
        startDate = new Date(Date.UTC(2022, 9, 1));
        endDate = new Date(Date.UTC(year, month, matcher[2]));
    } else if (matcher[6] === undefined) {
        const month = getMonth(matcher[3]);
        const year = getYear(month);
        startDate = new Date(Date.UTC(getYear(month), month, matcher[2]));
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
    const queryForHosts = `SELECT id, name, city FROM hosts;`;
    const resultSet = await driver.query(queryForHosts);
    for (const res of resultSet.rows) {
        let hostId = res.id;
        let name = res.name.trim();
        let address = res.city === null ? null : res.city.trim();
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
            if (resp.suggestions.length === 1) {
                const suggested = resp.suggestions[0];
                let updatedHost = {
                    name: suggested.value,
                    region: suggested.data.address.data.region,
                    city: suggested.data.address.data.city,
                    address: suggested.data.address.value
                }
                console.log("Should update host ", host.name , " with " , updatedHost);
                const updateHost = `UPDATE hosts SET region = '${updatedHost.region}', city = '${updatedHost.city}', address = '${updatedHost.address}', official_name = '${updatedHost.name}' WHERE id = ${host.id};`;
                await driver.query(updateHost);
            } else if (resp.suggestions.length === 0) {
                console.log("no need to update host ", host.name);
            } else {
                console.log("for ", host.name, " too many choices");
            }
            sleep.msleep(500);
        }
    }
    // await driver.end();
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
                    const qry = `SELECT id FROM olimpiads WHERE name = ${SqlString.escape(ol.name)};`;
                    const resultSet = await driver.query(qry)
                    if (resultSet.rowCount > 0) {
                        ol.id = resultSet.rows[0].id;
                    } else {
                        const insertOlimp = `INSERT INTO olimpiads (name, url, rating, level) VALUES(${SqlString.escape(ol.name)}, '${ol.fetchUrl}', ${ol.rating}, ${ol.level}) RETURNING id;`;
                        let newId = await driver.query(insertOlimp);
                        ol.id = newId.rows[0].id
                    }
                    olimps.push(ol);
                    for (const clazz of ol.classess) {
                        const queryForClass = `SELECT id FROM classes WHERE name = '${clazz}';`;
                        const resultSet = await driver.query(queryForClass);
                        let classId = 0;
                        if (resultSet.rowCount > 0) {
                            classId = resultSet.rows[0].id;
                        } else {
                            const insertClass = `INSERT INTO classes (name) VALUES('${clazz}') RETURNING id;`;
                            let newId = await driver.query(insertClass);
                            classId = newId.rows[0].id
                        }
                        const attachClassToOlimp = `INSERT INTO olimpiad_classes (olimpiad, class) VALUES(${ol.id}, ${classId}) ON CONFLICT ON CONSTRAINT pk_olimpiad_classes DO NOTHING;`;
                        await driver.query(attachClassToOlimp);
                    }
                    for (const profile of ol.profiles) {
                        let profileId = 0;
                        const queryForProfile = `SELECT id FROM profile WHERE name = '${profile}';`;
                        const resultSet = await driver.query(queryForProfile);
                        if (resultSet.rowCount > 0) {
                            profileId = resultSet.rows[0].id;
                        } else {
                            const insertProfile = `INSERT INTO profile (name) VALUES('${profile}') RETURNING id;`;
                            let newId = await driver.query(insertProfile);
                            profileId = newId.rows[0].id
                        }
                        const attachProfileToOlimp = `INSERT INTO olimpiad_profiles (olimpiad, profile) VALUES(${ol.id}, ${profileId}) ON CONFLICT ON CONSTRAINT pk_olimpiad_profiles DO NOTHING;`;
                        await driver.query(attachProfileToOlimp);
                    }
                    let enriched = await enrichDescription(ol, driver);
                    olimps.push(enriched)
                    counter++;
                    allCounter++;
                }
                console.log(table.previousElementSibling.textContent, counter);
            }
        }
        console.log("total: ", allCounter);
        // await driver.end();
        return olimps;
    }).catch(err => {
        console.log(err);
    });
}

const enrichDescription = async function(ol, driver) {
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
        for (const i in ol.grades) {
            const queryForGrade = `SELECT * FROM olimpiad_grades WHERE olimpiad = ${ol.id} AND grade = ${ol.grades[i]};`;
            const resultSet = await driver.query(queryForGrade);
            if (resultSet.rowCount === 0) {
                const insertGrade = `INSERT INTO olimpiad_grades (olimpiad, grade) VALUES(${ol.id}, ${ol.grades[i]}) ON CONFLICT ON CONSTRAINT pk_olimpiad_grades DO NOTHING;`;
                await driver.query(insertGrade);
            }
        }
        for (const host of ol.host) {
            let hostId = 0;
            const queryForHost = `SELECT id FROM hosts WHERE name = ${SqlString.escape(host)};`;
            const resultSet = await driver.query(queryForHost);
            if (resultSet.rowCount > 0) {
                hostId = resultSet.rows[0].id;
            } else {
                const insertHost = `INSERT INTO hosts (name) VALUES(${SqlString.escape(host)}) RETURNING id;`;
                let newId = await driver.query(insertHost);
                hostId = newId.rows[0].id
            }
            const attachHostToOlimp = `INSERT INTO olimpiad_hosts (olimpiad, host) VALUES(${ol.id}, ${hostId}) ON CONFLICT ON CONSTRAINT pk_olimpiad_hosts DO NOTHING ;`;
            await driver.query(attachHostToOlimp);
        }
        for (const event of ol.events) {
            const queryForEvent = `SELECT id FROM events WHERE name = '${event.what}' AND olimpiad = ${ol.id};`;
            // console.log("querying event ", queryForEvent);
            const resultSet = await driver.query(queryForEvent);
            if (resultSet.rowCount === 0) {
                const insertEvent = `INSERT INTO events (olimpiad, name, start, finish) VALUES(${ol.id}, '${event.what}', Date('${event.start.toISOString().split('T')[0]}'), Date('${event.end.toISOString().split('T')[0]}'));`;
                // console.log("inserting event ", insertEvent);
                await driver.query(insertEvent);
            }
            sleep.msleep(100);
        }
        sleep.msleep(750);
        return ol;
    }).catch(err => {
        console.log(ol.fetchUrl);
        console.log(err);
    });
}
const initDriver = async function () {
    console.log('Driver initializing...');
    const client = new pg.Client({
        user: 'olimp',
        host: 'localhost',
        database: 'olimp',
        password: 'olimp',
    });
    client.connect()
    console.log('Done');
    return client;
}

const start = async function() {
    const driver = await initDriver();
    // await getList(olimUrl, driver);
   await fixHosts(driver);
}

start();
