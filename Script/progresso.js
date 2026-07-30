import { linkAPI_atividades, linkAPI_atividades_concluidas, chaveAPI, getTodasAtividades, getConcluidasDoAluno} from "./API.js"
import { loadingInit, loadingEnd } from "./exportFunctions.js"

const userViewer = document.querySelector("span#ctr_view")
const inputCTR = document.querySelector("input#ctrProgresso")
const buttonBusca = document.querySelector("button#buscaCTR")
const sectionResultado = document.querySelector("section#resultado")
const divApostilas = document.querySelector("div#apostilasConcluidas")
const spanSemApostilas = document.querySelector("span#semApostilas")
const tituloResultado = document.querySelector("h2#tituloResultado")
const userSalvo = JSON.parse(localStorage.getItem("user"))

document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", (event) => {
        event.preventDefault()
    })
})

if (userSalvo == null || userSalvo.userLv != "professor") {
    window.location.href = "login.html"
} else {

    buttonBusca.addEventListener("click", async (event) => {
        event.preventDefault()

        const ctr = inputCTR.value

        if (ctr == "") {
            alert("Digite o CTR")
            return
        }

        loadingInit(buttonBusca, document.querySelector("div#buscaLoad"))

        try {
            const atividades = await getTodasAtividades(linkAPI_atividades, chaveAPI)
            const concluidas = await getConcluidasDoAluno(linkAPI_atividades_concluidas, chaveAPI, ctr)

            if (atividades == null || concluidas == null) return

            if (concluidas.length == 0) {
                mostraResultado(ctr, [])
                return
            }

            mostraResultado(ctr, apostilasCompletas(atividades, concluidas))

        } finally {
            loadingEnd(buttonBusca, document.querySelector("div#buscaLoad"))
        }
    })
}

function apostilasCompletas(atividades, concluidas) {

    const totalPorApostila = {}

    atividades.forEach(atividade => {

        const apostila = parseInt(atividade.apostila)

        if (totalPorApostila[apostila] == undefined) {
            totalPorApostila[apostila] = { kit: atividade.kit, total: 0 }
        }

        totalPorApostila[apostila].total++
    })

    const feitasPorApostila = {}
    const idsContados = []

    concluidas.forEach(concluida => {

        if (idsContados.includes(concluida.atividade_id)) return

        idsContados.push(concluida.atividade_id)

        const atividade = atividades.find(item => item.id == concluida.atividade_id)

        if (atividade == undefined) return

        const apostila = parseInt(atividade.apostila)

        if (feitasPorApostila[apostila] == undefined) {
            feitasPorApostila[apostila] = 0
        }

        feitasPorApostila[apostila]++
    })

    const completas = []

    Object.keys(totalPorApostila).forEach(apostila => {

        const total = totalPorApostila[apostila].total
        const feitas = feitasPorApostila[apostila] || 0

        if (total > 0 && feitas >= total) {
            completas.push({
                apostila: parseInt(apostila),
                kit: totalPorApostila[apostila].kit,
                total: total
            })
        }
    })

    completas.sort((a, b) => a.apostila - b.apostila)

    return completas
}

function mostraResultado(ctr, completas) {

    divApostilas.innerHTML = ""
    sectionResultado.style.display = "block"
    tituloResultado.innerHTML = `Módulos concluídos - CTR ${ctr}`

    if (completas.length == 0) {
        divApostilas.style.display = "none"
        spanSemApostilas.style.display = "block"
        return
    }

    spanSemApostilas.style.display = "none"
    divApostilas.style.display = "flex"

    completas.forEach(element => {
        divApostilas.innerHTML += `
            <div class="apostilaConcluida">
                <img src="Image/Apostilas/${element.apostila}.png" alt="apostila">
                <div class="infoApostila">
                    <span class="tituloApostila">Apostila ${String(element.apostila).padStart(2,"0")} <strong>✔</strong></span>
                    <span class="detalheApostila">${element.total} atividades concluídas</span>
                </div>
            </div>
        `
    })
}

// © 2026 Filipe Mairinck Vitorino. Todos os direitos reservados.
