import { NavigationController }                            from '../../../../docs/src/kolibri/navigation/navigationController.js';
import { CardNavigationProjector }                         from '../../../../docs/src/kolibri/navigation/projector/card/cardNavigationProjector.js';
// import { SideNavigationProjector }                       from "../../../../docs/src/kolibri/navigation/projector/dashboard-refined/dashboardRefinedNavigationProjector.js";
import { FlowerNavigationProjector }                       from "../../../../docs/src/kolibri/navigation/projector/flower/flowerNavigationProjector.js";
import { BubbleStateNavigationProjector }                  from "../../../../docs/src/kolibri/navigation/projector/bubble/bubbleNavigationProjector.js";
import { BreadCrumbProjector }                             from "../../../../docs/src/kolibri/navigation/projector/breadcrumb/breadCrumbProjector.js";
// import { PageSwitchProjector }                             from '../../../../docs/src/kolibri/navigation/projector/page-switch/pageSwitchProjector.js';
import { PageController }                                  from '../pages/pageController.js';
import { ForbiddenPageProjector }                          from '../pages/error-pages/403/forbiddenPageProjector.js';
import { PageNotFoundProjector }                           from '../pages/error-pages/404/pageNotFoundProjector.js';
import { StaticPageProjector }                             from '../pages/StaticPageProjector.js';
import { DebugPageProjector }                              from '../pages/debug/debugPageProjector.js';
import { StyleGuidePageProjector }                         from '../pages/style-guide/styleGuidePageProjector.js';
import { SimpleFormController }                            from "../../../../docs/src/kolibri/projector/simpleForm/simpleFormController.js";
import { SimpleFormPageProjector }                         from "../pages/simpleform/simpleFormPageProjector.js";
import { TestCasesPageProjector }                          from "../pages/test-cases/testCasesPageProjector.js";
import { DayController }                                   from "../pages/workday/dayController.js";
import { WorkDayPageProjector }                            from "../pages/workday/workDayPageProjector.js";
import { WeekController }                                  from "../pages/workweek/workweek/weekController.js";
import { WorkWeekPageProjector }                           from "../pages/workweek/workWeekPageProjector.js";
import { Person, personSelectionMold }                     from "../pages/person/person.js";
import { PersonListController, PersonSelectionController}  from "../pages/person/personController.js";
import { PersonPageProjector }                             from "../pages/person/personPageProjector.js";
import {
    DEBUGMODE, DESCRIPTION,
    FAVICON,
    HOMEPAGE,
    ICONPATH,
    LOGO,
    NAME, NAVIGATIONAL, VALUE,
    VISIBLE
} from '../../../../docs/src/kolibri/presentationModel.js';
import {
    CHECKBOX,
    COLOR,
    DATE,
    NUMBER,
    TEXT,
    TIME
} from "../../../../docs/src/kolibri/util/dom.js";
import {PageSwitchProjector} from "../../../../docs/src/kolibri/navigation/projector/pageSwitch/pageSwitchProjector.js";
import {
    SideNavigationProjector
}                            from "../../../../docs/src/kolibri/navigation/projector/sideNavigation/sideNavigationProjector.js";

/* ********************************************* PIN TO ELEMENTS ************************************************************ */
const pinToCardNavElement          = document.getElementById('card-nav');
const pinToFlowerNavElement        = document.getElementById('flower-nav');
const pinToBubbleStateNavElement   = document.getElementById('bubble-state-nav');
const pinToDashboardNavElement     = document.getElementById('dashboard-nav');
const pinToBreadCrumbsElement      = document.getElementById('bread-crumbs-nav');
const pinToContentElement          = document.getElementById('content');
const pinToDebugElement            = document.getElementById('debug');

/* ********************************************* UTILITY PAGE CONTROLLERS *************************************************** */

const errorForbiddenController = PageController('E403', null);
errorForbiddenController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false
});

