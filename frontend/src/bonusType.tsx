import { Create, Datagrid, Edit, EditButton, List, NumberField, NumberInput, Show, SimpleForm, SimpleShowLayout, TextField, TextInput } from 'react-admin';

export const BonusTypeList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField label="Название" source="name" />
            <NumberField source="type"/>
            <NumberField label="Дополнительные баллы" source="extraPoints"/>
            <NumberField label="Минимальное место" source="awardLevel"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const BonusTypeShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField label="Название" source="name" />
            <NumberField source="type"/>
            <NumberField label="Дополнительные баллы" source="extraPoints"/>
            <NumberField label="Минимальное место" source="awardLevel"/>
        </SimpleShowLayout>
    </Show>
);

export const BonusTypeEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id"/>
            <TextInput label="Название" source="name" />
            <NumberInput source="type"/>
            <NumberInput label="Дополнительные баллы" source="extraPoints"/>
            <NumberInput label="Минимальное место" source="awardLevel"/>
        </SimpleForm>
    </Edit>
);

export const BonusTypeCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput label="Название" source="name" />
            <NumberInput source="type"/>
            <NumberInput label="Дополнительные баллы" source="extraPoints"/>
            <NumberInput label="Минимальное место" source="awardLevel"/>
        </SimpleForm>
    </Create>
);