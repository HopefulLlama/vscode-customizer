// edit these options!
const options = {
  config: {
    javascript: {
      callback: (div) => {
        console.log(`Got div ${div.id}`);
        const ROWS = 200;
        const COLS = 300;
        var NUM_PARTICLES = ROWS * COLS,
        THICKNESS = Math.pow( 80, 2 ),
        SPACING = 3,
        MARGIN = 0,
        COLOR = 220,
        DRAG = 0.95,
        EASE = 0.25,

        /*

        used for sine approximation, but Math.sin in Chrome is still fast enough :)http://jsperf.com/math-sin-vs-sine-approximation

        B = 4 / Math.PI,
        C = -4 / Math.pow( Math.PI, 2 ),
        P = 0.225,

        */

        container,
        particle,
        canvas,
        mouse,
        stats,
        list,
        ctx,
        tog,
        man,
        dx, dy,
        mx, my,
        d, t, f,
        a, b,
        i, n,
        w, h,
        p, s,
        r, c
        ;

        particle = {
        vx: 0,
        vy: 0,
        x: 0,
        y: 0
        };

        function init() {

        container = div;
        canvas = document.createElement( 'canvas' );
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        ctx = canvas.getContext( '2d' );
        man = false;
        tog = true;

        list = [];

        w = canvas.width = COLS * SPACING + MARGIN * 2;
        h = canvas.height = ROWS * SPACING + MARGIN * 2;

        for ( i = 0; i < NUM_PARTICLES; i++ ) {

        p = Object.create( particle );
        p.x = p.ox = MARGIN + SPACING * ( i % COLS );
        p.y = p.oy = MARGIN + SPACING * Math.floor( i / COLS );

        list[i] = p;
        }

        container.addEventListener( 'mousemove', function(e) {

        bounds = container.getBoundingClientRect();
        mx = e.clientX - bounds.left;
        my = e.clientY - bounds.top;
        man = true;

        });

        if ( typeof Stats === 'function' ) {
        document.body.appendChild( ( stats = new Stats() ).domElement );
        }

        container.appendChild( canvas );
        }

        function step() {

        if ( stats ) stats.begin();

        if ( tog = !tog ) {

        if ( !man ) {

          t = +new Date() * 0.001;
          mx = w * 0.5 + ( Math.cos( t * 2.1 ) * Math.cos( t * 0.9 ) * w * 0.45 );
          my = h * 0.5 + ( Math.sin( t * 3.2 ) * Math.tan( Math.sin( t * 0.8 ) ) * h * 0.45 );
        }

        for ( i = 0; i < NUM_PARTICLES; i++ ) {
          p = list[i];
          d = ( dx = mx - p.x ) * dx + ( dy = my - p.y ) * dy;
          f = -THICKNESS / d;

          if ( d < THICKNESS ) {
            t = Math.atan2( dy, dx );
            p.vx += f * Math.cos(t);
            p.vy += f * Math.sin(t);
          }

          p.x += ( p.vx *= DRAG ) + (p.ox - p.x) * EASE;
          p.y += ( p.vy *= DRAG ) + (p.oy - p.y) * EASE;

        }

        } else {

        b = ( a = ctx.createImageData( w, h ) ).data;

        for ( i = 0; i < NUM_PARTICLES; i++ ) {

          p = list[i];
          b[n = ( ~~p.x + ( ~~p.y * w ) ) * 4] = b[n+1] = b[n+2] = COLOR, b[n+3] = 255;
        }

        ctx.putImageData( a, 0, 0 );
        }

        if ( stats ) stats.end();

        requestAnimationFrame( step );
        }

        init();
        step();
      },
    },
  },
};

function getFullscreenBackgroundStyle(path) {
  return `
    opacity: 0.1;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center center;
    background-image: url(${path});
  `;
}

/*!
* Deep merge two or more objects together.
* (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
* @param   {Object}   objects  The objects to merge together
* @returns {Object}            Merged values of defaults and options
*/
function merge(a, b) {
  const entries = b !== undefined ? Object.entries(b) : [];

  return entries.reduce((accumulator, [key, value]) => {
    if (value.toString() === '[object Object]') {
      // If we're doing a deep merge and the property is an object
      accumulator[key] = extend(a[key], value);
    } else {
      // Otherwise, do a regular merge
      accumulator[key] = value;
    }
    return accumulator;
  }, a);
};

function extend(...args) {
  // Loop through each object and conduct a merge
  return args.reduce((accumulator, current) => merge(accumulator, current), {});
};


