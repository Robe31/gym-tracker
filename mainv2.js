// Some Terminology for this projects comments
// AEL:(add event listener)

// This is where we will make new exercises. Here we wil store, update, and control its data
const ExerciseCont = (() => {
    // Exercise Constructor
    // Creates a new exercise object that will be added to an array
    const Exercise = function (id, name, weight) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.sets = 0;
        this.reps = 0;
    };

    // This is our data structure
    // The DS will keep track of work out time, date, and exercises
    const data = {
        exercises: [],
        time: 0,
        date: null,
        currentExercise: null,
    };

    return {
        // Gives access to current data state
        logData: () => {
            console.log(data);
        },
        // Adds new exercises to data state
        addExercise: (name, weight) => {
            let id = data.exercises.length;
            let exercise = new Exercise(id, name, weight);
            data.currentExercise = exercise;
            data.exercises.push(exercise);
        },
        // Removes exercises from data state
        removeExercise: (id) => {
            // Get ids of all exercises
            const ids = data.exercises.map((exercise) => {
                return exercise.id;
            });
            console.log(ids);
            // get index
            const index = ids.indexOf(id);

            //remove item
            data.exercises.splice(index, 1);
        },
        // Updates the amount of sets in a exercise and updates that in data state
        updateSet: (id, val) => {
            // Get ids of all exercises
            const ids = data.exercises.map((exercise) => {
                return exercise.id;
            });

            // get index of exercise to update
            const index = ids.indexOf(id);

            // Update sets of exercise
            data.exercises[index].sets = val;
        },
        // Updates the amount of reps in a exercise and updates that in data state
        updateRep: (id, val) => {
            // Get ids of all exercises
            const ids = data.exercises.map((exercise) => {
                return exercise.id;
            });

            // get index of exercise to update
            const index = ids.indexOf(id);

            // Update sets of exercise
            data.exercises[index].reps = val;
        },
        // Updates the amount of time pasted and record it to the data state
        updateTime: (time) => {
            data.time = time;
        },
        // Updates the date record it to the data state
        getDate: (date) => {
            data.date = date;
        },
        getCurrentExercise: () => {
            return data.currentExercise;
        },
    };
})();

