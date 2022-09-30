let validators = {
    tituloValido: false,
    conteudoValido: false
}


const tituloInput = document.querySelector("input");
const conteudoInput = document.querySelector("textarea");
let botaoSubmit = document.querySelector("button");
botaoSubmit.disabled = true;

function checkTitulo() {
    tituloInput.addEventListener("blur", ()=> {

        if(tituloInput.value.trim().length === 0) {
            tituloInput.classList.add("notValid");
            validators.tituloValido = false;
            checkButton();
        } else {
            tituloInput.classList.remove("notValid");
            validators.tituloValido = true;
            checkButton();
        }
    }) 
}

function checkConteudo() {
    conteudoInput.addEventListener("blur", ()=> {
        if(conteudoInput.value.trim().length === 0) {
            conteudoInput.classList.add("notValid");
            validators.conteudoValido = false;
            checkButton();
        } else {
            conteudoInput.classList.remove("notValid");
            botaoSubmit.classList.remove("notValid");
            validators.conteudoValido = true;
            checkButton();
        }
    })
}

function checkButton() {
    console.log(validators)
    for(key in validators) {
        if(validators[key] === false) {
            botaoSubmit.disabled = true;
            return
        }
        botaoSubmit.disabled = false;
    }
}

checkTitulo();
checkConteudo();