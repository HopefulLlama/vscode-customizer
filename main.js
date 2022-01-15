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

class Customizer {
  constructor(options) {
    const defaultOptions = {
      config: {
        default: {
          style: getFullscreenBackgroundStyle("https://images.alphacoders.com/985/thumb-1920-985802.png"),
        },
        plaintext: {
          style: getFullscreenBackgroundStyle("https://img5.goodfon.com/wallpaper/nbig/2/28/tsvety-buket-bloknot-1.jpg"),
        },
        javascript: {
          style: getFullscreenBackgroundStyle("https://i.kym-cdn.com/entries/icons/original/000/026/638/cat.jpg"),
        },
        json: {
          style: getFullscreenBackgroundStyle("https://wallpaperaccess.com/full/1555147.png"),
        },
        jsonc: {
          style: getFullscreenBackgroundStyle("https://wallpaperaccess.com/full/1555147.png"),
        },
        html: {
          style: getFullscreenBackgroundStyle("https://wallpaperaccess.com/full/4868336.jpg"),
        },
        css: {
          style: getFullscreenBackgroundStyle("https://p4.wallpaperbetter.com/wallpaper/285/806/562/css-css3-wallpaper-preview.jpg"),
        },
      },
      observe: {
        interval: 100,
        timeout: 3000,
      },
      // 0 - 1
      opacity: 0.1,
      // available modes: fullscreen, fullscreen_notitle, editor, editor_extended, panel, sidebar, sidebar_extended
      mode: "fullscreen_notitle",
      debug: true,
    };

    const mergedConfig = {
      ...defaultOptions.config,
      ...(options !== undefined ? options.config : {}),
    };

    const mergedObserve = {
      ...defaultOptions.observe,
      ...(options !== undefined ? options.observe : {}),
    }

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      config: mergedConfig,
      observe: mergedObserve,
    };

    this.config = mergedOptions.config;
    this.opacity = mergedOptions.opacity;
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

  changeToConfigImage(div) {
    const editorInstance = document.getElementsByClassName("editor-instance")[0];
    const editorMode = editorInstance.getAttribute("data-mode-id");
    this.log(`Switched to tab with mode: ${editorMode}`);

    // get the right background image
    const config = this.config[editorMode] !== undefined ? this.config[editorMode] : this.config.default;
    this.setBackgroundStyle(config.style, div);
  }

  observeChanges(div) {
    const target = document.getElementsByClassName("editor-instance")[0];
    // add an mutationobserver to the editor instance for getting changes
    const observer = new MutationObserver((mutations) => {
      // the important code is Here
      const mutation = mutations.find((mutation) => mutation.attributeName === "data-mode-id");
      if(mutation !== undefined) {
        this.changeToConfigImage(div);
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

const customizer = new Customizer();
// todo configuration for specific files
window.addEventListener("load", () => {
  customizer.main();
});
