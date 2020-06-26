// IMPORTS
const path = require('path');
const Utils = require('./testutils');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_TEST = 2 * 60; // Time between tests (seconds)
const browser = new Browser({waitDuration: 100, silent: true});
const path_assignment = path.resolve(path.join(__dirname, "../index.html"));
const URL = "file://" + path_assignment.replace("%", "%25");

function assign(){
    try {
      browser.evaluate(`
        (function assign(){ 
          try { window.cuadrado = cuadrado; } catch (e){}
          try { window.mod= mod; } catch (e){}
          try { window.fact = fact; } catch (e){}
          try { window.add = add; } catch (e){}
          try { window.mul = mul; } catch (e){}
          try { window.eq = eq; } catch (e){}
          try { window.sumatorio = sumatorio;} catch (e){}
          try { window.ordenar = ordenar;} catch (e){}
          try { window.revertir = revertir;} catch (e){}
          try { window.quitar = quitar;} catch (e){}
        })()`);
    } catch(e) {
      console.log("ERROR evaluando funciones creadas en el browser de ZombieJS", e);
    }
 }

//TESTS
describe("TEST SUITE DE LA Calculadora DE CORE", function () {
  describe('COMPROBACIONES PREVIAS', function() {
    this.timeout(T_TEST * 1000);

    it('(Precheck): Comprobando que existe el fichero de la entrega...', async function () {
        this.score = 0;
        this.msg_ok = `Encontrado el fichero '${path_assignment}'`;
        this.msg_err = `No se encontró el fichero '${path_assignment}'`;
        const fileexists = await Utils.checkFileExists(path_assignment);
        if (!fileexists) {
            error_critical = this.msg_err;
        }
        fileexists.should.be.equal(true);
    });

    it('(Precheck): Comprobando que el fichero contiene HTML válido...', async function () {
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;

        } else {
            this.msg_ok = `El fichero '${path_assignment}' se ha parseado correctamente`;
            this.msg_err = `Error al parsear '${path_assignment}'`;
            [error_nav, resp] = await Utils.to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Error al parsear '${path_assignment}': ${error_nav}`;
                error_critical = this.msg_err;
            }
        }
        should.not.exist(error_critical);
    });
  });

  describe('1. CAMPO INFORMATIVO', function() {
    before(async function() {
      if (error_critical) {
          this.msg_err = error_critical;
          should.not.exist(error_critical);
      } else {
          [error_nav, resp] = await Utils.to(browser.visit(URL));
          if (error_nav) {
              this.msg_err = `Error al abrir el fichero ${path_assignment}
              Error: ${error_nav}
              Recibido: ${browser.text('body')}`;
          }
          assign();
        }
      });
    it('Comprobando la funcionalidad "Campo informativo"...', async function () {
        this.score = 1;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra campo informativo, un <h2> con id 'info', clase 'grande' el title solicitado";
        browser.assert.element('h2#info.grande[title="Info sobre el número"]');

        this.msg_err = "El campo info no funciona correctamente para un resultado menor que 100";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 2));
        [error_nav, resp] = await Utils.to(browser.click('#cuadrado'));
        browser.assert.text("h2#info", "Info: El resultado es menor que 100");

        this.msg_err = "El campo info no funciona correctamente para un resultado entre 100 y 200";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 12));
        [error_nav, resp] = await Utils.to(browser.click('#cuadrado'));
        browser.assert.text("h2#info", "Info: El resultado está entre 100 y 200");

        this.msg_err = "El campo info no funciona correctamente para un resultado superior a 200";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 20));
        [error_nav, resp] = await Utils.to(browser.click('#cuadrado'));
        browser.assert.text("h2#info", "Info: El resultado es superior a 200");

    });
  });

  describe('2. OPERACIONES UNITARIAS', function() {
    before(async function() {
      if (error_critical) {
          this.msg_err = error_critical;
          should.not.exist(error_critical);
      } else {
          [error_nav, resp] = await Utils.to(browser.visit(URL));
          if (error_nav) {
              this.msg_err = `Error al abrir el fichero ${path_assignment}
              Error: ${error_nav}
              Recibido: ${browser.text('body')}`;
          }
          assign();
        }
      });
    it('a: Comprobando la funcionalidad "modulo"...', async function () {
        this.score = 0.5;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'modulo'";
        browser.assert.element('button#modulo');
        this.msg_err = "El botón módulo no funciona correctamente";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 2));
        [error_nav, resp] = await Utils.to(browser.click('#modulo'));
        browser.assert.input("#pantalla", 2);
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', -2));
        [error_nav, resp] = await Utils.to(browser.click('#modulo'));
        browser.assert.input("#pantalla", 2);

    });

    it('b: Comprobando la funcionalidad "factorial"...', async function () {
        this.score = 0.5;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'factorial'";
        browser.assert.element('button#factorial');
        this.msg_err = "El botón factorial no funciona correctamente";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 6));
        [error_nav, resp] = await Utils.to(browser.click('#factorial'));
        browser.assert.input("#pantalla", 720);
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 10));
        [error_nav, resp] = await Utils.to(browser.click('#factorial'));
        browser.assert.input("#pantalla", 3628800);

    });
  });

  describe('3. OPERACIONES BINARIAS', function() {
    before(async function() {
      if (error_critical) {
          this.msg_err = error_critical;
          should.not.exist(error_critical);
      } else {
          [error_nav, resp] = await Utils.to(browser.visit(URL));
          if (error_nav) {
              this.msg_err = `Error al abrir el fichero ${path_assignment}
              Error: ${error_nav}
              Recibido: ${browser.text('body')}`;
          }
          assign();
        }
      });
    it('a: Comprobando la funcionalidad "multiplicacion"...', async function () {
        this.score = 1.5;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'multiplicacion'";
        browser.assert.element('button#multiplicacion');
        this.msg_err = "No se encuentra el botón con id 'igual'";
        browser.assert.element('button#igual');
        this.msg_err = "La funcionalidad de multiplicacion no funciona correctamente";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 2));
        [error_nav, resp] = await Utils.to(browser.click('#multiplicacion'));
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 4));
        [error_nav, resp] = await Utils.to(browser.click('#igual'));
        browser.assert.input("#pantalla", 8);

    });

    it('b: Comprobando la funcionalidad "suma"...', async function () {
        this.score = 1.5;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'suma'";
        browser.assert.element('button#suma');
        this.msg_err = "No se encuentra el botón con id 'igual'";
        browser.assert.element('button#igual');
        this.msg_err = "La funcionalidad de suma no funciona correctamente";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 2));
        [error_nav, resp] = await Utils.to(browser.click('#suma'));
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 4));
        [error_nav, resp] = await Utils.to(browser.click('#igual'));
        browser.assert.input("#pantalla", 6);

    });
});

  describe('4. OPERACIONES EN FORMATO CSV (COMMA SEPARATED VALUES)', function() {
    before(async function() {
      if (error_critical) {
          this.msg_err = error_critical;
          should.not.exist(error_critical);
      } else {
          [error_nav, resp] = await Utils.to(browser.visit(URL));
          if (error_nav) {
              this.msg_err = `Error al abrir el fichero ${path_assignment}
              Error: ${error_nav}
              Recibido: ${browser.text('body')}`;
          }
          assign();
        }
      });
    it('a: Comprobando la funcionalidad "sumatorio"...', async function () {
        this.score = 1;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'sumatorio'";
        browser.assert.element('button#sumatorio');
        this.msg_err = "La funcionalidad de sumatorio no funciona correctamente";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "5,7,9,2"));
        [error_nav, resp] = await Utils.to(browser.click('#sumatorio'));
        browser.assert.input("#pantalla", 23);

      });

      it('b: Comprobando la funcionalidad "ordenar"...', async function () {
            this.score = 0.5;
            this.msg_ok = `Funcionalidad comprobada correctamente`;

            this.msg_err = "No se encuentra el botón con id 'ordenar'";
            browser.assert.element('button#ordenar');
            this.msg_err = "La funcionalidad de ordenar no funciona correctamente";
            [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "5,7,9,2"));
            [error_nav, resp] = await Utils.to(browser.click('#ordenar'));
            browser.assert.input("#pantalla", "2,5,7,9");

          });

        it('c: Comprobando la funcionalidad "revertir"...', async function () {
            this.score = 0.5;
            this.msg_ok = `Funcionalidad comprobada correctamente`;

            this.msg_err = "No se encuentra el botón con id 'revertir'";
            browser.assert.element('button#revertir');
            this.msg_err = "La funcionalidad de revertir no funciona correctamente";
            [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "5,7,9,2"));
            [error_nav, resp] = await Utils.to(browser.click('#revertir'));
            browser.assert.input("#pantalla", "2,9,7,5");
          });

          it('d: Comprobando la funcionalidad "quitar"...', async function () {
              this.score = 1;
              this.msg_ok = `Funcionalidad comprobada correctamente`;

              this.msg_err = "No se encuentra el botón con id 'quitar'";
              browser.assert.element('button#quitar');
              this.msg_err = "La funcionalidad de quitar no funciona correctamente";
              [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "5,7,9,2"));
              [error_nav, resp] = await Utils.to(browser.click('#quitar'));
              browser.assert.input("#pantalla", "5,7,9");
            });
    });

  describe('5. TRATAMIENTO DE ERRORES', function() {
    before(async function() {
      if (error_critical) {
          this.msg_err = error_critical;
          should.not.exist(error_critical);
      } else {
          [error_nav, resp] = await Utils.to(browser.visit(URL));
          if (error_nav) {
              this.msg_err = `Error al abrir el fichero ${path_assignment}
              Error: ${error_nav}
              Recibido: ${browser.text('body')}`;
          }
          assign();
        }
      });
    it('Comprobando tratamiento de errores con el cuadrado', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el operador cuadrado.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#cuadrado'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con el módulo', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el módulo.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#modulo'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con el factorial', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el factorial.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#factorial'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con la multiplicacion', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar la multiplicación.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#multiplicacion'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con el igual', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el igual.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', 2));
        [error_nav, resp] = await Utils.to(browser.click('#multiplicacion'));
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#igual'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con la suma', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar la suma.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#suma'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con el sumatorio', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'sumatorio'";
        browser.assert.element('button#sumatorio');
        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el sumatorio.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#sumatorio'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con el ordenar', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'ordenar'";
        browser.assert.element('button#ordenar');
        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el ordenar.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#ordenar'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con el revertir', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'revertir'";
        browser.assert.element('button#revertir');
        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el revertir.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#revertir'));
        browser.assert.input("#pantalla", "Error");
    });

    it('Comprobando tratamiento de errores con el quitar', async function () {
        this.score = 0.2;
        this.msg_ok = `Funcionalidad comprobada correctamente`;

        this.msg_err = "No se encuentra el botón con id 'quitar'";
        browser.assert.element('button#quitar');
        this.msg_err = "La funcionalidad de tratamiento de errores no funciona correctamente al usar el quitar.";
        [error_nav, resp] = await Utils.to(browser.fill('#pantalla', "hola"));
        [error_nav, resp] = await Utils.to(browser.click('#quitar'));
        browser.assert.input("#pantalla", "Error");
    });
  });


    after(async function() {
        try {
            await browser.tabs.closeAll();
        } catch(e) {}
    });
});
