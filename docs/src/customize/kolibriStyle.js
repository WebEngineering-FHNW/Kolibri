// noinspection JSUnusedLocalSymbols

/**
 * @module kolibriStyle
 * Common constants and facilities for a consistent look.
 * Importing a different style should give you a custom look.
 * Make sure to keep in line with kolibri-base.css
 */

export {
    colorAccent, colorOk, colorNeutral, colorSelect, colorOutput, colorShadow, shadowCss,
    hsl, hsla,
    KOLIBRI_LOGO_SVG
}

export {
    colorPrimaryDark,     colorPrimaryAccent, colorPrimaryBg,    colorPrimaryLight,
    colorSecondaryAccent, colorSecondaryDark, colorSecondaryBg,  colorSecondaryLight,
    colorSuccessAccent,   colorSuccessDark,   colorSuccessLight, colorSuccessBg,
    colorWarningAccent,   colorWarningDark,   colorWarningBg,    colorWarningLight,
    colorDangerAccent,    colorDangerDark,    colorDangerBg,     colorDangerLight
}

/* note to FA: spacers and font constants have been removed here (DK) */

/**
 * Css string value for the given color. We keep values as HSL to allow easier manipulation.
 * @param hue   - 0 to 360 degrees on the color wheel, where 0 is red, then yellow, green, cyan, blue, magenta.
 * @param sat   - saturation 0 to 100, where 0 is greyscale.
 * @param light - lightness, 0 is black and 100 is white.
 * @return {`hsl(${string}, ${string}%, ${string}%)`}
 * @example
 * const fireTruckRed = hsl(0, 100, 50);
 */
const hsl  = (hue, sat, light)        => `hsl(${hue}, ${sat}%, ${light}%)`;

/**
 * Css string value for the given color. We keep values as HSL to allow easier manipulation.
 * @param hue   - 0 to 360 degrees on the color wheel, where 0 is red, then yellow, green, cyan, blue, magenta.
 * @param sat   - saturation 0 to 100, where 0 is greyscale.
 * @param light - lightness, 0 is black and 100 is white.
 * @param alpha - between 0 and 1, where 0 is fully transparent and 1 is opaque.
 * @return {`hsl(${string}, ${string}%, ${string}%, ${string})`}
 * @example
 * const paleRose = hsla(0, 100, 50, 0.3);
 */
const hsla = (hue, sat, light, alpha) => `hsl(${hue}, ${sat}%, ${light}%, ${alpha})`;

const colorAccent  = "var(--kolibri-color-accent)";
const colorOk      = "var(--kolibri-color-ok)";
const colorNeutral = "var(--kolibri-color-neutral)";
const colorSelect  = "var(--kolibri-color-select)";

const colorOutput = "var(--kolibri-color-output)";
const colorShadow = "var(--kolibri-color-shadow)";

const shadowCss   = "var(--kolibri-box-shadow)";

// -- All colors according to Design File in Figma --

/* --- purple --- */
const palette_purple800     = "var(--kolibri-palette-purple-800)";
const palette_purple700     = "var(--kolibri-palette-purple-700)";
const palette_purple600     = "var(--kolibri-palette-purple-600)";
const palette_purple500     = "var(--kolibri-palette-purple-500)";
const palette_purple400     = "var(--kolibri-palette-purple-400)";
const palette_purple300     = "var(--kolibri-palette-purple-300)";
const palette_purple200     = "var(--kolibri-palette-purple-200)";
const palette_purple100     = "var(--kolibri-palette-purple-100)";

/* --- lavender --- */
const palette_lavender800   = "var(--kolibri-palette-lavender-800)";
const palette_lavender700   = "var(--kolibri-palette-lavender-700)";
const palette_lavender600   = "var(--kolibri-palette-lavender-600)";
const palette_lavender500   = "var(--kolibri-palette-lavender-500)";
const palette_lavender400   = "var(--kolibri-palette-lavender-400)";
const palette_lavender300   = "var(--kolibri-palette-lavender-300)";
const palette_lavender200   = "var(--kolibri-palette-lavender-200)";
const palette_lavender100   = "var(--kolibri-palette-lavender-100)";

/* --- blue --- */
const palette_blue800       = "var(--kolibri-palette-blue-800)";
const palette_blue700       = "var(--kolibri-palette-blue-700)";
const palette_blue600       = "var(--kolibri-palette-blue-600)";
const palette_blue500       = "var(--kolibri-palette-blue-500)";
const palette_blue400       = "var(--kolibri-palette-blue-400)";
const palette_blue300       = "var(--kolibri-palette-blue-300)";
const palette_blue200       = "var(--kolibri-palette-blue-200)";
const palette_blue100       = "var(--kolibri-palette-blue-100)";

/* --- green --- */
const palette_green800      = "var(--kolibri-palette-green-800)";
const palette_green700      = "var(--kolibri-palette-green-700)";
const palette_green600      = "var(--kolibri-palette-green-600)";
const palette_green500      = "var(--kolibri-palette-green-500)";
const palette_green400      = "var(--kolibri-palette-green-400)";
const palette_green300      = "var(--kolibri-palette-green-300)";
const palette_green200      = "var(--kolibri-palette-green-200)";
const palette_green100      = "var(--kolibri-palette-green-100)";

