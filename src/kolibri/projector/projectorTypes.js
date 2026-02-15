
/**
 * Projection function that creates a view for input purposes, binds the information that is available through
 * the inputController, and returns the generated views.

 * @typedef { <_T_>
 *     (inputController: !SimpleInputControllerType<_T_>, formCssClassName: !String )
 *      => [HTMLLabelElement, HTMLInputElement]
 *     } InputProjectionType
 * @impure since calling the controller functions changes underlying models. The DOM remains unchanged.
 * @note   in the future we might want to depend on a more general controller than SimpleInputControllerType.
 */

/**
 * An {@link InputProjectionType} that binds the input on value change.
 * Depending on the control and how the browser handles it, this might require a user action to confirm the
 * finalization of the value change like pressing the enter key or leaving the input field.
 * The signature is the same as for {@link InstantInputProjectionType} but the meaning is different.
 * @template _T_
 * @typedef { InputProjectionType<_T_> } ChangeInputProjectionType
 */

/**
 * An {@link InputProjectionType} that binds the input on any change instantly.
 * Depending on the control and how the browser handles it, this might result in each keystroke in a
 * text field leading to instant update of the underlying model.
 * The signature is the same as for {@link ChangeInputProjectionType} but the meaning is different.
 * @template _T_
 * @typedef { InputProjectionType<_T_> } InstantInputProjectionType
 */

/**
 * A constructor for an {@link InputProjectionType} that binds the input on any change with a given delay in milliseconds such that
 * a quick succession of keystrokes is not interpreted as input until there is some quiet time.
 * Each keystroke triggers the defined timeout. If the timeout is still pending while a key is pressed,
 * it is reset and starts from the beginning. After the timeout expires, the underlying model is updated.
 * @typedef { <_T_> (quietTimeMs: !Number) => InputProjectionType<_T_> } DebounceInputProjectionType
 */

/**
 * Interface for {@link InputProjectionType}s.
 * @typedef IInputProjector
 * @property { ChangeInputProjectionType   } projectChangeInput
 * @property { InstantInputProjectionType  } projectInstantInput
 * @property { DebounceInputProjectionType } projectDebounceInput
 */
