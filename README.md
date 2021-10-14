# Promise

`Promise` is a pattern that represents the eventual completion (or failure) of an asynchronous operation, and its resulting value. ECMAScript 6 (or ES6) introduces it and is widely used to simplify the workflow. This assignment is to implement `Promise` class with vanilla JavaScript(ES5orES6).You could see all the specification of Promise [h​ere](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)​, and the following methods should be implemented.

-  new Promise(executor)
-  Promise.all(iterable) (supposed that iterable is the type of Array<Promise>)
-  Promise.resolve(value)
-  Promise.reject(reason)
-  Promise.prototype.then(func)
-  Promise.prototype.catch(func)
-  Promise.prototype.finally(func)

Just guarantee that it should run on the latest version of Chrome browser.
* * *

## Getting Start

### 개발 환경
- NPM
- Webpack
- ES6

### 주요 파일
- promise.js - Promise 클래스 구현
- index.js - 구현 기능 테스트 로직 실행

### 프로젝트 빌드 & 실행
``` bash
# package.json 에 정의된 모듈 다운
$ npm install

# webpack 으로 js 파일 빌드
$ npm run build

# webpack dev server에 hot loading 적용하여 구동
$ npm run start

