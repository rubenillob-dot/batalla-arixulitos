// === VARIABLES GLOBALES ===
let cancionSonandoId = null;

let activeTimerInterval = null; // Intervalo activo para el temporizador de Twitch
let twitchSocket = null;
let votosUnicosChat = new Map(); // Mapa de username -> voto
let currentVoterTimeout = null;

// === DATOS DE LAS CANCIONES ===
const CANCIONES_DATA = [
    {
        id: 1,
        titulo: "La vida del stream",
        autor: "Rurru_Arxu",
        caratula: "imagen/La vida del stream.png",
        audio: "musica/La vida del stream.mp3",
        letra: `<b>(Intro)</b><br>¡Dale, Ericksito, al play, brother!<br>Que esto empieza ya...<br><br><b>(Verso 1)</b><br>Hoy empezamos un buen día de partidas<br>con el Xenomorfo dando la bienvenida.<br>Pidiendo cinco euros, ¡vaya cara dura!<br>cuando es más rico que Elon Musk, ¡qué locura!<br>Pero bueno, eso joder, ahora no importa,<br>que la paciencia en este stream se queda corta.<br>Venimos al directo con ganas de ver ganar,<br>pero acabamos estresados de tanto flipar.<br><br><b>(Pre-coro)</b><br>No vemos ni el arma de lo bug que está su cuenta,<br>¡joder, así no se puede, la vista nos revienta!<br>Verla jugar así es un reto extremo,<br>ojalá mejore en la siguiente o nos perdemos.<br>Pero nunca pares de jugar, Ari, dale duro,<br>que aquí estamos para animarte, te lo aseguro.<br><br><b>(Estribillo)</b><br>¡AYYYYYYY! ¡Qué mala suerte!<br>Por ganar una, perdí más puntos<br>que los que gané en las predis... ¡así no hay quien junte!<br>¡AYYYYYYY! ¡Vaya corriente!<br>Seguimos aquí, aunque el juego nos desmonte.<br><br><b>(Verso 2)</b><br>Y hablemos de los mods, que estamos olvidando,<br>comemos mucho menos que un oso hibernando.<br>¿Pa' cuándo nos abres la puerta del sótano ya?<br>Que el hambre nos consume en esta oscuridad.<br>Pero sigue haciendo streams, que son divertidos,<br>con los mejores momentos y los mejores sonidos.<br>A ver si por fin nos hacemos Epic Partner de una vez,<br>que este canal tiene arte de la cabeza a los pies.<br><br><b>(Puente)</b><br>¡Qué locura, hasta el Xeno sale en una canción!<br>Dominando las redes y hasta el corazón.<br>No dejes de brillar, que el equipo te apoya,<br>aunque el juego esté roto y sea una pesadilla.<br><br><b>(Estribillo)</b><br>¡AYYYYYYY! ¡Qué mala suerte!<br>Por ganar una, perdí más puntos<br>que los que gané en las predis... ¡así no hay quien junte!<br>¡AYYYYYYY! ¡Vaya corriente!<br>Seguimos aquí, aunque el juego nos desmonte.<br><br><b>(Outro)</b><br>¡Nunca pares, Ari!<br>¡Ericksito, súbele ahí!<br>Camino al Epic Partner...<br>¡Nos vemos en el sótano!`
    },
    {
        id: 2,
        titulo: "Perdonalo",
        autor: "Rubencillo_04",
        caratula: "imagen/perdonalo.png",
        audio: "musica/Perdonalo.mp3",
        letra: `<b></b><b>[Verso 1]</b><br>Se apagaron las luces, la pantalla está en gris<br>Hay un eco de risas que no me deja dormir<br>No merecemos este hielo, esta distancia feroz<br>Si ayer sobraban las bromas, hoy nos falta la voz.<br><br><b>[Pre-Estribillo]</b><br>Sabes bien que Piyu es genial<br>Tenerlo cerca es un regalo de verdad<br>Es el rey de Puerto Rico, el que nos hace soñar<br>Y aunque a veces se le pire un poquito...<br>Sabes que se le quiere igual.<br><br><b>[Estribillo]</b><br>Perdóoooonalo...<br>Solo ha sido una amarga confusión<br>No se entendieron sus palabras y tu corazón.<br>Déjalo estar, por favor, hagan las paces ya<br>No soporto veros tan lejos, en tanta soledad.<br>Quiero veros sonreír en el stream otra vez...<br>Perdóoooonalo, mi alma duele si no os veo bien.<br><br><b>[Verso 2]</b><br>El chat pregunta por qué falta una mitad<br>Y yo me muerdo los labios intentando aguantar<br>Fue un cruce de caminos, un orgullo fugaz<br>No dejéis que esta tormenta nos robe la paz.<br><br><b>[Pre-Estribillo]</b><br>Porque sabes que Piyu es genial<br>Nuestra pequeña y gran familia digital<br>Ese loco de la isla que no para de hablar<br>Y aunque a veces se le pire un poquito...<br>Aquí siempre será su hogar.<br><br><b>[Estribillo]</b><br>Perdóoooonalo...<br>Solo ha sido una absurda confusión<br>No se entendieron sus latidos y tu corazón.<br>Déjalo estar, por favor, hagan las paces ya<br>No soporto veros rendidos, sin ganas de hablar.<br>Quiero veros sonreír en el stream otra vez...<br>Perdóoooonalo, quiero veros felices otra vez.<br><br>Y veros sonreír...<br>Volver a compartir esa luz que nos daban los dos.<br>No dejes que el silencio sea el último adiós...<br><br><b>[Estribillo final]</b><br>Perdóoooonalo... fue una confusión.<br>Déjalo estar, hagan las paces ya...<br>No soporto veros así ya.<br>Quiero veros sonreír en el stream otra vez...<br>Quiero veros felices...<br>Solo una vez más.<br><br><b>[Outro]</b><br>Perdónalo...<br>(Silencio)`
    },
    {
        id: 3,
        titulo: "Arixu Cortar Papas",
        autor: "Piyuyin",
        caratula: "imagen/Arixu cortar Papas.jpeg",
        audio: "musica/Arixu Cortar Papas.mp3",
        letra: `<b>(Intro)</b><br>&quot;arixu estas ready pa cortar papas?<br>Chicos, cortamos papas?&quot; 😂🔥<br><br>Ey-ey<br>Arixu en el bloque<br>Los VIP activo’ siempre, tú sabe’<br>PR stand up 🇵🇷<br><br><b>(Coro)</b><br>Seguimo’ chilling aunque cambie la marea<br>El chat explotando cada vez que stream empieza<br>Fortnite y reggaetón, la vibra nunca frena<br>Con los VIP al lao’ la movie está completa<br><br>Yeh-eh<br>No cambiamos por fama ni por par de views<br>Aquí se gana junto’, ese siempre fue el move<br>Desde cero apoyando aunque nadie lo vio<br>Ahora todo el mundo sabe quiénes somo’<br><br><b>(Verso 1)</b><br>Xenomorfo activo cuidando la zona<br>Marta siempre firme aunque el sueño traiciona<br>Rubenillo llega y el chat se emociona<br>Nupo nunca falla cuando la noche corona<br><br>Lusanito con el vacilón prendío<br>La diva Laura con el flow encendío<br>Y Piyuyin… el mejor del mundo, obligado<br>Si él llega al lobby ya el win está asegura’o 😭🔥<br><br><b>(Pre-Coro)</b><br>No es solo stream, es familia real<br>Risas y momentos que no van a borrar<br>Muchos vienen y van<br>Pero este combo sigue hasta el final<br><br><b>(Coro)</b><br>Seguimo’ chilling aunque cambie la marea<br>El chat explotando cada vez que stream empieza<br>Fortnite y reggaetón, la vibra nunca frena<br>Con los VIP al lao’ la movie está completa<br><br><b>(Outro)</b><br>Codigo Arixu cabron o te cortamos las patas brrrrr`
    },
    {
        id: 4,
        titulo: "Xenodeformo Arixu",
        autor: "LivingBenidorm",
        caratula: "imagen/Xenodeformo Arixu.png",
        audio: "musica/Xenodeformo Arixu.mp3",
        letra: `<b>[Verso 1]</b><br>En el canal de Arixu todas las tardes lo pasamos genial<br>Aunque casi nunca me toquen los ñorteos es algo habitual<br>Con la skin de Mister Savage juego siempre con lealtad<br>Desde que me la relagó la streamer siento felicidad<br><br><b>[Pre-estribillo]</b><br>Soy el más manco del chat pero me gusta campear<br>Y dar esnipazos por doquier sin parar<br>Ari me regalas una skin me agregas por favor<br>Noopo un duo con el Piyu el chache es puro amor<br><br><b>[Estribillo]</b><br>En xenodeformo nos lo pasamos muy bien<br>Todas las tardes espero tu directo para verte también<br>Cuando te mate en una privada sin ningún remordimiento<br>Me tienes que regalar un padel contigo es mi sentimiento<br><br><b>[Verso 2]</b><br>En el canal de Arixu la diversión nunca va a parar<br>Aunque los ñorteos esquivos suelan sin razón llegar<br>Con esa skin especial las partidas son de otro nivel<br>La streamer me la dio y brilla como el sol en el cielo<br><br><b>[Pre-estribillo]</b><br>Soy el más manco del chat pero me gusta campear<br>Y dar esnipazos por doquier sin parar<br>Ari me regalas una skin me agregas por favor<br>Noopo un duo con el Piyu el chache es puro amor<br><br><b>[Break]</b><br><br><b>[Estribillo]</b><br>En xenodeformo nos lo pasamos muy bien<br>Todas las tardes espero tu directo para verte también<br>Cuando te mate en una privada sin ningún remordimiento<br>Me tienes que regalar un padel contigo es mi sentimiento<br><br><b>[Estribillo]</b><br>En xenodeformo nos lo pasamos muy bien<br>Todas las tardes espero tu directo para verte también<br>Cuando te mate en una privada sin ningún remordimiento<br>Me tienes que regalar un padel contigo es mi sentimiento<br><br><b>[Outro]</b>`
    },
    {
        id: 5,
        titulo: "No tengo ideas",
        autor: "Raquelurg_arxu_navidad",
        caratula: "imagen/No tengo ideas.png",
        audio: "musica/No tengo ideas.mp3",
        letra: `<b>(Verso 1)</b><br>No tengo ideas para hacer esta canción,<br>llevo media hora mirando el techo del salón.<br>El profe dice &quot;piensa en tu futuro ya&quot;,<br>pero yo solo quiero dormir hasta mañana.<br><br>Tengo tareas sin abrir desde el lunes,<br>mil mensajes y yo ignorando los grupos comunes.<br>Mi madre grita &quot;¡ponte ya a estudiar!&quot;,<br>y yo pensando qué excusa voy a inventar.<br><br><b>(Pre-Coro)</b><br>Y otra vez,<br>el despertador sonando a las seis.<br>No sé qué hago, no sé qué quiero,<br>solo sé que quiero vacaciones primero.<br><br><b>(Coro)</b><br>No quiero estudiar,<br>quiero desaparecer.<br>Poner música alta<br>y no tener que responder.<br>No tengo ideas,<br>ni ganas de pensar,<br>pero aquí sigo escribiendo<br>porque no sé qué más hacer ya.<br><br><b>(Verso 2)</b><br>Exámenes vienen como una invasión,<br>mi motivación perdió la conexión.<br>Digo &quot;mañana sí voy a cambiar&quot;,<br>pero mañana me vuelvo a distraer igual.<br><br>TikTok abierto desde hace dos horas,<br>dije &quot;cinco minutos&quot; y ya casi es la aurora.<br>La vida adulta me da un poco de miedo,<br>aunque finjo que todo me importa un huevo.<br><br><b>(Puente)</b><br>Tal vez un día encuentre dirección,<br>pero hoy solo quiero evitar la presión.<br>Si me preguntas qué voy a hacer,<br>probablemente dormir y luego comer.<br><br><b>(Coro final)</b><br>No quiero estudiar,<br>quiero respirar.<br>Salir con mis amigos<br>y olvidarme del celular.<br>No tengo ideas<br>para esta canción,<br>pero supongo que así<br>suena mi generación.`
    },
    {
        id: 6,
        titulo: "Arixu especial 2",
        autor: "Noopo_Arxu",
        caratula: "imagen/Arixu especial 2.jpeg",
        audio: "musica/Arixu especial 2.mp3",
        letra: `<b>[Intro]</b><br>Yeah-yeah…<br>Desde España pa’ la pantalla,<br>Arixu en directo,<br>siempre da batalla.<br><br>Yeah-yeah…<br><br><b>[Verso 1]</b><br>Cinco de la tarde,<br>comienza el show,<br>luces encendidas,<br>ya se conectó.<br><br>Auriculares puestos,<br>lista pa’ jugar,<br>aunque sabe bien<br>cómo va a terminar.<br><br>Dice: &quot;esta la gano&quot;,<br>termina al revés,<br>y el chat explotando<br>de risa otra vez.<br><br><b>[Verso 2]</b><br>Fortnite toda la jornada,<br>café y edición,<br>Simba aparece<br>buscando atención.<br><br>Se roba el foco,<br>tradición natural,<br>mientras ella ragea<br>por otro sniper fatal.<br><br><b>[Pre-Estribillo]</b><br>Xeno llega al chat<br>conduciendo su Porsche,<br>tira chistes malos<br>y no quiere el mod.<br><br>Sin su humor en directo<br>nadie sobrevive,<br>porque el stream sin Xeno<br>literalmente no vive.<br><br><b>[Estribillo]</b><br>Oh-oh,<br>el chat nunca falla,<br>&quot;feliz navidad&quot; en agosto<br>y nadie se calla.<br><br>Entre chistes random<br>y clips del mes,<br>siempre hay algún bug<br>rompiendo el estrés.<br><br>Y aunque no gane<br>una battle royale,<br>todos vuelven mañana<br>al directo igual.<br><br><b>[Verso 3]</b><br>Piyuyin entra<br>con susto brutal,<br>cae de la nada<br>y explota el canal.<br><br>VIP legendario,<br>caos natural,<br>cinco segundos dentro<br>y ya rompe el chat.<br><br>Noopo hace stream sniper<br>con talento sobrenatural,<br>aparece en cada lobby,<br>eso ya es paranormal.<br><br>La streamer ni está online<br>y él saluda emocionado,<br>si hubiera ranking de presencia<br>lo gana sobrado.<br><br><b>[Verso 4]</b><br>Laura pilla el micro<br>y empieza la función,<br>&quot;chat, viene uno bueno&quot;<br>y ya salta la tensión.<br><br>Cuenta un chiste malísimo<br>de un ninja y un flan,<br>y el chat lleno de:<br>&quot;mods, por favor, dadle ban&quot;.<br><br>Y si no está entrenando<br>sin descansar,<br>seguro en el pádel<br>queriendo ganar.<br><br><b>[Puente]</b><br>Tiene novio, sí,<br>y eso al chat desespera,<br>el de la bici amarilla<br>quiere su lugar a la primera.<br><br>Pero arixu se ríe<br>y sigue el game,<br>mientras mata a Mauj<br>una y otra vez.<br><br>Una privada perdida,<br>mañana habrá más,<br>pero las risas del chat<br>nunca se van.<br><br>Neus mira el mapa<br>pensando &quot;hoy sí será&quot;,<br>vive a un par de calles<br>pero nunca se le da.<br><br>Tiene al streamer cerca<br>y el destino al revés,<br>tan cerca de encontrarlo…<br>y tan lejos a la vez.<br><br>Entre memes, sustos<br>y comunidad,<br>arixu hizo del stream<br>un hogar de verdad.<br><br><b>[Outro]</b><br>Oh-oh,<br>aRixu en pantalla,<br>fitness, pádel<br>y defeats en batalla.<br><br>Oh-oh,<br>Simba vigilando,<br>y Rubencillo el stream<br>moderando.<br><br>Bicicletas amarillas<br>finalizando el chat,<br>&quot;feliz navidad&quot;<br>no deja de sonar.<br><br>Y aunque Fortnite hoy<br>la quiera trolear,<br>el código ARIXU<br>en la tienda está.`
    },
    {
        id: 7,
        titulo: "Arixu en la casa",
        autor: "Neeusgoomiiis",
        caratula: "imagen/Arixu en la casa.png",
        audio: "musica/Arixu en la casa.mp3",
        letra: `<b>[Intro]</b><br>Yeah-yeah…<br>Arixu baby…<br>La streamer favorita del party…<br><br><b>[Verso 1]</b><br>Siempre activa, nunca baja el nivel,<br>rubia peligrosa cuando entra en el canal.<br>Gym por la mañana, por la tarde directo,<br>y aunque falle jugadas, lo hace perfecto.<br><br>Cae en Fortnite pero se ríe igual,<br>dice &quot;todo chill&quot;, sigue siendo viral.<br>En la pista de pádel se pone criminal,<br>nadie le sigue el ritmo cuando empieza a jugar.<br><br><b>[Pre-Coro]</b><br>Y todos quieren una amiga como ella,<br>porque tiene brillo propio como estrella.<br>Siempre está pa’ ti cuando hace falta,<br>de esas personas que nunca te fallan.<br><br><b>[Coro]</b><br>Arixu, prende el stream y sube la presión,<br>todo el mundo activo cuando escucha su voz.<br>Tiene flow, tiene vibra, tiene algo especial,<br>hasta perdiendo queda espectacular.<br><br>Arixu, siempre rompiendo el control,<br>haciendo locuras pero con estilo y flow.<br>La reina del party, del gym y el gaming,<br>si entra en la squad ya nadie se quiere ir.<br><br><b>[Verso 2]</b><br>Chat explotando cuando empieza el directo,<br>ella ni lo intenta y le sale perfecto.<br>Carita bonita, mente competitiva,<br>siempre positiva, siempre bien arriba.<br><br>Una crown más… o quizá no cayó,<br>pero las risas nadie las ganó.<br>Con ella cualquier tarde mejora,<br>de esas amistades que valen oro ahora.<br><br><b>[Puente]</b><br>Y aunque el mapa cambie y venga otra season,<br>ella sigue siendo la mejor combinación.<br>Streamer, amiga y pura diversión,<br>Arixu tiene otro nivel de conexión.<br><br><b>[Final]</b><br>Yeah-yeah…<br>Todo el mundo sabe quién domina la misión…<br>Ah, y que no se me olvide…<br>&quot;Código Arixu en la tienda de Fortnite.&quot; mi amorrr.`
    },
    {
        id: 8,
        titulo: "CodeArixu 1x1",
        autor: "CodigoArixu",
        caratula: "imagen/CodeArixu 1x1.jpeg",
        audio: "musica/CodeArixu 1x1.mp3",
        letra: `<b>[Intro]</b><br>Yeah-yeah…<br>Antes de comprar la skin ya sabes qué toca,<br>código ARIXU o la tienda se equivoca.<br><br><b>[Verso 1]</b><br>Abren Fortnite, todo listo pa’ gastar,<br>pero el chat ya empieza a gritar:<br>&quot;¡Código ARIXU, no lo vayan a olvidar!&quot;,<br>porque si no lo ponen… ella lo vuelve a recordar.<br><br>Sale una skin nueva, todos van corriendo,<br>Arixu en directo promocionando el evento.<br>Dice &quot;si compran algo ya saben cuál va&quot;,<br>y el chat spameando &quot;ARIXU&quot; sin parar.<br><br>Aunque después entre y empiece el desastre,<br>cae del bus y se buguea al instante.<br>Quiere lootear y atraviesa el suelo,<br>Fortnite la odia pero ella sigue en el juego.<br><br><b>[Pre-Coro]</b><br>Fails por aquí, bugs por allá,<br>pero el código nunca puede faltar.<br>Pierde otra ranked, se escucha gritar,<br>y el chat: &quot;tranquila, lo vamos a usar&quot;.<br><br><b>[Coro]</b><br>Código ARIXU dentro de la tienda,<br>ponelo rápido antes que desaparezca.<br>Skins, pavos, picos pa’ comprar,<br>pero con ARIXU lo tienes que apoyar.<br><br>Código ARIXU, suena en el chat,<br>cada cinco minutos lo vuelven a spamear.<br>Aunque Fortnite explote y no deje jugar,<br>el código sigue brillando igual.<br><br><b>[Verso 2]</b><br>Nuevo pase de batalla, nueva actualización,<br>nuevo bug raro rompiendo la misión.<br>Arixu intenta correr, termina flotando,<br>y el chat mientras tanto el código recordando.<br><br>&quot;Epic arréglalo&quot;, vuelve a repetir,<br>mientras un coche la manda a volar sin sentido aquí.<br>Pero ella se ríe, sigue el vacilón,<br>porque hasta los bugs le dan colaboración.<br><br>La tienda girando, skins legendarias,<br>y el chat poniendo &quot;ARIXU&quot; como plegaria.<br>Ya es tradición dentro del canal,<br>comprar cualquier cosa con el código oficial.<br><br><b>[Puente]</b><br>Directos de tarde, risas sin control,<br>bugs imposibles rompiendo el monitor.<br>Pero entre fails hay algo seguro aquí:<br>el código ARIXU nunca va a morir.<br><br><b>[Último Coro]</b><br>Código ARIXU dentro de la tienda,<br>todo el mundo ya se lo sabe de memoria.<br>Si compras una skin o algún emote más,<br>pon ARIXU antes de confirmar.<br><br>Código ARIXU, grítalo otra vez,<br>aunque pierda diez partidas seguidas después.<br>Fortnite podrá buguearse sin final,<br>pero el código ARIXU… siempre viral.`
    },
    {
        id: 9,
        titulo: "Como el Fenix",
        autor: "Angel_granjero",
        caratula: "imagen/Como el Fenix.png",
        audio: "musica/Como el Fenix.mp3",
        letra: `<b>(Intro)</b><br>Yeah-yeah…<br>De las cenizas volví…<br>Y ahora nadie apaga lo que vive dentro de mí…<br>Oh-oh…<br><br><b>(Verso 1)</b><br>Tuve noches donde el alma se rompía,<br>donde ni mi reflejo me reconocía.<br>Las heridas hablaban por mi piel,<br>pero aprendí a quererme otra vez.<br><br>Caí profundo, pero no fue mi final,<br>la tormenta me enseñó a volar.<br>Y aunque hubo fuego consumiendo mi interior,<br>de las llamas nació alguien mejor.<br><br><b>(Pre-Coro)</b><br>Ahora mírame brillando,<br>todo lo malo quedó atrás.<br>Lo que un día fue tristeza<br>hoy me hizo más fuerte de verdad.<br><br><b>(Coro)</b><br>Como el fénix renací de las cenizas,<br>convertí mis cicatrices en la gasolina.<br>Lo que dolía ya no controla mi camino,<br>ahora vuelo alto porque volví conmigo.<br><br>Bailando bajo luces, corazón encendido,<br>dejé atrás el pasado que quiso destruirme vivo.<br>Y aunque las marcas nunca se van,<br>hoy son prueba de que pude despertar.<br><br><b>(Verso 2)</b><br>Tres años peleando contra la oscuridad,<br>hasta que entendí que podía sanar.<br>No fue magia, fue volver a creer,<br>que incluso roto uno puede renacer.<br><br>Ahora camino sin miedo al dolor,<br>porque aprendí el valor de mi voz.<br>La ansiedad ya no me roba el aire,<br>y mis demonios hoy no saben dónde hallarme.<br><br><b>(Puente)</b><br>De fuego nací…<br>de fuego crecí…<br>todo lo malo lo dejé morir.<br><br>Ya no corro del pasado,<br>porque ahora sé quién soy.<br>Cada lágrima caída<br>me hizo más fuerte hoy.<br><br><b>(Último coro)</b><br>Como el fénix renací de las cenizas,<br>hoy mi alma vuelve a sentirse viva.<br>Lo que un día me rompió por dentro,<br>ahora es fuerza moviendo mi cuerpo.<br><br>Bailando reggaetón con el corazón abierto,<br>celebrando que salí del infierno.<br>Y aunque las marcas nunca se van…<br>ya no duelen…<br>porque aprendí a volar.`
    },
    {
        id: 10,
        titulo: "Que vuelva Franco",
        autor: "anonimo_arxu",
        caratula: "imagen/Franco.png",
        audio: "musica/Franco.mp3",
        letra: `<b></b><b>[Verse 1]</b><br>Hoy es mi cumpleaños, la familia reunida,<br>la mesa de gala, la mejor comida.<br>Me pongo de pie y suelto el notición:<br>&quot;Me he echado una novia que es la sensación&quot;.<br><br><b>[Verse 2]</b><br>Todos me aplauden, mi madre encantada,<br>y mi abuelo el facha, con la frente levantada.<br>Saca la cartera, me suelta un buen billete,<br>&quot;Invítala a cenar y trátala de chupete&quot;.<br><br>¡Y saca la tarta, toca el cajón!<br>Que mi niño ha pillado a un bombón.<br>¡Saca la guitarra, venga a cantar!<br>Que esta tarde la calle vamos a cortar.<br>¡Toca las palmas, marca el compás!<br>Que el abuelo hoy invita y no mira pa’ atrás.<br><br><b>[Verse 3]</b><br>Repartiendo la tarta, soplando las velitas,<br>mi abuelo presumiendo de sus batallitas.<br>De repente, ¡ding dong!, suena el timbre del salón,<br>&quot;¡Es ella!&quot;, les digo, latiendo el corazón.<br><br><b>[Verse 4]</b><br>Abro la puerta, entra por el pasillo,<br>espectacular, brillando más que un anillo.<br>Pero mi abuelo la mira y pierde el color...<br>Que mi novia es negra y le da un sudor.<br><br><b>[Verse 5]</b><br>Grita a pulmón, montando el cacao:<br><br>&quot;¡Me cago en Dios! ¿Pero esto qué es?<br>¡Agárrame el pulso que me da un revés!<br>¡Ay, que me asfixio, me da un parraco!<br>¡Con lo tranquilo que vivía... joder, que vuelva Franco!&quot;<br><br><b>[Verse 6]</b><br>Llamando a urgencias, menudo sofoco,<br>la juerga gitana se rompe de a poco.<br>Lo suben a la camilla, le ponen el suero,<br>y el viejo murmura quitándose el sombrero:<br><br>&quot;¡Me habéis matao, me da un parraco!<br>¡Con lo tranquilo que vivía... joder, que vuelva Franco!&quot;<br><br><b>[Bridge]</b><br>Llegamos al centro, lo meten en boxes,<br>pasando las horas y dando las doce.<br>El médico sale, nos mira fatal:<br>&quot;Familia, lo siento, está en fase final&quot;.<br><br><b>[Outro]</b><br>Me acerco a la cama, le cojo la mano,<br>pensando que el viejo se va muy temprano.<br>Abre los ojos, me mira de lado,<br>y con el hilo de voz que le ha quedado...<br>Hace un esfuerzo, tosiendo un poco...<br><br>&quot;Hijo mío... me da un parraco...<br>¡Con lo tranquilo que vivía... joder, que vuelva Franco!&quot;`
    },
    {
        id: 11,
        titulo: "BOOOMM Silbido Chat",
        autor: "XxabranzinxX",
        caratula: "imagen/BOOOMM Silbido Chat.png",
        audio: "musica/BOOOMM Silbido Chat.mp3",
        letra: `<b>[Intro]</b><br>BOOOMM BOOOMM <br>SSSSHHHH<br><br>Eeiii<br>Llegó al canal <br>Una persona especial<br>Gracias por estar aquí<br>Eso me hace feliz<br><br><b>[Coro]</b><br>Gracias por tu suscripción me ayudas un montón <br>Si te quedas con nosotros sube fuerte la emoción.<br>Si buscas, fakes y diversión, este canal es el tuyo y conocerte es un orgullo<br><br><b>[Verso]</b><br>Sorteos en la casa, sube la celebración.<br>Deja que el chat te acoja <br>Y si alguien se porta mal BAN q se lleva<br>Si comentas, yo te leo<br>Si compartes, te celebro<br>Aquí siempre hay movimiento<br>Y el show nunca cae en cero<br><br><b>[Puente]</b><br>Un saludo pa’ la gente<br>Que se monta de frente<br>Lo que viene está caliente<br>Y el canal sigue demente.<br><br><b>[Outro]</b><br>Bienvenido al canal <br>Quedate un poco más<br>Bienvenido al canallll`
    },
    {
        id: 12,
        titulo: "Codigo ARIXU",
        autor: "ferdinangwsk",
        caratula: "imagen/Codigo ARIXU.png",
        audio: "musica/Codigo ARIXU.mp3",
        letra: `<b>[INTRO]</b><br>&quot;Chat… ¿estamos ready o qué?&quot;<br>&quot;¡Full doble uve toda la partida!&quot;<br><br><b>[VERSE 1]</b><br>Sale Ari conectando directo otra vez,<br>todo el chat ya sabe lo que va a suceder.<br>Caen los bunkers mal, nadie lo puede entender,<br>pero se ríe ella primero y eso lo hace bien.<br><br>Siempre full doble uve, no conoce el miedo,<br>entra contra squads aunque no tenga escudo entero.<br>Hace customs pa’ la gente, nunca dice luego,<br>si juega su comunidad… se convierte en fuego.<br><br>Y en la tienda no lo olvides, mi bro,<br>código ARIxU, que lo sepa Dios.<br>Todo el chat spameando con pasión,<br>porque Ari no es streamer… es conexión.<br><br><b>[CHORUS ]</b><br>Ohhhh ohhhh ohhhh<br>A-A-ARIxUUUU<br>Pon el código en la tienda, tú ya sabes túúú.<br><br>Ohhhh ohhhh ohhhh<br>Full doble uve sin miedo<br>Aunque caigan mal los bunkers, la seguimos rompiendo.<br><br>Ohhhh ohhhh ohhhh<br>Toda la familia unida<br>Ríen, lloran, se descojonan to’a la partida.<br><br>Ohhhh ohhhh ohhhh<br>Que lo escuche todo el mundo<br>Si Ari entra en el lobby… se viene otro triunfo.<br><br><b>[VERSE 2 ]</b><br>Mods en el chat cuidando el ambiente,<br>cada uno diferente, pero increíble la gente.<br>Han creado una familia gigante,<br>de esas que se sienten importantes.<br><br>Y Simba corriendo por toda la casa,<br>mientras todo el chat se ríe con lo que pasa.<br>Comunidad unida, nadie la separa,<br>apoyando siempre con la mejor cara.<br><br>Y su hermana ahí calladita observando,<br>igualita que Ari pero más tímida actuando.<br>Toda la familia siempre apoyando,<br>mientras el chat entero sigue vibrando.<br><br><b>[RAP]</b><br>Ey,<br>si hay ban… cuidado con lo que escribes,<br>que los mods van rápidos y ni lo percibes.<br>Aquí se viene a reír, a disfrutar la misión,<br>esta comunidad tiene corazón.<br><br>Customs activadas, Fortnite explotando,<br>Ari entra al mapa y todos aterrizando.<br>No importa perder si la noche está encendida,<br>porque aquí cada directo nos mejora la vida.<br><br>Padel en la pista, miedo da mirarla,<br>cada bola imposible consigue levantarla.<br>No existe punto que se le resista,<br>Ari modo tryhard… MVP de la pista.<br><br><b>[FINAL CHORUS ]</b><br>Ohhhh ohhhh ohhhh<br>A-A-ARIxUUUU<br>Pon el código en la tienda, tú ya sabes túúú.<br><br>Ohhhh ohhhh ohhhh<br>Full doble uve sin miedo<br>Aunque caigan mal los bunkers, la seguimos rompiendo.<br><br>Ohhhh ohhhh ohhhh<br>Toda la familia unida<br>Ríen, lloran, se descojonan to’a la partida.<br><br>Ohhhh ohhhh ohhhh<br>Que lo escuche todo el mundo<br>Si Ari entra en el lobby… se viene otro triunfo.<br><br><b>[OUTRO]</b><br>Desde el chat hasta el corazón…<br>Ari nunca juega sola no…<br>Familia para siempre…<br>Arixuuu…`
    },
    {
        id: 13,
        titulo: "Ticket dorado",
        autor: "aandreiiiitaaaa",
        caratula: "imagen/Ticket dorado.png",
        audio: "musica/Ticket dorado.mp3",
        letra: `<b>[Intro]</b><br>Chaaacha…<br>que no se oye bieeen…<br><br><b>[Verso 1]</b><br>Twitch prendío, ya son las seis<br>esperando a que arixu prenda de una vez<br>de pronto empezó, luchando se quedó, pero la puerta del garaje sin vida la dejó<br>otra partida más<br>otra vez sin fe<br>apostando No a la predi para ganar puntos otra vez.<br><br>Chaaacha…<br>que no se oye bieeen…<br><br><b>[Pre-Coro]</b><br>No me hables de suerte<br>siempre sale al revés<br>busco el ticket dorado<br>y no toca ni una vez<br>llegaron Piyu y cheno no encontraron el freno, chocaron con el muro y quedó feo el estreno.<br><br><b>[Coro]</b><br>y la puerta la aplasta otra vez<br>Arixu se fue<br>por la puerta del garaje y no llegó al top 10<br><br>&quot;Le pregunto a Xeno: ¿me echaste de menos?&quot; él responde que sí… ( pero nooo) y explotamos riendo luego<br><br>llega la otra semana y<br>el ticket dorado<br>de nuevo no me ha tocado<br><br>Suena el móvil, veinte llamadas sin contestar,<br>&quot;eran 23 bro&quot;… me empiezan a vacilar.<br><br><b>[Final]</b><br>Chaaachaa que se acabó la sesión`,
        activo: false
    },
    {
        id: 14,
        titulo: "Canción 14",
        autor: "Artista 14",
        caratula: "",
        audio: "",
        letra: "Letra...",
        activo: false
    },
    {
        id: 15,
        titulo: "Canción 15",
        autor: "Artista 15",
        caratula: "",
        audio: "",
        letra: "Letra...",
        activo: false
    }
];

