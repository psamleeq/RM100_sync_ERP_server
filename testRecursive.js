const { Promise } = require("mssql");

async function insertCaseToINVMB(data) {
    return new Promise((resolve, reject) =>{
            console.log(process.memoryUsage())
            data.i += 1
            data.next = '1'
            resolve(data)
    })
}

async function owen(data) {
    return new Promise((resolve, reject) =>{
            data.next = '2';
            resolve(data);
    })
}

async function brain(data) {
    return new Promise((resolve, reject) =>{
            data.next = '0'
            data.brain = 'big brain'
            console.log(data)
            setTimeout(()=>{
                resolve(data)
            }, 5000)
    })
}

async function main(func) {
    const data = await func
    if(!data) return false;
    if(data.i > 1000) {
        data.next = '3'
        data.i = 0
    }
    switch(data.next) {
        case '0':
            return setTimeout(() => main(insertCaseToINVMB(data)), 5000)
        case '1':
            return main(owen(data));
        case '2':
            return main(brain(data));
    }
}

main(insertCaseToINVMB({'data':'some data', 'next':'1', 'i':0}))





