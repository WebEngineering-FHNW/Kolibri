/**
 * @module dataflow - a dataflow abstraction that is not based on concurrency but on laziness and
 * can be used in an asynchronous fashion.
 */

export { DataFlowVariable, Scheduler }

/**
 * @callback createValueCallback
 * @template T
 * @type { () => T }
 */
/**
 * A dataflow abstraction that takes a function that specifies how to create a value and returns a
 * function that returns that value. The callback will be only called when needed and not more than once.
 * In other contexts known as "lazy" or "thunk".
 * @template T
 * @param { !createValueCallback } createValue - will be called when needed and not more than once. Mandatory.
 * @return { () => T }
 * @constructor
 * @example
 *     const x = DataFlowVariable(() => y() + 1);
 *     const y = DataFlowVariable(() => 1);
 *     x() === 2
 */
const DataFlowVariable = createValue => {
    let value = undefined;
    return () => {
        if (value !== undefined) { return value }
        value = createValue();
        return value;
    }
};

/**
 * @callback onResolveCallback
 * @impure   sets the surrounding {@link Promise} to the "resolved" state.
 * @type { () => void }
 */
/**
 * @typedef { (onResolveCallback) => void } Task
 * @impure  can produce arbitrary side effects and must use the {@link onResolveCallback} to signal completion.
 */
/**
 * @typedef  { object } SchedulerType
 * @property { (Task) => void } add   - schedule the task for execution.
 *                                      The {@link Task} must call its {@link onResolveCallback} when finished.
 * @property { Function }       addOk - convenience function that adds the {@link Task} for execution
 *                                      and calls "ok" {@link onResolveCallback} after execution no matter what.
 */
/**
 * Constructing a new {@link SchedulerType } where {@link Task}s can be added for asynchronous but sequence-preserving
 * execution. That means that even though the scheduled tasks can run asynchronously, it is still guaranteed that
 * when first task A and then task B is added, tasks B will not be started before task A has finished.
 * Note that this scheduler has no timeout facility and an async {@link Task} that never calls its
 * {@link onResolveCallback} will stall any further task execution.
 * @return { SchedulerType }
 * @constructor
 * @example
 *     const scheduler = Scheduler();
 *     scheduler.add( ok => {
 *         setTimeout( _ => {
 *             console.log("A");
 *             ok();
 *         }, 100);
 *     });
 *     scheduler.addOk ( () => console.log("B"));
 *     // log contains first A, then B
 */
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop();
        const prom = new Promise( ok => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
        });
    }
    function add(task) {
        tasks.unshift(task);
        process();
    }
    return {
        add:   add,
        addOk: task => add( ok => { task(); ok(); }) // convenience
    }
};
