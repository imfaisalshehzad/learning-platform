export enum USER_ROLE {
    STUDENT = "student",
    TEACHER = "teacher",
    SCHOOL = "school",
    PARENT = "parent",
    ADMIN = "admin",
}

export enum ENUM_ACTIVE {
    FALSE,
    TRUE
}

export enum LIVE_SESSION_TYPE {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

export enum LIVE_FREELANCE_ORDER_BY {
    ID = "id",
    NAME = "name",
    PRICE = "price",
    SESSION_DATE = "session_date",
    SESSION_START = "session_start",
    START_TIME = "start_time",
}

export enum QUERY_SORT_ORDER {
    DESC = "desc",
    ASC = "asc",
}

export enum GENDER_ENUM {
    MALE = "male",
    FEMALE = "female",
    NONE = "none",
}

export enum DAYS_LIST {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday'
}

export enum REPEAT_OPTIONS {
    WEEKLY = 'weekly',
    ALTERNATE = 'alternate',
}

export let WEEK_DAYS = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
}

export enum FEEDBACK_ENUM {
    SANCTION = 'Sanction',
    MERIT = 'Merit',
    COMMENT = 'Comment',
    NONE = 'None',
}


export enum REGISTER_ATTENDANCE_ENUM {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    NONE = 'NONE',
}

export enum FREELANCE_FAVOURITE {
    RECORDED = 'RECORDED',
    LIVE = 'LIVE',
    TEACHER = 'TEACHER',
    NONE = 'NONE',
}
