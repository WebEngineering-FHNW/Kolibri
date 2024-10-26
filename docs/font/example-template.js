/*
    Provides an html-template to share between font example pages.
*/

const HTML_TEMPLATE = `
<h2>H2 Style Examples from variable font settings</h2>

<p>This should show all the font features that are important in the Kolibri context.</p>

<dl>
    <dt>regular</dt>
    <dd>
        situs vilate in isis ab ernit.</dd>

    <dt>lighter</dt>
    <dd style="font-weight: lighter">
        situs vilate in isis ab ernit.</dd>

    <dt>italic</dt>
    <dd style="font-style: italic">
        situs vilate in isis ab ernit.</dd>

    <dt>animate on hover</dt>
    <dd class="animate_on_hover">
        situs vilate in isis ab ernit.  &lt;- try mouse over here !</dd>

    <dt>big O vs non-slashed zero </dt>
    <dd >
        big OOO vs zero 000</dd>

    <dt>numbers with no font support </dt>
    <dd >
        111 in running text <br>000 in running text </dd>

    <dt>numeric font support </dt>
    <dd class="font_numeric">
        111 in tabular text <br>000 in tabular text plus 
        <span class="font_numeric_fraction">1/3</span>rd fractions</dd>
</dl>
`;
