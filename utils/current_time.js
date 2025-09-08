class CurrentTime {
    getDateTwoDegits() {
        const date = new Date();
        return ('0' + date.getDate()).slice(-2);
    }

    getSecondsTwoDegits() {
        const date = new Date();
        return ('0' + date.getSeconds()).slice(-2);
    }

    getMonthTwoDegits() {
        const date = new Date();
        return ('0' + (date.getMonth() + 1)).slice(-2)
    }

    getHoursTwoDegits() {
        const date = new Date();
        return ('0' + date.getHours()).slice(-2)
    }

    getFullYear() {
        const date = new Date();
        return date.getFullYear();
    }

    getMonth() {
        const date = new Date();
        return date.getMonth();
    }

    getDate() {
        const date = new Date();
        return date.getDate();
    }

    genCREATE_DATE(currentDate) { // date: 20231211
        const date = new Date();
        return date.getFullYear().toString() + ('0' + (date.getMonth() + 1)).slice(-2) + currentDate;
    }

    genCREATE_TIME() { // time: 09:00:26 (hr, mins, sec)
        const date = new Date();
        return ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
    }
}


module.exports = CurrentTime;