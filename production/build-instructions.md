# Build instructions

"Building" is not strictly needed. One can use the Kolibri directly "as is" through the ES module system.

Anyway, sometimes it is nice to have a bundled and/or minified version for distribution or statistical purposes.

Make sure that production.js imports all modules that should be part of the distribution.
Consider using
        find $PWD -name '*.js' | grep -v Test.js

> **Warning**
> The code below will execute arbitrary and possibly harmful code. 
> Better use GitHub actions for this (public repos only since the code might be spied at).
> Otherwise make sure that it runs under a user with limited privileges and inside a container to contain side effects.

### Bundle with 
        cd production
        rollup -o productionBundle.js -f es -w . production.js --no-treeshake --compact

### Latest statistics
        2026-02-15
        bundle:   3000 LOC
        jsdoc:    3000 LOC
        test/ex:  5000 LOC 

raw incl. docs: 225 kB

### For a new distro bundle
- push to GitHub and let the gh action create the productionBundle in the gh-pages branch
- checkout gh-pages and copy productionBundle.js to new distro like kolibri-yyyy-MM-dd.js
- checkout main
- adapt and test TryProduction.html
- push
