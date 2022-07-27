# jsdom-web
 3,6kb web implementation of some jsdom features, to give you the same API

**NOTE:** Only most important features are implemented. The goal of this is to provide a lightweight implementation of the core jsdom API for the web, without implementing an own serializer and instead using the native document.createElement() and document.createTextNode() methods.

# Usage
Put the code from [this site](https://cdn.jsdelivr.net/npm/jsdom-web@latest/index.min.js) at the top of your code

```js
// JSDOM is already available in the global scope
const dom = new JSDOM('<div id="my-div">Hello World</div>');
const div = dom.window.document.getElementById('my-div');
console.log(div.textContent); // 'Hello World'
```