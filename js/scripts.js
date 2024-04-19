document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp() {
    navegacionFija();
    scrollNav();
    const galeria = document.querySelector('.galeria-imagenes');
    if (galeria !== null) {
        crearGaleria();
    }
}

function navegacionFija() {
    const barra = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');
    const body = document.querySelector('body');

    if (sobreFestival) {
        window.addEventListener('scroll', function() {
            if (sobreFestival.getBoundingClientRect().top < 0) {
                barra.classList.add('fijo');
                body.classList.add('body-scroll');
            } else {
                barra.classList.remove('fijo');
                body.classList.remove('body-scroll');
            }
        });
    }
}

function scrollNav() {
    const enlaces = document.querySelectorAll('.navegacion-principal a');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const seccionScroll = e.target.attributes.href.value;
            const seccion = document.querySelector(seccionScroll);
            seccion.scrollIntoView({ behavior: "smooth"});
        })
    });
}

function crearGaleria() {
    const galeria = document.querySelector('.galeria-imagenes');

    for(let i = 1; i <= 12; i++) {
        const imagen = document.createElement('picture');
        imagen.innerHTML = `
            <source srcset="../img/thumb/${i}.avif" type="image/avif">
            <source srcset="../img/thumb/${i}.webp" type="image/webp" alt="imagen galería">
            <img loading="lazy" width="200" height="300" src="../img/thumb/${i}.jpg" alt="imagen galería">
        `;
        imagen.onclick = function() {
            mostrarImagen(i);
        }
    
        galeria.appendChild(imagen);
    }
}

function mostrarImagen(id) {
    const imagen = document.createElement('picture');
    imagen.innerHTML = `
        <source srcset="../img/grande/${id}.avif" type="image/avif">
        <source srcset="../img/grande/${id}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="../img/grande/${id}.jpg" alt="imagen galería">
    `;
    
    const overlay = document.createElement('DIV');
    overlay.appendChild(imagen);
    overlay.classList.add('overlay');
    overlay.onclick = function() {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }

    const cerrarModal = document.createElement('P');
    cerrarModal.textContent = 'X';
    cerrarModal.classList.add('btn-cerrar');
    cerrarModal.onclick = function() {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }
    overlay.appendChild(cerrarModal);

    const body = document.querySelector('body');
    body.appendChild(overlay);
    body.classList.add('fijar-body');
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('../js/lineup.json');
        const data = await response.json();
        renderLineup(data.lineup);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
});

function renderLineup(lineup) {
    const lineupSection = document.getElementById('lineup');
    lineup.forEach(dia => {
        const diaElement = document.createElement('p');
        diaElement.textContent = dia.dia;
        lineupSection.appendChild(diaElement);

        const escenariosContenedor = document.createElement('div');
        escenariosContenedor.classList.add('escenarios-contenedor', 'contenedor');
        dia.escenarios.forEach(escenario => {
            const escenarioElement = document.createElement('div');
            escenarioElement.classList.add('escenario', escenario.nombre.toLowerCase().replace(/\s+/g, '-'));
            escenarioElement.classList.add(dia.bgClass); // Añadir la clase de fondo según el día

            const nombreEscenario = document.createElement('p');
            nombreEscenario.classList.add('nombre-escenario');
            nombreEscenario.textContent = escenario.nombre;
            escenarioElement.appendChild(nombreEscenario);

            const ulCalendario = document.createElement('ul');
            ulCalendario.classList.add('calendario');
            escenario.artistas.forEach(artista => {
                const liArtista = document.createElement('li');
                liArtista.textContent = `${artista.hora} | `;
                const spanArtista = document.createElement('span');
                spanArtista.textContent = artista.nombre;
                liArtista.appendChild(spanArtista);
                ulCalendario.appendChild(liArtista);
            });

            escenarioElement.appendChild(ulCalendario);
            escenariosContenedor.appendChild(escenarioElement);
        });

        lineupSection.appendChild(escenariosContenedor);
    });
}




