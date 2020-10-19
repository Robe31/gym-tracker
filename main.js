const DS = (() => {
    let data = {
        date: "",
        time: 0,
        exercises: [],
    };

    return {
        modifyData: (x, y) => {
            for (let n in data) {
                if (n == x) {
                    data[x] = y;
                }
            }
        },
        logData: () => {
            console.log(data);
        },
        addExercise: (ex) => {
            data.exercises.push(ex);
        },
        removeExercise: (x) => {
            console.log(x);
        },
        updateId: (arr) => {
            for (let n in arr) {
                console.log(n);
                for (let y in data.exercises) {
                    if (n == data.exercises[y].id) {
                        console.log(arr[n]);
                    }
                }
            }
        },
    };
})();

const Start = ((ds) => {
    // Get Current Date
    const currentDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
        let yy = String(today.getFullYear());

        today = `${mm}/${dd}/${yy}`;
        ds.modifyData("date", today);
        return today;
    };

    const timerTracker = () => {
        const timer = document.querySelector(".timer");
        const startTimer = () => {
            let totalTime = 0;
            let ss;
            let mm;
            let hh;
            let tracker = () => {
                ss = totalTime % 60;
                mm = ~~((totalTime % 3600) / 60); //~~ is shorthand Math.floor
                hh = ~~(totalTime / 3600);

                let time = "";
                if (hh > 0) {
                    time += `${hh}:${mm < 10 ? "0" : ""}`;
                }
                time += `${mm}:${ss < 10 ? "0" : ""}`;
                time += `${ss}`;

                timer.innerText = time;

                totalTime++;
                ds.modifyData("time", totalTime);
            };

            setInterval(() => {
                tracker();
            }, 1000);
        };
        startTimer();
    };

    const Exercise = () => {
        // lets turn this into an object that we can update when the dom elements are created
        const exEl = {
            addExInput: undefined,
            addWeightInput: undefined,
            addExBtn: undefined,
            addToList: undefined,
        };

        return {
            updateEl: () => {
                exEl.addExInput = document.querySelector("#addExInput");
                exEl.addWeightInput = document.querySelector("#addWeightInput");
                exEl.addExBtn = document.querySelector(".addExBtn");
                exEl.addToList = document.querySelector("tbody");

                return exEl;
            },
            addEx: () => {
                let exItem = document.createElement("tr");
                exItem.innerHTML = `
                    <th scope="row">
                        <i class="fas fa-times-circle removeEx"></i>
                    </th>
                    <td>
                        <p>${exEl.addExInput.value}</p>
                    </td>
                    <td>
                        <p>${exEl.addWeightInput.value}lbs</p>
                    </td>
                    <td>
                        <i class="fas fa-minus-circle setMinus"></i>
                        <span >0</span>
                        <i class="fas fa-plus-circle setPlus"></i>
                    </td>
                    <td>
                        <i class="fas fa-minus-circle repMinus"></i>
                        <span>0</span>
                        <i class="fas fa-plus-circle repPlus"></i>
                    </td>
                `;
                let ex = {
                    id: exEl.addToList.childElementCount,
                    exercise: exEl.addExInput.value,
                    weight: exEl.addWeightInput.value,
                    set: 0,
                    rep: 0,
                };
                console.dir(exEl.addToList);
                ds.addExercise(ex);
                ds.logData();
                exEl.addToList.appendChild(exItem);
                exEl.addExInput.value = "";
                exEl.addWeightInput.value = "";
            },
            set: (e) => {
                if (e.target.classList.contains("setPlus")) {
                    let n = parseInt(e.target.previousElementSibling.innerText);
                    n += 1;
                    e.target.previousElementSibling.innerText = n;
                } else if (e.target.classList.contains("setMinus")) {
                    let n = parseInt(e.target.nextElementSibling.innerText);
                    if (n != 0) {
                        n -= 1;
                        e.target.nextElementSibling.innerText = n;
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            },
            rep: (e) => {
                if (e.target.classList.contains("repPlus")) {
                    let n = parseInt(e.target.previousElementSibling.innerText);
                    n += 1;
                    e.target.previousElementSibling.innerText = n;
                } else if (e.target.classList.contains("repMinus")) {
                    let n = parseInt(e.target.nextElementSibling.innerText);
                    if (n != 0) {
                        n -= 1;
                        e.target.nextElementSibling.innerText = n;
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            },
            remove: (e) => {
                if (e.target.classList.contains("removeEx")) {
                    let list = Array.from(exEl.addToList.children);
                    e.target.parentNode.parentNode.remove();
                    ds.updateId(list);
                    // for (let n in list) {
                    //     if (list[n] == e.target.parentNode.parentNode) {
                    //         ds.updateId(list);
                    //     }
                    // }
                    // /ds.removeExercise();
                } else {
                    return;
                }
            },
        };
    };

    //Create work out sheet
    const workOutSheet = `
    <div class="container">
        <div class="row">
            <div class="col">
                <span class="timer">0:00</span>
            </div>
            <div class="col">
                <span>${currentDate()}</span>
            </div>
        </div>
        <form>
            <div class="row">
                <div class="col-8 px-0">
                    <input type="text" class="form-control" id="addExInput" placeholder="Add Excerise"/>
                </div>
                <div class="col-2 px-0">
                    <input type="number" class="form-control" id="addWeightInput" placeholder="lbs"/>
                </div>
                <div class="col-2 px-0">
                    <button type="button" class="btn btn-success addExBtn">
                        Add
                    </button>
                </div>
            </div>
        </form>
        <table class="table table-sm table-secondary table-striped">
                    <thead>
                        <tr>
                            <th scope="col">&bull;</th>
                            <th scope="col">Exercise</th>
                            <th scope="col">lb</th>
                            <th scope="col">Set(s)</th>
                            <th scope="col">Rep(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
        <button type="button" class="btn btn-danger" id="endWO">
            End Work Out
        </button>
    </div>
    `;

    return {
        //display Work Out Sheet and remove start btn
        createWorkSheet: (start, main) => {
            start.parentNode.style.display = "none";
            main.innerHTML = workOutSheet;
        },
        timer: () => {
            //start timer
            timerTracker();
        },
        getEx: () => {
            return Exercise;
        },
    };
})(DS);

const Ui = (() => {
    // Set UI Elements
    const elements = {
        start: document.querySelector("#startWO"),
        main: document.querySelector("main"),
    };
    return {
        // Get UI Elements
        getElements: () => {
            return elements;
        },
    };
})();

const App = ((ui, st) => {
    // Get UI Elements
    const el = ui.getElements();

    //Set varible for when workout sheet elements is loaded
    // let exEl = undefined;
    //Load Event Listeners
    const event = {
        start: () => {
            el.start.addEventListener("click", (e) => {
                st.createWorkSheet(el.start, el.main);
                st.timer();

                event.addExercises();
                event.updateSet();
                event.updateRep();
                event.removeEx();
                e.preventDefault();
            });
        },
        addExercises: () => {
            let get = st.getEx();
            let ex = get();
            let exEl = ex.updateEl();
            exEl.addExBtn.addEventListener("click", ex.addEx);
        },
        updateSet: () => {
            let get = st.getEx();
            let ex = get();
            let exEl = ex.updateEl();
            exEl.addToList.addEventListener("click", (e) => {
                ex.set(e);
            });
        },
        updateRep: () => {
            let get = st.getEx();
            let ex = get();
            let exEl = ex.updateEl();
            exEl.addToList.addEventListener("click", (e) => {
                ex.rep(e);
            });
        },
        removeEx: () => {
            let get = st.getEx();
            let ex = get();
            let exEl = ex.updateEl();
            exEl.addToList.addEventListener("click", (e) => {
                ex.remove(e);
            });
        },
    };
    return {
        init: () => {
            event.start();
        },
    };
})(Ui, Start);

App.init();
