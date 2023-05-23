import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, {useCallback, useEffect, useState} from 'react';
import {Theme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Navbar from "../Navbar";

interface ScheduleDto {
    day: string;
    olimps: string[];
    value: number;
}

interface ScheduleDayDetailsDto {
    day: string;
    olimp: string;
    oid: number;
    name: string;
    finish: string;
    start: string;
}

interface GenericMap {
    id: number;
    name: string;
    olimpiadIds: number[];
}

interface Olimpiad {
    id: number;
    name: string;
    url: string;
    rating: number;
    level: number;
}

interface OlimpiadEvent {
    id: number;
    name: string;
    start: Date;
    finish: Date;
    olimpiad: Olimpiad;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const API_URL = `http://localhost:3000`;

const classes = await fetch(API_URL+`/classes`)
    .then(res => res.json())
    .then((res: GenericMap[]) => res);

const CustomTooltip = (tip:any) => {
    if (tip.value === undefined) return null;
    return (
        <span style={{ color: tip.color, backgroundColor: 'black', padding: '10px' }}>
              {tip.day} : {tip.value} событий
          </span>
    )
}

const initialSchedule = await fetch(API_URL+`/olimpiads/schedule`)
    .then(res => res.json())
    .then((res: ScheduleDto[]) => res);

function fetchEvents(day: string, olimpiads: number[]) {
    if (olimpiads.length === 0) {
        return fetch(API_URL + `/events?filter=start%7C%7C%24lte%7C%7C${day}&filter=finish%7C%7C%24gte%7C%7C${day}&join=olimpiad`)
            .then(res => res.json())
            .then((res: OlimpiadEvent[]) => res);
    } else {
        return fetch(API_URL+`/events?filter=start%7C%7C%24lte%7C%7C${day}&filter=finish%7C%7C%24gte%7C%7C${day}&filter=olimpiad||$in||${olimpiads.join(',')}&join=olimpiad`)
            .then(res => res.json())
            .then((res : OlimpiadEvent[]) => res);
    }
};

function fetchSchedule(olimpiads: number[]) {
    if (olimpiads.length == 0)
        return fetch(API_URL+`/olimpiads/schedule`)
            .then(res => res.json())
            .then((res: ScheduleDto[]) => res);
    else
        return fetch(API_URL+`/olimpiads/schedule?filter=olimps||$in||`+olimpiads.join(','))
            .then(res => res.json())
            .then((res: ScheduleDto[]) => res);
}

function getOlimpiadIds(genericMap: GenericMap[], name: string | string[]) {
    console.log("Finding "+name+" in "+genericMap.map(o => o.name).join(','));
    return genericMap.filter(g => name.indexOf(g.name) > -1).map(g => g.olimpiadIds).reduce<number[]>((p, c) => {
        if (typeof c[0] === 'number') {
            return p.concat(c.filter(o => p.indexOf(o) === -1));
        } else {
            let incoming:number[] = c[0];
            return p.concat(incoming.filter(o => p.indexOf(o) === -1));
        }
    }, []);
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function Row(props: { row: Olimpiad}) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            {/* <TableRow
          key={row.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        > */}

            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <a href={'/#/admin/olimpiads/'+row.id+'/show'}>{row.name}</a>
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.rating}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Детали
                            </Typography>
                            <Typography component="legend">Уровень</Typography>
                            <Rating name="read-only" value={4 - row.level}  max={3} readOnly />
                            <Typography component="legend">Предметы</Typography>
                            {/* <Typography component="legend">Рейтинг</Typography>
              <Rating name="read-only" value={((81 - row.olimpiad.rating)/10)} precision={0.1} max={10} readOnly /> */}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const OlimpiadList = () => {
    const [className, setClassName] = useState<string[]>([]);
    const [olimpiads, setOlimpiads] = useState<Olimpiad[]>([]);

    useEffect(() => {
        fetch(API_URL+`/olimpiads`)
            .then(res => res.json())
            .then(res => setOlimpiads(res));
    }, [])

    const handleClassChange = (event: SelectChangeEvent<typeof className>) => {
        const {
            target: { value },
        } = event;
        setClassName(
            typeof value === 'string' ? value.split(',') : value,
        );
        fetch(API_URL+`/olimpiads?`)
            .then(res => res.json())
            .then(res => setOlimpiads(res));
        console.log(olimpiads);
    };

    return (
        <body>
        <Navbar />
        <div style={{ height: 600, width: '95%' }}>
            <div>
                <FormControl sx={{ m: 1, width: '95%' }}>
                    <InputLabel id="class-checkbox-label">Предметы</InputLabel>
                    <Select
                        labelId="class-checkbox-label"
                        id="class-checkbox"
                        value={className}
                        onChange={(event) => {
                            handleClassChange(event);
                            // fetchSchedule(olimpiads).then(rows => setSchedule(rows));
                        }}
                        input={<OutlinedInput label="Предмет" />}
                        MenuProps={MenuProps}
                    >
                        {classes.map((c) => (
                            <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* <FormControl sx={{ m: 1, width: 400 }}>
          <InputLabel id="profile-checkbox-label">Профиль</InputLabel>
          <Select
          labelId="profile-checkbox-label"
          id="profile-checkbox"
          multiple
          value={profileName}
          onChange={(event) => {
            handleProfileChange(event);
            // fetchSchedule(olimpiads).then(rows => setSchedule(rows));
          }}
          input={<OutlinedInput label="Профиль" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {profiles.map((c) => (
            <MenuItem key={c.id} value={c.name}>
              <Checkbox checked={profileName.indexOf(c.name) > -1} />
              <ListItemText primary={c.name} />
            </MenuItem>
          ))}
        </Select>
        </FormControl> */}
            </div>
            {/* <div
      className={css({
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      })}> */}
            <div>
                <h2 style={{ textAlign: 'center' }}>Олимпиады</h2>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Олимпиада</TableCell>
                                <TableCell align="right">Рейтинг</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {olimpiads.map(row => (
                                <Row key={row.id} row={row}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
        <footer className="footer">
            <p className="footer-by">Максим Найденов © 2023</p>
        </footer>
        </body>
    );
}

export default OlimpiadList;

