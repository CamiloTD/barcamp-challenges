var Unete = Unete.default;
const TEXT_SPEED = 60;

window.onload = async function main () {
    let body = document.body;
    let Console = document.createElement('div'); Console.className="console";
    let API = await Unete('http://' + location.host + ":50003");
    let challenges = await API.challenges();

    let Narrator = animatedSpan("greetings"); Console.append(Narrator); body.append(Console);
    let name = localStorage.getItem("name");

    if(!name || name == "null") {
        await Narrator.write("Bienvenido humano", TEXT_SPEED);
        await Narrator.write(" Haz sido seleccionado para una competencia para una de las redes secretas mas prestigiosas universalmente, para mantener nuestro anonimato emplearemos el nombre de CoralineDB. ", TEXT_SPEED);
        await Narrator.write(" nuestro proposito al contactarte se trata de que necesitamos un desarrollador web que nos ayude con ciertas dificultades de esganografia ",TEXT_SPEED);
        await Narrator.write("Que tenemos al investigar a nuestra compañia enemiga, les estamos tendiendo una trampa, necesitamos tu ayuda para lograrlo", TEXT_SPEED);
        await Narrator.write(" Creemos que TU puedes ayudarnos con esta mision tan importante, para ello te hemos preparado unas prueba ", TEXT_SPEED); 
        await Narrator.write("Sé que las competencias son duras, y estoy dispuesta a ayudarte en todo lo que necesites...", TEXT_SPEED);
        await Narrator.write("Pero primero...", TEXT_SPEED);
        await Narrator.write("¿Podrías darme tu nombre?", TEXT_SPEED);
        
        name = await prompt("¿Cómo te llamas?");
        localStorage.setItem("name", name);
    } else {
        await Narrator.write(`Bienvenido de vuelta, ${name}...`, TEXT_SPEED);
        await Narrator.write(`Pensé que nunca volverías...`, TEXT_SPEED);
    }

    await Narrator.write("Éstos son tus desafíos:", TEXT_SPEED);



    let user = { name };

    let $list = document.createElement("ul");
        $list.className = "challenge-list";

    for(let i in challenges) {
        let challenge = challenges[i];
        let $item = document.createElement("li");
        let $header = document.createElement("div"); $header.className = "header";
        let $files = document.createElement("ul"); $files.className = "files";

        $header.innerHTML += `<span class="title">${challenge.name}</span>: <span class="desc">${challenge.desc}</span>`;
        $files.innerHTML += challenge.files.map((file) => `<li><a download target="_blank" class="file" href="/${i}/${file}">${file}</span></li>`);

        let $code = document.createElement("button")
            $code.innerHTML = "Ingresar Solucion";
            $code.onclick = async () => {
                let code = prompt("Ingresa tu código...");

                let result = await API.submit(i, user.name, code);

                if(result) alert("Congratulations, winner");
                else alert("You are not a winner");
            };

        $files.append($code);

        $item.append($header, $files);
        $list.append($item);
    }

    let $exit = document.createElement("button");

    $exit.innerHTML += "Salir";

    Console.append($list);
}

function animatedSpan (cn) {
    let $span = document.createElement("span");
    $span.className = cn;

    $span.write = (text, timing, finalize="<br>") => new Promise((done, error) => {
        let i = 0;
        let $subspan = document.createElement("span");
            $subspan.className = "line";

        let timer = setInterval (() => {
            if(i >= text.length) {
                $span.innerHTML += finalize;
                clearInterval(timer);
                done();
                return;
            }

            $subspan.innerHTML += text[i++];
        }, timing);

        $span.append($subspan);
    });

    return $span;
}