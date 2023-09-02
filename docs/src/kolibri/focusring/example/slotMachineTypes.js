/**
 * @typedef SlotMachineModelType
 * @property { Array<IObservable<String>> } wheels
 * @property { () => Boolean }              isRunning
 * @property { (b:Boolean) => void }        setIsRunning
 * @property { (callback: ValueChangeCallback<Boolean>) => void }  onIsRunningChange
 */

/**
 * @typedef SlotMachineControllerType
 * @property { Array<IObservable<String>> } wheels
 * @property { (callback: ValueChangeCallback<Boolean>) => void }  onIsRunningChange
 * @property { () => void }                 startEngine
 *
 */