const errorNotFoundController = PageController('E404', null);
errorNotFoundController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false
});

const debugController = PageController('debug', null);
debugController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false,
    [ICONPATH]: '../navigation/icons/bug.svg'
});

/* ********************************************* PAGE CONTROLLERS ************************************************************ */
const homePageController = PageController('home', null);
homePageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/home.svg"
});

const docsPageController = PageController('docs', null);
docsPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [NAVIGATIONAL]: false,
    [ICONPATH]: "../navigation/icons/docs.svg"
});

const gettingStartedController = PageController('getting-started', null);
gettingStartedController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/start.svg",
    [VALUE]: "Getting Started",
    [DESCRIPTION]: `Kolibri is a lightweight web UI toolkit without any dependencies. You can easily copy and integrate it into your own project.
    It includes documentation, examples, and a testing facility.
    Start building your SPA with Kolibri now!`
});

const styleGuideController = PageController('style-guide', null);
styleGuideController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/palette.svg",
    [VALUE]: "Style Guide",
    [DESCRIPTION]: `The style guide is the go-to resource for everything related to styling Kolibri.`
});

const testCasesController = PageController('test-cases', null);
testCasesController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/test.svg",
    [VALUE]: "Test Cases",
    [DESCRIPTION]: `Have a look at the live test case report.`
});

const examplePageController = PageController('examples', null);
examplePageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [NAVIGATIONAL]: false,
    [ICONPATH]: "../navigation/icons/example.svg"
});

const teamPageController = PageController('team', null);
teamPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/team.svg"
});

const formStructure = [
    {value: "Text",       label: "Text",   name: "text",   type: TEXT     },
    {value: 0,            label: "Number", name: "number", type: NUMBER   },
    {value: "1968-04-19", label: "Date",   name: "date",   type: DATE     },
    {value: 12 * 60 + 15, label: "Time",   name: "time",   type: TIME     },
    {value: false,        label: "Check",  name: "check",  type: CHECKBOX },
    {value: "",           label: "Color",  name: "color",  type: COLOR    }
];
const simpleFormPageController = PageController('simpleform', [SimpleFormController(formStructure)]);
simpleFormPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/forms.svg",
    [VALUE]: "Simple Form",
    [DESCRIPTION]: `With Kolibri, you can easily create model-view-controller forms using the projector pattern with just one line of code. 
    This simple form makes it easy to get started. 
    With this example you will learn, how bindings work in Kolibri and why they are useful.
    Give it a try!`
});

const workDayPageController = PageController('workday', [DayController()]);
workDayPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/day.svg",
    [VALUE]: "Work Day",
    [DESCRIPTION]: `The Work Day example shows you how you can easily add business rules to your form.`
});

const workWeekPageController = PageController('workweek', [WeekController()]);
workWeekPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/calendar.svg",
    [VALUE]: "Work Week",
    [DESCRIPTION]: `The work week brings everything together through composition of components.`
});

const personListController      = PersonListController(Person);
const personSelectionController = PersonSelectionController(personSelectionMold);
const personPageController = PageController("masterdetail", [personListController, personSelectionController]);
personPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "../navigation/icons/masterdetail.svg",
    [VALUE]: "Master Detail View",
    [DESCRIPTION]: `This master detail view example shows, how easy multi-way editing and consistent updates throughout the application are. 
    All entries are immediately synchronized, whether you edit in the master or detail view. 
    You can build complex UIs without ever installing a dependency.`
});

/* ********************************************* NAVIGATION CONTROLLER  ************************************************************ */

const navigationController = NavigationController();
navigationController.setConfiguration(/** @type ModelConfigurationObject */{
    [NAME]: 'Kolibri',
    [LOGO]: '../img/logo/logo-new-128.svg',
    [FAVICON]: '../img/logo/logo-new-128.svg',
    [DEBUGMODE]: true,
    [HOMEPAGE]: homePageController
});

