/**
 * @typedef SlotMachineModelType
 * @property { Array<IObservable<String>> } wheels
 * @property { () => Boolean }              isRunning
 * @property { (b:Boolean) => void }        setIsRunning
 * @property { (callback: onValueChangeCallback<Boolean>) => void }  onIsRunningChange
 */

/**
 * @typedef SlotMachineControllerType
 * @property { Array<IObservable<String>> } wheels
 * @property { (callback: onValueChangeCallback<Boolean>) => void }  onIsRunningChange
 * @property { () => void }                 startEngine
 *
 */