/* --- yellow --- */
const palette_yellow800     = "var(--kolibri-palette-yellow-800)";
const palette_yellow700     = "var(--kolibri-palette-yellow-700)";
const palette_yellow600     = "var(--kolibri-palette-yellow-600)";
const palette_yellow500     = "var(--kolibri-palette-yellow-500)";
const palette_yellow400     = "var(--kolibri-palette-yellow-400)";
const palette_yellow300     = "var(--kolibri-palette-yellow-300)";
const palette_yellow200     = "var(--kolibri-palette-yellow-200)";
const palette_yellow100     = "var(--kolibri-palette-yellow-100)";

/* --- pink --- */
const palette_pink800       = "var(--kolibri-palette-pink-800)";
const palette_pink700       = "var(--kolibri-palette-pink-700)";
const palette_pink600       = "var(--kolibri-palette-pink-600)";
const palette_pink500       = "var(--kolibri-palette-pink-500)";
const palette_pink400       = "var(--kolibri-palette-pink-400)";
const palette_pink300       = "var(--kolibri-palette-pink-300)";
const palette_pink200       = "var(--kolibri-palette-pink-200)";
const palette_pink100       = "var(--kolibri-palette-pink-100)";

/* --- monochrome --- */
/* todo dk: these names make issues when used through the production bundle. Better prefix with "color-" or so.*/
const colorBlack            = hsl(240,  15,  9);
const colorBody             = hsl(247,  15, 35);
const colorLabel            = hsl(235,  14, 50);
const colorPlaceholder      = hsl(234,  18, 68);
const colorBackgroundDark   = hsl(249,  23, 18);
const colorLine             = hsl(233,  27, 88);
const colorBackgroundLight  = hsl(231,  28, 95);
const colorWhite            = hsl(240,  45, 98);

/* --- transparent - dark --- */
const palette_black95       = hsla(...colorBlack, 0.95);
const palette_black75       = hsla(...colorBlack, 0.75);
const palette_black65       = hsla(...colorBlack, 0.65);
const palette_black40       = hsla(...colorBlack, 0.40);
const palette_black25       = hsla(...colorBlack, 0.25);
const palette_black10       = hsla(...colorBlack, 0.10);

/* --- transparent - white --- */
const palette_white95       = hsla(...colorWhite, 0.95);
const palette_white75       = hsla(...colorWhite, 0.75);
const palette_white65       = hsla(...colorWhite, 0.65);
const palette_white40       = hsla(...colorWhite, 0.40);
const palette_white25       = hsla(...colorWhite, 0.25);
const palette_white10       = hsla(...colorWhite, 0.10);

/* --- primary --- */
const colorPrimaryDark   = palette_purple700;
const colorPrimaryAccent = palette_purple500;
const colorPrimaryLight  = palette_purple200;
const colorPrimaryBg     = palette_purple100;

/* --- secondary --- */
const colorSecondaryDark   = palette_blue800;
const colorSecondaryAccent = palette_blue500;
const colorSecondaryLight  = palette_blue200;
const colorSecondaryBg     = palette_blue100;

/* --- success --- */
const colorSuccessDark   = palette_green800;
const colorSuccessAccent = palette_green500;
const colorSuccessLight  = palette_green200;
const colorSuccessBg     = palette_green100;

/* --- warning --- */
const colorWarningDark   = palette_yellow600;
const colorWarningAccent = palette_yellow500;
const colorWarningLight  = palette_yellow200;
const colorWarningBg     = palette_yellow100;

/* --- danger --- */
const colorDangerDark   = palette_pink800;
const colorDangerAccent = palette_pink500;
const colorDangerLight  = palette_pink200;
const colorDangerBg     = palette_pink100;

const KOLIBRI_LOGO_SVG = `
<svg class="kolibri-logo-svg" viewBox="0 0 305 342" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M138 194C183.5 214.5 228 221.5 236.5 341.5C229.5 273.5 187 263.5 138 194Z" fill="#5F2EEA"/>
    <path d="M117 122C117 46 42.5 17 0 0C81.2 39.2 77.5 79.5 80.5 138C87 216.5 128 235.667 150.5 248C105.7 212 117 157 117 122Z" fill="#FE2EA8"/>
    <path d="M80.9999 144.5C81.3468 146.565 81.692 148.581 82.0374 150.552C86.8892 170.965 107.957 211.566 156.5 225.5C210.5 241 236.407 308.5 237.074 342C220.5 279.5 210.346 274.538 156.5 250.5C102.35 226.326 92.1459 208.229 82.0374 150.552C81.492 148.257 81.1515 146.218 80.9999 144.5Z" fill="#BE58FD"/>
    <path d="M115 49.5C100.5 39.8333 79 51.0005 54 32C92.5 36.5 109.5 26 129.5 44C149.5 65 128.5 90 148 113.499C123.5 104.499 133 61.5 115 49.5Z" fill="#5F2EEA"/>
    <circle cx="100.5" cy="60.5" r="9.5" fill="#2D1FB1"/>
    <path class="wing" opacity="0.5" d="M128 179.114C176.159 220.174 254.92 177.348 279 146C243.884 171.608 187.698 146.442 128 179.114Z" fill="#BD53FE" stroke="#BD53FE"/>
    <path class="wing" opacity="0.7" d="M128 158C163.892 67.1818 241.575 130.021 305 47C263.208 149.285 161.925 132.314 128 158Z" fill="#4C2EEC"/>
    <path class="wing" opacity="0.7" d="M128 178.895C162.922 103.67 248.073 126.739 305 47C278.211 119.718 247.116 181.904 128 178.895Z" fill="#FF2CA5"/>
</svg>
`;
