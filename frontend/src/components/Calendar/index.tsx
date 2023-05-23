import {ResponsiveCalendar} from '@nivo/calendar'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, {useCallback, useState} from 'react';
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
import Footer from "../Footer";

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

const profiles = await fetch(API_URL+`/profiles`)
    .then(res => res.json())
    .then((res: GenericMap[]) => res);

const CustomTooltip = (tip:any) => {
      if (tip.value === undefined) return null;
      return (
          <span style={{ color: tip.color, backgroundColor: 'black', padding: '10px' }}>
              {tip.day} : {tip.value} событий
          </span>
      )
    };
const russianMonths = [
    'Явн',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек'
];

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
};

function joinOlimpiadIds(left: number[], right: number[]) {
    return left.concat(right.filter(o => left.indexOf(o) === -1));
};

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
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  /*
            <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={className}
            onChange={handleClassChange}
            input={<OutlinedInput id="select-multiple-chip" label="Специальность" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {classes.map((c) => (
              <MenuItem
                key={c.id}
                value={c.name}
                style={getStyles(c.name, className, theme)}
              >
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Профиль</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={profileName}
            onChange={handleProfileChange}
            input={<OutlinedInput id="select-multiple-chip" label="Профиль" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {profiles.map((c) => (
              <MenuItem
                key={c.id}
                value={c.name}
                style={getStyles(c.name, className, theme)}
              >
                {c.name}
              </MenuItem>
            ))}
          </Select>
          //olimpsChange: React.Dispatch<SetStateAction<number[]>>) => {
          */
// const MultipleSelectChip = () => {
//     const theme = useTheme();
//     const [className, setClassName] = useState<string[]>([]);
//     const [profileName, setProfileName] = useState<string[]>([]);
//     const [olimpiads, setOlimpiads] = useState<number[]>([]);

//     const handleClassChange = (event: SelectChangeEvent<typeof className>) => {
//       const {
//         target: { value },
//       } = event;
//       setClassName(
//         // On autofill we get a stringified value.
//         typeof value === 'string' ? value.split(',') : value,
//       );
//       setOlimpiads(
//         joinOlimpiadIds(olimpiads, getOlimpiadIds(classes, className))
//       );
//       console.log(olimpiads);
//     };

//     const handleProfileChange = (event: SelectChangeEvent<typeof profileName>) => {
//         const {
//           target: { value },
//         } = event;
//         setProfileName(
//           // On autofill we get a stringified value.
//           typeof value === 'string' ? value.split(',') : value,
//         );
//         setOlimpiads(
//             joinOlimpiadIds(olimpiads, getOlimpiadIds(profiles, profileName))
//         );
//         console.log(olimpiads);
//         console.log(getOlimpiadIds(profiles, value));
//       };
  
//     return (
//       <div>
//         <FormControl sx={{ m: 1, width: 400 }}>
//           <InputLabel id="class-checkbox-label">Специальность</InputLabel>
//           <Select
//           labelId="class-checkbox-label"
//           id="class-checkbox"
//           multiple
//           value={className}
//           onChange={handleClassChange}
//           input={<OutlinedInput label="Специальность" />}
//           renderValue={(selected) => selected.join(', ')}
//           MenuProps={MenuProps}
//         >
//           {classes.map((c) => (
//             <MenuItem key={c.id+'|'+c.olimpiadIds.join(',')} value={c.name}>
//               <Checkbox checked={className.indexOf(c.name) > -1} />
//               <ListItemText primary={c.name} />
//             </MenuItem>
//           ))}
//         </Select>
//         </FormControl>
//         <FormControl sx={{ m: 1, width: 400 }}>
//           <InputLabel id="profile-checkbox-label">Профиль</InputLabel>
//           <Select
//           labelId="profile-checkbox-label"
//           id="profile-checkbox"
//           multiple
//           value={profileName}
//           onChange={handleProfileChange}
//           input={<OutlinedInput label="Профиль" />}
//           renderValue={(selected) => selected.join(', ')}
//           MenuProps={MenuProps}
//         >
//           {profiles.map((c) => (
//             <MenuItem key={c.id} value={c.name}>
//               <Checkbox checked={profileName.indexOf(c.name) > -1} />
//               <ListItemText primary={c.name} />
//             </MenuItem>
//           ))}
//         </Select>
//         </FormControl>
//       </div>
//     );
// };

