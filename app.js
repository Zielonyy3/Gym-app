class Application {
    constructor() {}
}

class PlansContainer {
    // dodać listę elementów w tablicy, które nie zamykają fomrluarza 
    // dodać krzyżyk na formularzu
    //jesli pusty fomrularz to zamknac bez zapisywania
    constructor() {
        this.plansList = document.querySelector('.nav');
        this.plansListButton = document.querySelector('.plansListButton');
        this.blurContainer = document.querySelector('.blurContainer');
        this.addPlanForm = document.querySelector('.addPlanForm');
        this.addPlanButton = this.addPlanForm.querySelector('#addPlanButton');
        this.container = document.querySelector('.container');
        this.addButtons = document.querySelectorAll('.addPlanButton');

        this.plansListButton.addEventListener('click', this.togglePlansList.bind(this));
        window.addEventListener('click', this.showForm.bind(this));
        this.addPlanButton.addEventListener('click', this.addPlan.bind(this));

        this.plans = []
    }
    cleanForm() {
        this.addPlanForm.querySelector('#planName').value = "";
        this.addPlanForm.querySelector('#planDescripition').value = "";
    }
    togglePlansList() {
        this.plansList.classList.toggle('navHidden');
    }
    showForm(e) {
        for (const button of this.addButtons) {
            if (button == e.target && this.addPlanForm.dataset.show == 0) {
                this.blurContainer.style.display = "block";
                this.addPlanForm.dataset.show = 1;
                this.addPlanForm.classList.remove('addPlanFormHidden');
                this.container.classList.add('blur');

            } else if (this.addPlanForm.dataset.show == 1 && !this.addPlanForm.contains(e.target) && (document.querySelector('.swal-overlay') ? !document.querySelector('.swal-overlay').contains(e.target) : 1)) {
                swal({
                        title: "Porzucić nowy plan?",
                        text: "Czy chcesz zamknąć bez zapisywania?",
                        icon: "warning",
                        buttons: ["Zostaw!", "Porzuć"],
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            this.blurContainer.style.display = "none";
                            this.addPlanForm.dataset.show = 0;
                            this.addPlanForm.classList.add('addPlanFormHidden');
                            this.container.classList.remove('blur');
                            this.cleanForm();
                        } else {
                            this.addPlanForm.dataset.show = 0;
                        }
                    });

            } else if (!(this.addPlanForm.classList.contains('addPlanFormHidden')))
                this.addPlanForm.dataset.show = 1;

        }
    }
    addPlan(e) {
        e.preventDefault();
        const planName = this.addPlanForm.querySelector('#planName').value;
        const description = this.addPlanForm.querySelector('#planDescripition').value;
        if (planName) {
            const newPlan = new Plan(planName, description);
            newPlan.addPlanToDOM();
            this.plans.push(newPlan);

            swal("Plan dodano", "", "success")
                .then(() => {
                    this.plansList.classList.remove('navHidden');
                    this.cleanForm();
                    this.addPlanForm.dataset.show = 0;
                    this.container.classList.remove('blur');
                    this.addPlanForm.classList.add('addPlanFormHidden');
                    this.blurContainer.style.display = "none";
                });

        } else {
            swal("Podaj nazwę planu!", "", "error");
        }
    }

}

class Plan {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.weekDays = {
            mon: 1,
            tue: 1,
            wed: 1,
            thu: 1,
            fri: 1,
            sat: 0,
            sun: 0
        };
        this.exercises = [];

        this.nav = document.querySelector('.nav');

        const addExerciseDiv = document.createElement('div');
        this.addExerciseDiv = addExerciseDiv;
        addExerciseDiv.classList.add('addExercise');

        const addExerciseInput = document.createElement('input');
        this.addExerciseInput = addExerciseInput;
        addExerciseInput.id = 'addExerciseInput';
        addExerciseInput.placeholder = 'Nazwa ćwiczenia';

        const addExerciseButton = document.createElement('i');
        this.addExerciseButton = addExerciseButton;

        addExerciseButton.classList.add('addExercisePlus', 'fas', 'fa-plus-square');

