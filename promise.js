const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

class NewPromise {
    constructor(executor) {
        this.state = STATE.PENDING;
        this.value = undefined;
        this.callbacks = [];
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }
    }

    changeState() {

    }

    resolve(value) {
        if (this.state !== STATE.PENDING) return;
        this.state = STATE.FULFILLED;
        this.value = value;
    }

    reject(reason) {
        this.state = STATE.REJECTED;
        this.value = reason;
    }

}