// Aquí está el código para el formulario de compra
document.addEventListener('DOMContentLoaded', function(){
    const botonComprar = document.getElementById('boton-comprar');

    botonComprar.addEventListener('click', function() {
        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const pase = document.getElementById('pase').value;
        const cantidad = document.getElementById('cantidad').value;

        if (nombre.trim() === '' || !email.includes('@') || pase === '' || cantidad.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Los datos no están completos',
                text: 'Por favor, complete todos los campos correctamente.',
            });
        } else {
            // Crear objeto con los datos del formulario
            const compra = {
                nombre: nombre,
                email: email,
                tipoPase: pase,
                cantidad: cantidad
            };

            // Mostrar el resumen del carrito
            mostrarResumenCarrito(compra);

            console.log('Formulario válido. Continuar con la lógica de la aplicación...');
        }
    });

    function mostrarResumenCarrito(compra) {
        // Ocultar formulario
        const formularioCompra = document.getElementById('formulario-compra');
        formularioCompra.style.display = 'none';
    
        // Mostrar resumen del carrito
        const resumenCarrito = document.getElementById('resumen-carrito');
        resumenCarrito.innerHTML = `
            <h3>Resumen del Carrito</h3>
            <p>Tipo de Pase: ${compra.tipoPase}</p>
            <p>Cantidad de Entradas: ${compra.cantidad}</p>
            <p>Precio Total: $${calcularMontoTotal(compra.tipoPase, compra.cantidad)}</p>
            <p>Nombre: ${compra.nombre}</p>
            <p>Email: ${compra.email}</p>
            <div class="botones-carrito">
                <button id="botonVolver">Volver</button>
                <button id="botonContinuar">Comprar</button>
            </div>
        `;
    
        // Controladores de eventos para los botones
        const botonVolver = document.getElementById('botonVolver');
        botonVolver.addEventListener('click', function() {
            Swal.fire({
                title: '¿Deseas continuar con la compra más tarde?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar el carrito',
                cancelButtonText: 'Descartar',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Guardar los datos en localStorage
                    localStorage.setItem('compra', JSON.stringify(compra));
                    // Redirigir al index
                    window.location.href = 'index.html'; // Cambia 'index.html' por la URL correcta de tu página de inicio
                } else {
                    // Borrar datos guardados en localStorage
                    localStorage.removeItem('compra');
                    // Redirigir al formulario en blanco
                    location.reload();
                }
            });
        });
    
        const botonContinuar = document.getElementById('botonContinuar');
        botonContinuar.addEventListener('click', function() {
            // Aquí debes mostrar la ventana modal con el mensaje de felicitaciones
            Swal.fire({
                title: `Felicitaciones ${compra.nombre}, ya adquiriste tus entradas!`,
                icon: 'success',
            }).then((result) => {
                // Agregar mensaje adicional
                const mensajeAdicional = document.createElement('p');
                mensajeAdicional.textContent = `¡Ya compraste tus entradas! Hemos enviado la información de facturación a ${compra.email}`;
                resumenCarrito.appendChild(mensajeAdicional);
    
                botonVolver.style.display = 'none';
                botonContinuar.style.display = 'none';
            });
        });
    }
    

    function calcularMontoTotal(tipoPase, cantidad) {
        let precioPase = 0;
        if (tipoPase === 'Viernes 15' || tipoPase === 'Sábado 16') {
            precioPase = 80000;
        } else if (tipoPase === '2 Días') {
            precioPase = 150000;
        }
        return precioPase * cantidad;
    }

    // Verificar si hay datos guardados en localStorage al cargar la página
    const compraGuardada = localStorage.getItem('compra');
    if (compraGuardada) {
        // Mostrar el resumen del carrito con los datos guardados
        mostrarResumenCarrito(JSON.parse(compraGuardada));
    }
});