        this.addExerciseDiv.appendChild(addExerciseInput);
        this.addExerciseDiv.appendChild(addExerciseButton);
        this.addExerciseButton.addEventListener('click', this.addExercise.bind(this));

    }
    showPlan() {
        document.querySelector('.content').innerHTML = "";
        for (const exercise of this.exercises) {
            exercise.showInDOM();
        }
        document.querySelector('.content').appendChild(this.addExerciseDiv);
    }

    addExercise() {
        const exerciseName = this.addExerciseInput.value;
        if (exerciseName) {
            const newExercise = new Exercise(exerciseName);
            this.exercises.push(newExercise);
            this.addExerciseInput.value = "";
            this.showPlan();
        } else {
            this.addExerciseInput.classList.add('animateEmptyInput');
            setTimeout(() => this.addExerciseInput.classList.remove('animateEmptyInput'), 1000)
        }

    }

    addPlanToDOM() {
        const newDiv = document.createElement('div');
        newDiv.classList.add('plan');
        newDiv.textContent = this.name;
        newDiv.addEventListener('click', this.showPlan.bind(this))
        this.nav.appendChild(newDiv);
    }
}

class Exercise {
    constructor(name, image = "https://cnet1.cbsistatic.com/img/sRejNDr7D67rMcvwI11v6xrJcho=/940x0/2019/11/12/e66cc0f3-c6b8-4f6e-9561-e23e08413ce1/gettyimages-1002863304.jpg", description = 'there is no description') {
        this.name = name;
        this.image = image;
        this.description = description;
        this.results = [];
        this.exerciseCardContent = '';
        this.exerciseCardHeader = '';
        this.exerciseListDown = '';
        this.addResultButton = '';
        this.exerciseSecondRow = '';
    }

    showInDOM() {
        const createCardHeader = () => {
            const exerciseCardHeader = document.createElement('div');
            exerciseCardHeader.classList.add('exerciseCardHeader');

            const exerciseTitle = document.createElement('h2');
            exerciseTitle.classList.add('exerciseTitle');
            exerciseTitle.textContent = this.name;

            exerciseCardHeader.appendChild(exerciseTitle);

            for (let i = 0; i < 3; i++) {
                const result = document.createElement('div');
                result.classList.add('result', 'green');
                result.textContent = '25kg';
                exerciseCardHeader.appendChild(result);
            }

            const listDown = document.createElement('i');
            listDown.classList.add('listDown', 'fas', 'fa-chevron-down');
            this.exerciseListDown = listDown;
            // this.exerciseListDown.addEventListener('click', this.showExerciseContent.bind(this));
            exerciseCardHeader.appendChild(listDown);
            return exerciseCardHeader;
        }

        const createCardContent = () => {
            const exerciseFirstRow = document.createElement('div');
            exerciseFirstRow.classList.add('exerciseFirstRow');
            const img = document.createElement('img');
            img.src = this.image;

            const inputDiv = document.createElement('div');

            const inputs = [{
                name: 'weight',
                placeholder: 'Ciężar'
            }, {
                name: 'reps',
                placeholder: 'Liczba powtórzeń'
            }, {
                name: 'series',
                placeholder: 'Liczba serii'
            }]

            for (let i = 0; i < 3; i++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.classList.add('exerciseInput');
                input.name = inputs[i].name;
                input.placeholder = inputs[i].placeholder;
                inputDiv.appendChild(input);
            }
            const textArea = document.createElement('textarea');
            textArea.name = 'exerciseDescription';
            textArea.id = 'exerciseDescription';
            textArea.placeholder = 'Opis';
            textArea.rows = '9';

            const button = document.createElement('button');
            button.classList.add('addSeries');
            button.textContent = 'Dodaj';
            this.addResultButton = button;
            this.addResultButton.addEventListener('click', this.addResult.bind(this))

            const inputDiv2 = document.createElement('div');
            inputDiv2.appendChild(textArea);
            inputDiv2.appendChild(button);

            exerciseFirstRow.appendChild(img);
            exerciseFirstRow.appendChild(inputDiv);
            exerciseFirstRow.appendChild(inputDiv2);

            const exerciseSecondRow = document.createElement('div');
            exerciseSecondRow.classList.add('exerciseSecondRow');
            // for (let i = 0; i < 20; i++) {
            //     const result = document.createElement('div');
            //     result.classList.add('result', 'green');
            //     result.textContent = '25kg';
            //     exerciseSecondRow.appendChild(result);
            // }

            this.exerciseSecondRow = exerciseSecondRow;
            const exerciseCardContent = document.createElement('div');
            exerciseCardContent.classList.add('exerciseCardContent', 'hiddenContent');
            exerciseCardContent.appendChild(exerciseFirstRow);
            exerciseCardContent.appendChild(exerciseSecondRow);

            return exerciseCardContent;
        }

        this.exerciseCardHeader = createCardHeader();
        this.exerciseCardContent = createCardContent();
        this.exerciseCardHeader.addEventListener('click', this.showExerciseContent.bind(this))
        const exerciseCard = document.createElement('div');
        exerciseCard.classList.add('exerciseCard');
        exerciseCard.appendChild(this.exerciseCardHeader);
        exerciseCard.appendChild(this.exerciseCardContent);

        document.querySelector('.content').appendChild(exerciseCard);

    }
    showExerciseContent() {
        if (this.exerciseCardContent.classList.contains('hiddenContent')) {
            this.exerciseCardContent.style.transition = 'height .3s, min-height .3s, padding .01s';
            this.exerciseCardContent.style.height = '350px';
            setTimeout(() => this.exerciseCardContent.style.height = '', 300);
            this.exerciseListDown.classList.remove('fa-chevron-down');
            this.exerciseListDown.classList.add('fa-chevron-up');
        } else {
            this.exerciseCardContent.style.transition = 'height .3s, min-height .3s, padding .3s';
            this.exerciseListDown.classList.remove('fa-chevron-up');
            this.exerciseListDown.classList.add('fa-chevron-down');
        }
        this.exerciseCardContent.classList.toggle('hiddenContent');
    }
    colorizeResults() {
        const resultTab = [...this.exerciseSecondRow.querySelectorAll('.result')];
        const newTab = resultTab.map(result => result.textContent.slice(0, result.textContent.indexOf('kg')));
        resultTab.forEach((result, i) => {
            console.log(result);
            if ((i > 0 && parseInt(result.textContent.slice(0, result.textContent.indexOf('kg'))) < parseInt(resultTab[i - 1].textContent.slice(0, resultTab[i - 1].textContent.indexOf('kg'))))) {
                result.classList.remove('green');
                result.classList.add('red');
            }
        });
    }

