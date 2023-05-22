import { ChipField, Create, Datagrid, Edit, EditButton, List, ReferenceArrayField, ReferenceArrayInput, Show, SimpleForm, SimpleShowLayout, SingleFieldList, TextField, TextInput } from 'react-admin';

export const ClassList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField label="Название" source="name" />
            <ReferenceArrayField label="Олимпиады"  source="olimpiadIds" reference="olimpiads">
                <SingleFieldList>
                    <ChipField source="name" sx={{ wordWrap: 'break-word', width: '200px' }} />
                </SingleFieldList>
            </ReferenceArrayField>
            <EditButton/>
        </Datagrid>
    </List>
);

export const ClassShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField label="Название" source="name" />
            <ReferenceArrayField label="Олимпиады с выбранным профилем" source="olimpiadIds" reference="olimpiads">

            </ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);

export const ClassEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" />
            <TextInput label="Название" source="name" />
            <ReferenceArrayField label="Олимпиады с выбранным профилем"  source="olimpiadIds" reference="olimpiads"></ReferenceArrayField>
        </SimpleForm>
    </Edit>
);

export const ClassCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput label="Название" source="name" />
        </SimpleForm>
    </Create>
);