class Customizer {
  constructor(options) {
    const defaultOptions = {
      config: {
        all: {
          style: "",
          callback: (div) => {
            while (div.firstChild) {
              div.removeChild(div.lastChild);
            }
          }
        },
        default: {
          style: getFullscreenBackgroundStyle("https://images.alphacoders.com/985/thumb-1920-985802.png"),
          callback: () => {},
        },
        plaintext: {
          style: getFullscreenBackgroundStyle("https://img5.goodfon.com/wallpaper/nbig/2/28/tsvety-buket-bloknot-1.jpg"),
          callback: () => {},
        },
        javascript: {
          style: getFullscreenBackgroundStyle("https://www.wallpapertip.com/wmimgs/83-838172_programming-javascript.jpg"),
          callback: () => {},
        },
        json: {
          style: getFullscreenBackgroundStyle("https://wallpaperaccess.com/full/1555147.png"),
          callback: () => {},
        },
        jsonc: {
          style: getFullscreenBackgroundStyle("https://wallpaperaccess.com/full/1555147.png"),
          callback: () => {},
        },
        html: {
          style: getFullscreenBackgroundStyle("https://wallpaperaccess.com/full/4868336.jpg"),
          callback: () => {},
        },
        css: {
          style: getFullscreenBackgroundStyle("https://p4.wallpaperbetter.com/wallpaper/285/806/562/css-css3-wallpaper-preview.jpg"),
          callback: () => {},
        },
      },
      observe: {
        interval: 100,
        timeout: 3000,
      },
      // available modes: fullscreen, fullscreen_notitle, editor, editor_extended, panel, sidebar, sidebar_extended
      mode: "fullscreen_notitle",
      debug: true,
    };

    const mergedOptions = extend(defaultOptions, options);

    this.config = mergedOptions.config;
    this.mode = mergedOptions.mode;
    this.observe = mergedOptions.observe;
    this.debug = mergedOptions.debug;

    this.log("Initializing customizer...");
  }

  log(message) {
    if(this.debug) {
      console.log(`customizer: ${message}`);
    }
  }

  createElement() {
    const div = document.createElement("div");
    div.classList.add("customizer-background-div");
    div.id = "customizer-background-div";

    const baseCss = `
      z-index: 500;
      position: absolute;
      pointer-events: none;
    `;

    const sizeCss =  this.mode === "fullscreen" ? `
      width: 100vw;
      height: 100vh;
    ` : `
      width: 100%;
      height: 100%;
    `;

    div.style.cssText = baseCss + sizeCss;

    return div;
  }

  addElement(div) {
    document.body.append(div);
  }

  getParent() {
    switch (this.mode) {
      case "fullscreen":
        return document.body;
      case "fullscreen_notitle":
        return document.getElementsByClassName("split-view-view visible")[1];
      case "editor":
      case "editor_extended":
        return document.getElementById("workbench.parts.editor");
      case "panel":
        return document.getElementById("workbench.parts.panel");
      case "sidebar":
      case "sidebar_extended":
        return document.getElementById("workbench.parts.sidebar");
    }
  }

  styleDiv(div) {
    switch(this.mode) {
      case "editor_extended":
        div.style.height = "100vh";
        break;
      case "sidebar_extended":
        div.style.width = "100vw";
        break;
    }
  }

  changeBackgroundMode(div) {
    return this.waitForElementToDisplay('#workbench\\.parts\\.editor', this.observe.interval, this.observe.timeout)
      .then(() => {
        this.getParent().prepend(div);
        this.styleDiv(div);
      });
  }

  waitForElementToDisplay(selector, checkFrequencyInMs, timeoutInMs) {
    const startTimeInMs = Date.now();

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (document.querySelector(selector) != null) {
          resolve();
          clearInterval(intervalId);
        } else if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
          reject();
          clearInterval(intervalId);
        }
      }, checkFrequencyInMs);
    });
  }

  setBackgroundStyle(style, div) {
    this.log("Applying styles to background");
    div.style.cssText = div.style.cssText + style;
  }

  applyConfig(div) {
    const editorInstance = document.getElementsByClassName("editor-instance")[0];
    const editorMode = editorInstance.getAttribute("data-mode-id");
    this.log(`Switched to tab with mode: ${editorMode}`);

    // get the right background image
    const config = this.config[editorMode] !== undefined ? this.config[editorMode] : this.config.default;

    this.setBackgroundStyle(this.config.all.style + config.style, div);
    this.config.all.callback(div);
    config.callback(div);
  }

  observeChanges(div) {
    const target = document.getElementsByClassName("editor-instance")[0];
    // add an mutationobserver to the editor instance for getting changes
    const observer = new MutationObserver((mutations) => {
      // the important code is Here
      const mutation = mutations.find((mutation) => mutation.attributeName === "data-mode-id");
      if(mutation !== undefined) {
        this.applyConfig(div);
      }
    });

    const observerConfig = {
      attributes: true,
      childList: false,
      characterData: false
    };

    observer.observe(target, observerConfig);
  }

  observeChangeBackground(div) {
    return this.waitForElementToDisplay(".editor-instance", this.observe.interval, this.observe.timeout)
      .then(() => {
        this.observeChanges(div);
      });
  }

  main() {
    this.log("Starting customizer");

    const div = this.createElement();
    this.addElement(div);
    this.changeBackgroundMode(div);
    this.observeChangeBackground(div);
  }
}

const customizer = new Customizer(options);
// todo configuration for specific files
window.addEventListener("load", () => {
  customizer.main();
});
