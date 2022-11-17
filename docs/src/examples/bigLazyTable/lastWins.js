/**
 * @module lastWins - a {@link SchedulerType} where the last task wins and earlier ones might be dropped.
 */

export { ForgetfulScheduler }

/**
 * Constructing a new {@link SchedulerType } just like {@link Scheduler} but only the most recently added {@link Task}
 * is guaranteed to be started. Earlier ones will be dropped if a new task arrives before they could be started.
 * A task that has been started will not be stopped while running.
 * @constructor
 * @return { SchedulerType }
 * @example
 * const scheduler = ForgetfulScheduler();
 * scheduler.add  ( done => { console.log(1); done() } );
 * scheduler.addOk( ()   =>   console.log(2) );
 */
const ForgetfulScheduler = () => {
    let inProcess   = false;
    let waitingTask = undefined;
    const process = () => {
        if (inProcess) return;
        if (waitingTask === undefined) return;
        inProcess   = true;
        const task  = waitingTask;
        waitingTask = undefined;
        const prom = new Promise( ok => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
        });
    };
    const add = task => {
        waitingTask = task;
        process();
    };
    return {
        add,
        addOk: task => add( ok => { task(); ok(); }) // convenience
    }
};