function Row(props: { row: OlimpiadEvent}) {
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
          <a href={'/admin/olimpiads/'+row.olimpiad.id+'/show'}>{row.olimpiad.name}</a>
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.start.toString()}</TableCell>
        <TableCell align="right">{row.finish.toString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Детали
              </Typography>
              <Typography component="legend">Уровень</Typography>
              <Rating name="read-only" value={4 - row.olimpiad.level}  max={3} readOnly />
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

const MyResponsiveCalendarCanvas = () => {
    const [selectedDay, selectedDayChange] = useState('2022-09-01');
    const [eventsForDay, eventsChanged] = useState<OlimpiadEvent[]>([]);

    const [className, setClassName] = useState<string[]>([]);
    const [profileName, setProfileName] = useState<string[]>([]);
    const [olimpiads, setOlimpiads] = useState<number[]>([]);
    const [schedule, setSchedule] = useState<ScheduleDto[]>(initialSchedule);

    const handleClassChange = (event: SelectChangeEvent<typeof className>) => {
      const {
        target: { value },
      } = event;
      setClassName(
        typeof value === 'string' ? value.split(',') : value,
      );
      setOlimpiads(
        getOlimpiadIds(classes, className)
        // joinOlimpiadIds(getOlimpiadIds(classes, className), getOlimpiadIds(profiles, profileName))
      );
      fetchSchedule(olimpiads).then(rows => setSchedule(rows));
      console.log(olimpiads);
    };

    const handleProfileChange = (event: SelectChangeEvent<typeof profileName>) => {
        const {
          target: { value },
        } = event;
        setProfileName(
          typeof value === 'string' ? value.split(',') : value,
        );
        setOlimpiads(
            joinOlimpiadIds(getOlimpiadIds(profiles, profileName), getOlimpiadIds(classes, className))
        );
        console.log(olimpiads);
        fetchSchedule(olimpiads).then(rows => setSchedule(rows));
        console.log(getOlimpiadIds(profiles, value));
      };
  
    const handler = useCallback(
        (updateDay:string) => {
          selectedDayChange(updateDay);
        },
        [selectedDayChange]
      );
    return (
        <body>
        <Navbar />
    <div style={{ height: 600, width: 1080 }}>
          <div>
        <FormControl sx={{ m: 1, width: 1080 }}>
          <InputLabel id="class-checkbox-label">Специальность</InputLabel>
          <Select
          labelId="class-checkbox-label"
          id="class-checkbox"
          multiple
          value={className}
          onChange={(event) => {
            handleClassChange(event);
            // fetchSchedule(olimpiads).then(rows => setSchedule(rows));
          }}
          input={<OutlinedInput label="Специальность" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {classes.map((c) => (
            <MenuItem key={c.id} value={c.name}>
              <Checkbox checked={className.indexOf(c.name) > -1} />
              <ListItemText primary={c.name} />
            </MenuItem>
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
    <h2 style={{ textAlign: 'center' }}>Загруженность по дням</h2>
    <ResponsiveCalendar
        data={schedule}
        from="2022-09-01"
        to="2023-06-01"
        emptyColor="#ffffff"
        // colors={['#a1cfff', '#468df3', '#a053f0', '#9629f0', '#8428d8']}
        // colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        margin={{ top: 40, right: 40, bottom: 50, left: 40 }}
        direction="horizontal"
        monthLegend={(y,m) => russianMonths[m]}
        monthBorderColor="#ffffff"
        dayBorderWidth={0}
        dayBorderColor="#ffffff"
        tooltip={CustomTooltip}
        onClick={(d, event) => {
            selectedDayChange(d.day);
            console.log(olimpiads);
            eventsChanged([])
            fetchEvents(d.day, olimpiads).then(rows => eventsChanged(rows));
        }}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left'
            }
        ]}></ResponsiveCalendar>
    {/* </div> */}
    <div>
    <h2 style={{ textAlign: 'center' }}>События на {selectedDay}</h2>
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Олимпиада</TableCell>
              <TableCell align="right">Событие</TableCell>
              <TableCell align="right">Начало</TableCell>
              <TableCell align="right">Конец</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventsForDay.map(row => (
              <Row key={row.id} row={row}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>    
    </div>
</div>
        <Footer/>
        </body>
    );
}

export default MyResponsiveCalendarCanvas;

