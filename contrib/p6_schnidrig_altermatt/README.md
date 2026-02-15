Content copied over from GitHub repository:
git@github.com:CeeDiii/ip6-navigation-kolibri.git

# IP6: Research Projector for Advanced Navigation Support Kolibri
Bachelor Thesis project - University of Applied Sciences Northwestern Switzerland<br>
Fall semester 2022, 19.09.2022 – 24.03.2023<br>

The research paper can be found here: [https://navigation-for-kolibri.gitbook.io/advanced-kolibri-navigation/](https://navigation-for-kolibri.gitbook.io/advanced-kolibri-navigation/)

## Project experts/customers
• Prof. Dierk König<br>
• Fabian Affolter<br>

## Project team
• Florian Schnidrig, Student iCompetence<br>
• Cedric Altermatt, Student Computer Science<br>

## Project Idea
In the course of the predecessor project "Navigation support for Kolibri", a first prototype for a navigation approach for the Kolibri WebUI Toolkit  was created. This prototype enabled the creation of flat navigations for single-page-applications, which were created with Kolibri.

This IP6 project "Extended navigation support for Kolibri" is now based on this approach. The prototype will primarily be expanded in such a way that the navigation support is model-driven and supports multi-depth navigation hierarchies. Furthermore, new statuses and properties of the individual navigation nodes will be stored as attributes in the page model. For example, the visibility of a navigation node in the navigation, the child nodes of a navigation node, the active status of a navigation node, the icon of a navigation node and much more will represent attributes in the model. These attributes should also be easily extensible, so that the developer can easily add use-case-specific attributes.

## Project Goal
The goal of this project is a model-driven navigation that can be embedded in the context of Kolibri and validated with the user groups using various prototypes.

New approaches get tested with simple examples so that they can be easily verified whether they fit into the context of the project and provide the desired functionalities.

Implementation and management should be accessible and well documented for developers. Users will find a rich and interactive visualization of the navigation in Kolibri single page applications. The approaches pursued are provided with unit tests and validated with user tests.

The Kolibri navigation support will also be integrated into the official [Kolibri project website](https://webengineering-fhnw.github.io/Kolibri/index.html). The currently static site navigation will be replaced by the Kolibri navigation. The result of this project will be a functional prototype that allows to switch back and forth between the UI and the code in the individual example implementations, based on the functionality of the [JFX Ensemble](https://www.jfx-ensemble.com) showcase library. The implementation should adhere to the Kolibri design guidelines.

## Project Methodology
The procedure in this research project is iterative and incremental. The findings of an iteration serve as a basis for the further procedure. Solution approaches that meet the requirements are refined and implemented. Prototypes are validated with user groups. Automated tests are provided for quality assurance.

## Acknowledgment
We would like to express our sincere thanks to our lecturers, project clients and experts Prof. Dierk Koenig and Fabian Affolter. Without their regular feedback and exciting suggestions, this project would not have come about to the same extent and especially not in the same quality. Many thanks!

## Usage
The following block contains some theory on how to create a navigation with Kolibri. We have prepared a small tutorial where you can build your first Kolibri SPA based on the information below under `prototype/getting-startet-tutorial/app.js`
### Page
To create a page which can be used within the Kolibri navigation you will need to follow the following steps:
1. Create a `PageController` (The `PageModel` is created by the controller behind the scenes)
   ```Javascript
   /**
   * Constructor for a PageControllerType.
   *
   * @template T
   * @constructor
   * @param { !String } pageName - a name for page. the display name can be changed later, however the initial pageName must be unique as it will be set as the unchangeable hash that identifies the page. Mandatory
   * @param { [T] } contentControllers - the controllers that produce the dynamic content of this page.
   * @returns  PageControllerType
   * @example
   * const homePageController = PageController('home', null);
   * homePageController.setIconPath('./navigation/icons/house.svg');
   * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
   */
   ```
   ```Javascript
   const yourPageController = PageController("YourPageName", null);
   ```
   Do not worry about the second parameter of the `PageController` for now. This parameter is to pass additional `ContentControllers` that generate dynamic content but this is more advanced and is not part of this test scenario.


2. Call the `PageProjector` with your previously created `PageController`, a `pinToContentElement` and the path to your static HTML file. We will provide a `PageProjector` for you in this test scenario.
   ```Javascript
   /**
   * A constructor for a PageProjectorType.
   *
   * @constructor
   * @param { !PageControllerType } pageController - the pageController that controls the PageModelType we want to observe. Mandatory.
   * @param { !HTMLDivElement } pinToElement - the element in the DOM that we want to bind to append the pageContent. Mandatory.
   * @param { String } contentFilePath - the path to the static html content relative to index.html! Can be null.
   * @returns { PageProjectorType }
   * @example
   * const homePageController = PageController("home", null);
   * homePageController.setIconPath('./navigation/icons/house.svg');
   * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
   */
   ```
   ```Javascript
   YourPageProjector(yourPageController, pinToContentElement, './pages/yourPage/yourPage.html');
   ```
   The `pinToContentElement` can be found in the index.html and is a container which holds the currently displayed page.

### Navigation
1. Create a `NavigationController` to which you later will append your page.
   ```Javascript
   /**
   * Constructor for a NavigationControllerType
   * @return  { NavigationControllerType }
   * @constructor
   * @example
   * const navigationController = NavigationController();
   * navigationController.setWebsiteName('Kolibri');
   * navigationController.setWebsiteLogo('./img/logo/logo-new-128.svg');
   */
   ```
   ```Javascript
   const navigationController = NavigationController();
   ```

2. Call the `NavigationProjector` with your previously created `NavigationController` and a `pinToNavElement`.
   ```Javascript
   /**
   * @constructor
   * @param { !NavigationControllerType } controller
   * @param { !HTMLDivElement } pinToElement
   * @return { NavigationProjectorType }
   * @example
   * const navigationController = NavigationController();
   * DashboardNavigationProjector(navigationController, pinToNavElement);
   */
   ```
   ```Javascript
   NavigationProjector(navigationController, pinToNavElement);
   ```
   The `pinToNavElement` can be found in the index.html and is a container which holds the navigation of the application.

### Add the page to the navigation
Now the last step is to add your `PageController` to your `NavigationController`. You have to add an Array even if it is only one page you want to add at a time.
   ```Javascript
   navigationController.addPageController(yourPageController);
   ```

<b>Don't worry if you are confused by now, we will go through the whole process in depth step by step in the `getting-started-tutorial` mentioned above</b>

### Remove the presentation stylesheet
If you want to use a single navigation projector for your project, remove the following stylesheet from `index.html`:
 
```html
<link rel="stylesheet" href="./navigation/prototypePresentation.css">
```


It is currently only used to combine all projectors onto one page for prototyping purposes.
