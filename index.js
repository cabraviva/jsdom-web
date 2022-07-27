(function(){

function JSDOM (html, options) {
    // Check if called with new, else return new instance
    if (!(this instanceof JSDOM)) {
        return new JSDOM(html, options);
    }

    // Constructor
    var TagsThatBelongInHead = ['title', 'base', 'link', 'meta', 'style', 'script', 'noscript', 'template']

    this.sandbox = document.createElement('html')

    this.sandbox.append(document.createElement('head'))
    this.sandbox.append(document.createElement('body'))

    var sbox = this.sandbox

    this.window = {
        eval: function (code) {
            // Generate sandboxid
            var sandboxid = Array.from({ length: 200 }, function () { return Math.floor(Math.random() * 10) }).join('')
            window['_jsdom-sandbox+' + sandboxid] = this


            // Execute the script inside the sandbox DOM context
            var scriptcode = "(function(document, window) {" + code + "})(window['_jsdom-sandbox+" + sandboxid + "'].document, window['_jsdom-sandbox+" + sandboxid + "'].window);"

            // Evaluate it
            eval(scriptcode)
        },
        document: {
            get body() {
                return this.querySelector('body')
            },
            get head() {
                return this.querySelector('head')
            },
            get documentElement() {
                return this.querySelector('html')
            },

            querySelector: function (selector) {
                return sbox.querySelector(selector)
            },
            querySelectorAll: function (selector) {
                return sbox.querySelectorAll(selector)
            },
            getElementsByTagName: function (tagName) {
                return sbox.getElementsByTagName(tagName)
            },
            getElementsByTagNameNS: function (namespace, tagName) {
                return sbox.getElementsByTagNameNS(namespace, tagName)
            },
            getElementsByClassName: function (className) {
                return sbox.getElementsByClassName(className)
            },
            getElementsByName: function (name) {
                return sbox.getElementsByName(name)
            },
            getElementsByNameNS: function (namespace, name) {
                return sbox.getElementsByNameNS(namespace, name)
            },

            appendChild: function (child) {
                // Check if child belongs in head
                if (TagsThatBelongInHead.includes(child.tagName.toLowerCase())) {
                    sbox.querySelector('head').appendChild(child)
                } else {
                    return sbox.querySelector('body').appendChild(child)
                }
            },
            append: function () {
                for (var _ic = 0; _ic < arguments.length; _ic++) {
                    var child = arguments[_ic]
                    if (typeof child === 'string') {
                        sbox.querySelector('body').append(child);
                    } else {
                        if (TagsThatBelongInHead.includes(child.tagName.toLowerCase())) {
                            sbox.querySelector('head').appendChild(child);
                        } else {
                            sbox.querySelector('body').appendChild(child);
                        }
                    }
                }
            },
            insertBefore: function (child, referenceNode) {
                if (TagsThatBelongInHead.includes(child.tagName.toLowerCase())) {
                    sbox.querySelector('head').insertBefore(child, referenceNode)
                } else {
                    return sbox.querySelector('body').insertBefore(child, referenceNode)
                }
            },
            insertAdjacentHTML: function (position, html) {
                sbox.querySelector('body').insertAdjacentHTML(position, html)
            },
            insertAdjacentText: function (position, text) {
                sbox.querySelector('body').insertAdjacentText(position, text)
            }
        },
        window: this,
        navigator: navigator,
        history: {
            pushState: function () { },
            replaceState: function () { }
        },
        location: location,
        screen: screen,
        addEventListener: function (type, listener) {
            if (type === 'load') {
                listener()
                return
            }

            if (type === 'error') {
                listener()
                return
            }

            if (type === 'DOMContentLoaded') {
                listener()
                return
            }

            if (type === 'readystatechange') {
                listener()
                return
            }

            this.sandbox.addEventListener(type, listener)
        }
    }

    var documentCreateFuncNames = [
        'createElement',
        'createTextNode',
        'createComment',
        'createDocumentFragment',
        'createEvent',
        'createRange',
        'createNodeIterator',
        'createTreeWalker',
        'createElementNS',
        'createTextNodeNS',
        'createCommentNS',
        'createDocumentFragmentNS',
        'createEventNS',
        'createRangeNS',
        'createNodeIteratorNS',
        'createTreeWalkerNS',
        'createExpression',
        'createExpressionNS',
        'createXPathEvaluator',
        'createXPathNSResolver'
    ]
    for (var _id = 0; _id < documentCreateFuncNames.length; _id++) {
        var funcName = documentCreateFuncNames[_id]
        this.window.document[funcName] = function (a, b, c, d, e, f, g) { return document[funcname](a, b, c, d, e, f, g) }
    }

    this.sandbox.querySelector('body').innerHTML = html

    // Run scripts if options.runScripts is "dangerously"
    if (options && options.runScripts === 'dangerously') {
        var scripts = this.sandbox.querySelectorAll('script')
        for (var _ia = 0; _ia < scripts.length; _ia++) {
            var script = scripts[_ia]
            var scriptText = script.innerHTML

            this.window.eval(scriptText)
        }
    }
    // Go through every element in the body and put it in the head if it belongs in head
    for (var _ib = 0; _ib < this.sandbox.querySelector('body').length; _ib++) {
        var element = this.sandbox.querySelector('body')[_ib]
        if (TagsThatBelongInHead.includes(element.tagName.toLowerCase())) {
            this.window.document.head.appendChild(element)
        }
    }


    this.document = this.window.document;
}

window.JSDOM = JSDOM

})();