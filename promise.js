const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

class NewPromise {
    constructor(executor) {
        this.state = STATE.PENDING;
        this.value = undefined;
        this.handleFulfilled = [];
        this.handleRejected = [];
        // const resolve = (value) => {
        //     if (this.state !== STATE.PENDING) return;
        //     this.state = STATE.FULFILLED;
        //     this.value = value;
        //     this.handleFulfilled.forEach(callback => callback());
        // };
        // const reject = (reason) => {
        //     if (this.state !== STATE.PENDING) return;
        //     this.state = STATE.REJECTED;
        //     this.value = reason;
        //     this.handleRejected.forEach(callback => callback());
        // }
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }
    }

    resolve(value) {
        if (this.state !== STATE.PENDING) return;
        this.state = STATE.FULFILLED;
        this.value = value;
        this.handleFulfilled.forEach(callback => callback());
    }

    reject(reason) {
        if (this.state !== STATE.PENDING) return;
        this.state = STATE.REJECTED;
        this.value = reason;
        this.handleRejected.forEach(callback => callback());
    }

    then(onFulfilled, onRejected) {
        let newPromise = new NewPromise((resolve, reject) => {
            if (this.status === STATE.FULFILLED) {
                // setTimeout(() => {
                    try {
                        let result = onFulfilled(this.value);
                        resolveNewPromise(newPromise, result, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                // });
            } else if (this.status === STATE.REJECTED) {
                // setTimeout(() => {
                    try {
                        let result = onRejected(this.value);
                        resolveNewPromise(newPromise, result, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                // });
            } else if (this.status === STATE.PENDING) {
                this.handleFulfilled.push(() => {
                    // setTimeout(() => {
                        try {
                            let result = onFulfilled(this.value);
                            resolveNewPromise(newPromise, result, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    // });
                });
                this.handleRejected.push(() => {
                    // setTimeout(() => {
                        try {
                            let result = onRejected(this.value);
                            resolveNewPromise(newPromise, result, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    // });
                });
            }
        });
        return newPromise;
    }

    resolveNewPromise(promise, value, resolved, rejected) {
        try {
            if (value instanceof NewPromise) {
                value.then(resolved, rejected);
            } else {
                resolved(value);
            }   
        } catch (error) {
            rejected(error);
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

NewPromise.prototype.all = (iterable) => {
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
}

NewPromise.prototype.resolve = (value) => {
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
}

NewPromise.prototype.reject = (reason) => {
    if (reason instanceof NewPromise) {
        return reason;
    }
    return new NewPromise((resolve, reject) => {
        reject(reason);
    });
}

export default NewPromise;