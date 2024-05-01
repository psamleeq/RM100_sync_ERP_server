var date = new Date();
function sleepTill23() {
    var millisTill23 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 0, 0, 0) - date;
    if (millisTill23 < 0) {
         millisTill23 += 24*60*60*1000; // it's after 23, try 23 tomorrow.
    }
    setTimeout(() => {console.log('alert')}, millisTill23);
}

sleepTill23();
