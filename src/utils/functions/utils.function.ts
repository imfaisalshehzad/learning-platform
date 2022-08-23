import moment from "moment";

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function stringToArray(string, split) {
    return string.split(split);
}

export function currentTimeOnwardsDayEnd(dayEnd) {
    const currentMoment = moment().toDate();
    const tillDayEnd = moment(dayEnd).endOf("day").toDate();
    return {
        currentMoment,
        tillDayEnd
    }

}

export function getStartEndDates(from, to) {

    let start_date, end_date, startMonth, endMonth;
    if (from && to) {
        start_date = moment(from).startOf("day").toDate();
        end_date = moment(to).endOf("day").toDate();
    } else {
        startMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
        endMonth = moment().clone().endOf('month').format('YYYY-MM-DD');
        start_date = moment(startMonth).startOf("day").toDate();
        end_date = moment(endMonth).endOf("day").toDate();
    }

    return {
        start_date,
        end_date
    }

}


export function joinDateAndTime(date, time) {
    return moment(date + ' ' + time);
}
