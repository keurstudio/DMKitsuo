init()
global_hub()


function new_image(src) {
    img = new Image()
    img.src = src
    return img
}


function getMousePos(c, event) {
    var rect = c.getBoundingClientRect()
    return {
        x: (event.clientX - rect.left)/zoom,
        y: (event.clientY - rect.top)/zoom
    }
}


function reportWindowSize() {

    canvas.style.transformOrigin = 'top left'
    zoom = window.innerHeight / 1080
    canvas.style.transform="scale(" + zoom + "," + zoom + ")"

}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


function afficher_money(x=1720, y=200) {

    ctx.drawImage(imgs["money"], x-36, y-36, 72, 72)
    ctx.font = 42 + "px Romelio"
    ctx.fillStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.strokeText(heros.or, x, y)
    ctx.fillText(heros.or, x, y)
    ctx.lineWidth = 1

}


function afficher_artefacts(x=200, y=200) {

    ctx.font = 42 + "px Romelio"
    ctx.fillStyle = "#ffffff"

    for (let i = 0; i < heros.artefacts.length; i++) {
        ctx.drawImage(imgs["artefact"+(1+heros.artefacts[i])], x-36+72*i, y-36, 72, 72)

        if ( (xyMouseMove.x - (x+72*i))**2 + (xyMouseMove.y - y)**2 < 1300) {
            let x_text = xyMouseMove.x
            let y_text = xyMouseMove.y+50
            let str = infos_artefacts[heros.artefacts[i]].text
            let words = str.split(" ")
            let print = words[0]
            words.splice(0, 1)
            ctx.font = "36px Arial"

            while (words.length > 0) {

                if (ctx.measureText(print + " " + words[0]).width < 360) {
                    print += " " + words[0]
                    words.splice(0, 1)
                } else {
                    ctx.strokeText(print, x_text, y_text)
                    ctx.fillText(print, x_text, y_text)
                    y_text += 40
                    print = words[0]
                    words.splice(0, 1)
                }
            }
            ctx.strokeText(print, x_text, y_text)
            ctx.fillText(print, x_text, y_text)
        }

        if (activations_artefacts[heros.artefacts[i]] >= 0) {
            ctx.font = "42px Arial"
            ctx.lineWidth = 3
            ctx.strokeText(activations_artefacts[heros.artefacts[i]], x+72*i, y)
            ctx.fillText(activations_artefacts[heros.artefacts[i]], x+72*i, y)
            ctx.lineWidth = 1
        }
    }

}


function init() {

    zoom = 1

    canvas = document.getElementById("canvasJeu")
    ctx = canvas.getContext("2d")
    ctx.font = "32px Arial"
    ctx.textBaseline = "middle"

    faces = ["etonne", "good", "happy", "interrogatif", "larmoyant", "neutral", "sad", "unhappy"]
    elts = ["normal", "eau", "electricite", "feu", "plante", "glace", "esprit", "tourmente", "amour"]

    xyMouseMove = {"x": -1, "y": -1}
    xyMouseDown = {"x": -1, "y": -1}
    xyMouseUp = {"x": -1, "y": -1}

    keyboard_keys = {50: "é", 65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l", 77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z"}

    clicked = {"down": false, "up": false, "right": false, "zoom": false, "keyboard": -1}

    window.addEventListener('resize', reportWindowSize)

    window.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, false)

    canvas.addEventListener("mousemove", function(event) {
        xyMouseMove = getMousePos(canvas, event)
    }, false)

    canvas.addEventListener("mousedown", function(event) {
        if (futur_mode == mode) {
            xyMouseDown = getMousePos(canvas, event)
            clicked.right = (event.which == 3)
            clicked.down = true
        }
    }, false)

    canvas.addEventListener("mouseup", function(event) {
        if (futur_mode == mode) {
            xyMouseUp = getMousePos(canvas, event)
            clicked.up = true
        }
    }, false)

    document.addEventListener('keydown', function(event) {
        clicked.keyboard = event.keyCode
    })

    imgs = {}
    imgs["souris"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/souris.png")
    imgs["ecran_titre"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/ecran_titre.jpg")
    imgs["shop"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/shop.png")
    imgs["monster"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/monster.png")
    imgs["elite"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/elite.png")
    imgs["boss"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/boss.png")
    imgs["campfire"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/campfire.png")
    imgs["question"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/question.png")

    for (let face of faces) {
        imgs["face_" + face] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/art/face_" + face + ".png")
    }

    for (let elt of elts) {
        imgs["art-heros-" + elt] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/art/parts_" + elt +"_heros.png")
    }

    imgs["background1"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/background1.png")
    imgs["carte"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/map.png")
    imgs["frappe"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/frappe.png")
    imgs["coeur"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/coeur.png")
    imgs["coeur_vide"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/coeur_vide.png")

    imgs["attaque"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/attaque.png")
    imgs["defense"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/defense.png")
    imgs["retrait"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/retrait.png")
    imgs["dormir"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/dormir.png")
    imgs["money"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/icons/money.png")

    for (let i = 1; i <= 42; i++) {
        imgs["monster" + i] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/monsters/monster" + i + ".png")
    }

    for (let i = 1; i <= 20; i++) {
        imgs["artefact" + i] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/artefacts/artefact_" + i + ".png")
    }

    imgs["background2"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/background2.png")
    imgs["background3"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/background3.png")
    imgs["firecamp_bg"] = new_image("https://keurstudio.github.io/DMKitsuo/Memoriz/graphics/firecamp_bg.png")

    mode = 0
    last_mode = 0
    futur_mode = 0

    serie = 1

    boutique = {"kanjis": [], "artefacts": []}

    transition = {"on": false, "step": 0}

    donjon = generer_donjon(20)

    deck = []
    mots_proposes = []
    mots_demandes = []

    affichage_erreurs = []
    affichage_degats = []
    frappes = []

    combos = {"ordre": [], "nb": 0, "font_time": 0}

    propositions_retrait = []

    dialogue = -1
    mystere = -1
    etape_tour = 0
    tour_idx = 0
    dj_step = 0

    ennemi_attack_steps = [15, 28, 39, 48, 55, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 0, 0, 0, 0]

    for (let i = 0; i < 20; i++) {
        deck.push(i)
    }

    barre_temps = {"x1": 160, "y1": 80, "w": 1600, "h": 40}
    barre_vivacite = {"x1": 160, "y1": 130, "w": 1600, "h": 24}
    banc = {"x1": 210, "y1": 840, "w": 1500, "h": 240}
    heros = {"x": 360, "y": 580, "y_carte": -1, "w": 192, "h": 192, "pvMax": 100, "pv": 100, "artefacts": [], "avancement_carte": 0, "num_etage": -1, "num_salle": -1, "temps_tour": 15, "temps_restant": 15, "debut_tour": new Date().getTime(), "mot_clicked" : -1, "vivacite": 0, "or": 0, "step_attack": -1, "debut_clignotement": -1, "decalage_x": 0}
    activations_artefacts = [0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1]

    exemple_ennemi = {"x": 1260, "y": 540, "w": 128, "h": 128, "num": 12, "pvMax": 20, "pv": 20, "specifs": [], "demandes": [Math.floor(Math.random()*kanjis.length)], "nb_demandes": 2}
    ennemis = [exemple_ennemi]

    reportWindowSize()
}


infos_artefacts = [

    {"num": 1, "price": 15, "text": "Régénère 1 pv tous les 12 kanjis trouvés"},
    {"num": 2, "price": 20, "text": "Quand les pv sont inférieurs à 50% du maximum, régénère 1 pv tous les 8 kanjis trouvés"},
    {"num": 3, "price": 18, "text": "Régénère 1 pv tous les 7 kanjis consécutifs trouvés"},
    {"num": 4, "price": 25, "text": "Quand les pv sont inférieurs à 25% du maximum, régénère 1 pv tous les 4 kanjis consécutifs trouvés"},
    {"num": 5, "price": 10, "text": "Régénère 2 pv au début de chaque combat"},
    {"num": 6, "price": 35, "text": "Une signification éronée de moins est proposée chaque tour"},
    {"num": 7, "price": 22, "text": "Après 9 kanjis trouvés, les dégats infligés en trouvant le prochain kanji sont doublés"},
    {"num": 8, "price": 19, "text": "Inflige 2 dégats à tous les ennemis tous les 6 kanjis consécutifs trouvés"},
    {"num": 9, "price": 17, "text": "Inflige 2 dégats à tous les ennemis tous les 10 kanjis trouvés"},
    {"num": 10, "price": 13, "text": "Inflige 4 dégats à tous les ennemis tous les 10 kanjis ratés"},
    {"num": 11, "price": 16, "text": "Inflige 2 dégats à tous les ennemis tous les 10 dégats subis"},
    {"num": 12, "price": 21, "text": "La jauge de vivacité diminue de 10% de moins en cas d'erreur sur un kanji"},
    {"num": 13, "price": 32, "text": "L'augmentation de dégats de la jauge de vivacité est augmentée de 10%"},
    {"num": 14, "price": 12, "text": "Les kanjis des séries précédentes sont affichés en bleu"},
    {"num": 15, "price": 28, "text": "Augmente le temps d'un tour de 5%"},
    {"num": 16, "price": 23, "text": "Les kanjis d'anciennes séries apparaissent un peu plus souvent"},
    {"num": 17, "price": 10, "text": "Diminue le temps d'un tour de 5%"},
    {"num": 18, "price": 10, "text": "Diminue le temps du tour en cours d'une seconde à chaque erreur sur un kanji"},
    {"num": 19, "price": 10, "text": "Une signification éronée deplus est proposée chaque tour"},
    {"num": 20, "price": 10, "text": "La jauge de vivacité diminue de 10% de plus en cas d'erreur sur un kanji"},

]


bestiaire = [
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 1, "pvMax": 15, "pv": 15, "specifs": [], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 1, "or": 1},
    // Spécif 1 : inflige 1 dégat supplémentaire en cas d'erreur
    {"x": 1220, "y": 540, "w": 128, "h": 128, "num": 2, "pvMax": 32, "pv": 32, "specifs": [1], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 1, "or": 1},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 3, "pvMax": 22, "pv": 22, "specifs": [], "attaque": 1, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 1},
    // Spécif 2 : subit 50% de dégat en moins si plus de 50% du temps utilisé
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 4, "pvMax": 26, "pv": 26, "specifs": [2], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 1},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 5, "pvMax": 33, "pv": 33, "specifs": [], "attaque": 1, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 1},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 6, "pvMax": 38, "pv": 38, "specifs": [], "attaque": 0, "defense": 1, "demandes": [], "nb_demandes": 3, "or": 1},
    // Spécif 3 : régagne 5 pv pour chaque non trouvé (mais pas en cas d'erreur)
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 7, "pvMax": 42, "pv": 42, "specifs": [], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 1},
    // Spécif 6 : augmente l'attaque de 1 à chaque tour
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 8, "pvMax": 32, "pv": 32, "specifs": [6], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 1, "or": 1},
    // Spécif 7 : diminue la défense de 1 chaque tour
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 9, "pvMax": 40, "pv": 40, "specifs": [7], "attaque": 0, "defense": 4, "demandes": [], "nb_demandes": 2, "or": 1},

    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 10, "pvMax": 50, "pv": 50, "specifs": [8], "attaque": 1, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 2},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 11, "pvMax": 55, "pv": 55, "specifs": [1,3], "attaque": 0, "defense": 1, "demandes": [], "nb_demandes": 2, "or": 2},
    {"x": 1220, "y": 540, "w": 128, "h": 128, "num": 12, "pvMax": 62, "pv": 62, "specifs": [1,2,6], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 1, "or": 2},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 13, "pvMax": 70, "pv": 70, "specifs": [5], "attaque": 0, "defense": 2, "demandes": [], "nb_demandes": 2, "or": 2},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 14, "pvMax": 76, "pv": 76, "specifs": [8,11], "attaque": 1, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 2},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 15, "pvMax": 85, "pv": 85, "specifs": [4], "attaque": 1, "defense": 1, "demandes": [], "nb_demandes": 2, "or": 2},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 16, "pvMax": 96, "pv": 96, "specifs": [1,2], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 3, "or": 2},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 17, "pvMax": 90, "pv": 90, "specifs": [1,11], "attaque": 0, "defense": 1, "demandes": [], "nb_demandes": 2, "or": 2},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 18, "pvMax": 104, "pv": 104, "specifs": [6], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 4, "or": 2},

    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 19, "pvMax": 111, "pv": 111, "specifs": [6], "attaque": 2, "defense": 1, "demandes": [], "nb_demandes": 3, "or": 3},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 20, "pvMax": 120, "pv": 120, "specifs": [3], "attaque": 1, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 3},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 21, "pvMax": 135, "pv": 135, "specifs": [1,8], "attaque": 0, "defense": 1, "demandes": [], "nb_demandes": 2, "or": 3},
    {"x": 1220, "y": 540, "w": 128, "h": 128, "num": 22, "pvMax": 75, "pv": 75, "specifs": [5,6], "attaque": 1, "defense": 0, "demandes": [], "nb_demandes": 4, "or": 3},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 23, "pvMax": 150, "pv": 150, "specifs": [7], "attaque": 0, "defense": 6, "demandes": [], "nb_demandes": 2, "or": 3},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 24, "pvMax": 156, "pv": 156, "specifs": [3,11], "attaque": 1, "defense": 0, "demandes": [], "nb_demandes": 3, "or": 3},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 25, "pvMax": 54, "pv": 54, "specifs": [4,9], "attaque": 5, "defense": 2, "demandes": [], "nb_demandes": 1, "or": 3},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 26, "pvMax": 162, "pv": 162, "specifs": [], "attaque": 1, "defense": 1, "demandes": [], "nb_demandes": 3, "or": 3},
    {"x": 1120, "y": 540, "w": 128, "h": 128, "num": 27, "pvMax": 140, "pv": 140, "specifs": [1,2,8,11], "attaque": 0, "defense": 1, "demandes": [], "nb_demandes": 2, "or": 3},


    // Elites étage 1 : 28, 29, 30
    // Spécif 4 : subit 100% de dégats en moins si plus de 50% du temps utilisé
    // Spécifs 8, 9, 10 : réduction de 10%, 20%, 30% du temps d'un tour
    // Spécif 11, 12 : 1, 2 mots proposés de plus
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 28, "pvMax": 120, "pv": 120, "specifs": [4,12,9], "attaque": 3, "defense": 1, "demandes": [], "nb_demandes": 2, "or": 5},
    // Spécif 5 : régénère 20% des pvMax à chaque début de tour
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 29, "pvMax": 50, "pv": 50, "specifs": [5,12,9], "attaque": 2, "defense": 0, "demandes": [], "nb_demandes": 3, "or": 5},
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 30, "pvMax": 150, "pv": 150, "specifs": [12,8], "attaque": 1, "defense": 1, "demandes": [], "nb_demandes": 5, "or": 5},

    // Elites étage 2 : 31, 32, 33
    // Spécif 4 : subit 100% de dégats en moins si plus de 50% du temps utilisé
    // Spécifs 8, 9, 10 : réduction de 10%, 20%, 30% du temps d'un tour
    // Spécif 11, 12 : 1, 2 mots proposés de plus
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 31, "pvMax": 250, "pv": 250, "specifs": [2,12,9], "attaque": 4, "defense": 1, "demandes": [], "nb_demandes": 3, "or": 10},
    // Spécif 5 : régénère 20% des pvMax à chaque début de tour
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 32, "pvMax": 150, "pv": 150, "specifs": [4,12,10,6], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 10},
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 33, "pvMax": 350, "pv": 350, "specifs": [12,8], "attaque": 2, "defense": 0, "demandes": [], "nb_demandes": 6, "or": 10},

    // Elites étage 3 : 31, 32, 33
    // Spécif 4 : subit 100% de dégats en moins si plus de 50% du temps utilisé
    // Spécifs 8, 9, 10 : réduction de 10%, 20%, 30% du temps d'un tour
    // Spécif 11, 12 : 1, 2 mots proposés de plus
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 34, "pvMax": 350, "pv": 250, "specifs": [2,12,9], "attaque": 4, "defense": 1, "demandes": [], "nb_demandes": 3, "or": 15},
    // Spécif 5 : régénère 20% des pvMax à chaque début de tour
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 35, "pvMax": 250, "pv": 150, "specifs": [4,12,10,6], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 15},
    {"x": 1120, "y": 540, "w": 256, "h": 256, "num": 36, "pvMax": 450, "pv": 350, "specifs": [12,8], "attaque": 2, "defense": 0, "demandes": [], "nb_demandes": 6, "or": 15},


    // Boss étage 1 : 37, 38
    // Spécif 13 : invoque un monstre à la fin de chaque tour
    {"x": 1120, "y": 540, "w": 384, "h": 384, "num": 37, "pvMax": 270, "pv": 270, "specifs": [9,11,13], "attaque": 3, "defense": 1, "demandes": [], "nb_demandes": 2, "or": 15},
    {"x": 1120, "y": 540, "w": 384, "h": 384, "num": 38, "pvMax": 230, "pv": 230, "specifs": [7,9,11,12], "attaque": 3, "defense": 5, "demandes": [], "nb_demandes": 4, "or": 15},

    // Boss étage 2 : 39, 40
    {"x": 1120, "y": 540, "w": 384, "h": 384, "num": 39, "pvMax": 440, "pv": 440, "specifs": [9,11,13], "attaque": 3, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 30},
    {"x": 1120, "y": 540, "w": 384, "h": 384, "num": 40, "pvMax": 480, "pv": 480, "specifs": [6,7,9,11,12], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 5, "or": 30},

    // Boss étage 3 : 39, 40
    {"x": 1120, "y": 540, "w": 384, "h": 384, "num": 41, "pvMax": 640, "pv": 440, "specifs": [9,11,13], "attaque": 3, "defense": 0, "demandes": [], "nb_demandes": 2, "or": 30},
    {"x": 1120, "y": 540, "w": 384, "h": 384, "num": 42, "pvMax": 680, "pv": 480, "specifs": [6,7,9,11,12], "attaque": 0, "defense": 0, "demandes": [], "nb_demandes": 5, "or": 45},

]


