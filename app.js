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
    }

    showInDOM() {
        const exerciseCard = document.createElement('div');
        exerciseCard.classList.add('exerciseCard');

        const header = this.createCardHeader();
        const content = this.createCardContent();
        exerciseCard.appendChild(header);
        exerciseCard.appendChild(content);

        document.querySelector('.content').appendChild(exerciseCard);

    }

    createCardHeader() {
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
        exerciseCardHeader.appendChild(listDown);
        console.log(exerciseCardHeader);
        return exerciseCardHeader;
    }

    createCardContent() {
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

        const inputDiv2 = document.createElement('div');
        inputDiv2.appendChild(textArea);
        inputDiv2.appendChild(button);

        exerciseFirstRow.appendChild(img);
        exerciseFirstRow.appendChild(inputDiv);
        exerciseFirstRow.appendChild(inputDiv2);
        console.log(exerciseFirstRow);

        const exerciseSecondRow = document.createElement('div');
        exerciseSecondRow.classList.add('exerciseSecondRow');
        for (let i = 0; i < 20; i++) {
            const result = document.createElement('div');
            result.classList.add('result', 'green');
            result.textContent = '25kg';
            exerciseSecondRow.appendChild(result);
        }

        const exerciseCardContent = document.createElement('div');
        exerciseCardContent.classList.add('exerciseCardContent');
        exerciseCardContent.appendChild(exerciseFirstRow);
        exerciseCardContent.appendChild(exerciseSecondRow);

        return exerciseCardContent;
    }
}

const app = new Application();
const plansContainer = new PlansContainer();