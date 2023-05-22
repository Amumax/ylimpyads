import { Datagrid, DateField, EditButton, List, TextField } from 'react-admin';

export const EventList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <DateField source="start" />
            <DateField source="finish" />
            <EditButton />
        </Datagrid>
    </List>
);