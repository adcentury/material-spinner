# Material Spinner

> A jQuery based Material Design Spinner.

## Install

Install via npm
```
npm install material-spinner
```

or just [download it](https://raw.githubusercontent.com/adcentury/material-spinner/master/dist/js/material.spinner.min.js).

Include the script after jquery

```html
<script src="path/to/jquery.min.js"></script>
<script src="path/to/material.spinner.min.js"></script>
```

or require it in CommonJS.

```javascript
var $ = require('jquery');
require('material-spinner');
```

## Usage

### via Data API

```html
<div id="spinner" data-spinner='{"radius": 25}'></div>
```

### via Javascript

```javascript
$('#spinner').spinner({radius: 25});
```

## Options

| Name | dafault | description |
| ---- | ------- | ----------- |
| radius | 25 | Optional, in `px` |
| strokeWidth | 5 | Optional, in `px` |
| duration | 2 | Optional, in `seconds`. Represent the duaration of a round |
| color | '#3f88f8' | Optional. MUST BE a valid color hex string |

