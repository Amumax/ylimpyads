import { Datagrid, EditButton, List, ReferenceArrayField, TextField } from 'react-admin';

export const HostList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="region" />
            <TextField source="city" />
            <TextField source="address" />
            <TextField source="phone" />
            <TextField source="url" />
            <TextField source="email" />
            <TextField source="official_name" />
            <ReferenceArrayField source="olimpiadIds" reference="olimpiads" />
            <EditButton />
        </Datagrid>
    </List>
);