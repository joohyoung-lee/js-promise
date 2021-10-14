import NewPromise from './promise';

const App = () => {

    const newPromise = new NewPromise((resolve, reject) => {
        setTimeout(() => {
          resolve('resolve');
        }, 1000);
    });
    newPromise.then((value) => {
        document.getElementById('result').innerText = value;
        // expected result: 'resolve'
    });
    
    const newPromise2 = NewPromise.resolve(123);

    newPromise2.then((value) => {
        document.getElementById('result').innerText = value;
        // expected result: 123
    });
      
    NewPromise.reject(new Error("fail")).then((resolve) => {
    // 호출되지 않음
    }, (error) => {
        console.error(error); // Stacktrace
    });

    const NewPromiseError = new NewPromise((resolve, reject) => {
        throw 'Reject Error';
      });
      
    NewPromiseError.catch((error) => {
        console.error(error); // Reject Error
    });
    
    function checkMail() {
        return new NewPromise((resolve, reject) => {
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

    const p1 = NewPromise.resolve(3);
    const p2 = 1337;
    const p3 = new NewPromise((resolve, reject) => {
        setTimeout(() => {
        resolve("foo");
        }, 100);
    });
    NewPromise.all([p1, p2, p3]).then(values => {
        console.log(values); 
        //expected result: [3, 1337, "foo"]
    });
};

App();