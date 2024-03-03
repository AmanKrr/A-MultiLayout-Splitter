# a-multilayout-splitter

`a-multilayout-splitter` is a versatile React component designed for creating dynamic, resizable layouts with collapsible panes. It supports both horizontal and vertical orientations, allowing for a flexible arrangement of UI components. With features like minimum and maximum size validation, custom handlebars, and programmable collapse and expand functionalities, it's the perfect tool for developing responsive and interactive layouts.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Orientation](#orientation)
  - [Collapsible Panes](#collapsible-panes)
  - [Initial State and Sizes](#initial-state-and-sizes)
  - [Pixel and Percentage Support](#pixel-and-percentage-support)
    - [Sizes in Pixel](#sizes-in-pixel)
    - [Sizes in Percentage](#sizes-in-percentage)
    - [Sizes in Pixel and Percentage both](#sizes-in-pixel-and-percentage-both)
  - [Programmatic Collapse and Expand](#programmatic-collapse-and-expand)
  - [Min and Max Sizes](#min-and-max-sizes)
  - [Disabling Resize](#disabling-resize)
  - [Custom Handlebar](#custom-handlebar)
  - [Nested Layout](#nested-layout)
- [Features](#features)
- [License](#license)
- [Limitations](#limitations)

## Installation

To install the package, run the following command in your project directory:

```bash
npm install a-multilayout-splitter
```

or if you use yarn:

```bash
yarn add a-multilayout-splitter
```

## Usage

### Note:

Please note that the documentation for this project is currently a work in progress and needs updates. Kindly follow the instructions provided below in the README for usage and guidance.

### Basic Example

To add a splitter to your application, use the `<Split>` component with child elements representing the components you want to split. By default, the splitter will occupy 100% of the height and width of its parent container.

<a href="https://codesandbox.io/p/sandbox/react-splitter-multilayout-pjfxss?file=%2Fsrc%2FApp.tsx%3A1%2C1-24%2C1">CodeSanbox Example</a>

### Note:

The `id` prop is crucial as it helps you easily identify the instance of each split. You can refer to the [Programmatic Collapse and Expand](#programmatic-collapse-and-expand) section for more information.

```jsx
import { Split } from "a-multilayout-splitter";

<Split mode="horizontal" id="split1">
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>
```

### Orientation

Control the orientation of the panes by setting the `mode` property to either `'horizontal'` or `'vertical'`.

```jsx
import { Split } from "a-multilayout-splitter";

<Split mode="vertical" id="split1">
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>;
```

### Collapsible Panes

Enable or disable the collapsible functionality using the `lineBar` property.

- By default, collapsible behavior is enabled.
- To disable, set `lineBar` without any value or with specific handlebar positions.

```jsx
import { Split } from "a-multilayout-splitter";

<Split id='split1' mode='horizontal' lineBar>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>

<Split id='split1' mode='horizontal' lineBar={[1, 3]}>
  <div>Pane 1</div>
  <div>Pane 2</div>
  <div>Pane 3</div>
  <div>Pane 4</div>
</Split>
```

### Initial State and Sizes

Define initial sizes and collapsed state for panes to enhance user experience.

```jsx
import { Split } from "a-multilayout-splitter";

<Split id="split1" mode="horizontal" initialSizes={["200px", "200px", "200px"]} collapsed={[true, false, true]} width="600px" height="100px">
  <div>Pane 1</div>
  <div>Pane 2</div>
  <div>Pane 3</div>
</Split>;
```

### Pixel and percentage support

You can also define the sizes for splitter pane using initialSizes property. It accepts an array of string. Splitter pane sizes supports pixel and percentage. You can provide combination of pixel and percentage also.

#### Sizes in pixel

```jsx
import { Split } from "a-multilayout-splitter";

<Split mode="horizontal" width="200px" height="100px" initialSizes={["100px", "100px"]}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>;
```

#### Sizes in percentage

```jsx
import { Split } from "a-multilayout-splitter";

<Split mode="horizontal" width="200px" height="100px" initialSizes={["50%", "50%"]}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>;
```

#### Sizes in pixel and percentage both

```jsx
<Split mode="horizontal" width="200px" height="100px" initialSizes={["100%", "50%"]}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>
```

### Programmatic Collapse and Expand

Use `SplitUtils` to programmatically control the panes.

### Note:

For collapsing and expanding split panes, it's necessary to provide the instance. Each split instance is stored under the given split ID, allowing you to easily use that ID and pass the instance when needed. To retrieve all splitter instances, you can utilize `SplitUtils.getSplitInstance()` by providing the key (i.e., the ID) of the specific splitter on which you want to expand or collapse. This approach ensures precise control over the behavior of split panes.

```jsx
import { Split, SplitUtils } from "a-multilayout-splitter";

<Split mode='horizontal' id='split1'>
  <div>Pane 1</div>
  <div>Pane 2</div>
  <div>Pane 3</div>
  <div>Pane 4</div>
</Split>
<button onClick={() => SplitUtils.closeSplitter(SplitUtils.getSplitInstance()['split1'], 2,"horizontal")}>Collapse</button>
<button onClick={() => SplitUtils.openSplitter(SplitUtils.getSplitInstance()['split1'], 2, "horizontal")}>Expand</button>
```

### Min and Max Sizes

Restrict pane sizes with minimum and maximum values.

```jsx
import { Split } from "a-multilayout-splitter";

<Split id="split1" mode="horizontal" minSizes={[20, 20]} maxSizes={[80, 80]}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>;
```

### Disabling Resize

Disable resizing entirely or for specific handlebars.

```jsx
import { Split } from "a-multilayout-splitter";

<Split id="split1" mode="horizontal" disable>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>;
```

```jsx
import { Split } from "a-multilayout-splitter";

<Split id="split1" mode="horizontal" disable={[1, 2]}>
  <div>Pane 1</div>
  <div>Pane 2</div>
  <div>Pane 3</div>
  <div>Pane 4</div>
</Split>;
```

### Custom Handlebar

Implement custom handlebars with the `renderBar` property. Currently, custom handlebars do not support the 'disable' and 'lineBar' properties.

```jsx
import { Split } from "a-multilayout-splitter";

<Split id='split1' mode="horizontal" renderBar={() => /* Custom render function */}>
  <div>Pane 1</div>
  <div>Pane 2</div>
</Split>
```

### Nested Layout

When dealing with deeply nested layouts, you may encounter resizing issues where the layout does not expand or grow as expected. To address this issue, the fixClass property and SplitUtils.fixClass() method are provided as solutions. By applying the fixClass property to the appropriate splitter, you can dynamically adjust the layout to ensure proper resizing behavior.

```jsx
import { Split } from "a-multilayout-splitter";

<div className="App" style={{ width: "100%", height: "500px" }}>
  <Split mode="vertical" id="splitter1">
    <Split mode="horizontal" id="splitter2" collapsed={[false, false]}>
      <div>Pane 1</div>
      <Split mode="vertical" id="splitter3" collapsed={[false, false]}>
        <div>Pane 2</div>
        <Split mode="horizontal" id="splitter4" collapsed={[false, false, false]} fixClass>
          <div className={SplitUtils.fixClass()}>Pane 3</div>
          <div>Pane 4</div>
          <div>Pane 5</div>
        </Split>
      </Split>
    </Split>
    <Split mode="horizontal" id="splitter5" collapsed={[false, false]}>
      <div>Pane 6</div>
      <div>Pane 7</div>
    </Split>
  </Split>
</div>;
```

## Local Storage

To resume your layout from where you left off before closing the tab or browser, you can enable the `enableSessionStorage` option. By default, this option is set to `false`. Once enabled, your layout will be saved, allowing you to seamlessly continue your work from the last saved state.

## Features

- **Lightweight and Fast**: Designed to be lightweight and deliver optimal performance.
- **Flexible Orientation**: Supports horizontal and vertical layouts.
- **Collapsible Panes**: Built-in expand and collapse functionality.
- **Customizable Sizes**: Set initial, minimum, and maximum sizes.
- **Programmatic Control**: Dynamically collapse or expand panes.
- **Custom Handlebars**: Extend with custom handlebar designs.
- **Responsive Design**: Adapts to various screen sizes and layouts.

## Limitations

- **Nested Layout Issues:** Local Storage does not support nested layouts, resulting in unexpected behavior when nested layouts have more than two levels.
- **Difficulty in Managing Nested Layouts:** There is currently no built-in provision to address nested layout issues caused by internal methods. Users may need to utilize the `fixClass` prop or the `fixClass` method provided by `SplitUtils` to mitigate these issues.
- **Limitations of Custom Handlebars:** The `custom handleBar` feature does not support the `disable` and `lineBar` functionalities, which may restrict its usability in certain scenarios.

For more information and advanced usage, please refer to the [documentation](#https://amankrr.github.io/react-multilayout-split/).

Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
