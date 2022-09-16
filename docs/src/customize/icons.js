/**
 * A typesafe way to create icons from svg and ensure consistent styling.
 * Many icon SVGs based on www.svgrepo.com.
 */
export {
    svg,
    ICON_EMPTY,
    ICON_HOUSE,
    ICON_ONE_TWO,
    ICON_PLUS_MINUS,
    ICON_TERMINAL,
    ICON_KOLIBRI,
    ICON_CHRISTMAS_TREE
}

/**
 * @typedef {
 *        "empty"
 *      | "house"
 *      | "one_two"
 *      | "plus_minus"
 *      | "terminal"
 *      | "kolibri"
 *      | "christmas_tree"
 *      }  IconNameType
 */

/** @type { IconNameType } */ const ICON_EMPTY          = "empty";
/** @type { IconNameType } */ const ICON_HOUSE          = "house";
/** @type { IconNameType } */ const ICON_ONE_TWO        = "one_two";
/** @type { IconNameType } */ const ICON_PLUS_MINUS     = "plus_minus";
/** @type { IconNameType } */ const ICON_TERMINAL       = "terminal";
/** @type { IconNameType } */ const ICON_KOLIBRI        = "kolibri";
/** @type { IconNameType } */ const ICON_CHRISTMAS_TREE = "christmas_tree";


const svg = /** @type { Object.<IconNameType, String>  } */ {};

