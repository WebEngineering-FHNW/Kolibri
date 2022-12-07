/**
 * The focus ring is a data structure that arranges its elements in a ring. One element is always in focus and can be accessed.
 * The focus can be moved elementwise via two functions. Since the elements are arranged in a ring,
 * the first element will come back into focus after the last element and vice versa.
 *
 * @template _T_
 * @typedef FocusRingType
 * @property { () => FocusRingType<_T_> } left  - moves the focus to the next element in the ring
 * @property { () => FocusRingType<_T_> } right - moves the focus to the next element in the ring
 * @property { () => _T_ }                focus - returns the currently focused element
 */