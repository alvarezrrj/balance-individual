class BalanceIndividual extends HTMLElement {
    questions = [
        'Me preocupo por conocer cómo trabajan a quienes compro productos o servicios; si sé que no tienen conductas éticas (con empleados, medioambiente, etc.), no les compro',
        'Pongo mi dinero en bancos con fines principalmente sociales',
        'Invierto mis ganancias/beneficios/ahorros en fines sociales',
        'Contribuyo activamente a que las condiciones (de vida, familiares, de trabajo) de los que me rodean sean dignas, denunciándolas en caso contrario y/o tratando de cambiarlas si no son aceptables',
        'Las tareas se deben repartir de forma justa en el entorno laboral (o de estudio) y así lo hago (si soy el responsable) y lo exijo (si no)',
        'Las tareas de casa se deben repartir de forma equitativa entre los miembros de la familia, en función de su edad y habilidades, no discriminando por razón de género',
        'La renta se debe repartir de forma equilibrada según el trabajo desarrollado, con un máximo y un mínimo entre el que cobra más y el que menos y sin discriminar por razón de genero, raza o edad',
        'Tomo las decisiones teniendo en cuenta a los demás, de forma democrática o por consenso, si es posible',
        'Hago accesible la información de utilidad para los demás de la que dispongo o todos los que quieran conocerla',
        'Soy solidario/a con los demás, tanto en las situaciones puntuales y cotidianas (no sólo con conocidos) como con organizaciones',
        'Aporto a la comunidad que me rodea, participando activamente y cooperando con las causas sociales que se desarrollan en ésta',
        'Tengo una actitud ecológica; genero los mínimos residuos y los gestiono correctamente, reciclando y reutilizando aquellos que produzco, siempre que es posible su reciclado o reutilización',
        'Promuevo y demando a los demás que tengan una conducta respetuosa con el medioambiente, por el beneficio de todos.',
        'Mis acciones tienen por objeto el beneficio de los que me rodean (no sólo el mío y/o el mi familia cercana y amigos)',
        'Mis acciones tienen por fin principal contribuir a la sostenibilidad tanto en el ámbito social como medioambiental',
        'Creo que cooperar con los demás es más beneficioso para todos que competir'
    ];

    results = {
        A: 'Funcionamiento vital orientado principalmente hacia el bien común y prácticas coherentes con ello. Puedes ser un ejemplo para los demás. ¡Enhorabuena y gracias!',
        B: 'Mucho interés por el bien común y buenas prácticas al respecto. Algún área de mejora (en lo relativo a la frecuencia). Puedes ser ejemplo para otros y aprender de otras buenas prácticas para seguir mejorando.',
        C: 'Interés personal demostrable por la economía del bien común, con áreas de mejora. Puedes ayudar a los que se inician en estas prácticas, compartiendo las tuyas.',
        D: 'Se evidencia un interés por el bien común, pero hay bastantes ámbitos donde mejorar y se requeriría una mayor orientación de las prácticas personales hacia el bien común. Trabajando por ello se puede conseguir.',
        E: 'Algunos intereses en relación con el bien común, pero hay muchas áreas donde mejorar en tu práctica diaria. Con interés y esfuerzo podrás lograr tu objetivo. ¡Ánimo!',
    }

    modalContent = `
        <header>
            <h1>Tu resultado: <span></span></h1>
            <h2>¿Cómo se interpreta mi resultado?</h2>
        </header>
        <p></p>
        <footer>
            <small>
            ¡Enhorabuena si has tenido una alta puntuación! Y si está por debajo de lo que te gustaría, mucho ánimo porque contribuir más al bien común está en tu mano. 
            </small>
            <form>
                <button autofocus value="cancel" formmethod="dialog">Cerrar</button>
            </form>
        </footer>
    `;

    wrapper;
    dialog;


    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        const wrapper = document.createElement('div');
        this.wrapper = wrapper;
        wrapper.setAttribute('id', 'wrapper');
        const toggle = wrapper.appendChild(document.createElement('button'));
        toggle.textContent = "Completá el cuestionario";
        const tableWrapper = wrapper.appendChild(document.createElement('div'));
        const table = tableWrapper.appendChild(document.createElement('table'));
        // Table caption
        const caption = table.appendChild(document.createElement('caption'));
        caption.innerHTML = "<small>LEYENDA: (1) Siempre; (2) A Veces; (3) Nunca; (4) No pero me gustaría.</small>";
        // Table header
        const thead = table.appendChild(document.createElement('thead'));
        const thr = thead.appendChild(document.createElement('tr'));
        const thd1 = thr.appendChild(document.createElement('th'));
        thd1.textContent = "Afirmación a valorar (con hechos contrastables)";
        const thd2 = thr.appendChild(document.createElement('th'));
        thd2.textContent = '1';
        const thd3 = thr.appendChild(document.createElement('th'));
        thd3.textContent = '2';
        const thd4 = thr.appendChild(document.createElement('th'));
        thd4.textContent = '3';
        const thd5 = thr.appendChild(document.createElement('th'));
        thd5.textContent = '4';
        // Table body
        const tbody = table.appendChild(document.createElement('tbody'));
        for (let question of this.questions) {
            let questionRow = tbody.appendChild(document.createElement('tr'));
            let question1 = questionRow.appendChild(document.createElement('td'));
            question1.textContent = question;
            this.appendOptions(questionRow, this.questions.indexOf(question));
        }
        // Modal
        const dialog = wrapper.appendChild(document.createElement('dialog'));
        dialog.innerHTML = this.modalContent;
        this.dialog = dialog;

        // Submit
        const submitWrapper = tableWrapper.appendChild(document.createElement('div'));
        submitWrapper.setAttribute('id', 'submit-wrapper');
        const submit = submitWrapper.appendChild(document.createElement('button'));
        submit.textContent = 'Calcular';
        submit.addEventListener('click', () => {
            // Find unanswered questions
            if (this.findUnanswered()) return;
            // Calculate score
            this.score();
        })

        // Toggle
        toggle.addEventListener('click', () => {
            wrapper.classList.toggle('show');
        })

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            #wrapper {
                display: grid;
                grid-template-rows: auto 0fr;
                transition: grid-template-rows .3s ease-out;
                padding: 1rem;
                max-width: fit-content;
                --color-green: #4d8;
                --color-green-contrast: white;
                --color-lime: #9d5;
                --color-lime-contrast: white;
                --color-yellow: #ed0;
                --color-yellow-contrast: black;
                --color-orange: #e94;
                --color-orange-contrast: white;
                --color-red: #a35;
                --color-red-contrast: white;
            }
            caption {
                text-align: right;
            }
            table {
                border-collapse: collapse;
                border-radius: 1rem;
                overflow: hidden;
            }
            table td {
                padding: .375rem;
            }
            table thead th:first-child {
                text-align: left;
                padding: .375rem;
            }
            table thead tr:nth-child(1) {
                background-color:  #0088cc66;
            }
            table tbody tr:nth-child(odd) {
                background-color: #f2f2f2;
            }
            table tbody tr:nth-child(even) {
                background-color: #fbfbfb;
            }
            table tbody tr:hover {
                background-color: #ddd;
            }
            table tbody tr.invalid {
                background-color: color-mix(in srgb, white 50%, var(--color-red));
            }
            #submit-wrapper {
                display: flex;
                justify-content: flex-end;
                margin-top: .5rem;
            }
            #submit-wrapper button {
                margin-top: .5rem;
            }
            #wrapper.show {
                grid-template-rows: auto 1fr;
            }
            #wrapper button {
                margin-bottom: 1rem;
                width: fit-content;
                padding: 1rem 2.5rem;
                border: none;
                border-radius: 100px;
                background-color: #0088cc;
                color: #fff;
                cursor: pointer;
                text-transform: uppercase;
                font-weight: 700;
                font-size: .875rem;
            }
            #wrapper button:hover,
            #wrapper button:focus {
                background-color: #0078b4;
            }
            #wrapper div {
                overflow: hidden;
            }
            @media only screen and (max-width: 576px) {
                #wrapper {
                    font-size: .875rem;
                    padding: 1rem 0;
                }
                caption {
                    margin-right: .25rem;
                }
            }
            dialog {
                border: none;
                border-radius: 25px;
                box-shadow: 0px 0px 15px;
                padding: 1rem 1.5rem;
                max-width: 768px;
            }
            dialog span {
                width: 2em;
                height: calc(2em / 1.67);
                color: white;
                border-radius: .375em;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            dialog h1 {
                margin-top: .25rem;
            }
            dialog form {
                display: flex;
                justify-content: flex-end;
                margin-top: 1rem;
            }
            .A {
                background-color: var(--color-green);
                color: var(--color-green-contrast);
            }
            .B {
                background-color: var(--color-lime);
                color: var(--color-lime-contrast);
            }
            .C {
                background-color: var(--color-yellow);
                color: var(--color-yellow-contrast);
            }
            .D {
                background-color: var(--color-orange);
                color: var(--color-orange-contrast);
            }
            .E {
                background-color: var(--color-red);
                color: var(--color-red-contrast);
            }
        `;
        this.shadowRoot.append(style, wrapper);
    }

    result(key) {
        return 
    }

    /**
     * Appends radio options to a question row
     * @param {HTMLElement} row
     * @param {number} questionNumber 
     */
    appendOptions(row, questionNumber) {
        for (let i=0; i<4; i++) {
            let td = row.appendChild(document.createElement('td'));
            let input = td.appendChild(document.createElement('input'));
            input.setAttribute('type', 'radio')
            input.setAttribute('value', i+5 % 4)
            input.setAttribute('name', `question${questionNumber}`);
            input.addEventListener('click', e => this.clearUncheckedClass(e));
        }
    }

    /** 
     * Finds unanswered question, focuses on it, scrolls to it and adds invalid
     * class to row
     * @return bool
     */
    findUnanswered() {
        let rows = this.wrapper.querySelectorAll('tr');
        for (let row of rows) {
            let unchecked = row.querySelectorAll('input:not(:checked)');
            if (unchecked.length > 3) {
                unchecked[0].focus();
                unchecked[0].scrollIntoView();
                unchecked[0].closest('tr').classList.add('invalid')
                return true;
            }
        }
        return false;
    }

    /**
     * @return void
     */
    score() {
        let ones = this.wrapper.querySelectorAll('input[value="1"]:checked').length;
        let twos = this.wrapper.querySelectorAll('input[value="2"]:checked').length;
        let threes = this.wrapper.querySelectorAll('input[value="3"]:checked').length;
        let fours = this.wrapper.querySelectorAll('input[value="4"]:checked').length;
        let total = ones*10 + twos*6 + threes*0 + fours*2;
        let key;
        if (total > 130) key = 'A';
        if (total > 100 && total <= 130) key = 'B';
        if (total > 70 && total <= 100) key = 'C';
        if (total > 35 && total <= 70) key = 'D';
        if (total <= 35) key =  'E';

        let score = this.dialog.querySelector('span')
        score.classList.remove('A', 'B', 'C', 'D', 'E');
        score.classList.add(key);
        score.textContent = key;
        
        this.dialog.querySelector('p').textContent = this.results[key];
        this.dialog.showModal();
    }

    clearUncheckedClass(event) {
        event.target.closest('tr').classList.remove('invalid');
    }
}

customElements.define('balance-individual', BalanceIndividual);