function generer_boutique() {

    boutique.kanjis = []
    boutique.artefacts = []

    let tries = 0

    while (boutique.kanjis.length < 3 && tries < 60) {

        let n = Math.floor(deck.length*Math.random())

        while (boutique.kanjis.indexOf(n) > -1 && tries < 60) {
            tries += 1
            n = Math.floor(deck.length*Math.random())
        }

        if (tries < 60) {
            boutique.kanjis.push({"idx": n, "pos": boutique.kanjis.length})
        }
    }

    tries = 0

    while (boutique.artefacts.length < 3 && tries < 60) {

        let n = Math.floor(16*Math.random())

        while ((boutique.artefacts.indexOf(n) > -1 || heros.artefacts.indexOf(n) > -1) && tries < 60) {
            tries += 1
            n = Math.floor(16*Math.random())
        }

        if (tries < 60) {
            boutique.artefacts.push({"idx": n, "pos": boutique.artefacts.length})
        }
    }

}


function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}


function invoquer_monster(liste_monstres) {

    for (let i = 0; i < liste_monstres.length; i++) {
        let ennemi_genere = clone(bestiaire.filter(x=>x.num == liste_monstres[i])[0])
        ennemi_genere.time_attack = -1
        ennemi_genere.step_attack = -1
        ennemi_genere.debut_clignotement = -1
        ennemi_genere.decalage_x = 0
        let x = -1
        let y = -1
        let trop_proche = true
        let tries = 0

        while (trop_proche && tries < 100) {
            tries += 1
            trop_proche = false
            x = 900 + (800-0.5*ennemi_genere.w)*Math.random()
            y = 400+(ennemi_genere.w*0.5-64) + (320-(ennemi_genere.w-128))*Math.random()

            for (let enemy of ennemis) {
                let dist = (enemy.x - x)**2 + 0.8*(enemy.y - y)**2
                if (dist < 90000-900*tries) {
                    trop_proche = true
                }
            }
        }

        ennemi_genere.x = x
        ennemi_genere.y = y
        ennemis.push(ennemi_genere)
    }

}


function generer_salle_monstres(salles_potentielles, profondeur) {

    let salle_idx = Math.min(Math.max(0, Math.round(((profondeur%salles_potentielles.length)/salles_potentielles.length)*salles_potentielles.length)-1 + Math.floor(3*Math.random())), salles_potentielles.length-1)
    let liste_monstres = salles_potentielles[salle_idx]

    ennemis = []

    for (let i = 0; i < liste_monstres.length; i++) {
        let ennemi_genere = clone(bestiaire.filter(x=>x.num == liste_monstres[i])[0])
        ennemi_genere.time_attack = -1
        ennemi_genere.step_attack = -1
        ennemi_genere.debut_clignotement = -1
        ennemi_genere.decalage_x = 0
        let x = -1
        let y = -1
        let trop_proche = true
        let tries = 0

        while (trop_proche && tries < 100) {
            tries += 1
            trop_proche = false
            x = 900 + (800-0.5*ennemi_genere.w)*Math.random()
            y = 400+(ennemi_genere.w*0.5-64) + (320-(ennemi_genere.w-128))*Math.random()

            for (let enemy of ennemis) {
                let dist = (enemy.x - x)**2 + 0.8*(enemy.y - y)**2
                if (dist < 90000-900*tries) {
                    trop_proche = true
                }
            }
        }

        ennemi_genere.x = x
        ennemi_genere.y = y
        ennemis.push(ennemi_genere)
    }
}


function generer_salle_elite(salles_potentielles) {

    let salle_idx = Math.floor(Math.random()*salles_potentielles.length)
    let liste_monstres = salles_potentielles[salle_idx]

    ennemis = []

    for (let i = 0; i < liste_monstres.length; i++) {
        let ennemi_genere = clone(bestiaire.filter(x=>x.num == liste_monstres[i])[0])
        ennemi_genere.time_attack = -1
        ennemi_genere.step_attack = -1
        ennemi_genere.debut_clignotement = -1
        ennemi_genere.decalage_x = 0

        let x = -1
        let y = -1
        let trop_proche = true
        let tries = 0

        while (trop_proche && tries < 100) {
            tries += 1
            trop_proche = false
            x = 900 + (800-0.5*ennemi_genere.w)*Math.random()
            y = 400+(ennemi_genere.w*0.5-64) + (320-(ennemi_genere.w-128))*Math.random()

            for (let enemy of ennemis) {
                let dist = (enemy.x - x)**2 + (enemy.y - y)**2
                if (dist < 90000) {
                    trop_proche = true
                }
            }
        }

        ennemi_genere.x = x
        ennemi_genere.y = y
        ennemis.push(ennemi_genere)
    }
}


function generer_salle_boss(salles_potentielles) {

    generer_salle_elite(salles_potentielles)
    dj_step += 1

}


salles_monsters = [
    [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [3, 2],
        [1, 3, 1],
        [2, 3, 1],
        [2, 2, 3],
        [4, 2, 1],
        [4, 4],
        [4, 3],
        [4, 3, 2],
        [1, 1, 4, 1],
        [5, 5],
        [5, 2, 5],
        [5, 5],
        [5, 6],
        [6, 6],
        [6, 7],
        [5, 7],
        [6, 8],
        [7, 8],
        [8, 8],
        [5, 5, 4],
        [5, 4, 6],
        [4, 6, 6],
        [6, 4, 7],
        [5, 7, 4],
        [6, 4, 8],
        [4, 7, 8],
        [8, 4, 8],
        [8, 9],
        [9, 9],
    ],

    [
        [10, 10],
        [10, 10, 10],
        [11, 10],
        [12, 11],
        [10, 12, 10],
        [11, 12, 10],
        [11, 11, 12],
        [13, 11, 10],
        [13, 13],
        [13, 12],
        [13, 12, 11],
        [10, 10, 13, 10],
        [14, 14],
        [14, 11, 14],
        [14, 14],
        [14, 15],
        [15, 15],
        [15, 16],
        [14, 16],
        [15, 17],
        [16, 17],
        [17, 17],
        [14, 14, 13],
        [14, 13, 15],
        [13, 15, 15],
        [15, 13, 16],
        [14, 16, 13],
        [15, 13, 17],
        [13, 16, 17],
        [17, 13, 17],
        [17, 18],
        [18, 18],
    ],

    [
        [19, 19],
        [19, 19, 19],
        [20, 19],
        [21, 20],
        [19, 21, 19],
        [20, 21, 19],
        [20, 20, 21],
        [22, 20, 19],
        [22, 22],
        [22, 21],
        [22, 21, 20],
        [19, 19, 22, 19],
        [23, 23],
        [23, 20, 23],
        [23, 23],
        [23, 24],
        [24, 24],
        [24, 25],
        [23, 25],
        [24, 26],
        [25, 26],
        [26, 26],
        [23, 23, 22],
        [23, 22, 24],
        [22, 24, 24],
        [24, 22, 25],
        [23, 25, 22],
        [24, 22, 26],
        [22, 25, 26],
        [26, 22, 26],
        [26, 27],
        [27, 27],
    ],

]


