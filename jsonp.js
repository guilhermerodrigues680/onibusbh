let jsonpID = Math.floor(Math.random() * 100) + 1;

// https://blog.logrocket.com/jsonp-demystified-what-it-is-and-why-it-exists/
function jsonp(url, timeout = 7500) {
  const head = document.querySelector('head');
  jsonpID += 1;

  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    const callbackName = `jsonpCallback${jsonpID}`;

    script.src = encodeURI(`${url}?callback=${callbackName}`);
    script.async = true;

    const timeoutId = window.setTimeout(() => {
      cleanUp();

      return reject(new Error('Timeout'));
    }, timeout);

    window[callbackName] = data => {
      cleanUp();

      return resolve(data);
    };

    script.addEventListener('error', error => {
      cleanUp();

      return reject(error);
    });

    function cleanUp() {
      window[callbackName] = undefined;
      head.removeChild(script);
      window.clearTimeout(timeoutId);
      script = null;
    }


    head.appendChild(script);
  });
}

function jsonpbh(url, timeout = 7500) {
  const head = document.querySelector('head');
  jsonpID += 1;

  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    const callbackName = `jsonpCallback${jsonpID}`;

    script.src = encodeURI(`${url}/${callbackName}`);
    script.async = true;

    const timeoutId = window.setTimeout(() => {
      cleanUp();

      return reject(new Error('Timeout'));
    }, timeout);

    window[callbackName] = data => {
      cleanUp();

      return resolve(data);
    };

    script.addEventListener('error', error => {
      cleanUp();

      return reject(error);
    });

    function cleanUp() {
      window[callbackName] = undefined;
      head.removeChild(script);
      window.clearTimeout(timeoutId);
      script = null;
    }

    head.appendChild(script);
  });
}

// // Using YQL and JSONP
// $.ajax({
// url: "http://mobile-l.sistbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarLinhas/retornoJSONListaLinhas",

// // The name of the callback parameter, as specified by the YQL service
// jsonp: "",

// // Tell jQuery we're expecting JSONP
// dataType: "jsonp",

// // Tell YQL what we want and that we want JSON
// data: {},

// // Work with the response
// success: function( response ) {
// console.log( response ); // server response
// },
// error: function(a,b,c) {
// console.log(a,b,c)
// }
// });

export { jsonpbh }
