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

export default NewPromise;