salles_elite = [ [ [28],[29],[30] ], [ [31], [32], [33] ], [ [34], [35], [36] ] ]

salles_boss = [ [ [37], [38] ], [ [39], [40] ], [ [41], [42] ] ]


function generer_donjon(profondeur, steps = 3) {

    let dj = []

    for (let i = 0; i < profondeur*steps; i++) {
        dj.push([])
    }

    for (let step = 0; step < steps; step++) {

        for (let i = 0; i < profondeur; i++) {
            let nb_salles = 3+Math.floor(3*Math.random())
            if (i%profondeur == profondeur-1) {
                nb_salles = 1
            }
            let range = 0.2*Math.random()
            let offset = -range*Math.random()

            for (let j = 0; j < nb_salles; j++) {
                let type = ""
                let rnd = Math.random()
                let y = offset + range + j*(1-2*range)/(nb_salles-1)

                if (nb_salles == 1) {
                    y = 0.3 + 0.4*Math.random()
                }

                if (rnd < 0.5) {
                    type = "monster"
                } else if (rnd < 0.63) {
                    if (i < 3) {
                        type = "monster"
                    } else {
                        type = "elite"
                    }
                } else if (rnd < 0.73) {
                    type = "shop"
                } else if (rnd < 0.83) {
                    type = "campfire"
                } else {
                    type = "question"
                }

                if (i == 0) {
                    type = "monster"
                }
                if (i%profondeur == profondeur-1) {
                    type = "boss"
                }

                if (i == profondeur-2) {
                    dj[i+step*profondeur].push({"type": "campfire", "next": [0], "y": y, "step": step})
                } else {
                    dj[i+step*profondeur].push({"type": type, "y": y, "next": [], "step": step})
                }

            }

            if (i >= 1 || step >= 1) {
                if (i % 2 == 0) {

                    let relier = 0

                    for (let j = 0; j < dj[i-1+step*profondeur].length; j++) {

                        dj[i-1+step*profondeur][j].next = [relier]

                        if (Math.random() < 0.5 && relier < dj[i+step*profondeur].length-1) {
                            relier += 1
                            dj[i-1+step*profondeur][j].next.push(relier)
                        }
                    }

                    while (relier < dj[i+step*profondeur].length-1) {
                        relier += 1
                        dj[i-1+step*profondeur][dj[i-1+step*profondeur].length-1].next.push(relier)
                    }

                } else {

                    let relier = dj[i+step*profondeur].length-1

                    for (let j = dj[i-1+step*profondeur].length - 1; j >= 0; j--) {

                        dj[i-1+step*profondeur][j].next = [relier]

                        if (Math.random() < 0.5 && relier > 0) {
                            relier -= 1
                            dj[i-1+step*profondeur][j].next.push(relier)
                        }
                    }

                    while (relier > 0) {
                        relier -= 1
                        dj[i-1+step*profondeur][0].next.push(relier)
                    }
                }
            }

        }

//        dj[profondeur*(step+1)-1][0] = {"type": "boss", "y": 0.5, "next": [], "step": step}
    }

    return dj
}


function animate_carte() {

    ctx.drawImage(imgs["carte"], -300-heros.avancement_carte*200, -108, (1920+96)*10, 1080+216)

    for (let i = 0; i < donjon.length; i++) {
        for (let j = 0; j < donjon[i].length; j++) {
            let salle = donjon[i][j]

            let x = 200*i+45-heros.avancement_carte*200
            let y = 100 + salle.y*900
            let coeff = 1
            if (heros.num_etage == -1 && i == 0) {
                coeff = 1.21 + 0.19*Math.sin(time/300)
            }

            if (heros.num_etage >= 0 && i == heros.num_etage + 1) {
                if (donjon[heros.num_etage][heros.num_salle].next.indexOf(j) >= 0) {
                    coeff = 1.21 + 0.19*Math.sin(time/300)
                }
            }
            ctx.drawImage(imgs[salle.type], x-32*coeff, y-32*coeff, 64*coeff, 64*coeff)

            if (coeff > 1.01 && clicked.down && xyMouseDown.x > x-32*coeff && xyMouseDown.x < x+32*coeff && xyMouseDown.y > y-32*coeff && xyMouseDown.y < y+32*coeff) {
                heros.y_carte = y
                if (salle.type === "monster") {
                    generer_salle_monstres(salles_monsters[dj_step], heros.num_etage)
                    tour_idx = 0
                    futur_mode = 2
                    heros.num_etage += 1
                    heros.num_salle = j
                } else if (salle.type === "elite") {
                    generer_salle_elite(salles_elite[dj_step])
                    tour_idx = 0
                    futur_mode = 2
                    heros.num_etage += 1
                    heros.num_salle = j
                } else if (salle.type === "boss") {
                    generer_salle_boss(salles_boss[dj_step])
                    tour_idx = 0
                    futur_mode = 2
                    heros.num_etage += 1
                    heros.num_salle = j
                } else if (salle.type === "campfire") {
                    propositions_retrait = tirer_propositions(deck, 3)
                    futur_mode = 3
                    heros.num_etage += 1
                    heros.num_salle = j
                } else if (salle.type === "question") {
                    mystere = Math.floor(mysteries.length*Math.random())
                    if (mystere == 2) {
                        propositions_retrait = tirer_propositions(deck, 3)
                    }
                    dialogue = -1
                    futur_mode = 4
                    heros.num_etage += 1
                    heros.num_salle = j
                } else if (salle.type === "shop") {
                    futur_mode = 5
                    heros.num_etage += 1
                    heros.num_salle = j
                }
            }

            for (let k = 0; k < donjon[i][j].next.length; k++) {
                ctx.beginPath()

                let x_end = x+200
                let y_end = 100+donjon[i+1][donjon[i][j].next[k]].y*900
                let x1 = x + (x_end-x)*(0.16-0.00015*(Math.abs(y_end-y)))
                let x2 = x + (x_end-x)*(0.84+0.00015*(Math.abs(y_end-y)))
                let y1 = y + (y_end-y)*(0.16-0.00015*(Math.abs(y_end-y)))
                let y2 = y + (y_end-y)*(0.84+0.00015*(Math.abs(y_end-y)))

                ctx.moveTo(x1, y1)
                ctx.lineTo(x2, y2)

                ctx.lineWidth = 5
                ctx.stroke()
                ctx.lineWidth = 1
            }
        }
    }

    // Affichage du fuwa psy
    if (heros.num_etage > -1) {
        let salle = donjon[heros.num_etage][heros.num_salle]
        let x = 200*heros.num_etage+45-heros.avancement_carte*200
        let y = heros.y_carte
        let respi = 1.02 + 0.02*Math.sin(time/400)
        let w = 0.5*heros.w * respi
        let h = 0.5*heros.h * respi
        ctx.drawImage(imgs["art-heros-esprit"], x - 0.5*w, y - 0.5*h*respi, w, h)
        ctx.drawImage(imgs["face_neutral"], x - 0.5*w, y - 0.5*h*respi, w, h)
        if (x > 960) {
            heros.avancement_carte += 0.0125
        }
    }

    afficher_money(1720, 40)
    afficher_artefacts(200, 40)

    clicked.down = false
}


function tirer_propositions(liste, nb) {
    let L = []
    let tries = 0
    while (L.length < nb && tries < 100) {
        tries += 1
        let k = liste[Math.floor(liste.length*Math.random())]
        if (L.indexOf(k) == -1) {
            L.push(k)
        }
    }
    return L
}


function generer_partie(serie_min, serie_max, specifs = []) {

    donjon = generer_donjon(17)
    deck = []

    for (let i = serie_min; i < serie_max; i++) {
        deck.push(i)
    }

}


function animate_menu() {

    ctx.drawImage(imgs["ecran_titre"], 0, 0, 1920, 1080)

    ctx.font = "48px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#ffffff"

    ctx.strokeText("Série de kanjis n°" + serie, 960, 90)
    ctx.fillText("Série de kanjis n°" + serie, 960, 90)

    let idx_min = 1
    let idx_max = 20

    if (serie == 0) {
        idx_min = 1
        idx_max = 20
    } else if (serie == 1) {
        idx_min = 1
        idx_max = 30
    } else {
        idx_min = 1+10*(serie-1)
        idx_max = 30+10*(serie-1)
    }

    ctx.strokeText("Kanjis " + idx_min + " à " + idx_max, 960, 150)
    ctx.fillText("Kanjis " + idx_min + " à " + idx_max, 960, 150)

    ctx.strokeText("(<)", 680, 90)
    ctx.fillText("(<)", 680, 90)
    ctx.strokeText("(>)", 1240, 90)
    ctx.fillText("(>)", 1240, 90)

    if (clicked.down && ( (xyMouseDown.x - 680)**2 + (xyMouseDown.y - 90)**2 < 900)) {
        clicked.down = false
        serie = Math.max(0, serie-1)
    } else if (clicked.down && ( (xyMouseDown.x - 1240)**2 + (xyMouseDown.y - 90)**2 < 900)) {
        clicked.down = false
        serie = Math.min(200, serie+1)
    }

    if (serie > 1) {
        ctx.font = "32px Arial"
//        ctx.strokeText("+ " + 2*(serie-1) + " aléatoires parmi les Kanjis 1 à " + 10*(serie-1), 960, 190)
//        ctx.fillText("+ " + 2*(serie-1) + " aléatoires parmi les Kanjis 1 à " + 10*(serie-1), 960, 190)

        ctx.strokeText("+ tous les kanjis précédents (1 " + " à " + 10*(serie-1) + ") moins fréquemment", 960, 190)
        ctx.fillText("+ tous les kanjis précédents (1 " + " à " + 10*(serie-1) + ") moins fréquemment", 960, 190)
    }

    ctx.font = "70px Arial"
    let n = 0
    for (let i = idx_min-1; i < idx_max; i++) {
        ctx.font = "70px Arial"
        ctx.strokeText(kanjis[i], 160 + 320*(n%6), 270+150*Math.floor(n/6))
        ctx.fillText(kanjis[i], 160 + 320*(n%6), 270+150*Math.floor(n/6))

        ctx.font = "36px Arial"
//        ctx.strokeText(expressions[i], 160 + 320*(n%6), 270+150*Math.floor(n/6)+50)
//        ctx.fillText(expressions[i], 160 + 320*(n%6), 270+150*Math.floor(n/6)+50)

        n += 1
    }

    ctx.beginPath()
    ctx.strokeStyle = "#ffffff"
    ctx.moveTo(1560, 980)
    ctx.lineTo(1560, 1060)
    ctx.lineTo(1880, 1060)
    ctx.lineTo(1880, 980)
    ctx.lineTo(1560, 980)
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "#555555"
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.globalAlpha = 1
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.strokeStyle = "#000000"

    ctx.strokeText("Lancer la partie", 1720, 1020)
    ctx.fillText("Lancer la partie", 1720, 1020)
    ctx.lineWidth = 1

    if (clicked.down && xyMouseDown.x > 1560 && xyMouseDown.x < 1880 && xyMouseDown.y > 980 && xyMouseDown.y < 1060) {
        generer_partie(idx_min-1, idx_max)
        dj_step = 0
        heros.debut_tour = new Date().getTime()
        time_0 = new Date().getTime()
        futur_mode = 6
    }

    clicked.down = false

}