    addResult() {
        const propertiesTab = ["weight", "reps", "series", "exerciseDescription"];
        const values = [];
        let empty = 0;
        propertiesTab.forEach((property, i) => {
            if (property == 'exerciseDescription') {
                values[i - empty] = this.exerciseCardContent.querySelector(`textarea[name="${property}"]`);
            } else {
                const input = this.exerciseCardContent.querySelector(`input[name="${property}"]`);
                if (input.value)
                    values[i - empty] = input;
                else {
                    empty++;
                    input.classList.add('animateEmptyInput');
                    setTimeout(() => input.classList.remove('animateEmptyInput'), 1000)
                }
            }
        })
        let newResult = 0;
        if (values.length == propertiesTab.length) {
            newResult = new Result(values[0].value, values[1].value, values[2].value, values[3].value);
            values.forEach(input => input.value = '');
            this.results.push(newResult);
            this.exerciseSecondRow.appendChild(newResult.addResultToDOM());
            this.colorizeResults();
        }

    }

}

class Result {
    constructor(weight, reps, series, description) {
        this.date = Date.now();
        this.weight = weight;
        this.reps = reps;
        this.series = series;
        this.description = description;
        this.resultWindow = document.querySelector('.resultWindow');
    }
    addResultToDOM() {
        const div = document.createElement('div');
        div.classList.add('result');
        div.textContent = this.weight + 'kg';
        div.addEventListener('mouseover', this.showResultWindow.bind(this));
        div.addEventListener('mouseout', this.hideResultWindow.bind(this));
        return div;
    }

    showResultWindow(e) {
        if (e.target.classList.contains('red'))
            this.resultWindow.querySelector('.resultWeight').classList.add('red');
        else
            this.resultWindow.querySelector('.resultWeight').classList.remove('red');
        this.resultWindow.querySelector('.resultWeight').textContent = this.weight + 'kg';
        this.resultWindow.querySelector('.repsDiv').textContent = this.reps;
        this.resultWindow.querySelector('.seriesDiv').textContent = this.series;
        this.resultWindow.querySelector('.resultDescription').textContent = this.description;
        this.resultWindow.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    hideResultWindow(e) {
        this.resultWindow.style.transform = 'translate(-50%, -50%) scale(0)';
    }
}

const app = new Application();
const plansContainer = new PlansContainer();