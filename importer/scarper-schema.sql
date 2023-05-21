create table grades
(
    id integer not null primary key,
    name varchar
);
insert into grades (id, name) values (1, '1');
insert into grades (id, name) values (2, '2');
insert into grades (id, name) values (3, '3');
insert into grades (id, name) values (4, '4');
insert into grades (id, name) values (5, '5');
insert into grades (id, name) values (6, '6');
insert into grades (id, name) values (7, '7');
insert into grades (id, name) values (8, '8');
insert into grades (id, name) values (9, '9');
insert into grades (id, name) values (10, '10');
insert into grades (id, name) values (11, '11');
create table classes
(
    id   integer not null primary key generated always as identity,
    name varchar
);
create table olimpiads
(
    id     integer not null primary key generated always as identity,
    name   varchar,
    url    varchar,
    rating integer,
    level  integer
);
create table events
(
    id       integer not null primary key generated always as identity,
    olimpiad integer not null,
    name     varchar,
    start    date,
    finish   date,
    CONSTRAINT fk_olimpiad
        FOREIGN KEY(olimpiad)
            REFERENCES olimpiads(id) on delete cascade
);
create table hosts
(
    id      integer not null primary key generated always as identity,
    name    varchar,
    official_name varchar,
    region  varchar,
    city    varchar,
    address varchar,
    phone   char(22),
    url     varchar,
    email   varchar
);
create table profile
(
    id   integer not null primary key generated always as identity,
    name varchar
);
create table olimpiad_classes
(
    olimpiad integer not null,
    class    integer not null,
    CONSTRAINT fk_olimpiad
        FOREIGN KEY (olimpiad)
            REFERENCES olimpiads (id) on delete cascade,
    constraint fk_class
        foreign key (class)
            references classes (id) on delete cascade,
    constraint pk_olimpiad_classes
        primary key (olimpiad, class)
);
create table olimpiad_grades
(
    olimpiad integer not null,
    grade    integer not null,
    CONSTRAINT fk_olimpiad
        FOREIGN KEY(olimpiad)
            REFERENCES olimpiads(id) on delete cascade,
    constraint fk_grade
        foreign key (grade)
            references grades (id) on delete cascade,
    constraint pk_olimpiad_grades
        primary key (olimpiad, grade)
);
create table olimpiad_hosts
(
    olimpiad integer not null,
    host     integer not null,
    CONSTRAINT fk_olimpiad
        FOREIGN KEY(olimpiad)
            REFERENCES olimpiads(id) on delete cascade,
    constraint fk_host
        foreign key (host)
            references hosts(id) on delete cascade,
    constraint pk_olimpiad_hosts
        primary key (olimpiad, host)
);
create table majors
(
    id   integer not null primary key generated always as identity,
    name varchar not null,
    code varchar
);
-- общий список специальностей, тот что есть у минкульта
create table olimpiad_profiles
(
    olimpiad integer not null,
    profile  integer not null,
    CONSTRAINT fk_olimpiad
        FOREIGN KEY(olimpiad)
            REFERENCES olimpiads(id) on delete cascade,
    constraint fk_profile
        foreign key (profile)
            references profile(id) on delete cascade,
    constraint pk_olimpiad_profiles
        primary key (olimpiad, profile)
);
-- список ВУЗов с их специальностями
create table host_majors
(
    host  integer not null,
    major integer not null,
    CONSTRAINT fk_hosts
        FOREIGN KEY(host)
            REFERENCES hosts(id) on delete cascade,
    constraint fk_major
        foreign key (major)
            references majors(id) on delete cascade,
    constraint pk_host_majors
        primary key (host, major)
);
-- тип бонуса за что-то в олимпиаде
create table bonus_type
(
    id           integer not null primary key generated always as identity,
    name         varchar not null, -- имя бонуса, например БВИ
    type         integer,            -- тип бонуса, насколько понимаю бывают двух видов - БВИ, то есть даёт 100 баллов, или ИД - дополнительные баллы к предмету
    extra_points integer,            -- количество баллов
    award_Level  integer             -- место которое нужно занять для получения этого бонуса
);
-- собственно начисляемые бонусы
-- тут ещё хитрость в чём - host в этой таблице может быть не только организатор олимпиады, а ВУЗ который принимает для себя результаты этой олимпиады
create table host_bonuses
(
    id           integer not null primary key generated always as identity,
    host       integer not null, -- организатор
    olimpiad   integer not null, -- олимпиада
    class      integer,          -- специальность
    profile    integer,          -- или профиль для этой олимпиады
    host_major integer,          -- специальность университета
    bonus_type integer,           -- ссылка на тип бонуса
    CONSTRAINT fk_olimpiad
        FOREIGN KEY(olimpiad)
            REFERENCES olimpiads(id) on delete cascade,
    constraint fk_class
        foreign key (class)
            references classes(id) on delete cascade,
    constraint fk_profile
        foreign key (profile)
            references profile(id) on delete cascade,
    constraint fk_host_major
        foreign key (host_major)
            references majors(id) on delete cascade,
    constraint fk_bonuses
        foreign key (bonus_type)
            references bonus_type(id) on delete cascade
);

-- alter table olimpiad_grades add constraint fk_grade foreign key (grade) references grades (id) on delete cascade;