svg[ICON_EMPTY] = `
    <svg id="icon_${ICON_EMPTY}" viewBox="0 0 1 1" >
    </svg>
`;
svg[ICON_HOUSE] = `
    <svg id="icon_${ICON_HOUSE}" viewBox="0 0 30 32" >
        <path d="M1 12.5815C1 11.6147 1.46592 10.7072 2.25152 10.1437L15 1L27.7485 10.1437C28.5341 10.7072 29 11.6147 29 12.5815V28.5C29 29.8807 27.8807 31 26.5 31H20.2C19.6477 31 19.2 30.5523 19.2 30V21.2727C19.2 20.9966 18.9761 20.7727 18.7 20.7727H11.3C11.0239 20.7727 10.8 20.9966 10.8 21.2727V30C10.8 30.5523 10.3523 31 9.8 31H3.5C2.11929 31 1 29.8807 1 28.5V12.5815Z" />
    </svg>
`;
svg[ICON_ONE_TWO] = `
    <svg id="icon_${ICON_ONE_TWO}" viewBox="0 0 24 24" >
        <path d="M3.604 3.089A.75.75 0 014 3.75V8.5h.75a.75.75 0 010 1.5h-3a.75.75 0 110-1.5h.75V5.151l-.334.223a.75.75 0 01-.832-1.248l1.5-1a.75.75 0 01.77-.037zM8.75 5.5a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5.5 15.75c0-.704-.271-1.286-.72-1.686a2.302 2.302 0 00-1.53-.564c-.535 0-1.094.178-1.53.565-.449.399-.72.982-.72 1.685a.75.75 0 001.5 0c0-.296.104-.464.217-.564A.805.805 0 013.25 15c.215 0 .406.072.533.185.113.101.217.268.217.565 0 .332-.069.48-.21.657-.092.113-.216.24-.403.419l-.147.14c-.152.144-.33.313-.52.504l-1.5 1.5a.75.75 0 00-.22.53v.25c0 .414.336.75.75.75H5A.75.75 0 005 19H3.31l.47-.47c.176-.176.333-.324.48-.465l.165-.156a5.98 5.98 0 00.536-.566c.358-.447.539-.925.539-1.593z"/>
    </svg>
`;
svg[ICON_PLUS_MINUS] = `
    <svg id="icon_${ICON_PLUS_MINUS}" viewBox="0 0 24 24" >
        <path d="M12.5 6.75a.75.75 0 00-1.5 0V9H8.75a.75.75 0 000 1.5H11v2.25a.75.75 0 001.5 0V10.5h2.25a.75.75 0 000-1.5H12.5V6.75zM8.75 16a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"/><path fill-rule="evenodd" d="M5 1a2 2 0 00-2 2v18a2 2 0 002 2h14a2 2 0 002-2V7.018a2 2 0 00-.586-1.414l-4.018-4.018A2 2 0 0014.982 1H5zm-.5 2a.5.5 0 01.5-.5h9.982a.5.5 0 01.354.146l4.018 4.018a.5.5 0 01.146.354V21a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V3z"/>
    </svg>
`;
svg[ICON_TERMINAL] = `
    <svg id="icon_${ICON_TERMINAL}" viewBox="0 0 24 24" >
        <path d="M9.25 12a.75.75 0 01-.22.53l-2.75 2.75a.75.75 0 01-1.06-1.06L7.44 12 5.22 9.78a.75.75 0 111.06-1.06l2.75 2.75c.141.14.22.331.22.53zm2 2a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5z"/><path fill-rule="evenodd" d="M0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75zm1.75-.25a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H1.75z"/>
    </svg>
`;
svg[ICON_KOLIBRI] = `
<svg id="icon_${ICON_KOLIBRI}" viewBox="0 0 128 128" style="fill:none" >
    <path d="M82.375 106C80.0436 75.8514 58.9236 72.2085 48.775 67.9375C49.3236 74.8465 65.9582 80.6396 70.2898 84.7704C76.6469 90.8328 81.2331 95.8391 82.375 106Z" fill="#1E19FF"/>
    <path d="M52.7125 54.025C52.7125 34.075 33.1562 26.4625 22 22C43.315 32.29 42.3438 42.8687 43.1312 58.225C44.8375 78.8312 63.2125 82.5062 63.2125 82.5062C50.875 72.5312 52.7125 63.2125 52.7125 54.025Z" fill="#FF2CA5"/>
    <path d="M62.1239 84.2567C48.0491 78.3159 44.767 74.1573 43.525 60.85C43.525 60.85 48.5519 74.6326 62.1239 78.3159C75.696 81.9992 82.2075 98.0393 82.375 106C78.2095 91.148 75.6573 89.9689 62.1239 84.2567Z" fill="#6000FF"/>
    <path d="M58.4127 62.7124C62.7709 39.208 83.6844 51.0936 94.8144 28.3C89.5866 54.8305 65.1945 55.0495 58.4127 62.7124Z" fill="#1E19FF"/>
    <path d="M58.4156 62.7193C69.1306 44.5994 89.6791 52.8668 105.942 34.2029C97.3011 51.9087 87.6772 66.7312 58.4156 62.7193Z" fill="#FF2CA5"/>
    <path d="M58.4064 62.7154C69.2766 74.3202 90.1304 65.5289 96.8058 58.0697C87.5516 63.8076 73.8789 55.7374 58.4064 62.7154Z" fill="#6000FF"/>
    <ellipse cx="48.1188" cy="37.8812" rx="2.49375" ry="2.49375" fill="#14141B"/>
    <path d="M51.4253 33.3451C47.9627 30.8207 43.78 33.9764 37.4875 29.4554C46.1943 30.0331 49.8099 26.8381 54.657 31.6257C59.5498 37.2528 55.1288 44.5092 59.9453 50.8416C54.2063 48.6284 55.7238 36.4788 51.4253 33.3451Z" fill="#1E19FF"/>
</svg>
`;
svg[ICON_CHRISTMAS_TREE] = `
<svg id="icon_${ICON_CHRISTMAS_TREE}" viewBox="0 0 512 512"  xml:space="preserve">
	<path d="M449.414,478.037l-72.517-92.833c-16.287-0.187-24.22-12.898-28.482-19.753
		c-0.437-0.718-0.968-1.57-1.499-2.389c-0.531,0.812-1.062,1.663-1.499,2.374c-4.294,6.901-12.304,19.753-28.81,19.753
		c-16.521-0.016-24.5-12.875-28.794-19.777c-0.437-0.718-0.968-1.57-1.499-2.397c-0.547,0.82-1.062,1.671-1.515,2.39
		c-4.294,6.901-12.305,19.745-28.795,19.745c-16.521-0.016-24.5-12.875-28.794-19.792c-0.437-0.711-0.968-1.561-1.499-2.389
		c-0.547,0.828-1.078,1.678-1.515,2.389c-4.294,6.902-12.32,19.753-28.825,19.753c-16.521-0.015-24.5-12.882-28.795-19.792
		c-0.437-0.71-0.968-1.561-1.499-2.381c-0.516,0.812-1.047,1.663-1.484,2.373c-4.263,6.84-12.18,19.473-28.357,19.715
		l-72.658,93.012c-10.29,13.21-5.044,24.008,11.727,24.008c18.176,0,26.343-18.98,43.598-18.98
		c17.271,0,17.271,28.935,34.526,28.935c17.27,0,17.27-28.935,34.525-28.935c17.271,0,17.271,28.935,34.526,28.935
		c17.27,0,17.27-28.935,34.525-28.935c17.271,0,17.271,28.935,34.526,28.935c17.271,0,17.271-28.935,34.51-28.935
		c17.286,0,17.286,28.935,34.51,28.935c17.271,0,17.271-28.935,34.526-28.935c17.27,0,25.453,18.98,43.614,18.98
		C454.458,502.046,459.721,491.247,449.414,478.037z"/>
	<path  d="M134.783,366.84c15.162,0,15.162-24.359,30.309-24.344c15.162,0,15.131,24.376,30.278,24.391
		c15.178,0,15.193-24.367,30.356-24.344c15.147,0,15.131,24.367,30.278,24.383c15.148,0,15.163-24.368,30.31-24.337
		c15.162,0,15.146,24.36,30.293,24.376c15.162,0,15.162-24.36,30.309-24.337c15.163,0,15.148,24.36,30.294,24.383
		c16.755,0,21.924-10.697,11.477-23.797l-60.93-76.484c-2.483,0.422-5.075,0.703-7.808,0.703c-10.868,0-17.411-6.246-21.315-11.376
		c-3.92,5.13-10.447,11.376-21.315,11.376c-10.853,0-17.396-6.246-21.316-11.376c-3.919,5.13-10.462,11.376-21.33,11.376
		c-10.852,0-17.396-6.238-21.315-11.368c-3.904,5.13-10.447,11.368-21.3,11.368c-2.732,0-5.309-0.281-7.792-0.703l-60.947,76.288
		C112.859,356.106,118.013,366.825,134.783,366.84z"/>
	<path  d="M192.075,249.212c10.65,0,10.65-16.24,21.299-16.24s10.649,16.24,21.315,16.24
		c10.681,0,10.681-16.24,21.314-16.24c10.666,0,10.666,16.24,21.331,16.24c10.634,0,10.634-16.24,21.315-16.24
		c10.65,0,10.65,16.24,21.3,16.24c16.755,0,22.548-11.204,12.882-24.876l-59.26-83.776c-9.635-13.694-25.484-13.694-35.165,0
		l-59.228,83.776C169.496,238.007,175.289,249.212,192.075,249.212z"/>
	<polygon  points="213.656,130.293 256.004,104.176 298.321,130.293 286.579,81.956 324.492,49.766 274.899,46.01 
		256.004,0 237.094,46.01 187.501,49.766 225.414,81.956 	"/>
</svg>
`;