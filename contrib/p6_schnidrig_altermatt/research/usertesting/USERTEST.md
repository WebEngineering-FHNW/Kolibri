# Enhanced Navigation Support for the Kolibri Web UI Toolkit

## First, what is Kolibri?
Kolibri is a toolkit to build single-page-applications from scratch without using big, bloated frameworks with all their dependencies. The codebase is written in vanilla Javascript. It allows users to copy code snippets and insert them into an existing project without using a dependency management system such as Node Package Manager (npm). 

## The project goal
The navigation fits into the context of Kolibri and follow the Model View Controller approach. The abstraction of the navigation data takes place in the presentation model. Projectors take care of displaying the data in the view. The goal of this project is a model-driven navigation that can be embedded in the context of Kolibri and validated with the user groups using various prototypes. 

Most webdevs are familiar with the React or Angular router. As a mental model you can compare the Kolibri navigation to these routers.

## Team
• [Prof. Dierk König, Project Coach & Expert](mailto:dierk.koenig@fhnw.ch)<br>
• [Fabian Affolter, Project Coach & Expert](mailto:fabian.affolter@fhnw.ch)<br>
• [Cedric Altermatt, Student Computer Science](mailto:cedric.altermatt1@students.fhnw.ch)<br>
• [Florian Schnidrig, Student iCompetence](mailto:florian.schnidrig@students.fhnw.ch)<br>

## Prerequisites
* Pull the following branch from github: @TODO add branch
(This step can be ignored if you're reading this in your IDE)
* You need Chrome, Edge or Firefox

## Usage
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

## Navigation
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

## Add the page to the navigation
   Now the last step is to add your `PageController` to your `NavigationController`. You have to add an Array even if it is only one page you want to add at a time.
   ```Javascript
   navigationController.addPageControllers([yourPageController]);
   ```

<b>Don't worry if you are confused by now, we will go through the whole process in depth step by step in the testing scenario afterwards.</b>

