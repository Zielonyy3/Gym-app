<<<<<<< HEAD
=======
class Application {
    constructor() {}
}

class Plans {
    constructor() {
        this.plansList = document.querySelector('.nav');
        this.plansListButton = document.querySelector('.plansListButton');
        this.plansListButton.addEventListener('click', this.showPlansList.bind(this))
        this.addPlanForm = document.querySelector('.addPlanForm');
        this.container = document.querySelector('.container');
        this.addButtons = document.querySelectorAll('.addPlanButton');
        addEventListener('click', this.addPlan.bind(this));


    }
    showPlansList() {
        this.plansList.classList.toggle('navHidden');
    }
    addPlan(e) {
        // console.log(e.target);
        // console.log(this.addPlanForm.contains(e.target));
        for (const button of this.addButtons) {
            if (button == e.target && this.addPlanForm.dataset.show == 0) {
                this.addPlanForm.dataset.show = 1;
                this.addPlanForm.classList.remove('addPlanFormHidden');
                this.container.classList.add('blur');

            } else if (this.addPlanForm.dataset.show == 1 && !(this.addPlanForm.contains(e.target))) {
                swal({
                        title: "Porzucić nowy plan?",
                        text: "Czy chcesz zamknąć bez zapisywania?",
                        icon: "warning",
                        buttons: ["Zostaw!", "Porzuć"],
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            this.addPlanForm.dataset.show = 0;
                            this.addPlanForm.classList.add('addPlanFormHidden');
                            this.container.classList.remove('blur');
                        } else {
                            this.addPlanForm.dataset.show = 0;
                        }
                    });

            } else if (!(this.addPlanForm.classList.contains('addPlanFormHidden')))
                this.addPlanForm.dataset.show = 1;

        }
    }
}

const app = new Application();
const plan = new Plans();
>>>>>>> 4bdbd65... Add interaection with "add plan" button
