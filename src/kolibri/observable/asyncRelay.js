import {LoggerFactory} from "../logger/loggerFactory.js";
import {Scheduler}     from "../dataflow/dataflow.js";

export {AsyncRelay}

const log = LoggerFactory("ch.fhnw.kolibri.observable.asyncRelay");

/**
 * @typedef { (remoteObservableMap:ObservableMapType) => (observableMap:ObservableMapType) => SchedulerType } AsyncRelayType
 * Connecting a remote observable map (remoteObservableMap) with another observable map (observableMap) such that
 * value changes from either side are synchronized with the other side.
 * The remote observable map is supposed to work in an asynchronous fashion, which means that
 * all function calls need to happen under the control of a {@link SchedulerType scheduler}
 * in order to ensure proper sequencing.
 */

/**
 * @type { AsyncRelayType }
 * @see {@link AsyncRelayType}
 * */
const AsyncRelay = remoteObservableMap => observableMap => {

    // only access to the (async) remoteObservableMap is scheduled
    const romScheduler = Scheduler();

    // whenever observableMap changes, tell remoteObservableMap
    observableMap.onKeyAdded( key => {
        romScheduler.addOk( _=> {
            observableMap.getValue(key)
              (_=> remoteObservableMap.removeKey(key))
              (v=> remoteObservableMap.setValue(key, v)) // might debounce
        } );
    });
    observableMap.onKeyRemoved( key => {
        romScheduler.addOk( _=> {remoteObservableMap.removeKey(key)} );
    });
    observableMap.onChange( (key, value) => {
        romScheduler.addOk( _=> {
            log.debug(_=>`relay: observableMap onchange key ${key} value ${value}`);
            remoteObservableMap.setValue(key, value)     // might debounce
        } );
    });

    // whenever remoteObservableMap changes, update observableMap immediately
    remoteObservableMap.onKeyAdded( key => {
            remoteObservableMap.getValue(key)
              (_=> observableMap.removeKey(key))
              (v=> observableMap.setValue(key, v))  // might debounce and oscillate
    });
    remoteObservableMap.onKeyRemoved( key => {
            observableMap.removeKey(key)
    });
    remoteObservableMap.onChange((key, value) => {
        log.debug(`relay: remoteObservableMap onchange key ${key} value ${value}`);
        observableMap.setValue(key, value);         // might debounce and oscillate
    });

    return romScheduler;
};
