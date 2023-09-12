# Build instructions

"Building" is not strictly needed. One can use the Kolibri directly "as is" through the ES module system.

Anyway, sometimes it is nice to have a bundled and/or minified version for distribution or statistical purposes.

Install node and [rollup](https://rollupjs.org).

Make sure that production.js imports all modules that should be part of the distribution.
Consider using
        find $PWD -name '*.js' | grep -v Test.js

> **Warning**
> The code below will execute arbitrary and possibly harmful code. 
> Better use GitHub actions for this (public repos only since the code might be spied at).
> Otherwise make sure that it runs under a user with limited privileges.

### Bundle with 
        cd production
        rollup -o productionBundle.js -f es -w . production.js --no-treeshake --compact

### Latest statistics
        2023-09-12 T 16:08:22 MESZ
        bundle:   3000 LOC
        jsdoc:    4600 LOC
