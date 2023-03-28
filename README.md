
# Kolibri

If you want to use Kolibri, please have a look at the  

[Home Page](https://webengineering-fhnw.github.io/Kolibri/index.html)

where you find how to "install" and use the Kolibri and how
you become owner of the code without the need for any license.

Kolibri does _not_ require node.js or npm or any of such tools.

## Notes for developers

### Sources
The src dir is under docs such that we can publish the sources directly.

### Styling
Kolibri comes with its own 
[design system (figma)](https://www.figma.com/file/8Yq9C2CFomC1Uv6qlzfGri/Kolibri-(%CE%B1)?node-id=82%3A1326&t=iNQmpiVgOXTlKYeb-1).

When changing default css or the style API, make sure to check examples, test report, and
[style overview](https://webengineering-fhnw.github.io/Kolibri/src/examples/style/styleOverview.html).

### Inspection Profile
The settings for the inspection profile are maintained in the file `JS_TypeSystem.xml`
that can be imported in IntelliJIDEA under Preferences -> Inspection Profile.

The goal is to never push code that causes any inspection findings.
Some perceived typos (unknown words) might remain that you can safely add to your local dictionary.

## Automatic Bundling
Every push to the repo automatically creates a production bundle via a 
[GitHub action](https://github.com/WebEngineering-FHNW/Kolibri/actions)
and deploys the bundle 
[here](https://raw.githubusercontent.com/WebEngineering-FHNW/Kolibri/gh-pages/productionBundle.js) 
.
