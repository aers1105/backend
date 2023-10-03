const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = async (files, extensionesValidas = ['png', 'jpeg', 'jpg'], carpeta = '') => {

    return new Promise((resolve, reject) => {


        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');

        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject('extension no valida.');
        }

        const nombreFinal = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreFinal);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject((err));
            }

            resolve(nombreFinal);
        });

    })

}



module.exports = {
    subirArchivo
}