import {TestSuite} from '../kolibri/util/test.js';
import {PageController} from '../pages/pageController.js';
import {NavigationController} from './navigationController.js';
import {DEBUGMODE, FAVICON, HOMEPAGE, LOGO, NAME} from "../kolibri/presentationModel.js";

const navigationSuite = TestSuite('navigationController');

navigationSuite.add('addPageController', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();

    navigationController.addPageControllers(homePageController);

    assert.is(navigationController.getPageController('#home'), homePageController);
});

navigationSuite.add('deletePageController', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();

    navigationController.addPageControllers(homePageController);

    assert.is(navigationController.getPageController('#home'), homePageController);

    navigationController.deletePageController('#home');

    assert.is(navigationController.getPageController('#home'), undefined);
});

navigationSuite.add('setHomepage', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();

    navigationController.addPageControllers(homePageController);

    assert.is(navigationController.getHomePage(), null);

    navigationController.setHomePage(homePageController);

    assert.is(navigationController.getHomePage().getHash(), '#home');
});

navigationSuite.add('onNavigationHashAddAndDel', assert => {
    const homePageController = PageController('home', null);
    const navigationController = NavigationController();
    let newHash;
    let isDeleted = false;

    navigationController.onNavigationHashAdd(hash => newHash = hash);
    navigationController.onNavigationHashDel(() => isDeleted = true);

    navigationController.addPageControllers(homePageController);

    assert.is(newHash, '#home');

    navigationController.deletePageController(homePageController.getHash());

    assert.isTrue(isDeleted);
});

navigationSuite.add('onWebsiteNameChanged', assert => {
    const navigationController = NavigationController();
    let name;

    navigationController.onWebsiteNameChanged(newName => name = newName);

    navigationController.setWebsiteName('Kolibri');

    assert.is(name, 'Kolibri');
});

navigationSuite.add('onWebsiteLogoChanged', assert => {
    const navigationController = NavigationController();
    let logoPath;

    navigationController.onWebsiteLogoChanged(newPath => logoPath = newPath);

    navigationController.setWebsiteLogo('./logo/kolibri.png');

    assert.is(logoPath, './logo/kolibri.png');
});

navigationSuite.add('onFavIconChanged', assert => {
    const navigationController = NavigationController();
    let logoPath;

    navigationController.onFavIconChanged(newPath => logoPath = newPath);

    navigationController.setFavIcon('./favicon/kolibri.png');

    assert.is(logoPath, './favicon/kolibri.png');
});

navigationSuite.add('setConfiguration', assert => {
    const navigationController = NavigationController();
    const homePageController = PageController('home', null);

    const configurationSuccessful = navigationController.setConfiguration(/** @type ModelConfigurationObject*/{
        [NAME]:      "TestName",
        [LOGO]:      "./logo/kolibri.png",
        [FAVICON]:   "./favicon/kolibri.png",
        [HOMEPAGE]:  homePageController,
        [DEBUGMODE]: true,
    });

    assert.is(configurationSuccessful, true);
    assert.is(navigationController.getWebsiteName(), "TestName");
    assert.is(navigationController.getWebsiteLogo(), "./logo/kolibri.png");
    assert.is(navigationController.getFavIcon(), "./favicon/kolibri.png");
    assert.is(navigationController.getHomePage(), homePageController);
    assert.is(navigationController.isDebugMode(), true);
});

navigationSuite.run();