function animate_revision() {

    ctx.font = "48px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#ffffff"

    ctx.strokeText("Mémorisez-en le maximum en 90 secondes", 960, 90)
    ctx.fillText("Mémorisez-en le maximum en 90 secondes", 960, 90)

    heros.temps_restant = (90000 + heros.debut_tour - time)/1000

    // Affichage de la barre de temps
    ctx.beginPath()
    ctx.moveTo(barre_temps.x1 + 0*barre_temps.w, barre_temps.y1+40)
    ctx.lineTo(barre_temps.x1 + 0*barre_temps.w, barre_temps.y1+barre_temps.h+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1+barre_temps.h+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1+40)
    ctx.lineTo(barre_temps.x1 + 0*barre_temps.w, barre_temps.y1+40)
    ctx.fillStyle = "#000099"
    ctx.globalAlpha = 0.5
    ctx.fill()
    ctx.globalAlpha = 1

    let prop = heros.temps_restant/90
    ctx.beginPath()
    ctx.moveTo(barre_temps.x1 + barre_temps.w, barre_temps.y1+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w*prop, barre_temps.y1+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w*prop, barre_temps.y1 + barre_temps.h+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1 + barre_temps.h+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1+40)
    ctx.globalAlpha = 0.3
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.beginPath()
    ctx.moveTo(barre_temps.x1, barre_temps.y1+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1+40)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1 + barre_temps.h+40)
    ctx.lineTo(barre_temps.x1, barre_temps.y1 + barre_temps.h+40)
    ctx.lineTo(barre_temps.x1, barre_temps.y1+40)
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.strokeStyle = "#ffffff"
    ctx.moveTo(1560, 980)
    ctx.lineTo(1560, 1060)
    ctx.lineTo(1880, 1060)
    ctx.lineTo(1880, 980)
    ctx.lineTo(1560, 980)
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "#555555"
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.globalAlpha = 1
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1

    ctx.strokeText("Démarrer", 1720, 1020)
    ctx.fillText("Démarrer", 1720, 1020)

    if (clicked.down && xyMouseDown.x > 1560 && xyMouseDown.x < 1880 && xyMouseDown.y > 980 && xyMouseDown.y < 1060) {
        clicked.down = false
        futur_mode = 1
    } else if (heros.temps_restant <= 0) {
        futur_mode = 1
    }

    let idx_min = 1
    let idx_max = 20

    if (serie == 0) {
        idx_min = 1
        idx_max = 20
    } else if (serie == 1) {
        idx_min = 1
        idx_max = 30
    } else {
        idx_min = 1+10*(serie-1)
        idx_max = 30+10*(serie-1)
    }

    let n = 0
    for (let i = idx_min-1; i < idx_max; i++) {
        ctx.font = "70px Arial"
        ctx.strokeText(kanjis[i], 160 + 320*(n%6), 270+150*Math.floor(n/6))
        ctx.fillText(kanjis[i], 160 + 320*(n%6), 270+150*Math.floor(n/6))

        ctx.font = "36px Arial"
        ctx.strokeText(expressions[i], 160 + 320*(n%6), 270+150*Math.floor(n/6)+50)
        ctx.fillText(expressions[i], 160 + 320*(n%6), 270+150*Math.floor(n/6)+50)

        n += 1
    }

    clicked.down = false
}


function animate_firecamp() {

    ctx.drawImage(imgs["firecamp_bg"], 0, 0, 1920, 1080)

    // Affichage du fuwa psy
    let respi = 1.02 + 0.02*Math.sin(time/400)
    let w = heros.w * respi
    let h = heros.h * respi
    ctx.drawImage(imgs["art-heros-esprit"], heros.x - 0.5*w, heros.y - 0.5*h*respi, w, h)
    ctx.drawImage(imgs["face_neutral"], heros.x - 0.5*w, heros.y - 0.5*h*respi, w, h)

    let taille = 260
    let taille_coeur = 100

    // Affichage de la vie du joueur
    ctx.font = 36 + "px Romelio"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    let pourcentage_vie = heros.pv / heros.pvMax

    ctx.globalAlpha = 0.4
    ctx.drawImage(imgs["coeur"], heros.x - taille_coeur*0.5, heros.y - taille_coeur*0.5 - 0.65*taille, taille_coeur, taille_coeur)
    ctx.globalAlpha = 1
    ctx.drawImage(imgs["coeur"], 0, 74+(512-148)*(1-pourcentage_vie), 512, (512-148)*pourcentage_vie, heros.x - taille_coeur*0.5, heros.y - taille_coeur*0.5 - 0.60*taille+(1-pourcentage_vie)*80, taille_coeur, taille_coeur * pourcentage_vie * (364/512))
    ctx.drawImage(imgs["coeur_vide"], heros.x - taille_coeur*0.5, heros.y - taille_coeur*0.5 - 0.65*taille, taille_coeur, taille_coeur)

    ctx.fillStyle = "#ffffff"

    ctx.strokeText(heros.pv, heros.x, heros.y-taille_coeur*0.5-0.47*taille)
    ctx.fillText(heros.pv, heros.x, heros.y-taille_coeur*0.5-0.47*taille)

    ctx.drawImage(imgs["dormir"], 720-120, 320-120, 240, 240)
    ctx.drawImage(imgs["retrait"], 960+120, 320-120, 240, 240)

    // Affichage des kanjis retirables
    ctx.font = 76 + "px Romelio"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#ffffff"

    ctx.strokeText("Se reposer", 720, 140)
    ctx.fillText("Se reposer", 720, 140)

    ctx.strokeText("Brûler un kanji", 960+240, 140)
    ctx.fillText("Brûler un kanji", 960+240, 140)

    for (let j = 0; j < propositions_retrait.length; j++) {
        ctx.strokeText(kanjis[propositions_retrait[j]], 40+1080+80*j, 500)
        ctx.fillText(kanjis[propositions_retrait[j]], 40+1080+80*j, 500)

        if (clicked.down && ( (xyMouseDown.x - (40+1080+80*j))**2 + (xyMouseDown.y - 500)**2 < 1600)) {

            if (deck.indexOf(propositions_retrait[j]) > -1) {
                clicked.down = false
                deck.splice(deck.indexOf(propositions_retrait[j]), 1)
                console.log("Kanji retiré :" + kanjis[propositions_retrait[j]])
            }

            futur_mode = 1
        }
    }

    if (clicked.down && ( (xyMouseDown.x - 720)**2 + (xyMouseDown.y - 320)**2 < 14400)) {
        clicked.down = false
        heros.pv = Math.min(heros.pv + Math.floor(0.25*heros.pvMax), heros.pvMax)
        futur_mode = 1
    }

    clicked.down = false
}


