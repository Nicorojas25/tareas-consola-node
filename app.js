require("colors");

const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} = require("./helpers/inquirer");
const Tareas = require("./models/tareas");
//const { mostrarMenu, pausa } = require("./helpers/mensajes");

console.clear();

const main = async () => {
  let opt = "";
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    // Cargar tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    // Impresión del menú
    opt = await inquirerMenu();
    //console.log({ opt });

    switch (opt) {
      case "1": // Crear tarea
        const desc = await leerInput("Descripción: ");
        tareas.crearTarea(desc);
        break;

      case "2": // Listar tareas
        tareas.listadoCompleto();
        //console.log(tareas.listadoArr);
        break;

      case "3": // Listar tareas completadas
        tareas.listarPendientesCompletadas();
        break;

      case "4": // Listar tareas pendientes
        tareas.listarPendientesCompletadas(false);
        break;

      case "5": // Completado | pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toogleCompletadas(ids);
        break;

      case "6":
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          const ok = await confirmar("¿Estás seguro?");
          //console.log({ id });
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada");
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== "0");
};

main();