/* ********************************************* UTILITY PAGE PROJECTORS  ************************************************************ */

ForbiddenPageProjector(errorForbiddenController, pinToContentElement, '../pages/error-pages/403/forbidden.html');
PageNotFoundProjector (errorNotFoundController, pinToContentElement, '../pages/error-pages/404/pageNotFound.html');
DebugPageProjector    (navigationController, debugController, pinToDebugElement);

/* ********************************************* PAGE PROJECTORS  ******************************************************************** */
StaticPageProjector    (homePageController, pinToContentElement, '../pages/home/home.html');
StaticPageProjector    (gettingStartedController, pinToContentElement, '../pages/getting-started/getting-started.html');
StyleGuidePageProjector(styleGuideController, pinToContentElement, '../pages/style-guide/style-guide.html');
TestCasesPageProjector (testCasesController, pinToContentElement, '../pages/test-cases/test-cases.html');
StaticPageProjector    (teamPageController, pinToContentElement, '../pages/team/team.html');

const simpleFormPageSwitchProjector = PageSwitchProjector(simpleFormPageController.getHash(), navigationController, 'b8b91e5db694d34644fea5c013ac9f75');
SimpleFormPageProjector(simpleFormPageController, pinToContentElement, '../pages/simpleform/simpleForm.html', simpleFormPageSwitchProjector);

const workDaySwitchProjector = PageSwitchProjector(workDayPageController.getHash(), navigationController, '0aab51fd5a5a4d77bd15d3d6050555c2');
WorkDayPageProjector(workDayPageController, pinToContentElement, '../pages/workday/workday.html', workDaySwitchProjector);

const workWeekSwitchProjector = PageSwitchProjector(workWeekPageController.getHash(), navigationController, '20f45f893355e993f826446ffd73845e');
WorkWeekPageProjector(workWeekPageController, pinToContentElement, '../pages/workweek/workweek.html', workWeekSwitchProjector);

const personSwitchProjector = PageSwitchProjector(personPageController.getHash(), navigationController, 'ee23d660b99cb062170d2a495d7698dd');
PersonPageProjector(personPageController, pinToContentElement, '../pages/person/person.html', personSwitchProjector);

/* ********************************************* NAVIGATION PROJECTORS  ******************************************************************** */

const cardNavigationProjector = CardNavigationProjector(navigationController, pinToCardNavElement);
const cardGridProjector = cardNavigationProjector.getGridProjector();
cardGridProjector.setGridForPage(styleGuideController.getQualifier(), { rowSpan: 1});
cardGridProjector.setGridForPage(testCasesController.getQualifier(), { rowSpan: 1});
cardGridProjector.setGridForPage(workDayPageController.getQualifier(), { rowSpan: 1});
cardGridProjector.setGridForPage(workWeekPageController.getQualifier(), { rowSpan: 1});

FlowerNavigationProjector(navigationController, pinToFlowerNavElement);
BubbleStateNavigationProjector(navigationController, pinToBubbleStateNavElement);
SideNavigationProjector(navigationController, pinToDashboardNavElement);
BreadCrumbProjector(navigationController, pinToBreadCrumbsElement);
/* ********************************************* CONSTRUCTION THE PAGE  ************************************************************ */

navigationController.addPageControllers(
    errorForbiddenController,
    errorNotFoundController,
    debugController,
    homePageController,
    docsPageController,
    gettingStartedController,
    styleGuideController,
    testCasesController,
    examplePageController,
    simpleFormPageController,
    workDayPageController,
    workWeekPageController,
    personPageController,
    teamPageController
);

/* ********************************************* Add parents  ************************************************************ */

gettingStartedController.setParent(docsPageController);
styleGuideController.setParent(docsPageController);
testCasesController.setParent(docsPageController);
simpleFormPageController.setParent(examplePageController);
workDayPageController.setParent(examplePageController);
workWeekPageController.setParent(examplePageController);
personPageController.setParent(examplePageController);


