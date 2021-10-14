/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

class NewPromise {

    constructor(executor) {
        this.state = STATE.PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.handleFulfilled = [];
        this.handleRejected = [];
        const resolve = (value) => {
            if (this.state !== STATE.PENDING) return;
            this.state = STATE.FULFILLED;
            this.value = value;
            this.handleFulfilled.forEach(callback => callback());
        };
        const reject = (reason) => {
            if (this.state !== STATE.PENDING) return;
            this.state = STATE.REJECTED;
            this.reason = reason;
            this.handleRejected.forEach(callback => callback());
        }
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        const newPromise = new NewPromise((resolve, reject) => {
            if (this.state === STATE.FULFILLED) {
                try {
                    let result = onFulfilled(this.value);
                    this.resolveNewPromise(newPromise, result, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            } else if (this.state === STATE.REJECTED) {
                try {
                    let result = onRejected(this.reason);
                    this.resolveNewPromise(newPromise, result, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            } else if (this.state === STATE.PENDING) {
                this.handleFulfilled.push(() => {
                    try {
                        let result = onFulfilled(this.value);
                        this.resolveNewPromise(newPromise, result, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
                this.handleRejected.push(() => {
                    try {
                        let result = onRejected(this.reason);
                        this.resolveNewPromise(newPromise, result, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });
        return newPromise;
    }

    resolveNewPromise(promise, value, resolved, rejected) {
        if (value instanceof NewPromise) {
            value.then((data) => {
                this.resolveNewPromise(promise, data, resolved, rejected);
            }, (error) => {
                rejected(error);
            });
        } else if (value != null && (typeof value === 'object' || typeof value === 'function')) {
            let isCalled = false;
            try {
                if (typeof value.then === 'function') {
                    value.then(value, (res) => {
                        if (isCalled) return;
                        isCalled = true;
                        this.resolveNewPromise(promise, res, resolved, rejected);
                    }, (rej) => {
                        if (isCalled) return;
                        isCalled = true;
                        rejected(rej);
                    });
                } else {
                    resolved(value);
                }
            } catch (error) {
                if (isCalled) return;
                isCalled = true;
                rejected(error);
            }
        } else {
            resolved(value);
        }   
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        return this.then((value) => {
            return NewPromise.resolve(onFinally()).then(() => {
                return value;
            });
        }, (error) => {
            return NewPromise.resolve(onFinally()).then(() => {
                throw error;
            });
        });
    }
}

NewPromise.all = (iterable) => {
    return new NewPromise((resolve, reject) => {
        const result = [];
        let index = 0;
        for (let i = 0; i < iterable.length; i++) {
            NewPromise.resolve(iterable[i]).then((value) => {
                result[i] = value;
                index += 1;
                if (index === iterable.length) {
                    resolve(result);
                }
            }, (error) => {
                reject(error);
            });
        }
    });
};

NewPromise.resolve = (value) => {
    if (value instanceof NewPromise) {
        return value;
    }
    if (value !== null && typeof value === 'object' 
        && value.then && typeof value.then === 'function') {
        return new NewPromise(value.then);
    }
    return new NewPromise((resolve) => {
        resolve(value);
    });
};

NewPromise.reject = (reason) => {
    if (reason instanceof NewPromise) {
        return reason;
    }
    return new NewPromise((resolve, reject) => {
        reject(reason);
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NewPromise);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const App = () => {

    const newPromise = new _promise__WEBPACK_IMPORTED_MODULE_0__["default"]((resolve, reject) => {
        setTimeout(() => {
          resolve('resolve');
        }, 1000);
    });
    newPromise.then((value) => {
        document.getElementById('result').innerText = value;
        // expected result: 'resolve'
    });
    
    const newPromise2 = _promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(123);

    newPromise2.then((value) => {
        document.getElementById('result').innerText = value;
        // expected result: 123
    });
      
    _promise__WEBPACK_IMPORTED_MODULE_0__["default"].reject(new Error("fail")).then((resolve) => {
    // 호출되지 않음
    }, (error) => {
        console.error(error); // Stacktrace
    });

    const NewPromiseError = new _promise__WEBPACK_IMPORTED_MODULE_0__["default"]((resolve, reject) => {
        throw 'Reject Error';
      });
      
    NewPromiseError.catch((error) => {
        console.error(error); // Reject Error
    });
    
    function checkMail() {
        return new _promise__WEBPACK_IMPORTED_MODULE_0__["default"]((resolve, reject) => {
            if (Math.random() > 0.5) {
                resolve('Mail has arrived');
            } else {
                reject(new Error('Failed to arrive'));
            }
        });
    }
      
    checkMail()
        .then((mail) => {
            console.log(mail);
        })
        .finally(() => {
            console.log('Experiment completed');
        });

    const p1 = _promise__WEBPACK_IMPORTED_MODULE_0__["default"].resolve(3);
    const p2 = 1337;
    const p3 = new _promise__WEBPACK_IMPORTED_MODULE_0__["default"]((resolve, reject) => {
        setTimeout(() => {
        resolve("foo");
        }, 100);
    });
    _promise__WEBPACK_IMPORTED_MODULE_0__["default"].all([p1, p2, p3]).then(values => {
        console.log(values); 
        //expected result: [3, 1337, "foo"]
    });
};

App();
})();

/******/ })()
;