// This is where at the UI will be loaded and controlled
const UI = (() => {
    // Create the paths that will be used to grab our selectors
    const el = {
        main: "main",
        startBtn: "#startWO",
        timer: ".timer",
        date: "#date",
        list: "tbody",
        exerciseInput: "#addExInput",
        weightInput: "#addWeightInput",
        addBtn: ".addExBtn",
        removeBtn: ".removeEx",
        set: {
            minus: ".setMinus",
            plus: ".setPlus",
        },
        rep: {
            minus: ".repMinus",
            plus: ".repPlus",
        },
        endBtn: "#endWO",
    };
    return {
        getElements: () => {
            return el;
        },
        startWorkout: (date) => {
            document.querySelector(el.main).innerHTML = `
            <div class="container px-0" id="app">
                <div class="row">
                    <div class="col">
                        <span class="timer"></span>
                    </div>
                    <div class="col">
                        <span id="date">${date}</span>
                    </div>
                </div>
                <form >
                    <div class="row" id="app-form">
                        <div class="col pr-0">
                            <input type="text" class="form-control" id="addExInput" placeholder=" Add Excerise"/>
                        </div>
                        <div class="col px-0">
                            <input type="number" class="form-control" id="addWeightInput" placeholder=" lbs"/>
                        </div>
                        <div class="col pl-0">
                            <button type="button" class="btn btn-success addExBtn">
                                Add
                            </button>
                        </div>
                    </div>
                </form>
                <table class="table table-sm table-secondary table-striped ">
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
            </div>`;
        },
        addExercise: (id, name, weight) => {
            let exItem = document.createElement("tr");
            exItem.id = `${id}`;
            exItem.innerHTML = `
                <th scope="row">
                    <i class="fas fa-times-circle removeEx"></i>
                </th>
                <td>
                    <p>${name}</p>
                </td>
                <td>
                    <p>${weight}lbs</p>
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
            document.querySelector(el.list).appendChild(exItem);
        },
        removeExercise: (exercise) => {
            exercise.remove();
        },
        updateSets: (ex, action) => {
            if (action == "plus") {
                let n = parseInt(ex.previousElementSibling.innerText);
                n += 1;
                ex.previousElementSibling.innerText = n;
                return n;
            } else {
                let n = parseInt(ex.nextElementSibling.innerText);
                if (n != 0) {
                    n -= 1;
                    ex.nextElementSibling.innerText = n;
                    return n;
                } else {
                    return 0;
                }
            }
        },
        updateReps: (ex, action) => {
            if (action == "plus") {
                let n = parseInt(ex.previousElementSibling.innerText);
                n += 1;
                ex.previousElementSibling.innerText = n;
                return n;
            } else {
                let n = parseInt(ex.nextElementSibling.innerText);
                if (n != 0) {
                    n -= 1;
                    ex.nextElementSibling.innerText = n;
                    return n;
                } else {
                    return 0;
                }
            }
        },
        time: () => {
            const timer = document.querySelector(el.timer);
            let totalTime = 0;
            let ss;
            let mm;
            let hh;
            let time = "";
            let currentTime;
            return {
                tracker: () => {
                    ss = totalTime % 60;
                    mm = ~~((totalTime % 3600) / 60); //~~ is shorthand Math.floor
                    hh = ~~(totalTime / 3600);

                    time = "";
                    if (hh > 0) {
                        time += `${hh}:${mm < 10 ? "0" : ""}`;
                    }
                    time += `${mm}:${ss < 10 ? "0" : ""}`;
                    time += `${ss}`;

                    timer.innerText = time;
                    currentTime = time;
                    totalTime++;
                },
                currentTime: () => {
                    return currentTime;
                },
            };
        },
    };
})();

// This is where all event listeners will be loaded
const App = ((ui, exercise) => {
    // Get UI elements so we can attach event listeners to them
    const el = ui.getElements();

    // Creates a AEL on the startBtn
    const start = () => {
        const startBtn = document.querySelector(el.startBtn);
        startBtn.addEventListener("click", eventStart);
    };

    // Creates a AEL on the addBtn
    const add = () => {
        const addBtn = document.querySelector(el.addBtn);
        addBtn.addEventListener("click", addExercise);
    };

    // To do this we're going to target the tbody
    const remove = () => {
        // grab tbody
        let list = document.querySelector(el.list);
        // Add AEL
        list.addEventListener("click", (e) => {
            if (e.target.classList.contains("removeEx")) {
                let id = e.target.parentNode.parentNode;
                removeExercise(id);
            } else {
                return;
            }
        });
    };

    // Add AEL to tbody to listen for a click on either set buttons
    const sets = () => {
        // grab tbody
        let list = document.querySelector(el.list);
        // Add AEL
        list.addEventListener("click", (e) => {
            if (e.target.classList.contains("setPlus")) {
                updateSets(e.target, "plus");
            } else if (e.target.classList.contains("setMinus")) {
                updateSets(e.target, "minus");
            } else {
                return false;
            }
        });
    };

    // Add AEL to tbody to listen for a click on either rep buttons
    const reps = () => {
        // grab tbody
        let list = document.querySelector(el.list);
        // Add AEL
        list.addEventListener("click", (e) => {
            if (e.target.classList.contains("repPlus")) {
                updateReps(e.target, "plus");
            } else if (e.target.classList.contains("repMinus")) {
                updateReps(e.target, "minus");
            } else {
                return false;
            }
        });
    };

    // All the events below this comment
    function eventStart() {
        let date = getCurrentDate();
        ui.startWorkout(date);
        exercise.getDate(date);
        stopWatch();
        add();
        remove();
        sets();
        reps();
    }

    // This function adds a new exercise to view and adds it to DS
    function addExercise() {
        // Grab ui inputs
        let name = document.querySelector(el.exerciseInput);
        let weight = document.querySelector(el.weightInput);

        // Add exercise to DS
        exercise.addExercise(name.value, weight.value);

        // Get recently added exercise
        let current = exercise.getCurrentExercise();

        // Display new exercise from data state to ui
        ui.addExercise(current.id, current.name, current.weight);

        // Clear input values
        name.value = "";
        weight.value = "";
    }

    // This function removes a exercise from view and DS
    function removeExercise(ex) {
        ui.removeExercise(ex);
        exercise.removeExercise(ex.id);
    }

    // This function will be used to update an exercise's sets
    function updateSets(ex, action) {
        let n = ui.updateSets(ex, action);
        let id = ex.parentNode.parentNode.id;
        id = parseInt(id);

        exercise.updateSet(id, n);
    }

    // This function will be used to update an exercise's reps
    function updateReps(ex, action) {
        let n = ui.updateReps(ex, action);
        let id = ex.parentNode.parentNode.id;
        id = parseInt(id);

        exercise.updateRep(id, n);
    }

    // This function will start the timer, update the time to data state, and able to end it
    function stopWatch() {
        let time = ui.time();
        let startUiTracker = setInterval(time.tracker, 1000);
        let startExTracker = setInterval(() => {
            exercise.updateTime(time.currentTime());
        }, 1000);

        let endBtn = document.querySelector(el.endBtn);
        endBtn.addEventListener("click", () => {
            clearInterval(startUiTracker);
            clearInterval(startExTracker);
        });
    }

    function getCurrentDate() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
        let yy = String(today.getFullYear());
        today = `${mm}/${dd}/${yy}`;
        return today;
    }
    return {
        init: () => {
            start();
        },
    };
})(UI, ExerciseCont);

App.init();