// === RENDERIZADO DINÁMICO DE TARJETAS ===
function renderizarCanciones() {
    const grid = document.querySelector('.grid-canciones');
    if (!grid) return;

    const activeSongs = CANCIONES_DATA.filter(song => song.activo !== false);
    
    let html = '';
    const numCombats = 6;
    
    for (let c = 1; c <= numCombats; c++) {
        const songA = activeSongs[(c - 1) * 2];
        const songB = activeSongs[(c - 1) * 2 + 1];
        
        if (!songA) continue;
        
        html += `
        <div class="combate-block">
            <!-- Rótulo de Combate Estilo FMS -->
            <div class="combate-header-container">
                <div class="combate-header-main">
                    <h3 class="combate-title">COMBATE NÚMERO ${c}</h3>
                </div>
                <div class="combate-header-ribbon">
                    <div class="ribbon-left">${songA ? songA.autor : ''}</div>
                    <div class="ribbon-right">${songB ? songB.autor : ''}</div>
                </div>
            </div>
            
            <!-- Cara a Cara (VS) -->
            <div class="combate-vs-container">
                <!-- Participante A -->
                ${generarHtmlTarjeta(songA)}
                
                <!-- Elemento VS gigante -->
                ${songB ? `<div class="vs-divider">VS</div>` : ''}
                
                <!-- Participante B -->
                ${songB ? generarHtmlTarjeta(songB) : ''}
            </div>
        </div>
        `;
    }
    
    grid.innerHTML = html;
}