function animate_jeu() {

    /////////////////
    // TRAITEMENTS //
    /////////////////
    if (heros.pv <= 0) {
        futur_mode = 7
    }

    if (etape_tour == 0) {

        heros.mot_clicked = -1
        used = []
        mots_demandes = []
        mots_proposes = []
        invocation = false

        for (let i = 0; i < ennemis.length; i ++) {
            // Spécif 13 : invocation un tour sur 3
            if (ennemis[i].specifs.indexOf(13) > -1 && tour_idx%3 == 1 && ennemis.length < 4) {
                invocation = true
            }
        }

        if (invocation) {
            console.log(ennemis.length)
            invoquer_monster([9*dj_step+Math.min(Math.floor(tour_idx/3), 5)])
            console.log(ennemis.length)
        }

        for (let i = 0; i < ennemis.length; i ++) {
            ennemis[i].demandes = []
            for (let j = 0; j < ennemis[i].nb_demandes; j++) {
                let n =  deck[Math.floor(Math.random()*deck.length)]

                // Ajout de kanjis d'anciennes séries avec une certaine probabilité
                if (serie >= 2 && Math.random() < (0.3+0.035*(heros.artefacts.indexOf(15)>-1))) {
                    n =  Math.floor(Math.random()*10*(serie-1))
                }

                while (used.indexOf(n) > -1) {
                    n =  Math.floor(Math.random()*deck.length)
                }
                ennemis[i].demandes.push(n)
                mots_proposes.push(n)
                used.push(n)

                mots_demandes.push({"idx": n, "enemy": ennemis[i], "x": ennemis[i].x - (ennemis[i].nb_demandes-1)*50 + 100*j, "y": ennemis[i].y - 0.5*ennemis[i].h-50})
            }
        }

        // Chemin aléatoire combo
        combos.ordre = [Math.floor(Math.random()*mots_demandes.length)]

        for (let i = 0; i < 0 + 1*ennemis.length+1-1*(heros.artefacts.indexOf(5)>-1)+1*(heros.artefacts.indexOf(18)>-1); i++) {
            let n =  deck[Math.floor(Math.random()*deck.length)]

            while (used.indexOf(n) > -1) {
                n =  deck[Math.floor(Math.random()*deck.length)]
            }

            if (serie >= 2 && Math.random() < 0.3) {
                n =  Math.floor(Math.random()*10*(serie-1))

                while (used.indexOf(n) > -1) {
                    n =  Math.floor(Math.random()*10*(serie-1))
                }
            }

            if (mots_proposes.length < 12) {
                mots_proposes.push(n)
            }
            used.push(n)
        }

        // Proposition supplémentaire de la part des ennemis avec les spécifs 11 et/ou 12
        for (let i = 0; i < ennemis.length; i++) {
            if (ennemis[i].specifs.indexOf(11) > -1) {
                for (let i = 0; i < 1; i++) {
                    if (mots_proposes.length < 12) {
                        let n =  deck[Math.floor(Math.random()*deck.length)]

                        while (used.indexOf(n) > -1) {
                            n =  deck[Math.floor(Math.random()*deck.length)]
                        }

                        if (serie >= 2 && Math.random() < 0.3) {
                            n =  Math.floor(Math.random()*10*(serie-1))

                            while (used.indexOf(n) > -1) {
                                n =  Math.floor(Math.random()*10*(serie-1))
                            }
                        }

                        mots_proposes.push(n)
                        used.push(n)
                    }
                }
            }
            if (ennemis[i].specifs.indexOf(12) > -1) {
                for (let i = 0; i < 2; i++) {
                    if (mots_proposes.length < 12) {
                        let n =  deck[Math.floor(Math.random()*deck.length)]

                        while (used.indexOf(n) > -1) {
                            n =  deck[Math.floor(Math.random()*deck.length)]
                        }

                        if (serie >= 2 && Math.random() < 0.3) {
                            n =  Math.floor(Math.random()*10*(serie-1))

                            while (used.indexOf(n) > -1) {
                                n =  Math.floor(Math.random()*10*(serie-1))
                            }
                        }

                        mots_proposes.push(n)
                        used.push(n)
                    }
                }
            }

        }

        // Tri des mots proposés par ordre alphabétique
        mots_proposes.sort(function (a, b) {
            if (expressions[a] > expressions[b]) {
                return 1;
            } else {
                return -1;
            }
        });

        // Mélange aléatoire des mots proposés
        //shuffleArray(mots_proposes)

        // Spécif 5 : régénération de 5 pv à chaque début de tour
        for (let i = 0; i < ennemis.length; i++) {
            if (ennemis[i].specifs.indexOf(5) > -1) {
                ennemis[i].pv = Math.min(ennemis[i].pvMax, ennemis[i].pv + Math.floor(0.2*ennemis[i].pvMax))
            }
        }

        heros.debut_tour = new Date().getTime()
        time_0 = new Date().getTime()

        // Spécificités de début de tour ennemi
        for (let i = 0; i < ennemis.length; i++) {
            // Spécif 6 : augmente l'attaque de 1 à chaque début de tour
            if (ennemis[i].specifs.indexOf(6) > -1) {
                ennemis[i].attaque += 1
            }

            // Spécif 7 : diminue la défense de 1 à chaque tour
            if (ennemis[i].specifs.indexOf(7) > -1) {
                ennemis[i].defense = Math.max(ennemis[i].defense-1, 0)
            }

            // Spécif 8, 9, 10 : moins de temps pour jouer
            if (ennemis[i].specifs.indexOf(8) > -1) {
                heros.debut_tour -= 15000*0.1
            } else if (ennemis[i].specifs.indexOf(9) > -1) {
                heros.debut_tour -= 15000*0.2
            } else if (ennemis[i].specifs.indexOf(10) > -1) {
                heros.debut_tour -= 15000*0.3
            }
        }

        tour_idx += 1
        etape_tour = 1
    }

    if (etape_tour == 1) {
        heros.temps_restant = (16000*(1+0.05*(heros.artefacts.indexOf(14)>-1)-0.05*(heros.artefacts.indexOf(16)>-1)) + heros.debut_tour - time)/1000

        for (let i = 0; i < mots_demandes.length; i++) {
            let mot = mots_demandes[i]
            if (heros.mot_clicked >= 0 && clicked.down && xyMouseDown.x > mot.x - 50 && xyMouseDown.x < mot.x + 50 && xyMouseDown.y > mot.y - 50 && xyMouseDown.y < mot.y + 50) {
//            if (heros.mot_clicked >= 0 && clicked.down && xyMouseDown.x > mot.x - 50 && xyMouseDown.x < mot.x + 50 && xyMouseDown.y > mot.y - 50 && xyMouseDown.y < mot.y + 125) {
                clicked.down = false
                let correct = (mots_demandes[i].idx == mots_proposes[heros.mot_clicked])
                heros.mot_clicked = -1
                if (correct) {
                    heros.debut_tour += 1000
                    let x = mot.enemy.x - 10 + 20*Math.random()
                    let y = mot.enemy.y - 10 + 20*Math.random()
                    frappes.push({"x": x, "y": y, "w": mot.enemy.w*1.75, "h": mot.enemy.h*1.75, "debut": new Date().getTime()})
                    if (heros.temps_restant >= 0.5*heros.temps_tour) {
                        heros.vivacite = Math.min(heros.vivacite + 1, 100)
                        let dgts = Math.max(0, Math.floor((4 + Math.floor(heros.vivacite*(1+0.1*(heros.artefacts.indexOf(12)>-1))/8) - mot.enemy.defense) * (1 - 0.5*(mot.enemy.specifs.indexOf(2) > -1 && heros.temps_restant < 0.5*heros.temps_tour) ) * (1 - 1*(mot.enemy.specifs.indexOf(4) > -1 && heros.temps_restant < 0.5*heros.temps_tour) ) *(1+Math.min(combos.nb/20, 4)))*(1 + 1*(activations_artefacts[6] == 9)))
                        affichage_degats.push({"x": x, "y": y, "dgts": dgts, "debut": new Date().getTime()})
                        mot.enemy.pv = Math.min(mot.enemy.pv, mot.enemy.pv - dgts)
                        mot.enemy.decalage_x += dgts
                        if (mot.enemy.debut_clignotement == -1) {
                            mot.enemy.debut_clignotement = time
                        }
                        heros.step_attack = 0
                        heros.audio_dgts = dgts
                    } else if (heros.temps_restant >= heros.temps_tour/6) {
                        heros.vivacite = Math.min(heros.vivacite + 0.5, 100)
                        let dgts = Math.max(0, Math.floor((3 + Math.floor(heros.vivacite*(1+0.1*(heros.artefacts.indexOf(12)>-1))/15) - mot.enemy.defense) * (1 - 0.5*(mot.enemy.specifs.indexOf(2) > -1 && heros.temps_restant < 0.5*heros.temps_tour) ) * (1 - 1*(mot.enemy.specifs.indexOf(4) > -1 && heros.temps_restant < 0.5*heros.temps_tour) ) *(1+Math.min(combos.nb/20, 4)))*(1 + 1*(activations_artefacts[6] == 9)))
                        affichage_degats.push({"x": x, "y": y, "dgts": dgts, "debut": new Date().getTime()})
                        mot.enemy.pv = Math.min(mot.enemy.pv, mot.enemy.pv - dgts)
                        mot.enemy.decalage_x += dgts
                        if (mot.enemy.debut_clignotement == -1) {
                            mot.enemy.debut_clignotement = time
                        }
                        heros.step_attack = 0
                        heros.audio_dgts = dgts
                    } else {
                        heros.vivacite = Math.min(heros.vivacite + 0.25, 100)
                        let dgts = Math.max(0, Math.floor((2 + Math.floor(heros.vivacite*(1+0.1*(heros.artefacts.indexOf(12)>-1))/20) - mot.enemy.defense) * (1 - 0.5*(mot.enemy.specifs.indexOf(2) > -1 && heros.temps_restant < 0.5*heros.temps_tour) ) * (1 - 1*(mot.enemy.specifs.indexOf(4) > -1 && heros.temps_restant < 0.5*heros.temps_tour) ) *(1+Math.min(combos.nb/20, 4)))*(1 + 1*(activations_artefacts[6] == 9)))
                        affichage_degats.push({"x": x, "y": y, "dgts": dgts, "debut": new Date().getTime()})
                        mot.enemy.pv = Math.min(mot.enemy.pv, mot.enemy.pv - dgts)
                        mot.enemy.decalage_x += dgts
                        if (mot.enemy.debut_clignotement == -1) {
                            mot.enemy.debut_clignotement = time
                        }
                        heros.step_attack = 0
                        heros.audio_dgts = dgts
                    }

                    // Activation des artefacts en cas de kanji trouvé
                    if (heros.artefacts.indexOf(0) > -1) {
                        activations_artefacts[0] += 1
                        if (activations_artefacts[0] >= 12) {
                            activations_artefacts[0] -= 12
                            heros.pv = Math.min(heros.pv + 1, heros.pvMax)
                        }
                    }

                    if (heros.artefacts.indexOf(1) > -1 && heros.pv <= 0.5*heros.pvMax) {
                        activations_artefacts[1] += 1
                        if (activations_artefacts[1] >= 8) {
                            activations_artefacts[1] -= 8
                            heros.pv = Math.min(heros.pv + 1, heros.pvMax)
                        }
                    }

                    if (heros.artefacts.indexOf(2) > -1) {
                        activations_artefacts[2] += 1
                        if (activations_artefacts[2] >= 7) {
                            activations_artefacts[2] -= 7
                            heros.pv = Math.min(heros.pv + 1, heros.pvMax)
                        }
                    }

                    if (heros.artefacts.indexOf(3) > -1 && heros.pv <= 0.25*heros.pvMax) {
                        activations_artefacts[3] += 1
                        if (activations_artefacts[3] >= 4) {
                            activations_artefacts[3] -= 4
                            heros.pv = Math.min(heros.pv + 1, heros.pvMax)
                        }
                    }

                    if (heros.artefacts.indexOf(6) > -1) {
                        activations_artefacts[6] += 1
                        if (activations_artefacts[6] >= 10) {
                            activations_artefacts[6] -= 10
                        }
                    }

                    if (heros.artefacts.indexOf(7) > -1) {
                        activations_artefacts[7] += 1
                        if (activations_artefacts[7] >= 6) {
                            activations_artefacts[7] -= 6
                            for (let i = 0; i < ennemis.length; i++) {
                                let x = ennemis[i].x - 10 + 20*Math.random()
                                let y = ennemis[i].y - 10 + 20*Math.random()
                                frappes.push({"x": x, "y": y, "w": ennemis[i].w*1.75, "h": ennemis[i].h*1.75, "debut": new Date().getTime()})
                                ennemis[i].pv -= 2
                                affichage_degats.push({"x": ennemis[i].x, "y": ennemis[i].y, "dgts": 2, "debut": new Date().getTime()})
                            }
                        }
                    }

                    if (heros.artefacts.indexOf(8) > -1) {
                        activations_artefacts[8] += 1
                        if (activations_artefacts[8] >= 10) {
                            activations_artefacts[8] -= 10
                            for (let i = 0; i < ennemis.length; i++) {
                                let x = ennemis[i].x - 10 + 20*Math.random()
                                let y = ennemis[i].y - 10 + 20*Math.random()
                                frappes.push({"x": x, "y": y, "w": ennemis[i].w*1.75, "h": ennemis[i].h*1.75, "debut": new Date().getTime()})
                                ennemis[i].pv -= 2
                                affichage_degats.push({"x": ennemis[i].x, "y": ennemis[i].y, "dgts": 2, "debut": new Date().getTime()})
                            }
                        }
                    }

                    if (combos.ordre.length > 0 && combos.ordre[0] == i) {
                        combos.nb += 1
                        combos.font_time = 240
                    } else {
                        combos.ordre = []
                        combos.nb = 0
                    }

                } else {
                    if (heros.artefacts.indexOf(17) > -1) {
                        heros.debut_tour -= 1000
                    }
                    activations_artefacts[1] = 0
                    activations_artefacts[3] = 0
                    activations_artefacts[7] = 0
                    let x = heros.x - 10 + 20*Math.random()
                    let y = heros.y - 10 + 20*Math.random()
                    frappes.push({"x": x, "y": y, "w": heros.w*1.75, "h": heros.h*1.75, "debut": new Date().getTime()})
                    affichage_erreurs.push({"x": mots_demandes[i].x, "y": mots_demandes[i].y - 66, "idx": mots_demandes[i].idx, "debut": new Date().getTime()})
                    heros.vivacite = Math.max(0, heros.vivacite - 8*(1-0.1*(heros.artefacts.indexOf(11)>-1)+0.1*(heros.artefacts.indexOf(19)>-1)))
                    if (heros.temps_restant >= 0.5*heros.temps_tour) {
                        let dgts = 5 + mot.enemy.attaque
                        heros.pv -= dgts
                        affichage_degats.push({"x": x, "y": y, "dgts": dgts, "debut": new Date().getTime()})
                    } else if (heros.temps_restant >= heros.temps_tour/6) {
                        let dgts = 4 + mot.enemy.attaque
                        heros.pv -= dgts
                        affichage_degats.push({"x": x, "y": y, "dgts": dgts, "debut": new Date().getTime()})
                    } else {
                        let dgts = 3 + mot.enemy.attaque
                        heros.pv -= dgts
                        affichage_degats.push({"x": x, "y": y, "dgts": dgts, "debut": new Date().getTime()})
                    }

                    if (heros.artefacts.indexOf(10) > -1) {
                        activations_artefacts[10] += 1
                        if (activations_artefacts[10] >= 10) {
                            activations_artefacts[10] -= 10
                            for (let i = 0; i < ennemis.length; i++) {
                                let x = ennemis[i].x - 10 + 20*Math.random()
                                let y = ennemis[i].y - 10 + 20*Math.random()
                                frappes.push({"x": x, "y": y, "w": ennemis[i].w*1.75, "h": ennemis[i].h*1.75, "debut": new Date().getTime()})
                                ennemis[i].pv -= 2
                                affichage_degats.push({"x": ennemis[i].x, "y": ennemis[i].y, "dgts": 4, "debut": new Date().getTime()})
                            }
                        }
                    }

                    combos.ordre = []
                    combos.nb = 0
                }
                mots_demandes.splice(i, 1)

                if (combos.ordre.length > 0) {
                    combos.ordre = [Math.floor(Math.random()*mots_demandes.length)]
                }

                i -= 1
            }
        }

        if (heros.temps_restant <= 0) {
            etape_tour = 3

            // Kanji pas trouvé dans le temps imparti
            let nb = 0
            for (let i = 0; i < mots_demandes.length; i++) {
                let x = heros.x - 10 + 20*Math.random()
                let y = heros.y - 10 + 20*Math.random()
                frappes.push({"x": x, "y": y, "w": heros.w*1.75, "h": heros.h*1.75, "debut": new Date().getTime() + 250*nb})
                affichage_erreurs.push({"x": mots_demandes[i].x, "y": mots_demandes[i].y - 66, "idx": mots_demandes[i].idx, "debut": new Date().getTime()})
                heros.vivacite = Math.max(0, heros.vivacite - 3*(1-0.1*(heros.artefacts.indexOf(11)>-1)+0.1*(heros.artefacts.indexOf(19)>-1)))
                let dgts = (2+mots_demandes[i].enemy.attaque) + 1*(mots_demandes[i].enemy.specifs.indexOf(1) > -1)
                heros.pv -= dgts

                if (heros.artefacts.indexOf(9) > -1) {
                    activations_artefacts[9] += 1
                    if (activations_artefacts[9] >= 10) {
                        activations_artefacts[9] -= 10
                        for (let i = 0; i < ennemis.length; i++) {
                            let x = ennemis[i].x - 10 + 20*Math.random()
                            let y = ennemis[i].y - 10 + 20*Math.random()
                            frappes.push({"x": x, "y": y, "w": ennemis[i].w*1.75, "h": ennemis[i].h*1.75, "debut": new Date().getTime()})
                            ennemis[i].pv -= 4
                            affichage_degats.push({"x": ennemis[i].x, "y": ennemis[i].y, "dgts": 4, "debut": new Date().getTime()})
                        }
                    }
                }

                if (heros.artefacts.indexOf(10) > -1) {
                    activations_artefacts[10] += 1
                    if (activations_artefacts[10] >= 10) {
                        activations_artefacts[10] -= 10
                        for (let i = 0; i < ennemis.length; i++) {
                            let x = ennemis[i].x - 10 + 20*Math.random()
                            let y = ennemis[i].y - 10 + 20*Math.random()
                            frappes.push({"x": x, "y": y, "w": ennemis[i].w*1.75, "h": ennemis[i].h*1.75, "debut": new Date().getTime()})
                            ennemis[i].pv -= 2
                            affichage_degats.push({"x": ennemis[i].x, "y": ennemis[i].y, "dgts": 4, "debut": new Date().getTime()})
                        }
                    }
                }

                affichage_degats.push({"x": heros.x, "y": heros.y, "dgts": dgts, "debut": new Date().getTime() + 250*nb})
                for (let i = 0; i < ennemis.length; i++) {
                    if (ennemis[i].specifs.indexOf(3) > -1) {
                        ennemis[i].pv = Math.min(ennemis[i].pvMax, ennemis[i].pv + 5)
                    }
                }

                nb += 1
            }
        }

        if (mots_demandes.length == 0) {
            etape_tour = 3
        }
    }


    if (etape_tour == 3 && affichage_erreurs.length == 0) {
        mots_demandes = []
        etape_tour = 0
    }


    for (let i = 0; i < frappes.length; i++) {
        if (time - frappes[i].debut > 300) {
            frappes.splice(i, 1)
            i--
        }
    }

    // Suppression des kanjis demandés par un ennemi vaincu
    for (let k = 0; k < mots_demandes.length; k++) {
        if (mots_demandes[k].enemy.pv <= 0) {
            mots_demandes.splice(k, 1)
            k--
        }
    }

    if (combos.ordre.length > 0 && combos.ordre[0] >= mots_demandes.length) {
	combos.ordre = [Math.floor(Math.random()*mots_demandes.length)]
    }

    // Suppression des ennemis dont les pv sont égaux à 0
    for (let i = 0; i < ennemis.length; i++) {
        if (ennemis[i].pv <= 0) {
            heros.or += ennemis[i].or
            if (ennemis[i].or >= 5) {

                let n = Math.floor(16*Math.random())
                let tries = 0
                while (heros.artefacts.indexOf(n) > -1 && tries < 60) {
                    n = Math.floor(16*Math.random())
                    tries += 1
                }
                if (tries < 60) {
                    heros.artefacts.push(n)
                }

            }
            ennemis.splice(i, 1)
            i -= 1
        }
    }

    // Tous les ennemis ont été vaincus ?
    if (ennemis.length == 0) {
        etape_tour = 10
        mots_demandes = []
        mots_proposes = []
    }

    if (etape_tour == 10) {
        etape_tour = 0
        futur_mode = 1
    }

    ////////////////
    // AFFICHAGES //
    ////////////////
    let respi = 1.02 + 0.02*Math.sin(time/400)

    // Affichage de l'arrière-plan
    ctx.drawImage(imgs["background1"], 0, 0, 1920, 1080)

    ctx.font = 36 + "px Romelio"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    let taille = 260
    let taille_coeur = 100

    // Affichage de la vie du joueur
    let pourcentage_vie = heros.pv / heros.pvMax

    ctx.globalAlpha = 0.4
    ctx.drawImage(imgs["coeur"], heros.x - taille_coeur*0.5, heros.y - taille_coeur*0.5 - 0.65*taille, taille_coeur, taille_coeur)
    ctx.globalAlpha = 1
    ctx.drawImage(imgs["coeur"], 0, 74+(512-148)*(1-pourcentage_vie), 512, (512-148)*pourcentage_vie, heros.x - taille_coeur*0.5, heros.y - taille_coeur*0.5 - 0.60*taille+(1-pourcentage_vie)*80, taille_coeur, taille_coeur * pourcentage_vie * (364/512))
    ctx.drawImage(imgs["coeur_vide"], heros.x - taille_coeur*0.5, heros.y - taille_coeur*0.5 - 0.65*taille, taille_coeur, taille_coeur)

    ctx.fillStyle = "#ffffff"

    ctx.strokeText(heros.pv, heros.x, heros.y-taille_coeur*0.5-0.47*taille)
    ctx.fillText(heros.pv, heros.x, heros.y-taille_coeur*0.5-0.47*taille)

    // Affichage du fuwa psy
    {
        let w = heros.w * respi
        let h = heros.h * respi
        ctx.drawImage(imgs["art-heros-esprit"], heros.x - 0.5*w, heros.y - 0.5*h*respi, w, h)
        ctx.drawImage(imgs["face_neutral"], heros.x - 0.5*w, heros.y - 0.5*h*respi, w, h)
    }

    if (combos.nb > 0) {
        ctx.font = 48 + "px Romelio"
        ctx.fillStyle = "#ff0000"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.strokeText("COMBO : ", heros.x, heros.y-heros.h*1.5)
        ctx.fillText("COMBO : ", heros.x, heros.y-heros.h*1.5)

        ctx.font = ((combos.font_time+72)*(1+Math.min(2, 0.02*combos.nb))) + "px Romelio"

        if (combos.font_time > 0) {
            combos.font_time -= 15
        }

        ctx.strokeText(combos.nb, heros.x + 150, heros.y-heros.h*1.5)
        ctx.fillText(combos.nb, heros.x+ 150, heros.y-heros.h*1.5)
    }

    // Affichage des ennemis
    for (let i = 0; i < ennemis.length; i++) {
        let enemy = ennemis[i]
        let w = enemy.w * respi
        let h = enemy.h * respi
        ctx.drawImage(imgs["monster" + enemy.num], enemy.x - 0.5*w, enemy.y - 0.5*h*respi, w, h)

        ctx.font = 24 + "px Romelio"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.drawImage(imgs["attaque"], enemy.x + 0.55*w, enemy.y - 34, 32, 32)

        ctx.strokeText((2+enemy.attaque), enemy.x + 0.55*w+16, enemy.y - 34 + 16)
        ctx.fillStyle = "#000000"
        ctx.fillText((2+enemy.attaque), enemy.x + 0.55*w+16, enemy.y - 34 + 16)

        ctx.drawImage(imgs["defense"], enemy.x + 0.55*w, enemy.y + 2, 32, 32)

        ctx.strokeText(enemy.defense, enemy.x + 0.55*w+16, enemy.y + 2 + 16)
        ctx.fillStyle = "#000000"
        ctx.fillText(enemy.defense, enemy.x + 0.55*w+16, enemy.y + 2 + 16)

        ctx.beginPath()
        ctx.moveTo(enemy.x - 0.5*enemy.w, enemy.y + 0.52*enemy.h)
        ctx.lineTo(enemy.x + 0.5*enemy.w, enemy.y + 0.52*enemy.h)
        ctx.lineTo(enemy.x + 0.5*enemy.w, enemy.y + 0.52*enemy.h + 25)
        ctx.lineTo(enemy.x - 0.5*enemy.w, enemy.y + 0.52*enemy.h + 25)
        ctx.lineTo(enemy.x - 0.5*enemy.w, enemy.y + 0.52*enemy.h)
        ctx.fillStyle = "#ffffff"
        ctx.globalAlpha = 0.5
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.lineWidth = 1

        let prop = enemy.pv / enemy.pvMax
        ctx.beginPath()
        ctx.moveTo(enemy.x - 0.5*enemy.w, enemy.y + 0.52*enemy.h)
        ctx.lineTo(enemy.x - 0.5*enemy.w + prop*enemy.w, enemy.y + 0.52*enemy.h)
        ctx.lineTo(enemy.x - 0.5*enemy.w + prop*enemy.w, enemy.y + 0.52*enemy.h + 25)
        ctx.lineTo(enemy.x - 0.5*enemy.w, enemy.y + 0.52*enemy.h + 25)
        ctx.lineTo(enemy.x - 0.5*enemy.w, enemy.y + 0.52*enemy.h)
        ctx.fillStyle = "#ff0000"
        ctx.globalAlpha = 0.85
        ctx.fill()
        ctx.globalAlpha = 1

        ctx.font = 24 + "px Romelio"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.strokeText(enemy.pv + " / " + enemy.pvMax, enemy.x, enemy.y + 0.52*enemy.h+13)
        ctx.fillStyle = "#000000"
        ctx.fillText(enemy.pv + " / " + enemy.pvMax, enemy.x, enemy.y + 0.52*enemy.h+13)
    }

    // Affichage des kanjis demandés
    ctx.font = 100 + "px Romelio"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    for (let j = 0; j < mots_demandes.length; j++) {
        if (serie >= 2 && heros.artefacts.indexOf(13) > -1 && mots_demandes[j].idx < 10*(serie-1)) {
            ctx.fillStyle = "#0000ff"
        } else if (combos.ordre.length > 0 && combos.ordre[0] == j) {
            ctx.fillStyle = "#ff0000"
        } else {
            ctx.fillStyle = "#ffffff"
        }
        ctx.strokeText(kanjis[mots_demandes[j].idx], mots_demandes[j].x, mots_demandes[j].y)
        ctx.fillText(kanjis[mots_demandes[j].idx], mots_demandes[j].x, mots_demandes[j].y)
    }

    ctx.fillStyle = "#ffffff"

    // Affichage de la barre de temps
    ctx.beginPath()
    ctx.moveTo(barre_temps.x1, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1 + barre_temps.h)
    ctx.lineTo(barre_temps.x1, barre_temps.y1 + barre_temps.h)
    ctx.lineTo(barre_temps.x1, barre_temps.y1)
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(barre_temps.x1 + 0.5*barre_temps.w, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + 0.5*barre_temps.w, barre_temps.y1+barre_temps.h)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1+barre_temps.h)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + 0.5*barre_temps.w, barre_temps.y1)
    ctx.fillStyle = "#008800"
    ctx.globalAlpha = 0.5
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.beginPath()
    ctx.moveTo(barre_temps.x1 + 0.5*barre_temps.w, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + 0.5*barre_temps.w, barre_temps.y1+barre_temps.h)
    ctx.lineTo(barre_temps.x1 + (1/6)*barre_temps.w, barre_temps.y1+barre_temps.h)
    ctx.lineTo(barre_temps.x1 + (1/6)*barre_temps.w, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + 0.5*barre_temps.w, barre_temps.y1)
    ctx.fillStyle = "#ff7f00"
    ctx.globalAlpha = 0.5
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.beginPath()
    ctx.moveTo(barre_temps.x1, barre_temps.y1)
    ctx.lineTo(barre_temps.x1, barre_temps.y1+barre_temps.h)
    ctx.lineTo(barre_temps.x1 + (1/6)*barre_temps.w, barre_temps.y1+barre_temps.h)
    ctx.lineTo(barre_temps.x1 + (1/6)*barre_temps.w, barre_temps.y1)
    ctx.lineTo(barre_temps.x1, barre_temps.y1)
    ctx.fillStyle = "#ff0000"
    ctx.globalAlpha = 0.5
    ctx.fill()
    ctx.globalAlpha = 1

    let prop = Math.max(Math.min(1, heros.temps_restant/heros.temps_tour), 0)
    ctx.beginPath()
    ctx.moveTo(barre_temps.x1 + barre_temps.w, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + barre_temps.w*prop, barre_temps.y1)
    ctx.lineTo(barre_temps.x1 + barre_temps.w*prop, barre_temps.y1 + barre_temps.h)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1 + barre_temps.h)
    ctx.lineTo(barre_temps.x1 + barre_temps.w, barre_temps.y1)
    ctx.globalAlpha = 0.3
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.font = 40 + "px Romelio"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#000000"

    let dgts = Math.max(0, Math.floor((4 + Math.floor(heros.vivacite*(1+0.1*(heros.artefacts.indexOf(12)>-1))/8))*(1+Math.min(combos.nb/10, 4)))*(1 + 1*(activations_artefacts[6] == 9)))
    ctx.strokeText(dgts, 1360, barre_temps.y1 + 0.5*barre_temps.h)
    ctx.fillText(dgts, 1360, barre_temps.y1 + 0.5*barre_temps.h)

    dgts = Math.max(0, Math.floor((3 + Math.floor(heros.vivacite*(1+0.1*(heros.artefacts.indexOf(12)>-1))/15) )*(1+Math.min(combos.nb/10, 4)))*(1 + 1*(activations_artefacts[6] == 9)))
    ctx.strokeText(dgts, 160 + (1/3)*1600, barre_temps.y1 + 0.5*barre_temps.h)
    ctx.fillText(dgts, 160 + (1/3)*1600, barre_temps.y1 + 0.5*barre_temps.h)

    dgts = Math.max(0, Math.floor((2 + Math.floor(heros.vivacite*(1+0.1*(heros.artefacts.indexOf(12)>-1))/20))*(1+Math.min(combos.nb/10, 4)))*(1 + 1*(activations_artefacts[6] == 9)))
    ctx.strokeText(dgts, 160 + (1/12)*1600, barre_temps.y1 + 0.5*barre_temps.h)
    ctx.fillText(dgts, 160 + (1/12)*1600, barre_temps.y1 + 0.5*barre_temps.h)

    // Affichage de la barre de vivacite
    ctx.beginPath()
    ctx.moveTo(barre_vivacite.x1, barre_vivacite.y1)
    ctx.lineTo(barre_vivacite.x1 + barre_vivacite.w, barre_vivacite.y1)
    ctx.lineTo(barre_vivacite.x1 + barre_vivacite.w, barre_vivacite.y1 + barre_vivacite.h)
    ctx.lineTo(barre_vivacite.x1, barre_vivacite.y1 + barre_vivacite.h)
    ctx.lineTo(barre_vivacite.x1, barre_vivacite.y1)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.beginPath()
    ctx.moveTo(barre_vivacite.x1, barre_vivacite.y1)
    ctx.lineTo(barre_vivacite.x1 + barre_vivacite.w*Math.min(100, heros.vivacite)/100, barre_vivacite.y1)
    ctx.lineTo(barre_vivacite.x1 + barre_vivacite.w*Math.min(100, heros.vivacite)/100, barre_vivacite.y1+barre_vivacite.h)
    ctx.lineTo(barre_vivacite.x1, barre_vivacite.y1+barre_vivacite.h)
    ctx.lineTo(barre_vivacite.x1, barre_vivacite.y1)
    ctx.fillStyle = "#aa5500"
    ctx.fill()

    // Affichage de l'or
    afficher_money()

    // Affichage des artefacts
    afficher_artefacts()

    // Affichage des erreurs
    for (let i = 0; i < affichage_erreurs.length; i++) {
        if (time - affichage_erreurs[i].debut > 1000) {
            affichage_erreurs.splice(i, 1)
        } else {
            ctx.globalAlpha = (time-affichage_erreurs[i].debut)/200
            ctx.font = 50 + "px Romelio"
            ctx.fillStyle = "#ffffff"
            ctx.strokeText(expressions[affichage_erreurs[i].idx], affichage_erreurs[i].x, affichage_erreurs[i].y)
            ctx.fillText(expressions[affichage_erreurs[i].idx], affichage_erreurs[i].x, affichage_erreurs[i].y)
            ctx.globalAlpha = 1
        }
    }

    // Affichage des frappes
    for (let i = 0; i < frappes.length; i++) {
        if (time > frappes[i].debut) {
            ctx.globalAlpha = 1-Math.abs(time-frappes[i].debut-150)/150
            ctx.drawImage(imgs["frappe"], frappes[i].x - 0.5*frappes[i].w, frappes[i].y - 0.5*frappes[i].h, frappes[i].w, frappes[i].h)
            ctx.globalAlpha = 1
        }
    }

    // Affichage des dégats
    for (let i = 0; i < affichage_degats.length; i++) {
        if (time - affichage_degats[i].debut > 400) {
            affichage_degats.splice(i, 1)
            i--
        } else {
            if (time-affichage_degats[i].debut < 150) {
                ctx.globalAlpha = (time-affichage_degats[i].debut)/150
            } else if (time-affichage_degats[i].debut > 250) {
                ctx.globalAlpha = 1-(time-250-affichage_degats[i].debut)/150
            }
            ctx.font = 100 + "px Romelio"
            ctx.fillStyle = "#ff0000"
            ctx.lineWidth = 4
            ctx.strokeText("−" + affichage_degats[i].dgts, affichage_degats[i].x, affichage_degats[i].y)
            ctx.fillText("−" + affichage_degats[i].dgts, affichage_degats[i].x, affichage_degats[i].y)
            ctx.lineWidth = 1
            if (time > affichage_degats[i].debut) {
                affichage_degats[i].y -= 6
            }
            ctx.globalAlpha = 1
        }
    }

    // Affichage des mots proposés
    for (let i = 0; i < mots_proposes.length; i++) {
        let x1, y1, x2, y2
        if (i % 3 == 0) {
            x1 = banc.x1 + 8
            x2 = banc.x1 + banc.w/3 - 8
            y1 = banc.y1 + 20*i
            y2 = y1 + 52
        } else if (i % 3 == 1) {
            x1 = banc.x1 + banc.w/3 + 8
            x2 = banc.x1 + 2*banc.w/3 - 8
            y1 = banc.y1 + 20*(i-1)
            y2 = y1 + 52
        } else {
            x1 = banc.x1 + 2*banc.w/3 + 8
            x2 = banc.x1 + banc.w - 8
            y1 = banc.y1 + 20*(i-2)
            y2 = y1 + 52
        }

        if (clicked.down && xyMouseDown.x > x1 && xyMouseDown.x < x2 && xyMouseDown.y > y1 && xyMouseDown.y < y2) {
            if (heros.mot_clicked == i) {
                heros.mot_clicked = -1
            } else {
                heros.mot_clicked = i
            }
        }

        if (clicked.keyboard != -1) {
            // En cas d'appui sur une touche
            if (expressions[mots_proposes[i]][0] === keyboard_keys[clicked.keyboard]) {
                // Si aucune proposition sélectionnée, choisir la première qui commence par la lettre
                if (heros.mot_clicked == -1) {
                    heros.mot_clicked = i
                    clicked.keyboard = -1
                } else {
                    // Sinon si le mot sélectionné ne commence pas par la lettre, la sélectionner
                    if (expressions[mots_proposes[heros.mot_clicked]][0] !== keyboard_keys[clicked.keyboard]) {
                        heros.mot_clicked = i
                        clicked.keyboard = -1
                    // Sinon si le mot sélectionné commence déjà par la lettre, choisir le suivant
                    } else {
                        let indices = []
                        let next = false
                        for (let j = 0; j < mots_proposes.length; j++) {
                            if (expressions[mots_proposes[j]][0] === keyboard_keys[clicked.keyboard]) {
                                indices.push(j)
                                if (next) {
                                    heros.mot_clicked = j
                                    clicked.keyboard = -1
                                    next = false
                                } else if (heros.mot_clicked == j) {
                                    next = true
                                }
                            }
                        }
                        if (next) {
                            heros.mot_clicked = i
                            clicked.keyboard = -1
                        }
                    }
                }
            }
        }

        if (time - time_0 > 1000) {

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y1)
            ctx.lineTo(x2, y2)
            ctx.lineTo(x1, y2)
            ctx.lineTo(x1, y1)
            ctx.fillStyle = "#ffffff"
            ctx.lineWidth = 2
            ctx.globalAlpha = 0.8
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.stroke()
            ctx.font = (40+10*(heros.mot_clicked==i)) + "px Romelio"
            ctx.strokeText(expressions[mots_proposes[i]], 0.5*(x1+x2), 0.5*(y1+y2))
            ctx.fillStyle = "#000000"
            if (heros.mot_clicked == i) {
                ctx.fillStyle = "#ff0000"
            }
            ctx.fillText(expressions[mots_proposes[i]], 0.5*(x1+x2), 0.5*(y1+y2))
            ctx.lineWidth = 1
        }
    }

    clicked.keyboard = -1
    clicked.down = false
}


