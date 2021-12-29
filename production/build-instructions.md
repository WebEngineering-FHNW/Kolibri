# Build instructions

"Building" is not strictly needed. One can use the Kolibri directly "as is" through the ES module system.

Anyway, sometimes it is nice to have a bundled and/or minified version for distribution or statistical purposes.

Install node and [rollup](https://rollupjs.org).

Make sure that production.js imports all modules that should be part of the distribution.

### Bundle with 
        cd production
        rollup -o productionBundle.js -f es -w . production.js --no-treeshake --compact

### Latest statistics
        2021-12-29 T 22:16:53 MEZ
        bundle:   330 LOC
        tests:    922 LOC
        jsdoc:    817 LOC