function generarHtmlTarjeta(song) {
    const origIndex = CANCIONES_DATA.indexOf(song);
    return `
    <div class="card" id="cancion${song.id}">
        <img src="${song.caratula}" alt="Carátula" class="caratula">
        <div class="card-content">
            <div class="card-header-top">
                <div class="author-row">
                    <i class="fa-solid fa-user author-avatar"></i> ${song.autor}
                </div>
            </div>
            <div class="song-title">${song.titulo}</div>
            <div class="player-ui">
                <audio id="audio${song.id}" src="${song.audio}"></audio>
                <button class="play-btn" onclick="reproducir('${song.id}')">
                    <i class="fa-solid fa-play" id="playIcon${song.id}"></i>
                </button>
                <div class="timeline">
                    <div class="timeline-progress" style="width: 0%;"></div>
                </div>
                <span class="time-text">0:00 / 0:00</span>
                <i class="fa-solid fa-volume-high" style="color: var(--text-muted); font-size: 0.8rem;"></i>
            </div>
            <div class="scoring-row">
                <button class="btn-yellow-small"
                    onclick="abrirLetra(CANCIONES_DATA[${origIndex}].titulo, CANCIONES_DATA[${origIndex}].letra)"
                    title="Ver letra">
                    <i class="fa-solid fa-book"></i>
                </button>

                <div class="fila-jueces">
                    <input type="hidden" class="score-input" id="inputAri${song.id}" value="">
                    
                    <!-- Contenedor Ari Emote / Badge -->
                    <div class="judge-slot-container" id="slotAri${song.id}" title="Puntuación de Ari" onclick="abrirScoringModal('${song.id}', 'Ari')">
                        <img src="emotes/EmoteAri.png" class="judge-emote" id="emoteAri${song.id}" alt="Ari">
                        <div class="judge-score-badge ari" id="badgeAri${song.id}" style="display: none;">-</div>
                    </div>

                    <!-- Botón del chat -->
                    <button class="btn-twitch-vote"
                        onclick="iniciarVotacionChat('${song.id}')"
                        title="Votación del Chat de Twitch">
                        <i class="fa-brands fa-twitch"></i>
                    </button>
                </div>
                <div class="twitch-score-badge" id="twitchScore${song.id}" title="Nota Twitch Chat">
                    <i class="fa-brands fa-twitch"></i> -
                </div>
                <div class="final-score-badge" id="finalScore${song.id}">-</div>
            </div>
        </div>
    </div>`;
}

