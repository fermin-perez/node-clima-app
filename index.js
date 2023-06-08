import {
  inquirerMenu,
  leerInput,
  listarLugares,
  pausa,
} from './helpers/inquirer.js';
import Busquedas from './models/busquedas.js';

const main = async () => {
  let opt;
  const busquedas = new Busquedas();

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostar Mensaje
        const lugar = await leerInput('Ciudad: ');

        //Buscar los lugares
        const lugares = await busquedas.ciudad(lugar);

        //Seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === '0') continue;
        const lugarSel = lugares.find((lugar) => lugar.id === id);

        //Guardar en DB
        busquedas.agregarHistorial(lugarSel.nombre);

        //Clima
        const { desc, temp, min, max } = await busquedas.climaLugar(
          lugarSel.lat,
          lugarSel.lng
        );

        //Mostrar Resultados
        console.clear();
        console.log('\nInformación de la ciudad\n'.green);
        console.log('Ciudad:', lugarSel.nombre.green);
        console.log('Lat:', lugarSel.lat);
        console.log('Lng:', lugarSel.lng);
        console.log('Temperatura:', temp);
        console.log('Mínima:', min);
        console.log('Máxima:', max);
        console.log('Como esta el clima:', desc.green);
        break;

      case 2:
        busquedas.HistorialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
