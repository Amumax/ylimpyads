import { Create, Datagrid, DateField, Edit, EditButton, List, Show, SimpleForm, SimpleShowLayout, TextField, TextInput } from 'react-admin';

export const MajorsList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="code" />
            <EditButton />
        </Datagrid>
    </List>
);

export const MajorShow = () => (
    <Show>
        <SimpleShowLayout >
            <TextField source="name" label="Название"/>
            <TextField source="code" label="Шифр"/>
        </SimpleShowLayout>
    </Show>
);

export const MajorEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="code" />
        </SimpleForm>
    </Edit>
);


export const MajorCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="code" />
        </SimpleForm>
    </Create>
)