// === INICIALIZACIÓN DEL REPRODUCTOR DE AUDIO Y EVENTOS ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderizar las tarjetas en la cuadrícula
    renderizarCanciones();

    // 2. Listener del control de volumen general
    const volumeSlider = document.querySelector('.volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function (e) {
            const volumen = e.target.value / 100;
            document.querySelectorAll('audio').forEach(audio => {
                audio.volume = volumen;
            });
        });
    }

    // 3. Listeners para los reproductores de audio de las tarjetas
    document.querySelectorAll('.grid-canciones audio').forEach(audio => {
        audio.addEventListener('loadedmetadata', function () {
            const id = this.id.replace('audio', '');
            const card = document.getElementById('cancion' + id);
            if (card && !isNaN(this.duration)) {
                const timeText = card.querySelector('.time-text');
                const totalMins = Math.floor(this.duration / 60);
                const totalSecs = Math.floor(this.duration % 60).toString().padStart(2, '0');
                if (timeText) timeText.innerText = `0:00 / ${totalMins}:${totalSecs}`;
            }
        });

        audio.addEventListener('timeupdate', function () {
            const id = this.id.replace('audio', '');
            const card = document.getElementById('cancion' + id);
            if (card && this.duration) {
                const progressBar = card.querySelector('.timeline-progress');
                const timeText = card.querySelector('.time-text');

                const progressPercent = (this.currentTime / this.duration) * 100;
                if (progressBar) progressBar.style.width = progressPercent + '%';

                const currentMins = Math.floor(this.currentTime / 60);
                const currentSecs = Math.floor(this.currentTime % 60).toString().padStart(2, '0');
                const totalMins = Math.floor(this.duration / 60);
                const totalSecs = Math.floor(this.duration % 60).toString().padStart(2, '0');

                if (timeText) timeText.innerText = `${currentMins}:${currentSecs} / ${totalMins}:${totalSecs}`;
            }
        });

        audio.addEventListener('ended', function () {
            const id = this.id.replace('audio', '');
            const card = document.getElementById('cancion' + id);
            const iconoActual = document.getElementById('playIcon' + id);
            if (card) {
                card.classList.remove('playing');
                const progressBar = card.querySelector('.timeline-progress');
                if (progressBar) progressBar.style.width = '0%';
                resetSlidersTarjeta(id); // Ocultar y resetear sliders al terminar la canción
            }
            if (iconoActual) {
                iconoActual.classList.remove('fa-pause');
                iconoActual.classList.add('fa-play');
            }
            cancionSonandoId = null;
        });
    });

    // 4. Clics en la línea de tiempo de reproducción de tarjetas
    document.querySelectorAll('.grid-canciones .timeline').forEach(timeline => {
        timeline.addEventListener('click', function (e) {
            const card = this.closest('.card');
            const id = card.id.replace('cancion', '');
            const audio = document.getElementById('audio' + id);
            if (audio && audio.duration) {
                const rect = this.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                audio.currentTime = percentage * audio.duration;
            }
        });
    });

    // 5. Listeners para los reproductores de batalla
    ['A', 'B'].forEach(lado => {
        const audio = document.getElementById('audioBatalla' + lado);
        if (audio) {
            audio.addEventListener('timeupdate', function () {
                const progress = document.getElementById('progressBatalla' + lado);
                const timeText = document.getElementById('timeBatalla' + lado);
                if (this.duration) {
                    progress.style.width = (this.currentTime / this.duration) * 100 + '%';
                    const currentMins = Math.floor(this.currentTime / 60);
                    const currentSecs = Math.floor(this.currentTime % 60).toString().padStart(2, '0');
                    const totalMins = Math.floor(this.duration / 60);
                    const totalSecs = Math.floor(this.duration % 60).toString().padStart(2, '0');
                    timeText.innerText = `${currentMins}:${currentSecs} / ${totalMins}:${totalSecs}`;
                }
            });
            audio.addEventListener('ended', function () {
                document.getElementById('playIconBatalla' + lado).className = 'fa-solid fa-play';
                document.getElementById('progressBatalla' + lado).style.width = '0%';
            });

            // Permitir clic para avanzar
            const timeline = document.getElementById('timelineBatalla' + lado);
            if (timeline) {
                timeline.addEventListener('click', function (e) {
                    if (audio.duration) {
                        const rect = this.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        audio.currentTime = (clickX / rect.width) * audio.duration;
                    }
                });
            }
        }
    });
});


