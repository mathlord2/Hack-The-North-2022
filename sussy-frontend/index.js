
function nameOf(i){
    return "img-" + i + ".png"
}

function appendImage(i) {
    let img = document.createElement("img")
    img.id = nameOf(i)
    img.src = "images/" + nameOf(i)
    document.getElementById("image-list").append(img)
}

function exists(fileName){
    let http = new XMLHttpRequest()
    let path = "images/" + fileName
    http.open("HEAD", path, false)
    http.send()

    return http.status !== 404
}

let curCheck = 0
function update(){
    for(let i = curCheck; exists(nameOf(i)); i++){
        if(document.getElementById(nameOf(i)) == null){
            appendImage(i)
            curCheck = i + 1
        }
    }
}

setInterval(update, 1000)