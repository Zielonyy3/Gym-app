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
        // console.log(e.target);
        // console.log(this.addPlanForm.contains(e.target));
        // if (document.querySelector('.swal-overlay'))
        //     console.log(document.querySelector('.swal-overlay').contains(e.target));
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
    }
    addPlanToDOM() {
        console.log('elo');
        const newDiv = document.createElement('div');
        newDiv.classList.add('plan');
        newDiv.textContent = this.name;
        this.nav.appendChild(newDiv);
    }
}

class Exercise {
    constructor() {
        name = this.name;
        image = this.image;
        description = this.description;
    }
}

const app = new Application();
const plansContainer = new PlansContainer();