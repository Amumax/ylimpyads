import { ChipField, Create, Datagrid, DateField, DateInput, Edit, EditButton, List, NumberField, NumberInput, ReferenceArrayField, ReferenceArrayInput, ReferenceInput, Show, SimpleForm, SimpleShowLayout, SingleFieldList, TextField, TextInput, UrlField, useRecordContext } from 'react-admin';

const OlimpiadTitle = () => {
    const record = useRecordContext();
    return <span>Олимпиада {record ? `"${record.name}"` : ''}</span>;
};

const OlimpiadFilters = [
    <TextInput source="name" label="Поиск" alwaysOn />,
    <ReferenceArrayInput source="hostIds" label="Организатор" reference="hosts" />,
    <NumberInput source="level" label="Уровень"/>,
    // <DateInput source="eventIds" label="Дата завершения" reference="events"/>
]

export const OlimpiadSmallShow = () => (
    <SimpleShowLayout>
        <ReferenceArrayField source="hostIds" reference="hosts">
            <Datagrid>
                <TextField source="name" label="Название"/>
                <TextField source="region" label="Регион"/>
                <TextField source="city" label="Город" />
            </Datagrid>
        </ReferenceArrayField>
        <ReferenceArrayField source="eventIds" reference="events">
            <Datagrid>
                <TextField source="name" label="Событие"/>
                <DateField source="start" label="Начало"/>
                <DateField source="finish" label="Окончание" />
            </Datagrid>
        </ReferenceArrayField>
        <ReferenceArrayField source="classIds" reference="classes">
        </ReferenceArrayField>
        <ReferenceArrayField source="profileIds" reference="profiles">
        </ReferenceArrayField>
    </SimpleShowLayout>
);
export const OlimpiadList = () => {
    console.log("Trying to make a proper sort");
    return <List filters={OlimpiadFilters} sort={{field: "name", order: "ASC"}}>
        <Datagrid rowClick="show" expand={OlimpiadSmallShow}>
            <TextField source="name" label="Полное название"/>
            <UrlField source="url" />
            <NumberField source="rating" label="Место в рейтинге"/>
            <NumberField source="level" label="Уровень олимпиады"/>
            <ReferenceArrayField source="classIds" reference="classes" label="Предметы">
                <SingleFieldList>
                    <ChipField source="name" sx={{ wordWrap: 'break-word', width: '100px' }} />
                </SingleFieldList>
            </ReferenceArrayField>
            <ReferenceArrayField source="profileIds" reference="profiles" label="Профили">
                <SingleFieldList>
                    <ChipField source="name" sx={{ wordWrap: 'break-word', width: '100px' }} />
                </SingleFieldList>
            </ReferenceArrayField>
            <EditButton />
        </Datagrid>
    </List>
};

export const OlimpiadEdit = () => (
    <Edit title={<OlimpiadTitle/>}>
        <SimpleForm>
            <NumberInput source="id" />
            <TextInput source="name" />
            <TextInput source="url" />
            <NumberInput source="rating" />
            <NumberInput source="level" />
            <ReferenceArrayInput source="hostIds" reference="hosts"></ReferenceArrayInput>
            <ReferenceArrayInput source="eventIds" reference="events"></ReferenceArrayInput>
            <ReferenceArrayInput source="classIds" reference="classes"></ReferenceArrayInput>
            <ReferenceArrayInput source="profileIds" reference="profiles"></ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);


export const OlimpiadCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="url" />
            <NumberInput source="rating" />
            <NumberInput source="level" />
            <ReferenceArrayInput source="hostIds" reference="hosts"></ReferenceArrayInput>
            <ReferenceArrayInput source="eventIds" reference="events"></ReferenceArrayInput>
            <ReferenceArrayInput source="classIds" reference="classes"></ReferenceArrayInput>
            <ReferenceArrayInput source="profileIds" reference="profiles"></ReferenceArrayInput>
        </SimpleForm>
    </Create>
);

export const OlimpiadShow = () => (
    <Show title={<OlimpiadTitle/>}>
        <SimpleShowLayout >
            <TextField source="name" label="Полное название"/>
            <UrlField source="url" label="URL" />
            <NumberField source="rating" label="Место в рейтинге"/>
            <NumberField source="level" label="Уровень олимпиады"/>
            <ReferenceArrayField source="hostIds" reference="hosts">
                <Datagrid>
                    <TextField source="name" label="Название"/>
                    <TextField source="region" label="Регион"/>
                    <TextField source="city" label="Город" />
                </Datagrid>
            </ReferenceArrayField>
            <ReferenceArrayField source="eventIds" reference="events">
                <Datagrid>
                    <TextField source="name" label="Событие"/>
                    <DateField source="start" label="Начало"/>
                    <DateField source="finish" label="Окончание" />
                </Datagrid>
            </ReferenceArrayField>
            <ReferenceArrayField source="classIds" reference="classes">

            </ReferenceArrayField>
            <ReferenceArrayField source="profileIds" reference="profiles">

            </ReferenceArrayField>
            <ReferenceArrayField source="gradeIds" reference="grades">
            </ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);