// === FUNCIONES DE LAS CARTAS ===

function reproducir(id) {
    const audioActual = document.getElementById('audio' + id);
    const iconoActual = document.getElementById('playIcon' + id);
    const cartaActual = document.getElementById('cancion' + id);

    if (!audioActual || !audioActual.src || audioActual.src.endsWith("html")) {
        alert("Añade una canción .mp3 en el HTML para que suene.");
        return;
    }

    if (cancionSonandoId === id) {
        if (audioActual.paused) {
            audioActual.play();
            cartaActual.classList.add('playing');
            iconoActual.classList.remove('fa-play');
            iconoActual.classList.add('fa-pause');
        } else {
            audioActual.pause();
            cartaActual.classList.remove('playing');
            iconoActual.classList.remove('fa-pause');
            iconoActual.classList.add('fa-play');
            resetSlidersTarjeta(id); // Ocultar y resetear sliders al pausar
        }
        return;
    }

    if (cancionSonandoId !== null) {
        const audioPrevio = document.getElementById('audio' + cancionSonandoId);
        const iconoPrevio = document.getElementById('playIcon' + cancionSonandoId);
        const cartaPrevia = document.getElementById('cancion' + cancionSonandoId);
        if (audioPrevio) audioPrevio.pause();
        if (cartaPrevia) {
            cartaPrevia.classList.remove('playing');
            resetSlidersTarjeta(cancionSonandoId); // Ocultar y resetear sliders de la tarjeta anterior
        }
        if (iconoPrevio) {
            iconoPrevio.classList.remove('fa-pause');
            iconoPrevio.classList.add('fa-play');
        }
    }

    audioActual.play();
    cartaActual.classList.add('playing');
    iconoActual.classList.remove('fa-play');
    iconoActual.classList.add('fa-pause');
    cancionSonandoId = id;
}

