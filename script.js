#!/usr/bin/env node

/*
You need to detect bursts of events in a log file. Specifically, you want to find any event (e.g., ERROR, INFO, WARNING) that occurs n times within t minutes.
Return the maximum number of events happening within a specified time.

Example: Given the following log file, ERROR occurs 3 times within 5 minutes.
Your function should output
```
ERROR: 4
INFO: 3
WARNING: 2
*/

const log_file =
    "[1695374400] INFO: Starting the system               # 2024-09-22 12:00:00\n" +
    "[1695374401] ERROR: Failed to load configuration     # 2024-09-22 12:00:01\n" +
    "[1695374460] WARNING: Disk usage high                # 2024-09-22 12:01:00\n" +
    "[1695374520] ERROR: Failed to connect to database    # 2024-09-22 12:02:00\n" +
    "[1695374580] INFO: User login successful             # 2024-09-22 12:03:00\n" +
    "[1695374610] ERROR: Failed to connect to database    # 2024-09-22 12:03:30\n" +
    "[1695374640] INFO: File uploaded                     # 2024-09-22 12:04:00\n" +
    "[1695374700] ERROR: Timeout while connecting to server # 2024-09-22 12:06:00\n" +
    "[1695374760] ERROR: Failed to connect to database    # 2024-09-22 12:06:00\n" +
    "[1695374820] WARNING: Memory usage high              # 2024-09-22 12:07:00\n" +
    "[1695374820] WARNING: CPU usage high                # 2024-09-22 12:08:00\n" +
    "[1695374880] INFO: Process completed                 # 2024-09-22 12:08:00\n" +
    "[1695374940] ERROR: Disk read failure                # 2024-09-22 12:09:00\n" +
    "[1695375000] ERROR: Timeout while connecting to server # 2024-09-22 12:10:00\n"

/*
input t = 5 , ERROR
output ERROR: 4
*/


const find = function(log, t_minutes, msg_type){
    const dict = {}
    delta = t_minutes * 60  // time in seconds

    log.split("\n").forEach(line => {
        // skip empty lines
        if(!line.trim().length) return

        // TODO use regex
        let [line_time, line_type] = line.substring(1).split(']')
        line_time = 1 * line_time
        line_type = line_type.split(':')[0].trim()

        // ignore other types
        if(line_type != msg_type) return

        let entry = dict[line_type] || {
            times: [],
            max: 0
        }

        // filter old times by window
        entry.times = entry.times.filter((old_time) => (old_time + delta >= line_time))
        // add current time
        entry.times.push(line_time)

        // check max counter
        if(entry.max < entry.times.length) entry.max = entry.times.length

        // update dictionary
        dict[line_type] = entry
    })

    console.log(`${msg_type}: ${dict[msg_type].max}`)

    return dict
}

console.log(log_file)

// test: 5 minutes
find(log_file, 5, 'ERROR')
