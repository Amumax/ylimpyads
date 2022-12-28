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