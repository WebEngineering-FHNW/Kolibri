# Build instructions

"Building" is not strictly needed. One can use the Kolibri directly "as is" through the ES module system.

Anyway, sometimes it is nice to have a bundled and/or minified version for distribution or statistical purposes.

Install node and [rollup](https://rollupjs.org).

Make sure that production.js imports all modules that should be part of the distribution.

### Bundle with 
        cd production
        rollup -o productionBundle.js -f es -w . production.js --no-treeshake --compact

        2021-12-18 T 22:50:49 MEZ
        bundle:   231 LOC
        tests:    460 LOC
        jsdoc:    553 LOC