// === GLOBALES DEL MODAL DE PUNTUACIÓN ===
let modalActiveSongId = null;
let modalActiveJuez = null;
let modalCurrentScore = 5.0;

// === FUNCIONES DE MODALES ===
function abrirLetra(titulo, letraHTML) {
    document.getElementById('modalTitle').innerText = titulo;
    document.getElementById('modalLyrics').innerHTML = letraHTML;
    document.getElementById('lyricsModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarLetra() {
    document.getElementById('lyricsModal').style.display = 'none';
    document.body.style.overflow = '';
}

function abrirScoringModal(songId, juez) {
    modalActiveSongId = songId;
    modalActiveJuez = juez;
    
    const input = document.getElementById(`input${juez}${songId}`);
    const originalVal = input && input.value !== "" ? parseFloat(input.value) : null;
    
    // Si no ha votado aún, se inicializa por defecto en 5.0
    modalCurrentScore = originalVal === null ? 5.0 : originalVal;
    
    const modal = document.getElementById('scoringModal');
    const titleEl = document.getElementById('scoringModalTitle');
    const songTitleEl = document.getElementById('scoringModalSongTitle');
    const emoteEl = document.getElementById('scoringModalJudgeEmote');
    
    if (titleEl) titleEl.innerText = `Puntuación de ${juez}`;
    
    // Buscar el título en la data de canciones
    const songData = CANCIONES_DATA.find(s => s.id == songId);
    if (songTitleEl) songTitleEl.innerText = songData ? songData.titulo : 'Canción';
    
    if (emoteEl) {
        emoteEl.src = 'emotes/EmoteAri.png';
        emoteEl.alt = 'Ari';
    }
    
    // Configurar y pintar progreso del slider
    const slider = document.getElementById('scoringModalSlider');
    if (slider) {
        slider.value = modalCurrentScore;
        const percent = (modalCurrentScore / 10) * 100;
        slider.style.background = `linear-gradient(to right, #a855f7 ${percent}%, rgba(168, 85, 247, 0.2) ${percent}%)`;
    }
    
    actualizarScoreModalDisplay();
    
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function cerrarScoringModal() {
    const modal = document.getElementById('scoringModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

function actualizarSliderModal(val) {
    modalCurrentScore = parseFloat(val);
    actualizarScoreModalDisplay();
    
    const slider = document.getElementById('scoringModalSlider');
    if (slider) {
        const percent = (modalCurrentScore / 10) * 100;
        slider.style.background = `linear-gradient(to right, #a855f7 ${percent}%, rgba(168, 85, 247, 0.2) ${percent}%)`;
    }
}

function actualizarScoreModalDisplay() {
    const scoreVal = document.getElementById('scoringModalValue');
    if (scoreVal) {
        scoreVal.innerText = modalCurrentScore.toFixed(1);
    }
}

function guardarScoreModal() {
    if (!modalActiveSongId || !modalActiveJuez) return;
    
    actualizarNotaEnVivo(modalActiveSongId, modalActiveJuez, modalCurrentScore);
    
    const avatarContainer = document.getElementById(`slot${modalActiveJuez}${modalActiveSongId}`);
    if (avatarContainer) {
        avatarContainer.classList.add('active');
    }
    
    cerrarScoringModal();
}

window.onclick = function (event) {
    let modalLetra = document.getElementById('lyricsModal');
    let modalScoring = document.getElementById('scoringModal');
    
    if (event.target == modalLetra) cerrarLetra();
    if (event.target == modalScoring) cerrarScoringModal();
}

// === ACTUALIZAR NOTAS ===
function actualizarNotaMedia(id) {
    const card = document.getElementById('cancion' + id);
    if (card) {
        const inputs = card.querySelectorAll('.score-input');
        const valAri = inputs[0] ? inputs[0].value : "";

        const hasVotedAri = valAri !== "";

        const ari = parseFloat(valAri) || 0;

        const twitchBadge = document.getElementById('twitchScore' + id);
        let twitchVal = 0;
        const hasVotedTwitch = twitchBadge && twitchBadge.classList.contains('voted');
        if (hasVotedTwitch) {
            twitchVal = parseFloat(twitchBadge.textContent.replace(/[^\d\.]/g, '')) || 0;
        }

        // Mostrar u ocultar emotes y badges
        const emoteAri = document.getElementById('emoteAri' + id);
        const badgeAri = document.getElementById('badgeAri' + id);
        if (hasVotedAri) {
            if (emoteAri) emoteAri.style.display = 'none';
            if (badgeAri) {
                badgeAri.innerText = ari.toFixed(1);
                badgeAri.style.display = 'flex';
            }
        } else {
            if (emoteAri) emoteAri.style.display = 'block';
            if (badgeAri) badgeAri.style.display = 'none';
        }

        // Calcular nota final (se muestra '-' si nadie ha votado)
        const finalBadge = card.querySelector('.final-score-badge');
        if (finalBadge) {
            if (!hasVotedAri && !hasVotedTwitch) {
                finalBadge.innerText = '-';
            } else {
                const final = ((ari * 0.75) + (twitchVal * 0.25)).toFixed(1);
                finalBadge.innerText = final;
            }
        }
    }
}




// === LÓGICA DE PUNTUACIÓN EN TIEMPO REAL (DESLIZADORES DE TARJETAS) ===
function actualizarNotaEnVivo(id, juez, valor) {
    // 1. Actualizar etiqueta visual (ej: "Ari: 8.5")
    const label = document.getElementById(`label${juez}${id}`);
    if (label) {
        label.innerText = `${juez}: ${parseFloat(valor).toFixed(1)}`;
    }

    // 2. Actualizar el input oculto para compatibilidad con el resto del script (ej: Salón de la Fama)
    const input = document.getElementById(`input${juez}${id}`);
    if (input) {
        input.value = valor;
    }

    // 3. Efecto visual de llenado en la barra del slider
    const rangeSlider = document.getElementById(`range${juez}${id}`);
    if (rangeSlider) {
        const percent = (parseFloat(valor) / 10) * 100;
        rangeSlider.style.background = `linear-gradient(to right, #a855f7 ${percent}%, rgba(168, 85, 247, 0.25) ${percent}%)`;
    }

    // 4. Recalcular nota media y actualizar badges de jueces y nota final
    actualizarNotaMedia(id);
}

function resetSlidersTarjeta(id) {
    // Los sliders han sido reemplazados por el modal de votación.
}

function togglePodiumAudio(audioId, button) {
    const audioElement = document.getElementById(audioId);
    
    const allPodiumAudios = ['audioPodiumOro', 'audioPodiumPlata', 'audioPodiumBronce'];
    allPodiumAudios.forEach(id => {
        if (id !== audioId) {
            const otherAudio = document.getElementById(id);
            if (otherAudio && !otherAudio.paused) {
                otherAudio.pause();
                const otherBtn = otherAudio.parentElement.querySelector('.btn-listen');
                if (otherBtn) {
                    otherBtn.innerHTML = '<i class="fa-solid fa-play"></i> Escuchar';
                    otherBtn.classList.remove('playing');
                }
            }
        }
    });

    if (audioElement.paused) {
        audioElement.play();
        button.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
        button.classList.add('playing');
    } else {
        audioElement.pause();
        button.innerHTML = '<i class="fa-solid fa-play"></i> Escuchar';
        button.classList.remove('playing');
    }
}

// === INTERACTIVIDAD DE TWITCH Y DESCARGAS ===

function iniciarVotacionChat(songId) {
    const song = CANCIONES_DATA.find(s => s.id === parseInt(songId));
    if (!song) return;

    // Detener cualquier temporizador anterior activo
    if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
    }
    
    // Cerrar conexión anterior de socket si existe
    cerrarTwitchSocket();
    votosUnicosChat.clear();

    // Cargar título en el overlay
    document.getElementById('voteSongTitle').innerText = song.titulo;

    // Mostrar el overlay
    const overlay = document.getElementById('voteTimerOverlay');
    overlay.style.display = 'flex';

    // Configurar interfaces 
    const feed = document.getElementById('liveVotosFeed');
    const feedList = document.getElementById('feedList');
    const currentVoterBox = document.getElementById('currentVoterBox');
    
    if (feedList) feedList.innerHTML = '';
    if (document.getElementById('liveVotosCount')) {
        document.getElementById('liveVotosCount').innerText = '0 votos';
    }
    if (feed) feed.classList.add('active');
    if (currentVoterBox) currentVoterBox.classList.remove('active');

    let timeLeft = 30;
    const countdownNumber = document.getElementById('timerCountdownNumber');
    const progressCircle = document.getElementById('timerProgressCircle');
    
    // Circunferencia del círculo de radio 50: 2 * PI * r = 314.16
    const circumference = 314.16;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = 0;

    countdownNumber.innerText = timeLeft;

    // Conectar a Twitch
    conectarTwitchChat();

    activeTimerInterval = setInterval(() => {
        timeLeft--;
        countdownNumber.innerText = timeLeft;

        // Actualizar el progreso circular del SVG
        const offset = circumference - (timeLeft / 30) * circumference;
        progressCircle.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            finalizarVotacionChat(song);
        }
    }, 1000);
}

function conectarTwitchChat() {
    try {
        twitchSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
        
        twitchSocket.onopen = () => {
            console.log("Conectado al servidor IRC de Twitch.");
            twitchSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            twitchSocket.send('PASS oauth:anonymous');
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            twitchSocket.send(`NICK justinfan${randomNum}`);
            twitchSocket.send('JOIN #imarixu');
        };

        twitchSocket.onmessage = (event) => {
            const rawMessage = event.data;
            if (rawMessage.startsWith('PING')) {
                twitchSocket.send('PONG :tmi.twitch.tv');
                return;
            }

            if (rawMessage.includes('PRIVMSG')) {
                // Parsear mensaje: @display-name=Nombre... :username!... PRIVMSG #channel :message
                const match = rawMessage.match(/^(?:@([^\s]+)\s)?(?::([^\s!]+))![^\s]+\sPRIVMSG\s#[^\s]+\s:(.+)$/m);
                if (match) {
                    const tagsStr = match[1] || '';
                    const username = match[2] || 'Anónimo';
                    const messageText = match[3] ? match[3].trim() : '';

                    // Extraer displayName de tags
                    let displayName = username;
                    if (tagsStr) {
                        const tags = {};
                        tagsStr.split(';').forEach(tag => {
                            const parts = tag.split('=');
                            if (parts.length === 2) {
                                tags[parts[0]] = parts[1];
                            }
                        });
                        if (tags['display-name']) {
                            displayName = decodeURIComponent(tags['display-name']);
                        }
                    }

                    // Validar si es un número exacto del 0 al 10 (admite coma o punto decimal)
                    const normalizedMsg = messageText.replace(',', '.');
                    if (/^(?:[0-9](?:\.[0-9]+)?|10(?:\.0+)?)$/.test(normalizedMsg)) {
                        const voteValue = parseFloat(normalizedMsg);
                        if (voteValue >= 0 && voteValue <= 10) {
                            registrarVotoChat(displayName, voteValue);
                        }
                    }
                }
            }
        };

        twitchSocket.onerror = (error) => {
            console.error("Error en WebSocket de Twitch:", error);
        };

        twitchSocket.onclose = () => {
            console.log("Conexión de Twitch cerrada.");
        };
    } catch (e) {
        console.error("Error al iniciar WebSocket:", e);
    }
}

function registrarVotoChat(user, vote) {
    if (votosUnicosChat.has(user)) {
        console.log(`Usuario ${user} ya ha votado.`);
        return;
    }

    votosUnicosChat.set(user, vote);

    // Crear ticket flotante de voto (dorado animado)
    const ticket = document.createElement('div');
    ticket.className = 'ticket-voto-flotante';
    ticket.innerText = `🎫 @${user}`;
    ticket.style.left = (20 + Math.random() * 80) + 'px';
    ticket.style.bottom = '80px';
    document.body.appendChild(ticket);
    setTimeout(() => {
        ticket.remove();
    }, 3000);

    // Actualizar el contador de votos en el feed
    const countEl = document.getElementById('liveVotosCount');
    if (countEl) {
        countEl.innerText = `${votosUnicosChat.size} votos`;
    }

    // 1. Mostrar la caja del último votante destacado (Estilo IlloJuan)
    const currentVoterBox = document.getElementById('currentVoterBox');
    const voterNameEl = document.getElementById('currentVoterName');
    const voterScoreEl = document.getElementById('currentVoterScore');

    if (currentVoterBox && voterNameEl && voterScoreEl) {
        voterNameEl.innerText = `Viewer: ${user}`;
        voterScoreEl.innerText = vote.toFixed(1).replace('.0', ''); // Mostrar entero si es exacto

        // Reiniciar animación
        currentVoterBox.classList.remove('active');
        void currentVoterBox.offsetWidth; // Reflujo CSS
        currentVoterBox.classList.add('active');

        // Ocultar tras 1.5s
        if (currentVoterTimeout) {
            clearTimeout(currentVoterTimeout);
        }
        currentVoterTimeout = setTimeout(() => {
            currentVoterBox.classList.remove('active');
        }, 1500);
    }

    // 2. Agregar al feed flotante
    const feedList = document.getElementById('feedList');
    if (feedList) {
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = `
            <span class="voter-name">${user}</span>
            <span class="voter-score">${vote.toFixed(1)}</span>
        `;
        feedList.appendChild(item);

        // Limitar a los últimos 6 elementos para no desbordar
        while (feedList.children.length > 6) {
            feedList.removeChild(feedList.firstChild);
        }

        // Auto-scroll hacia abajo
        feedList.scrollTop = feedList.scrollHeight;
    }
}

function cerrarTwitchSocket() {
    if (twitchSocket) {
        if (twitchSocket.readyState === WebSocket.OPEN || twitchSocket.readyState === WebSocket.CONNECTING) {
            twitchSocket.close();
        }
        twitchSocket = null;
    }
}

function finalizarVotacionChat(song) {
    if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
        activeTimerInterval = null;
    }
    cerrarTwitchSocket();

    // Ocultar overlays
    document.getElementById('voteTimerOverlay').style.display = 'none';
    const voterBox = document.getElementById('currentVoterBox');
    const feed = document.getElementById('liveVotosFeed');
    if (voterBox) voterBox.classList.remove('active');
    if (feed) feed.classList.remove('active');
    
    if (currentVoterTimeout) {
        clearTimeout(currentVoterTimeout);
    }

    // Calcular media de votos
    let averageScore;
    if (votosUnicosChat.size > 0) {
        let sum = 0;
        votosUnicosChat.forEach(val => sum += val);
        averageScore = (sum / votosUnicosChat.size).toFixed(1);
    } else {
        // Fallback simulado (UX en caso de canal offline)
        averageScore = (Math.random() * (9.5 - 5.0) + 5.0).toFixed(1);
        console.log(`Sin votos reales del chat. Usando fallback simulado: ${averageScore}`);
    }

    // Inyectar en el badge de Twitch
    const twitchBadge = document.getElementById('twitchScore' + song.id);
    if (twitchBadge) {
        twitchBadge.innerHTML = `<i class="fa-brands fa-twitch"></i> ${averageScore}`;
        twitchBadge.classList.add('voted');
    }

    // Recalcular la nota media final (badge azul)
    actualizarNotaMedia(song.id);

    alert(`Votación del chat de Twitch finalizada para "${song.titulo}".\nTotal de votos únicos: ${votosUnicosChat.size}\nNota media: ${averageScore}`);
}

function cancelarVotacionChat() {
    if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
        activeTimerInterval = null;
    }
    cerrarTwitchSocket();

    document.getElementById('voteTimerOverlay').style.display = 'none';
    const voterBox = document.getElementById('currentVoterBox');
    const feed = document.getElementById('liveVotosFeed');
    if (voterBox) voterBox.classList.remove('active');
    if (feed) feed.classList.remove('active');

    if (currentVoterTimeout) {
        clearTimeout(currentVoterTimeout);
    }
}

// === LOGICA DE LA RULETA DE FASE FINAL ===

let ruletaGanadores = [];
let ruletaDisponibles = [];
let ruletaSpinsCount = 0;
let ruletaCurrentRotation = 0;

document.addEventListener('DOMContentLoaded', () => {
    const btnComenzar = document.getElementById('btnComenzarRuleta');
    const btnGirar = document.getElementById('btnGirarRuleta');
    
    if (btnComenzar) {
        btnComenzar.addEventListener('click', function() {
            // 1. Obtener ganadores de los 6 combates
            ruletaGanadores = obtenerGanadoresFaseFinal();
            ruletaDisponibles = [...ruletaGanadores];
            ruletaSpinsCount = 0;
            ruletaCurrentRotation = 0;
            
            // Resetear podio visualmente
            resetearPodioVisual();
            
            // Dibujar la ruleta con los ganadores actuales
            dibujarRuleta(ruletaGanadores);
            
            // Habilitar botón girar
            if (btnGirar) {
                btnGirar.disabled = false;
                btnGirar.innerText = "GIRAR";
            }

            // Ocultar botón de comenzar y mostrar el contenedor con fade-in
            this.style.display = 'none';
            const contenedor = document.getElementById('contenedorRuleta');
            if (contenedor) {
                contenedor.style.display = 'flex';
                // Forzar reflujo y añadir clase 'show' para disparar la animación fade-in
                void contenedor.offsetWidth;
                contenedor.classList.add('show');
            }
        });
    }

    if (btnGirar) {
        btnGirar.addEventListener('click', function() {
            if (ruletaDisponibles.length === 0 || ruletaSpinsCount >= 3) return;
            
            const btn = this;
            btn.disabled = true; // Deshabilitar durante el giro
            
            // 1. Elegir ganador al azar entre los disponibles
            const randomIndex = Math.floor(Math.random() * ruletaDisponibles.length);
            const winnerSong = ruletaDisponibles[randomIndex];
            
            // 2. Encontrar el índice original en los 6 ganadores
            const originalIdx = ruletaGanadores.findIndex(s => s.id === winnerSong.id);
            if (originalIdx === -1) {
                btn.disabled = false;
                return;
            }
            
            // 3. Calcular rotación de destino
            const targetAngle = (240 - originalIdx * 60 + 360) % 360;
            const currentRotationNormalized = ruletaCurrentRotation % 360;
            let angleDiff = targetAngle - currentRotationNormalized;
            if (angleDiff <= 0) {
                angleDiff += 360;
            }
            
            const extraSpins = 5; // 5 giros completos para la emoción
            const totalNewRotation = ruletaCurrentRotation + angleDiff + (extraSpins * 360);
            ruletaCurrentRotation = totalNewRotation;
            
            // 4. Sonar redoble de tambores
            const sonidoTambores = document.getElementById('sonidoTambores');
            if (sonidoTambores) {
                sonidoTambores.currentTime = 0;
                sonidoTambores.play().catch(e => console.log("Tambores audio play blocked/missing", e));
            }
            
            // 5. Aplicar la rotación al canvas
            const canvas = document.getElementById('canvasRuleta');
            if (canvas) {
                canvas.style.transform = `rotate(${totalNewRotation}deg)`;
            }
            
            // 6. Esperar a que termine la animación (4 segundos)
            setTimeout(() => {
                // Play sonidoRevelar
                const sonidoRevelar = document.getElementById('sonidoRevelar');
                if (sonidoRevelar) {
                    sonidoRevelar.currentTime = 0;
                    sonidoRevelar.play().catch(e => console.log("Revelar audio play blocked/missing", e));
                }
                
                // Incrementar contador de tiradas
                ruletaSpinsCount++;
                
                // Eliminar de los disponibles
                ruletaDisponibles.splice(randomIndex, 1);
                
                // Colocar en el podio correspondiente
                let slotId = '';
                if (ruletaSpinsCount === 1) {
                    slotId = 'Bronce'; // 3º puesto
                } else if (ruletaSpinsCount === 2) {
                    slotId = 'Plata'; // 2º puesto
                } else if (ruletaSpinsCount === 3) {
                    slotId = 'Oro'; // 1º puesto (Campeón)
                }
                
                const podioBlock = document.getElementById('podio' + slotId);
                if (podioBlock) {
                    podioBlock.classList.add('active');
                    podioBlock.querySelector('.podio-winner-name').innerText = winnerSong.autor;
                    podioBlock.querySelector('.podio-winner-song').innerText = winnerSong.titulo;
                    
                    if (slotId === 'Oro') {
                        // Animación especial de celebración
                        podioBlock.classList.add('celebration-glow');
                    }
                }
                
                // Habilitar botón para el siguiente giro si no se ha terminado
                if (ruletaSpinsCount < 3) {
                    btn.disabled = false;
                } else {
                    btn.innerText = "FINALIZADO";
                    btn.disabled = true;
                }
            }, 4000);
        });
    }
});

function resetearPodioVisual() {
    const slots = ['Plata', 'Oro', 'Bronce'];
    slots.forEach(slot => {
        const block = document.getElementById('podio' + slot);
        if (block) {
            block.classList.remove('active', 'celebration-glow');
            block.querySelector('.podio-winner-name').innerText = '-';
            block.querySelector('.podio-winner-song').innerText = '-';
        }
    });
}

function obtenerNotaFinalCancion(song) {
    if (!song) return 0;
    // Leer valor del input de Ari
    const inputAri = document.getElementById('inputAri' + song.id);
    const valAri = inputAri ? inputAri.value : "";
    const ari = valAri !== "" ? parseFloat(valAri) : 0;
    
    // Leer valor del badge de Twitch
    const twitchBadge = document.getElementById('twitchScore' + song.id);
    let twitchVal = 0;
    if (twitchBadge && twitchBadge.classList.contains('voted')) {
        twitchVal = parseFloat(twitchBadge.textContent.replace(/[^\d\.]/g, '')) || 0;
    }
    
    // Si Ari y Twitch no han votado, la nota es 0
    if (valAri === "" && (!twitchBadge || !twitchBadge.classList.contains('voted'))) {
        return 0;
    }
    
    return parseFloat(((ari * 0.75) + (twitchVal * 0.25)).toFixed(1));
}

function obtenerGanadoresFaseFinal() {
    const activeSongs = CANCIONES_DATA.filter(song => song.activo !== false);
    const ganadores = [];
    for (let c = 1; c <= 6; c++) {
        const songA = activeSongs[(c - 1) * 2];
        const songB = activeSongs[(c - 1) * 2 + 1];
        
        if (!songA) continue;
        if (!songB) {
            ganadores.push(songA);
            continue;
        }
        
        const scoreA = obtenerNotaFinalCancion(songA);
        const scoreB = obtenerNotaFinalCancion(songB);
        
        if (scoreA >= scoreB) {
            ganadores.push(songA);
        } else {
            ganadores.push(songB);
        }
    }
    return ganadores;
}

function dibujarRuleta(ganadores) {
    const canvas = document.getElementById('canvasRuleta');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const r = cx - 10;

    ctx.clearRect(0, 0, cw, ch);

    const numSlices = 6;
    const arcAngle = (2 * Math.PI) / numSlices;

    for (let i = 0; i < numSlices; i++) {
        const angle = i * arcAngle;
        
        // Color alterno: negro y azul eléctrico
        ctx.fillStyle = (i % 2 === 0) ? '#121212' : '#00bfff';
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + arcAngle);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Escribir texto
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + arcAngle / 2);
        
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = (i % 2 === 0) ? '#ffffff' : '#121212';
        ctx.font = 'italic bold 14px "Montserrat", sans-serif';
        
        const artista = (ganadores[i] && ganadores[i].autor) ? ganadores[i].autor : `Ganador ${i+1}`;
        const textoMostrar = artista.length > 15 ? artista.substring(0, 13) + '..' : artista;
        ctx.fillText(textoMostrar, r - 30, 0);
        ctx.restore();
    }
    
    // Círculo central decorativo
    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.strokeStyle = '#00bfff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.shadowBlur = 0;
}


