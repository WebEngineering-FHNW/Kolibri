import {TestSuite} from '../kolibri/util/test.js';
import {PageController} from './pageController.js';
import {
    DESCRIPTION,
    ICONPATH,
    NAVIGATIONAL,
    VALUE,
    VISIBLE,
    ACTIVE,
    VISITED,
    PARENT,
    HASH
} from "../kolibri/presentationModel.js";

const pageSuite = TestSuite('pageController');

pageSuite.add('getDynamicContentControllers', assert => {
    const controller1 = {};
    const controller2 = {};
    const dummyControllers = [controller1, controller2];

    const homePageController = PageController('home', dummyControllers);

    assert.is(homePageController.getDynamicContentControllers(), dummyControllers);
    assert.is(homePageController.getDynamicContentControllers()[0], dummyControllers[0]);
    assert.is(homePageController.getDynamicContentControllers()[1], dummyControllers[1]);
});

pageSuite.add('initializeSuccess', assert => {
    const homePageController = PageController('home', null);

    assert.is(homePageController.getHash(), '#home');
});

pageSuite.add('initializePageFail', assert => {
    const [q1, q2, q3] = ['', 'test page', '1page'];
    let e1, e2, e3 = '';


    try {
        const pageController = PageController(q1, null);
    } catch (e) {
        e1 = e.message;
    }
    try {
        const pageController = PageController(q2, null);
    } catch (e) {
        e2 = e.message;
    }
    try {
        const pageController = PageController(q3, null);
    } catch (e) {
        e3 = e.message;
    }

    assert.is(e1, 'Qualifiers cannot be empty.');
    assert.is(e2, 'Qualifiers cannot contain spaces or new lines. Consider replacing them with "-" or "_" characters. Try: ' + q2.replace(/[\s\n]+/g, "-"));
    assert.is(e3, 'Qualifiers cannot start with a number. Please remove the number at the start of qualifier: ' + q3);

});

pageSuite.add('getValue', assert => {
    const homePageController = PageController('home', null);

    assert.is(homePageController.getValue(), 'home');

    homePageController.setValue('HOME');

    assert.is(homePageController.getValue(), 'HOME');
});

pageSuite.add('getParent', assert => {
    const homePageController = PageController('home', null);

    assert.is(homePageController.getParent(), null);

    const parentHomePageController = PageController('parentHome', null);
    homePageController.setParent(parentHomePageController);

    assert.is(homePageController.getParent(), parentHomePageController);
});

pageSuite.add('setParentFail', assert => {
    const homePageController = PageController('home', null);
    const parentPageController = PageController('parent', null);

    homePageController.setParent(parentPageController);
    assert.is(homePageController.getParent(), parentPageController);

    // not allowed because parent cannot be the node itself
    homePageController.setParent(homePageController);
    assert.is(homePageController.getParent(), parentPageController);


    // not allowed because it is a circular reference
    parentPageController.setParent(homePageController);
    assert.is(parentPageController.getParent(), null);


});

pageSuite.add('isVisible', assert => {
    const homePageController = PageController('home', null);

    assert.isTrue(homePageController.isVisible());

    homePageController.setVisible(false);

    assert.isTrue(!homePageController.isVisible());
});

pageSuite.add('isNavigational', assert => {
    const homePageController = PageController('home', null);

    assert.isTrue(homePageController.isNavigational());

    homePageController.setNavigational(false);

    assert.isTrue(!homePageController.isNavigational());
});

pageSuite.add('onIconPathChanged', assert => {
    const homePageController = PageController('home', null);
    let changedIcon;

    homePageController.onIconPathChanged(icon => changedIcon = icon);

    assert.is(changedIcon, '../navigation/icons/placeholder.svg');

    homePageController.setIconPath('../navigation/icons/house.svg');

    assert.is(changedIcon, '../navigation/icons/house.svg');
});

pageSuite.add('onActiveChanged', assert => {
    const homePageController = PageController('home', null);
    let isActive;

    homePageController.onActiveChanged(state => isActive = state);

    homePageController.activate();

    assert.isTrue(isActive);

    homePageController.passivate();

    assert.isTrue(!isActive);
});

pageSuite.add('onVisitedChanged', assert => {
    const homePageController = PageController('home', null);
    let visited;

    homePageController.onVisitedChanged(state => visited = state);

    assert.isTrue(!visited);

    homePageController.setVisited(true);

    assert.isTrue(visited);
});

pageSuite.add('onValueChanged', assert => {
    const homePageController = PageController('home', null);
    let value;

    homePageController.onValueChanged(newValue => value = newValue);

    assert.is(homePageController.getValue(), value);

    homePageController.setValue('about');

    assert.is(homePageController.getValue(), value);
});

pageSuite.add('onNavigationalChanged', assert => {
    const homePageController = PageController('home', null);
    let isNavigational;

    homePageController.onNavigationalChanged(state => isNavigational = state);

    assert.isTrue(isNavigational);

    homePageController.setNavigational(false);

    assert.isTrue(!isNavigational);
});

pageSuite.add('onVisibleChanged', assert => {
    const homePageController = PageController('home', null);
    let isVisible;

    homePageController.onVisibleChanged(state => isVisible = state);

    assert.isTrue(isVisible);

    homePageController.setVisible(false);

    assert.isTrue(!isVisible);
});

pageSuite.add('onParentChanged', assert => {
    const homePageController = PageController('home', null);
    let parent;

    homePageController.onParentChanged(newParent => parent = newParent);

    assert.is(homePageController.getParent(), null);

    const parentHomePageController = PageController('parentHome', null);
    homePageController.setParent(parentHomePageController);

    assert.is(homePageController.getParent(), parent);
});

pageSuite.add('setConfigurationSuccess', assert => {
    const pageController = PageController('page', null);

    const configurationSuccessful = pageController.setConfiguration(/** @type ModelConfigurationObject*/{
        [VALUE]:        "TestName",
        [DESCRIPTION]:  "Description",
        [ICONPATH]:     "./icon/kolibri.png",
        [ACTIVE]:       true,
        [VISITED]:      true,
        [VISIBLE]:      false,
        [NAVIGATIONAL]: false,
    });

    assert.is(configurationSuccessful, true);
    assert.is(pageController.getQualifier(), "page");
    assert.is(pageController.getValue(), "TestName");
    assert.is(pageController.getDescription(), "Description");
    assert.is(pageController.getIconPath(), "./icon/kolibri.png");
    assert.is(pageController.isActive(), true);
    assert.is(pageController.getVisited(), true);
    assert.is(pageController.isVisible(), false);
    assert.is(pageController.isNavigational(), false);
});

pageSuite.add('setConfigurationFail', assert => {
    const pageController = PageController('page', null);
    const parentController = PageController('parentPage', null);

    const configurationHashFail = pageController.setConfiguration(/** @type ModelConfigurationObject*/{
        [HASH]: '#newHash',
    });

    const configurationParentFail = pageController.setConfiguration(/** @type ModelConfigurationObject*/{
        [PARENT]: parentController,
    });

    assert.is(configurationHashFail, false);
    assert.is(configurationParentFail, false);
});


pageSuite.run();