mysteries = [
    {"text": "Au hasard d'un chemin, un esprit vous propose d'apaiser vos peines.", "choix": ["Accepter (retrait d'un kanji aléatoire)", "Refuser"]},
    {"text": "Alors que vous vous promenez proche d'un ravin, vous trébuchez.", "choix": ["Vous protégez vos artefacts et chute douloureusement (-10 pv)", "Vous vous accrochez mais vous laissez tomber un artefact et un kanji"]},
    {"text": "Une âme égarée vous harcèle et ne vous lâchera qu'après avoir dupliqué l'un des trois kanjis suivants dans votre deck :", "choix": []},
    {"text": "C'est votre jour de chance, vous trouvez une trousse de soins.", "choix": ["Utiliser un bandage (rend 20 pv)", "Utiliser un médicament (augmente les pv max de 5)"]},
    {"text": "Un esprit mauvais vous pourchasse et vous êtes déjà bien essoufflé.", "choix": ["Se laisser maudire (ajout d'un kanji aléatoire hors deck)", "Sprinter un coup pour le semer (-10 pv)"]},
    {"text": "Une bonne âme vous aide à déterrer un coffre. Vous ne pouvez pas tout prendre, il faut partager.", "choix": ["Prendre l'or (+10 or)", "Prendre l'artefact (aléatoire)"]},
    {"text": "Une balance se dresse devant vous et permet de changer l'or en vivacité et inversement.", "choix": ["+5 or et -10 vivacité", "-5 or et +10 vivacité", "Passer son chemin"]},
    {"text": "Vous empruntez un chemin dangereux. À moins de prendre des risques, une malédiction va s'abattre sur vous.", "choix": ["Ajout d'un artefact maudit aléatoire", "Ajout d'un kanji hors deck", "-10 pv max"]},
]


