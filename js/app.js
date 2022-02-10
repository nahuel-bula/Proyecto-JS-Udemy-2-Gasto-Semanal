//Variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}
//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto) => total + Number(gasto.cantidad),0);
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto,restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
        this.comprobarPresupuesto(cantidad);
    }
    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');
        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divMensaje,formulario);
        setTimeout(()=>{
            divMensaje.remove();
        },2000)
    }
    mostrarGastos(gastos){
        this.limpiarHtml(gastoListado);
        gastos.forEach(gasto=>{
            const {cantidad, nombre, id} = gasto;
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            nuevoGasto.innerHTML = `
            ${nombre}<span class="badge badge-primary badge-pill">$${cantidad}</span>
            `;
            const btnBorrar = document.createElement('button');
            btnBorrar.className = 'btn btn-danger borrar-gasto';
            btnBorrar.innerHTML=`Borrar &times;`
            btnBorrar.onclick=()=>{
                eliminarGasto(id);
            };
            nuevoGasto.appendChild(btnBorrar);
            gastoListado.appendChild(nuevoGasto);
        })
    }
    comprobarPresupuesto(presupuestoObj){
        const{presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        if ((presupuesto/4)>restante){
            restanteDiv.className = 'restante alert alert-danger'
        }else if((presupuesto/2)>restante){
            restanteDiv.className = 'restante alert alert-warning'
        }else {
            restanteDiv.className = 'restante alert alert-success'
        }

        if (restante<0){
            this.imprimirAlerta('Te has quedado sin presupuesto', 'error');
            formulario.querySelector('button[type="submit"]').disabled=true;
        }
    }
    limpiarHtml(dondeBorro){
        while (dondeBorro.firstChild){
            dondeBorro.removeChild(dondeBorro.firstChild)
        }
    }
}
const ui = new UI();
let presupuesto;
//Funciones
function preguntarPresupuesto(){
    const preguntarPresupuesto = prompt('Cual es tu presupuesto?');
    if (preguntarPresupuesto === null || preguntarPresupuesto === '' || isNaN(preguntarPresupuesto) || preguntarPresupuesto<=0){
        window.location.reload();
        return;
    }
    presupuesto = new Presupuesto(preguntarPresupuesto);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = document.querySelector('#cantidad').value;
    if (nombre === '' || cantidad === '' ){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }else{
        if(isNaN(cantidad) || cantidad<=0){
            ui.imprimirAlerta('Ingrese una cantidad valida', 'error');
            return;
        }
    }
    const gasto = {nombre, cantidad, id: Date.now()}
    presupuesto.nuevoGasto(gasto);
    const {gastos} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.insertarPresupuesto(presupuesto);
    //ui.comprobarPresupuesto(presupuesto);
    ui.imprimirAlerta('Gasto ingresado correctamente');
    formulario.reset();
}


function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.insertarPresupuesto(presupuesto);
}