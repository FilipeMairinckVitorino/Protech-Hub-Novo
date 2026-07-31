import { chaveAPI, getApostilas, linkAPI_apostilas } from "./API.js"

const userViewer = document.querySelector("span#ctr_view")
const sectionApostilas = document.querySelector("section.apostila")
const userSalvo = localStorage.getItem("user")

if (userSalvo == null){
    window.location.href = "login.html"
} else {
    const user = JSON.parse(userSalvo)

    userViewer.innerHTML = user.CTR

    const buscas = []

    if (user.Kit1 == true) {
        buscas.push(getApostilas(linkAPI_apostilas, chaveAPI, 1))
    }

    if (user.Kit2 == true) {
        buscas.push(getApostilas(linkAPI_apostilas, chaveAPI, 2))
    }

    const resultados = await Promise.all(buscas)

    resultados.forEach(conteudo => {

        if (!conteudo) return

        conteudo.forEach(element => {
            sectionApostilas.innerHTML += `
                <div class="apostila">
                    <img src="Image/Apostilas/${element.id}.png" alt="apostila" class="apostila">
                    <a href="apostila.html" class="apostila">${element.id} - ${element.nome}</a>
                </div>
            ` 
        })
    })

    if (user.Kit1 == false && user.Kit2 == false) {
        sectionApostilas.style.display = 'none'
        document.querySelector("span#semApostilas").style.display = 'block'
    }

    const divsApostilas = document.querySelectorAll("div.apostila")

    divsApostilas.forEach((element)=>{
        element.querySelector("a.apostila").addEventListener("click", (event)=>{
            event.preventDefault()

            let numApostila = element.querySelector("a.apostila").innerHTML.slice(0,2)

            localStorage.setItem("apostila", numApostila)

            location.href = "apostila.html"
        })
    })

    document.querySelectorAll("img.apostila").forEach(element => {
        element.addEventListener("click", ()=>{
            element.nextElementSibling.click()
        })
    })
    
}

// © 2026 Filipe Mairinck Vitorino. Todos os direitos reservados.