function animate_mystery() {

    ctx.drawImage(imgs["background2"], 0, 0, 1920, 1080)

    ctx.beginPath()
    ctx.moveTo(210, 200)
    ctx.lineTo(1710, 200)
    ctx.lineTo(1710, 880)
    ctx.lineTo(210, 880)
    ctx.lineTo(210, 200)
    ctx.fillStyle = "#000066"
    ctx.globalAlpha = 0.8
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.lineWidth = 1

    if (dialogue == -1) {
        dialogue = handle_text(mysteries[mystere].text)
    }
    print_text(dialogue)

    if (mystere == 2) {

        if (propositions_retrait.length == 0) {
            propositions_retrait = tirer_propositions(deck, 3)
        }

        ctx.font = 76 + "px Romelio"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "#ffffff"

        for (let j = 0; j < propositions_retrait.length; j++) {
            ctx.strokeText(kanjis[propositions_retrait[j]], 840+120*j, 500)
            ctx.fillText(kanjis[propositions_retrait[j]], 840+120*j, 500)

            if (clicked.down && ( (xyMouseDown.x - (840+120*j))**2 + (xyMouseDown.y - 500)**2 < 1600)) {
                clicked.down = false
                deck.push(propositions_retrait[j])
                futur_mode = 1
            }
        }
    }
}


function handle_text(dialogue) {

    let longueur_max = 1420

    let s = dialogue
    let x_start = 240
    let x = x_start
    let y = 250

    let mot = ""
    let img_to_print = ""
    let lettres = s.split("")
    let message = []

    let default_fill = "#ffffff"
    let current_fill = "#ffffff"

    ctx.textAlign = "left"
    ctx.font = (38) + "px Arial"

    while (lettres.length > 0) {
        l = lettres.splice(0, 1)[0]
        if (l === " ") {
            if (x - x_start >= longueur_max) {
                x = x_start
                y += 56
                for (let i = 0; i < mot.length; i++) {
                    message[message.length-mot.length+i].x = 10+x
                    message[message.length-mot.length+i].y = y
                    x += ctx.measureText(message[message.length-mot.length+i].lettre).width
                }
            }
            message.push({"lettre": " ", "x": 10 + x, "y": y, "fill": current_fill, "stroke": "#000000"})
            x += ctx.measureText(" ").width
            mot = ""
        } else if (l === "§") {
            if (lettres[0] === "#") {
                current_fill = "#" + lettres[1] + lettres[2] + lettres[3] + lettres[4] + lettres[5] + lettres[6]
                lettres.splice(0, 8)
            } else if (lettres[0] === "i" && lettres[1] === "m" && lettres[2] === "g" && lettres[3] === "{") {
                img_to_print = lettres[4]
                lettres.splice(0,5)
            }
        } else if (l === "}") {
            if (current_fill !== default_fill) {
                current_fill = default_fill
            } else if (img_to_print !== "") {
                if (x >= longueur_max*0.98) {
                    x = x_start
                    y += 56
                }
                message.push({"img": imgs[img_to_print], "x": x, "y": y})
                x += 60
                img_to_print = ""
            }
        } else if (img_to_print === "") {
            mot += l
            message.push({"lettre": l, "x": 10+x, "y": y, "fill": current_fill, "stroke": "#000000"})
            x += ctx.measureText(l).width
        } else {
            img_to_print += l
        }
    }

    if (x >= longueur_max) {
        x = x_start
        y += 56
        for (let i = 0; i < mot.length; i++) {
            message[message.length-mot.length+i].x = 10+x
            message[message.length-mot.length+i].y = y
            x += ctx.measureText(message[message.length-mot.length+i].lettre).width
        }
    }

    return {"texte": message, "t": 0}
}


