# NextJS Boilerplate

## Gettting start
---
just use `npm` or `yarn`
```
npm install
```
or
```
yarn install
```

Then use the following command to start develop.
```
npm start
```
or
```
yarn start
```
---

## What's include in the boilerplate?
- NextJS
- Redux
    - Redux-thunk
    - Redux-logger
- Import scss/css file directly into JS
- NProgress Loader

---
## Important Note
- When including `css` or `scss` into `js` file. Please noted that the imported `css` or `scss` wiil be in `String` format.

- To applied the imported styles, please use `withStyle` higher order component. which located in `/hoc` folder. But `withStyle` cannot wrapped `pageConnect`. Please either applied `withStyle` before using `pageConnect` or adding options in pageConnect.
- The agrument for `stylesheets` is an array of strings. As the example below write
    ```jsx
        [stylesheet]
    ```
- It is actually refer to array of stylesheet not just a placeholder. In case there is multiple stylesheets, the agrument will look something like this.
    ```jsx
        [stylesheet1, stylesheet2, ...]
    ```
- Please follow the following steps.

    1. Import files
    ```jsx
    import stylesheet from '<relative path>';
    ```

    2. Applied style

        2.1 Use pageConnect only (This should be used only components in `/pages` folder).

        ```jsx
        class pageComponent extends Component {
            ...
        }

        ...

        export default pageConnect(pageComponent, {
            stylesheets: [stylesheet]
        })
        ```

        2.2 Use `withStyle` with any other HOC.

        ```jsx
        class someCompoent extends Component {
            ...
        }

        ...

        export default pageConnect(autoBind(someComponent), {
            stylesheets: [stylesheet]
        })
        ```
- `pageConnect` hoc will accept 1 object as agrument. If in that object contain the folling key, it will add to `<Head>`
    - `stylesheets` is array of stylesheet that was imported.
    - `title` is string of title in that page
    - `icon` is string of source for `favicon`
    - `childrens` is array of JSX (Needed to be labeled with key already).
- `withInternalState` hoc will accept 1 object as its initial state. You can accessed its state with `this.props.state` or `props.state`, depends on the case. To update state, you will use `this.props.onSetState(<PropertyName>, <Value>)`.
- `withErrorCatch` hoc will accept 1 object as its parameters. There are 2 property that affect this hoc. `onError` callback and `onErrorJSX` to generate fallbeck jsx object.
- `wrappedComponent` hoc is the combined hoc of `withStyle`, `withInternalState`, and `withErrorCatch`. This hoc will accept 1 object as its parameters. The following parameters is consistent with the above parameters. If any one of the following peoperty is omitted, the result will be that that component will lack that certain peoperty. For example if `onError` and `fallbackJSX` is not defined. Then it will acted like `withInternalState` combined with `withErrorCatch` only.

    Noted: Please noted that `hasError` propery is reserved for internal usage. Please use another property name.

    Noted 2: If you want to forced an error to happen, you can actually set `hasError` property with `onSetState`. And if you do that, I want to ask you why? :-P

    The following is the defnined property.
    - `initialState` property for setting up its internal state.
    - `onError` property is an error callback.
    - `onErrorJSX` property is a callback to generate fallback JSX object, injected with `props` as an agrument.
    - `stylesheets` is an array of stylesheets.
- `wrappedContainer` is the same as `wrappedComponent` but also connect the component to redux store. This has the same effect as the following (Just much easier to use).

    ```jsx
    autoBind(wrappedComponent(..., ...)))
    ```

---

## Project Structure
```
    ┌── component
    ├── constraint
    │   ├── variables.js
    │   └── variables.scss
    ├── container
    │   └── style
    |       └── ...
    ├── function
    │   ├── general.js
    │   └── ...
    ├── hoc
    │   ├── style
    │   |   └── ...
    │   ├── withStyle.js
    │   ├── autoBind.js
    │   ├── pageConnect.js
    │   └── ...
    ├── next.config.js
    ├── package.json
    ├── pages
    │   └── style
    │   |   └── parallax.scss
    │   ├── _document.js
    │   ├── parallax.js
    │   └── ...
    ├── postcss.config.js
    ├── redux
    │   ├── actions
    │   │   ├── index.js
    │   │   └── ...
    │   ├── reducers
    │   │   ├── index.js
    │   │   └── ...
    │   ├── store.js
    │   └── types.js
    ├── static
    │   └── resources
    │       └── ...
    └── yarn.lock
```

Well, pretty much self-explainatory.

- `component`
    - This folder will contain all components (self-state). I encourage to use `props` as much as possible. Try not to set inner state to props in `constructor` or `componentWillReceiveProps`. I considered it anti-pattern and very counter-productive.
- `container`
    - This foler contain all `smart component` or `container`. Which will bind to the redux store.
- `function`
    - This folder contain regularly used user defined function. It is nice to have it all in one place, trust me.
- `hoc`
    - This folder conatin predefined Higher-Order-Component (HOC). There are 3 main HOC.

        1. `autoBind`
            - This HOC will bind every `action creators` and `redux store` to the component. This HOC should use with Component/Container level object only.
        2. `pageConnect`
            - This HOC will bind every `action creators` and `redux store` to the page component. This HOC should only be used with page level component only. (As it solved incompatibility of `withStyle` and `withRedux`).
        3. `withStyle`
            - This HOC will include `SCSS` or `CSS` as imported from `styledheets` agrument (Must be an `Array` of `stylesheet`) 
            to header of the page.
- `pages`
    - This folder `is` required by `NextJS`. So I'm not going to talk about it.
- `redux`
    - This folder contain all relevant file structure for redux. There are 2 files, and 2 sub folders.
        - `actions`
            - This folder contain at least 1 file. `index.js` file.
                - `index.js`
                    - This file merge all actions in the folder to the same object for the ease in implementing HOC above.
        - `reducers`
            - This folder contain at least 1 file. `index.js` file.
                - `index.js`
                    - This file merge all redux store in the folder to the same object.
        - `store.js`
            - This file defined store and middlewares that applied to it.
        - `types.js`
            - This file defined types for all actions in action creators.
- `static`
    - This folder contain all resouces. Such as external CSS libraries, Javascript libraries, or Images.
    - As of `NextJS` document goes, this should be accessed within custom `<Document>` section as linked [here](https://github.com/zeit/next.js/#custom-document).
- `Other files`
    - I have preconfig them already. By intensive googling of course. So please don't change the code. Or else you will be having a bad time.

---

Good Luck! 

