class Customizer {
  constructor(options) {
    const defaultOptions = {
      config: {
        default: "https://images.alphacoders.com/985/thumb-1920-985802.png",
        plaintext: "https://img5.goodfon.com/wallpaper/nbig/2/28/tsvety-buket-bloknot-1.jpg",
        javascript: "https://i.kym-cdn.com/entries/icons/original/000/026/638/cat.jpg",
        json: "https://wallpaperaccess.com/full/1555147.png",
        jsonc: "https://wallpaperaccess.com/full/1555147.png",
        html: "https://wallpaperaccess.com/full/4868336.jpg",
        css: "https://p4.wallpaperbetter.com/wallpaper/285/806/562/css-css3-wallpaper-preview.jpg"
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
    div.style.cssText = `
      opacity: 0.1;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      width: 100vw;
      height: 100vh;
      z-index: 500;
      position: absolute;
      pointer-events: none;
    `;

    if (this.mode == "fullscreen") {
      div.style.width = "100vw";
      div.style.height = "100vh";
    } else {
      div.style.width = "100%";
      div.style.height = "100%";
    }

    return div;
  }

  addElement(div) {
    document.body.append(div);
  }

  changeBackgroundMode(div) {
    return this.waitForElementToDisplay('#workbench\\.parts\\.editor', this.observe.interval, this.observe.timeout)
      .then(() => {
        switch (this.mode) {
          case "fullscreen":
            document.body.prepend(div);
            break;
          case "fullscreen_notitle":
            const fullscreenNoT = document.getElementsByClassName("split-view-view visible")[1];
            fullscreenNoT.prepend(div);
            break;
          case "editor":
            const editor = document.getElementById("workbench.parts.editor");
            editor.prepend(div);
            break;
          case "editor_extended":
            const editorExt = document.getElementById("workbench.parts.editor");
            editorExt.prepend(div);
            div.style.height = "100vh";
            break;
          case "panel":
            const panel = document.getElementById("workbench.parts.panel");
            panel.prepend(div);
            break;
          case "sidebar":
            const sidebar = document.getElementById("workbench.parts.sidebar");
            sidebar.prepend(div);
            break;
          case "sidebar_extended":
            const sidebarExt = document.getElementById("workbench.parts.sidebar");
            sidebarExt.prepend(div);
            div.style.width = "100vw";
            break;
        }
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

  setBackgroundImage(path, div) {
    this.log(`Changing background image to ${path} at ${div}`);
    div.style.opacity = this.opacity;
    div.style.backgroundImage = `url(${path})`;
  }

  changeToConfigImage(div) {
    const editorInstance = document.getElementsByClassName("editor-instance")[0];
    const editorMode = editorInstance.getAttribute("data-mode-id");
    this.log(`Switched to tab with mode: ${editorMode}`);

    // get the right background image
    const imagePath = this.config[editorMode];
    if (imagePath === undefined) {
      this.log(`Couldn't find configuration for ${editorMode}. Using default image.`);
      this.log(this.config.default);
      this.setBackgroundImage(this.config.default, div);
    } else {
      this.setBackgroundImage(imagePath, div);
    }
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