function print_text(dialogue) {

    ctx.textAlign = "left"
    ctx.font = 38 + "px Arial"

    s = dialogue.texte
    for (let i = 0; i < Math.min(s.length, dialogue.t); i++) {
        if (s[i].lettre !== undefined) {
            ctx.strokeStyle = s[i].stroke
            ctx.fillStyle = s[i].fill
            ctx.strokeText(s[i].lettre, s[i].x, s[i].y)
            ctx.fillText(s[i].lettre, s[i].x, s[i].y)
        } else if (s[i].img !== undefined) {
            ctx.drawImage(s[i].img, s[i].x, s[i].y, 60, 60)
        }
    }

    dialogue.t += 1
    let choix_clicked = -1

    if (dialogue.t >= s.length) {
        for (let i = mysteries[mystere].choix.length - 1; i >= 0; i--) {
            ctx.beginPath()
            let x1 = 260
            let x2 = 1920-260
            let y1 = 820+66*(i-mysteries[mystere].choix.length+1)-30
            let y2 = 820+66*(i-mysteries[mystere].choix.length+1)+30
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y1)
            ctx.lineTo(x2, y2)
            ctx.lineTo(x1, y2)
            ctx.lineTo(x1, y1)
            ctx.globalAlpha = 0.8
            ctx.fillStyle = "#444444"
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.stroke()
            ctx.fillStyle = "#ffffff"
            ctx.strokeText(mysteries[mystere].choix[i], 280, 820+66*(i-mysteries[mystere].choix.length+1))
            ctx.fillText(mysteries[mystere].choix[i], 280, 820+66*(i-mysteries[mystere].choix.length+1))


            if (clicked.down && xyMouseDown.x > x1 && xyMouseDown.x < x2 && xyMouseDown.y > y1 && xyMouseDown.y < y2) {
                clicked.down = false
                choix_clicked = i
            }
        }
    }

    if (choix_clicked == 0) {
        if (mystere == 0) {
            futur_mode = 1
            deck.splice(Math.floor(Math.random()*deck.length), 1)
        } else if (mystere == 1) {
            futur_mode = 1
            heros.pv -= 10
        } else if (mystere == 3) {
            futur_mode = 1
            heros.pv = Math.min(heros.pvMax, heros.pv + 20)
        } else if (mystere == 4) {
            futur_mode = 1
            deck.push(Math.floor(Math.random()*kanjis.length))
        } else if (mystere == 5) {
            futur_mode = 1
            heros.or += 10
        } else if (mystere == 6) {
            futur_mode = 1
            heros.or += 5
            heros.vivacite = Math.max(0, heros.vivacite - 10)
        } else if (mystere == 7) {
            futur_mode = 1
            let n = 16+Math.floor(4*Math.random())
            let tries = 0
            while (heros.artefacts.indexOf(n) > -1 && tries < 60) {
                n = 16+Math.floor(4*Math.random())
                tries += 1
            }
            if (tries < 60) {
                heros.artefacts.push(n)
            }
        }
    } else if (choix_clicked == 1) {
        if (mystere == 0) {
            futur_mode = 1
        } else if (mystere == 1) {
            futur_mode = 1
            deck.splice(Math.floor(Math.random()*deck.length), 1)
            heros.artefacts.splice(Math.floor(Math.random()*heros.artefacts.length), 1)
        } else if (mystere == 3) {
            futur_mode = 1
            heros.pvMax += 5
            heros.pv += 5
        } else if (mystere == 4) {
            futur_mode = 1
            heros.pv -= 10
        } else if (mystere == 5) {
            futur_mode = 1
            let n = Math.floor(16*Math.random())
            let tries = 0
            while (heros.artefacts.indexOf(n) > -1 && tries < 60) {
                n = Math.floor(16*Math.random())
                tries += 1
            }
            if (tries < 60) {
                heros.artefacts.push(n)
            }
        } else if (mystere == 6) {
            futur_mode = 1
            heros.or = Math.max(0, heros.or - 5)
            heros.vivacite = Math.min(100, heros.vivacite + 10)
        } else if (mystere == 7) {
            futur_mode = 1
            deck.push(Math.floor(Math.random()*kanjis.length))
        }
    } else if (choix_clicked == 2) {
        if (mystere == 6) {
            futur_mode = 1
        } else if (mystere == 7) {
            futur_mode = 1
            heros.pvMax -= 10
            heros.pv = Math.min(heros.pv, heros.pvMax)
        }
    }
}


function animate_perdu() {

    ctx.drawImage(imgs["background3"], 0, 0, 1920, 1080)

    ctx.font = "120px Arial"
    ctx.strokeText("Échec", 960, 540)
    ctx.fillStyle = "#ffffff"
    ctx.fillText("Échec", 960, 540)

    ctx.font = "72px Arial"
    ctx.strokeText("Étage atteint :" + heros.num_etage, 960, 840)
    ctx.fillStyle = "#ffffff"
    ctx.fillText("Étage atteint :" + heros.num_etage, 960, 840)

    if (clicked.down) {
        clicked.down = false
        futur_mode = 0
        heros = {"x": 360, "y": 580, "y_carte": -1, "w": 192, "h": 192, "pvMax": 100, "pv": 100, "artefacts": [], "avancement_carte": 0, "num_etage": -1, "num_salle": -1, "temps_tour": 15, "temps_restant": 15, "debut_tour": new Date().getTime(), "mot_clicked" : -1, "vivacite": 0, "or": 0}
        activations_artefacts = [0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        dialogue = -1
        mystere = -1
        etape_tour = 0
        tour_idx = 0
        dj_step = 0
    }
}


function animate_shop() {

    ctx.drawImage(imgs["background3"], 0, 0, 1920, 1080)

    ctx.beginPath()
    ctx.moveTo(210, 200)
    ctx.lineTo(1710, 200)
    ctx.lineTo(1710, 880)
    ctx.lineTo(210, 880)
    ctx.lineTo(210, 200)
    ctx.fillStyle = "#000066"
    ctx.globalAlpha = 0.8
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.lineWidth = 1
    ctx.textAlign = "center"

    for (let i = 0; i < boutique.kanjis.length; i++) {
        let x = 600+360*boutique.kanjis[i].pos
        let y = 400
        ctx.font = "100px Arial"
        ctx.fillStyle = "#ffffff"
        ctx.fillText(kanjis[deck[boutique.kanjis[i].idx]], x, y)
        ctx.strokeText(kanjis[deck[boutique.kanjis[i].idx]], x, y)

        ctx.drawImage(imgs["money"], x-36, y-36+100, 72, 72)
        ctx.font = 42 + "px Romelio"
        ctx.lineWidth = 3
        ctx.strokeText("2", x, y+100)
        ctx.fillText("2", x, y+100)

        if (clicked.down && ( (xyMouseDown.x - x)**2 + (xyMouseDown.y - y)**2 < 2500)) {
            if (heros.or >= 2) {
                heros.or -= 2
                deck.push(deck[boutique.kanjis[i].idx])
                boutique.kanjis.splice(i, 1)
                i--
            }
        }
    }

    ctx.font = "72px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.fillText("Dupliquer un kanji", 960, 280)
    ctx.strokeText("Dupliquer un kanji", 960, 280)
    ctx.fillText("Acheter un artefact", 960, 610)
    ctx.strokeText("Acheter un artefact", 960, 610)

    for (let i = 0; i < boutique.artefacts.length; i++) {
        let x = 600+360*boutique.artefacts[i].pos
        let y = 710
        ctx.drawImage(imgs["artefact"+(1+boutique.artefacts[i].idx)], x-50, y-50, 100, 100)

        ctx.drawImage(imgs["money"], x-36, y-36+100, 72, 72)
        ctx.font = 42 + "px Romelio"
        ctx.fillStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.strokeText(infos_artefacts[boutique.artefacts[i].idx].price, x, y+100)
        ctx.fillText(infos_artefacts[boutique.artefacts[i].idx].price, x, y+100)


        if ( (xyMouseMove.x - x)**2 + (xyMouseMove.y - y)**2 < 2500) {
            let x_text = xyMouseMove.x
            let y_text = xyMouseMove.y+50
            let str = infos_artefacts[boutique.artefacts[i].idx].text
            let words = str.split(" ")
            let print = words[0]
            words.splice(0, 1)
            ctx.font = "36px Arial"

            while (words.length > 0) {

                if (ctx.measureText(print + " " + words[0]).width < 360) {
                    print += " " + words[0]
                    words.splice(0, 1)
                } else {
                    ctx.strokeText(print, x_text, y_text)
                    ctx.fillText(print, x_text, y_text)
                    y_text += 40
                    print = words[0]
                    words.splice(0, 1)
                }
            }
            ctx.strokeText(print, x_text, y_text)
            ctx.fillText(print, x_text, y_text)
        }

        if (clicked.down && ( (xyMouseDown.x - x)**2 + (xyMouseDown.y - y)**2 < 2500)) {
            if (heros.or >= infos_artefacts[boutique.artefacts[i].idx].price) {
                heros.or -= infos_artefacts[boutique.artefacts[i].idx].price
                heros.artefacts.push(boutique.artefacts[i].idx)
                boutique.artefacts.splice(i, 1)
                i--
            }
        }
    }

    ctx.beginPath()
    ctx.strokeStyle = "#ffffff"
    ctx.moveTo(1640, 980)
    ctx.lineTo(1640, 1060)
    ctx.lineTo(1800, 1060)
    ctx.lineTo(1800, 980)
    ctx.lineTo(1640, 980)
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "#555555"
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.globalAlpha = 1
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.strokeStyle = "#000000"

    ctx.font = 50 + "px Romelio"
    ctx.strokeText("Partir", 1720, 1020)
    ctx.fillText("Partir", 1720, 1020)

    afficher_money(1720, 140)
    afficher_artefacts(200, 140)

    if (clicked.down && xyMouseDown.x > 1660 && xyMouseDown.x < 1780 && xyMouseDown.y > 980 && xyMouseDown.y < 1060) {
        futur_mode = 1
    }

    clicked.down = false

}


function global_hub() {

    time = new Date().getTime()

    if (last_mode != futur_mode) {
        last_mode = futur_mode
        transition.on = true
    }

    ///////////////////////////////////////////////////////////
    // AFFICHAGE
    ///////////////////////////////////////////////////////////
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (mode == 0) {
        animate_menu()
    } else if (mode == 1) {
        animate_carte()
    } else if (mode == 2) {
        animate_jeu()
    } else if (mode == 3) {
        animate_firecamp()
    } else if (mode == 4) {
        animate_mystery()
    } else if (mode == 5) {
        animate_shop()
    } else if (mode == 6) {
        animate_revision()
    } else if (mode == 7) {
        animate_perdu()
    }

//    ctx.font = "40px Arial"
//    for (let i = 0; i < deck.length; i++) {
//        ctx.fillText(kanjis[deck[i]], 20 + 40*i, 50)
//        ctx.strokeText(kanjis[deck[i]], 20 + 40*i, 50)
//    }

    if (transition.step > 0) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(1920, 0)
        ctx.lineTo(1920, 1080)
        ctx.lineTo(0, 1080)
        ctx.lineTo(0, 0)
        ctx.fillStyle = "#000000"
        ctx.globalAlpha = transition.step*0.05
        ctx.fill()
        ctx.globalAlpha = 1
    }

    if (transition.on) {
        transition.step += 1
        if (transition.step >= 20) {
            mode = futur_mode
            // Si début d'un combat
            if (mode == 2) {
                if (heros.artefacts.indexOf(4) > -1) {
                    heros.pv = Math.min(heros.pv + 2, heros.pvMax)
                }
            }
            // Si boutique
            if (mode == 5) {
                generer_boutique()
            }
            transition.on = false
        }
    } else {
        transition.step = Math.max(0, transition.step-1)
    }

    requestAnimationFrame(global_hub)
}

