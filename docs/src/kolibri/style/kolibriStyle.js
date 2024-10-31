// noinspection JSUnusedLocalSymbols

/**
 * @module kolibriStyle
 * Common constants and facilities for a consistent look.
 * Importing a different style should give you a custom look.
 * Make sure to keep in line with kolibri-base.css
 */

export { accentColor, okColor, neutralColor, selectColor, outputColor, shadowColor, shadowCss }

export {
    primaryDark,     primaryAccent, primaryBg,    primaryLight,
    secondaryAccent, secondaryDark, secondaryBg,  secondaryLight,
    successAccent,   successDark,   successLight, successBg,
    warningAccent,   warningDark,   warningBg,    warningLight,
    dangerAccent,    dangerDark,    dangerBg,     dangerLight
}

export {
    purple400, blue500
}

export {
    pxSpacer1,  pxSpacer2,  pxSpacer3,   pxSpacer4,  pxSpacer5,  pxSpacer6,
    pxSpacer7,  pxSpacer8,  pxSpacer9,   pxSpacer10, pxSpacer12, remSpacer1,
    remSpacer2, remSpacer3, remSpacer4,  remSpacer5, remSpacer6, remSpacer7,
    remSpacer8, remSpacer9, remSpacer10, remSpacer12
}

export {
    fontSizeH1, fontSizeH2, fontSizeH3, fontSizeH4, fontSizeH5, fontSizeH6,
    fontSizeTextL, fontSizeTextM, fontSizeTextS, fontSizeTextXS,
    fontSizeLinkL, fontSizeLinkM, fontSizeLinkS, fontSizeLinkXS,
    fontSizeCaption, fontSizeOverline
}

export {
    lightRubik, mediumRubik, regularRubik, semiboldRubik,
}

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

const accentColor  = "var(--kolibri-color-accent)";
const okColor      = "var(--kolibri-color-ok)";
const neutralColor = "var(--kolibri-color-neutral)";
const selectColor  = "var(--kolibri-color-select)";

const outputColor = "var(--kolibri-color-output)";
const shadowColor = "var(--kolibri-color-shadow)";

const shadowCss   = "var(--kolibri-box-shadow)";

// -- All colors according to Design File in Figma --

/* --- purple --- */
const purple800     = "var(--kolibri-palette-purple-800)";
const purple700     = "var(--kolibri-palette-purple-700)";
const purple600     = "var(--kolibri-palette-purple-600)";
const purple500     = "var(--kolibri-palette-purple-500)";
const purple400     = "var(--kolibri-palette-purple-400)";
const purple300     = "var(--kolibri-palette-purple-300)";
const purple200     = "var(--kolibri-palette-purple-200)";
const purple100     = "var(--kolibri-palette-purple-100)";

/* --- lavender --- */
const lavender800   = "var(--kolibri-palette-lavender-800)";
const lavender700   = "var(--kolibri-palette-lavender-700)";
const lavender600   = "var(--kolibri-palette-lavender-600)";
const lavender500   = "var(--kolibri-palette-lavender-500)";
const lavender400   = "var(--kolibri-palette-lavender-400)";
const lavender300   = "var(--kolibri-palette-lavender-300)";
const lavender200   = "var(--kolibri-palette-lavender-200)";
const lavender100   = "var(--kolibri-palette-lavender-100)";

/* --- blue --- */
const blue800       = "var(--kolibri-palette-blue-800)";
const blue700       = "var(--kolibri-palette-blue-700)";
const blue600       = "var(--kolibri-palette-blue-600)";
const blue500       = "var(--kolibri-palette-blue-500)";
const blue400       = "var(--kolibri-palette-blue-400)";
const blue300       = "var(--kolibri-palette-blue-300)";
const blue200       = "var(--kolibri-palette-blue-200)";
const blue100       = "var(--kolibri-palette-blue-100)";

/* --- green --- */
const green800      = "var(--kolibri-palette-green-800)";
const green700      = "var(--kolibri-palette-green-700)";
const green600      = "var(--kolibri-palette-green-600)";
const green500      = "var(--kolibri-palette-green-500)";
const green400      = "var(--kolibri-palette-green-400)";
const green300      = "var(--kolibri-palette-green-300)";
const green200      = "var(--kolibri-palette-green-200)";
const green100      = "var(--kolibri-palette-green-100)";

/* --- yellow --- */
const yellow800     = "var(--kolibri-palette-yellow-800)";
const yellow700     = "var(--kolibri-palette-yellow-700)";
const yellow600     = "var(--kolibri-palette-yellow-600)";
const yellow500     = "var(--kolibri-palette-yellow-500)";
const yellow400     = "var(--kolibri-palette-yellow-400)";
const yellow300     = "var(--kolibri-palette-yellow-300)";
const yellow200     = "var(--kolibri-palette-yellow-200)";
const yellow100     = "var(--kolibri-palette-yellow-100)";

/* --- pink --- */
const pink800       = "var(--kolibri-palette-pink-800)";
const pink700       = "var(--kolibri-palette-pink-700)";
const pink600       = "var(--kolibri-palette-pink-600)";
const pink500       = "var(--kolibri-palette-pink-500)";
const pink400       = "var(--kolibri-palette-pink-400)";
const pink300       = "var(--kolibri-palette-pink-300)";
const pink200       = "var(--kolibri-palette-pink-200)";
const pink100       = "var(--kolibri-palette-pink-100)";

/* --- monochrome --- */
const black         = hsl(240,  15,  9);
const body          = hsl(247,  15, 35);
const label         = hsl(235,  14, 50);
const placeholder   = hsl(234,  18, 68);
const bgDark        = hsl(249,  23, 18);
const line          = hsl(233,  27, 88);
const bgLight       = hsl(231,  28, 95);
const white         = hsl(240,  45, 98);

/* --- transparent - dark --- */
const black95       = hsla(...black, 0.95);
const black75       = hsla(...black, 0.75);
const black65       = hsla(...black, 0.65);
const black40       = hsla(...black, 0.40);
const black25       = hsla(...black, 0.25);
const black10       = hsla(...black, 0.10);

/* --- transparent - white --- */
const white95       = hsla(...white, 0.95);
const white75       = hsla(...white, 0.75);
const white65       = hsla(...white, 0.65);
const white40       = hsla(...white, 0.40);
const white25       = hsla(...white, 0.25);
const white10       = hsla(...white, 0.10);

/* --- primary --- */
const primaryDark       = purple700;
const primaryAccent     = purple500;
const primaryLight      = purple200;
const primaryBg         = purple100;

/* --- secondary --- */
const secondaryDark     = blue800;
const secondaryAccent   = blue500;
const secondaryLight    = blue200;
const secondaryBg       = blue100;

/* --- success --- */
const successDark       = green800;
const successAccent     = green500;
const successLight      = green200;
const successBg         = green100;

/* --- warning --- */
const warningDark       = yellow600;
const warningAccent     = yellow500;
const warningLight      = yellow200;
const warningBg         = yellow100;

/* --- danger --- */
const dangerDark        = pink800;
const dangerAccent      = pink500;
const dangerLight       = pink200;
const dangerBg          = pink100;

// todo dk: the whole typography section needs to be reworked, maybe it can even be removed
// todo dk: atm we have no visual testing of the outcome

/* --- typography --- */
const lightRubik     = 'Rubik-Light,    system-ui, serif';
const mediumRubik    = 'Rubik-Medium,   system-ui, serif';
const regularRubik   = 'Rubik-Regular,  system-ui, serif';
const semiboldRubik  = 'Rubik-SemiBold, system-ui, serif';


/* --- font-sizes --- */
const fontSizeH1         = '6.0rem';
const fontSizeH2         = '3.7rem';
const fontSizeH3         = '3.0rem';
const fontSizeH4         = '2.0rem';
const fontSizeH5         = '1.5rem';
const fontSizeH6         = '1.0rem';

const fontSizeTextL      = '1.25rem';
const fontSizeTextM      = '1.0rem';
const fontSizeTextS      = '0.875rem';
const fontSizeTextXS     = '0.75rem';

const fontSizeLinkL      = '1.25rem';
const fontSizeLinkM      = '1.125rem';
const fontSizeLinkS      = '1.0rem';
const fontSizeLinkXS     = '0.875rem';

const fontSizeCaption    = '0.875rem';
const fontSizeOverline   = '0.625rem';


/* --- spacing in rem--- */
const remSpacer1         = '0.3rem';
const remSpacer2         = '0.5rem';
const remSpacer3         = '0.8rem';
const remSpacer4         = '1.0rem';
const remSpacer5         = '1.3rem';
const remSpacer6         = '1.5rem';
const remSpacer7         = '1.8rem';
const remSpacer8         = '2.0rem';
const remSpacer9         = '2.2rem';
const remSpacer10        = '2.5rem';
const remSpacer12        = '3.0rem';

/* --- spacing in px--- */
const pxSpacer1          = '4px;';
const pxSpacer2          = '8px;';
const pxSpacer3          = '12px';
const pxSpacer4          = '16px';
const pxSpacer5          = '20px';
const pxSpacer6          = '24px';
const pxSpacer7          = '28px';
const pxSpacer8          = '32px';
const pxSpacer9          = '36px';
const pxSpacer10         = '40px';
const pxSpacer12         = '48px';
