// @ts-check

/** @type { import("./types").onUiLoaded } */
/** @type { import("./types").GradioApp } */

onUiLoaded(async () => {
  class Core {
    /**
     * @param {number} timeout
     * @return {Promise<void>}
     */
    static async sleep(timeout) {
      return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    /**
     * @return {GradioApp}
     */
    static get app() {
      return gradioApp();
    }
  }

  class Finder {
    /**
     * @param {string} id
     * @return {HTMLElement}
     */
    static by(id) {
      const $ = Core.app.getElementById(id);
      if (!$) {
        throw Error(`Unknown element by id. id = ${id}`);
      }

      return $;
    }

    /**
     * @param {string} id
     * @return {Boolean}
     */
    static exists(id) {
      return Core.app.getElementById(id) !== null;
    }

    /**
     * @param {string} selector
     * @param {HTMLElement | null} $from
     * @return {HTMLElement}
     */
    static query(selector, $from = null) {
      /** @type {HTMLElement | null} */
      let $ = null;
      if ($from) {
        $ = $from.querySelector(selector);
      } else {
        $ = Core.app.querySelector(selector);
      }

      if (!$) {
        throw Error(`Unknown element by query. query = ${selector}`);
      }

      return $;
    }

    /**
     * @param {string} selector
     * @param {HTMLElement | null} $from
     * @return {NodeListOf<HTMLElement>}
     */
    static queryAll(selector, $from = null) {
      if ($from) {
        return $from.querySelectorAll(selector);
      } else {
        return Core.app.querySelectorAll(selector);
      }
    }
  }

  class Helper {
    /**
     * @return {HTMLDivElement}
     */
    static div() {
      return document.createElement('div');
    }

    /**
     * @return {HTMLSpanElement}
     */
    static span() {
      return document.createElement('span');
    }

    /**
     * @return {HTMLLabelElement}
     */
    static label() {
      return document.createElement('label');
    }

    /**
     * @return {HTMLInputElement}
     */
    static checkbox() {
      const $ = document.createElement('input');
      $.type = 'checkbox';
      $.classList.add('gr-check-radio', 'gr-checkbox');
      $.style.margin = '0px 10px';
      return $;
    }

    /**
     * @return {HTMLSelectElement}
     */
    static select() {
      const $ = document.createElement('select');
      $.classList.add('gr-box', 'gr-input');
      return $;
    }

    /**
     * @return {HTMLOptionElement}
     */
    static option() {
      return document.createElement('option');
    }

    /**
     * @return {HTMLImageElement}
     */
    static img() {
      return document.createElement('img');
    }

    /**
     * @return {HTMLButtonElement}
     */
    static button() {
      const $ = document.createElement('button');
      $.classList.add('gr-button', 'gr-button-lg', 'gr-button-tool');
      return $;
    }

    /**
     * @return {HTMLDivElement}
     */
    static floatingButtonContainer() {
      const $ = this.div();
      $.classList.add('flex', 'row', 'flex-wrap', 'gap-1');
      $.style.position = 'absolute';
      $.style['z-index'] = 100;
      return $;
    }

    /**
     * @param {HTMLElement} $
     */
    static hidden($) {
      $.style.display = 'none';
    }

    /**
     * @param {HTMLButtonElement} $button
     */
    static leaveButton($button) {
      $button.textContent = '';
      $button.style.position = 'fixed';
      $button.style.width = '0';
      $button.style.height = '0';
      $button.style.top = '0';
      $button.style.left = '0';
      $button.style.top = '0';
      $button.style.margin = '0';
      $button.style.padding = '0';
      $button.style.border = '0';
      $button.style['min-width'] = 'initial';
      $button.style['min-height'] = 'initial';
      $button.classList.remove('gr-button-primary', 'gr-button-secondary');
    }

    /**
     * @param {HTMLElement} $from
     * @param {(visibled: Boolean) => void} callback
    */
    static handleDisplayChanged($from, callback) {
      const observer = new MutationObserver(records => {;
        for (const record of records) {
          if (record.attributeName === 'style' && /display:\s[^;]+;/.test(record.oldValue || '')) {
            callback(/display:\snone;/.test(record.oldValue || ''));
            break;
          }
        }
      });
      observer.observe($from, {attributes: true, attributeOldValue: true})
    }
  }

  class I18n {
    static t = {
      tagSelector: {
        open: '🏷',
      },
      pngDropBackup: {
        restore: '↩️️',
      },
      newGenTools: {
        gen: '▶️️',
        stop: '️■️',
        skip: '️➡',
      },
      image: {
        notFound: './file=html/card-no-preview.png',
      },
      lora: {
        newest: '新着順',
      },
    };
  }

  class Modules {
    /**
     * @return {Boolean}
     */
    static get already() {
      return Finder.exists('interactive-tag-selector');
    }

    /** @return {HTMLElement} */
    static get pain() { return Finder.by('tab_txt2img'); }

    /** @return {HTMLElement} */
    static get prompt() { return Finder.by('txt2img_prompt'); }

    /** @return {HTMLElement} */
    static get tokenCounter() { return Finder.by('txt2img_token_counter'); }

    /** @return {HTMLButtonElement} */ // @ts-ignore
    static get genButton() { return Finder.by('txt2img_generate'); }

    /** @return {HTMLButtonElement} */ // @ts-ignore
    static get stopButton() { return Finder.by('txt2img_interrupt'); }

    /** @return {HTMLButtonElement} */ // @ts-ignore
    static get skipButton() { return Finder.by('txt2img_skip'); }

    /** @return {HTMLElement} */
    static get toolsContainer() { return Finder.by('txt2img_actions_column'); }

    /** @return {HTMLElement} */
    static get toolsClearPrompt() { return Finder.by('txt2img_clear_prompt'); }

    /** @return {HTMLElement} */
    static get toolsStyleSelect() { return Finder.by('txt2img_styles_row'); }

    /** @return {HTMLElement} */
    static get toolsStyleApply() { return Finder.by('txt2img_style_apply'); }

    /** @return {HTMLElement} */
    static get toolsStyleCreate() { return Finder.by('txt2img_style_create'); }

    /** @return {HTMLElement} */
    static get tools() { return Finder.by('txt2img_tools'); }

    /** @return {HTMLElement} */
    static get sampler() { return Finder.by('sampler_selection_txt2img'); }

    /** @return {HTMLElement} */
    static get steps() { return Finder.by('txt2img_steps'); }

    /** @return {HTMLElement} */
    static get seedContainer() { return Finder.by('txt2img_seed_row'); }

    /** @return {HTMLElement} */
    static get seed() { return Finder.by('txt2img_seed'); }

    /** @return {HTMLElement} */
    static get cfgScale() { return Finder.by('txt2img_cfg_scale'); }

    /** @return {HTMLElement} */
    static get settings() { return Finder.by('txt2img_settings'); }

    /** @return {HTMLElement} */
    static get hiresFix() { return Finder.by('txt2img_hires_fix'); }

    /** @return {HTMLElement} */
    static get extraNetworks() { return Finder.by('txt2img_extra_networks'); }

    /** @return {HTMLElement} */ // @ts-ignore
    static get extraNetworksRefresh() { return Finder.by('txt2img_extra_close').nextElementSibling; }

    /** @return {HTMLTextAreaElement} */ // @ts-ignore
    static get extraNetworksSearchText() { return Finder.query('#txt2img_extra_tabs > div > textarea'); }

    /** @return {HTMLElement} */
    static get loraCards() { return Finder.by('txt2img_lora_cards'); }

    /** @return {HTMLElement} */
    static get loraSubDirs() { return Finder.by('txt2img_lora_subdirs'); }

    /** @return {HTMLElement} */
    static get scripts() { return Finder.by('txt2img_script_container'); }

    /** @return {HTMLElement} */
    static get tagSelectorContainer() { return Finder.by('interactive-tag-selector'); }

    /** @return {HTMLElement} */
    static get tagSelectorButton() { return Finder.by('txt2img_open_tag_selector'); }
  }

  class NewModules {
    static ids = {
      genTools: 'txt2img_new_gen_tools',
      promptBackup: 'txt2img_prompt_backup',
      seedStepsCfgContainer: 'txt2img_seed_steps_cfg_settings',
      loraCardHover: 'txt2img_lora_card_hover',
    };

    /** @return {HTMLElement} */
    static get genTools() { return Finder.by(this.ids.genTools); }

    /** @return {HTMLElement} */
    static get promptBackup() { return Finder.by(this.ids.promptBackup); }

    /** @return {HTMLElement} */
    static get seedStepsCfgContainer() { return Finder.by(this.ids.seedStepsCfgContainer); }

    /** @return {HTMLElement} */
    static get loraCardHover() { return Finder.by(this.ids.loraCardHover); }
  }

  class Executor {
    exec() {}
  }

  class Txt2ImgTopExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $txt2img = Modules.pain;
      const $top = Finder.query('div', $txt2img);
      const $result = Finder.query('#txt2img_results', $top);

      const $container = Helper.div();
      $container.classList.add('flex', 'row');
      $container.appendChild($top);
      $container.appendChild($result);

      $txt2img.appendChild($container);
    }
  }

  class AlignToolsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $open = Modules.tagSelectorButton;
      $open.textContent = I18n.t.tagSelector.open;

      Modules.tools.appendChild($open);
    }
  }

  class HideToolsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      Helper.hidden(Modules.toolsClearPrompt);
      Helper.hidden(Modules.toolsStyleApply);
      Helper.hidden(Modules.toolsStyleCreate);
      Helper.hidden(Modules.toolsStyleSelect);
    }
  }

  class NewGenToolsExecutor extends Executor {
    /** @typedef {{$gen: HTMLButtonElement, $stop: HTMLButtonElement, $skip: HTMLButtonElement}} OrgButtons */

    /**
     * @override
     */
    exec() {
      const buttons = {
        $gen: Modules.genButton,
        $stop: Modules.stopButton,
        $skip: Modules.skipButton,
      };
      const $genButton = this.remakeGen(buttons);
      const $container = Helper.floatingButtonContainer();
      $container.id = NewModules.ids.genTools;
      $container.style.right = '100px';
      $container.style.top = '-12px';
      $container.style['min-width'] = 'min(120px, 100%)';
      $container.appendChild($genButton);
      $container.appendChild(this.remakeStop(buttons, $genButton));
      $container.appendChild(this.remakeSkip(buttons, $genButton));

      Helper.leaveButton(buttons.$gen);
      Helper.leaveButton(buttons.$stop);
      Helper.leaveButton(buttons.$skip);

      Modules.tokenCounter.after($container);
    }

    /**
     * @param {OrgButtons} orgButtons
     * @return {HTMLButtonElement}
     * @access private
     */
    remakeGen(orgButtons) {
      const $button = Helper.button();
      $button.textContent = I18n.t.newGenTools.gen;
      $button.addEventListener('click', () => {
        orgButtons.$gen.click();
        $button.disabled = true;
        $button.classList.add('disabled', 'dark');
      });
      Helper.handleDisplayChanged(orgButtons.$stop, visibled => {
        if (!visibled) {
          $button.disabled = false;
          $button.classList.remove('disabled', 'dark');
        }
      });

      return $button;
    }

    /**
     * @param {OrgButtons} orgButtons
     * @param {HTMLButtonElement} $genButton
     * @return {HTMLButtonElement}
     * @access private
     */
    remakeStop(orgButtons, $genButton) {
      const $button = Helper.button();
      $button.classList.add('disabled', 'dark');
      $button.textContent = I18n.t.newGenTools.stop;
      $button.disabled = true;
      $button.addEventListener('click', () => {
        orgButtons.$stop.click();
      });
      $genButton.addEventListener('click', () => {
        $button.disabled = false;
        $button.classList.remove('disabled', 'dark');
      });
      Helper.handleDisplayChanged(orgButtons.$stop, visibled => {
        if (!visibled) {
          $button.disabled = true;
          $button.classList.add('disabled', 'dark');
        }
      });

      return $button;
    }

    /**
     * @param {OrgButtons} orgButtons
     * @param {HTMLButtonElement} $genButton
     * @return {HTMLButtonElement}
     * @access private
     */
    remakeSkip(orgButtons, $genButton) {
      const $button = Helper.button();
      $button.classList.add('disabled', 'dark');
      $button.textContent = I18n.t.newGenTools.skip;
      $button.disabled = true;
      $button.addEventListener('click', () => {
        orgButtons.$skip.click();
      });
      $genButton.addEventListener('click', () => {
        $button.disabled = false;
        $button.classList.remove('disabled', 'dark');
      });
      Helper.handleDisplayChanged(orgButtons.$stop, visibled => {
        if (!visibled) {
          $button.disabled = true;
          $button.classList.add('disabled', 'dark');
        }
      });

      return $button;
    }
  }

  class PngDropBackupExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $backup = Helper.div();
      $backup.id = NewModules.ids.promptBackup;
      Helper.hidden($backup);

      const $restore = Helper.button();
      $restore.textContent = I18n.t.pngDropBackup.restore;
      $restore.addEventListener('click', () => {
        const $prompt = Modules.prompt;
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $textarea = Finder.query('textarea', $prompt);
        $textarea.value = $backup.textContent || '';
        updateInput($textarea);
      });

      const $prompt = Modules.prompt;
      $prompt.addEventListener('drop', () => {
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $textarea = Finder.query('textarea', $prompt);
        const $backup = NewModules.promptBackup;
        $backup.textContent = $textarea.value;
      });

      const $container = Helper.floatingButtonContainer();
      $container.style.right = '0px';
      $container.style.bottom = '-12px';
      $container.style['min-width'] = 'min(40px, 100%)';
      $container.appendChild($restore);
      $container.appendChild($backup);

      NewModules.genTools.after($container);
    }
  }

  class AlignSettingsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $toolsContainer = Modules.toolsContainer;
      Modules.sampler.appendChild($toolsContainer);

      const $container = Helper.div();
      $container.id = NewModules.ids.seedStepsCfgContainer;
      $container.classList.add('flex', 'row', 'w-full', 'flex-wrap', 'gap-4');
      $container.appendChild(Modules.seed);
      $container.appendChild(Modules.steps);
      $container.appendChild(Modules.cfgScale);

      const $settings = Modules.settings;
      $settings.style['padding-top'] = 'initial';
      $settings.appendChild($container);
      $settings.appendChild(Modules.hiresFix);
      $settings.appendChild(Modules.extraNetworks);
      $settings.appendChild(Modules.scripts);
    }
  }

  class HideSettingsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      Helper.hidden(Modules.seedContainer);
    }
  }

  class AlignTagSelectorExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      NewModules.seedStepsCfgContainer.after(Modules.tagSelectorContainer);
    }
  }

  class LoraExecutor extends Executor {
    constructor() {
      super();
      this.mouse = { x: 0, y: 0 };
    }

    /**
     * @override
     */
    exec() {
      this.handleMouse();
      this.imageHover();
      this.cards();
      this.search();
      this.refresh();
      this.subDirs();
      this.sort();
    }

    /**
     * @access private
     */
    reload() {
      this.imageHover();
      this.cards();
      this.subDirs();
      this.sort();
    }

    /**
     * @access private
     */
    handleMouse() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    }

    /**
     * @access private
     */
    imageHover() {
      const $hover = Helper.div();
      $hover.id = NewModules.ids.loraCardHover;
      $hover.style.position = 'fixed';
      $hover.style['z-index'] = 1000;
      Helper.hidden($hover);

      const $image = Helper.img();
      $hover.appendChild($image);

      Modules.loraCards.appendChild($hover);
    }

    /**
     * @param {HTMLElement} $model
     * @access private
     */
    hoverShow($model) {
      const $hover = NewModules.loraCardHover;
      /** @type {HTMLImageElement} */ // @ts-ignore
      const $image = Finder.query('img', $hover);
      /** @type {HTMLImageElement} */ // @ts-ignore
      const $orgImage = Finder.query('img', $model);
      $image.src = $orgImage.src;
      $hover.style.width = '240px';
      $hover.style.display = '';
      $hover.style.left = `${Math.max(0, this.mouse.x - 240)}px`;
      $hover.style.top = `${Math.max(0, this.mouse.y - 400)}px`;
    }

    /**
     * @access private
     */
    hoverHide() {
      Helper.hidden(NewModules.loraCardHover);
    }

    /**
     * @access private
     */
    cards() {
      const $container = Modules.loraCards;
      for (const $card of Finder.queryAll('.card', $container)) {
        const $model = this.cardToModel($card);
        Helper.hidden($card);
        $container.appendChild($model);
      }
    }

    /**
     * @param {HTMLElement} $card
     * @return {HTMLElement}
     * @access private
     */
    cardToModel($card) {
      const $img = Helper.img();
      const matches = $card.style['background-image'].match(/"(.+)"/);
      $img.src = matches ? matches[1] : I18n.t.image.notFound;
      $img.style.width = '25px';
      $img.style.height = 'auto';

      const $imgBox = Helper.div();
      $imgBox.style['flex-basis'] = '10%';
      $imgBox.appendChild($img);

      const $path = Helper.div();
      $path.textContent = Finder.query('.actions > .name', $card).textContent;
      $path.style['text-align'] = 'left';
      $path.style['flex-basis'] = '50%';

      const $actions = Finder.query('.actions > .additional', $card);
      $actions.style['flex-basis'] = '40%';

      const timeMatches = $img.src.match(/mtime=(\d+)/);
      const timestamp = timeMatches ? parseInt(timeMatches[1]) : 0;

      const $model = Helper.div();
      $model.classList.add('flex', 'w-2/4', 'gr-button', 'gr-button-primary', 'lora_model');
      $model.dataset.timestamp = `${timestamp}`;
      $model.appendChild($imgBox);
      $model.appendChild($path);
      $model.appendChild($actions);
      $model.addEventListener('click', () => { $card.click(); });
      $model.addEventListener('mouseenter', e => {
        /** @type {HTMLElement} */ // @ts-ignore
        const target = e?.target;
        this.hoverShow(target);
      });
      $model.addEventListener('mouseleave', () => { this.hoverHide(); });
      return $model;
    }

    /**
     * @access private
     */
    search() {
      let timerId = -1;
      const $searchText = Modules.extraNetworksSearchText;
      $searchText.addEventListener('input', () => {
        if (timerId !== -1) {
          clearTimeout(timerId);
        }

        timerId = setTimeout(() => {
          for (const $model of Finder.queryAll('.lora_model', Modules.loraCards)) {
            const term = Finder.query('.search_term', $model).textContent || '';
            const shown = $searchText.value.length === 0 || term.toLowerCase().indexOf($searchText.value.toLowerCase()) > 0;
            $model.style.display = shown ? '' : 'none';
          }

          timerId = -1;
        }, 300);
      });
    }

    /**
     * @access private
     */
    refresh() {
      Modules.extraNetworksRefresh.addEventListener('click', () => { this.reload(); });
    }

    /**
     * @access private
     */
    subDirs() {
      const $container = Modules.loraSubDirs;
      const $selectBox = Helper.select();
      $selectBox.addEventListener('change', e => {
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const target = e?.target;
        for (const $dir of Finder.queryAll('button', $container)) {
          if ($dir.textContent === target.value) {
            $dir.click();
          }
        }
      });

      for (const $dir of Finder.queryAll('button', $container)) {
        const $option = Helper.option();
        $option.value = $dir.textContent || '';
        $option.textContent = $dir.textContent;
        $selectBox.appendChild($option);

        Helper.hidden($dir);
      }

      $container.appendChild($selectBox);
    }

    /**
     * @access private
     */
    sort() {
      const $checkBox = Helper.checkbox();

      const $span = Helper.span();
      $span.textContent = I18n.t.lora.newest;

      const $label = Helper.label();
      $label.appendChild($checkBox);
      $label.appendChild($span);

      Modules.loraSubDirs.appendChild($label);

      $checkBox.addEventListener('change', e => {
        /** @type {HTMLInputElement} */ // @ts-ignore
        const target = e?.target;
        const newest = target.checked;
        const $container = Modules.loraCards;
        /** @type {{timestamp: string, term: string, elem: HTMLElement}[]} */
        const items = [];
        for (const $model of Finder.queryAll('.lora_model', $container)) {
          const term = Finder.query('.search_term', $model).textContent || '';
          items.push({timestamp: $model.dataset.timestamp || '', term: term, elem: $model});
        }

        items.sort((a, b) => {
          if (newest) {
            return parseInt(b.timestamp) - parseInt(a.timestamp);
          } else {
            return a.term.toLowerCase() > b.term.toLowerCase() ? 1 : -1;
          }
        });

        items.forEach(item => {
          $container.appendChild(item.elem);
        });
      });
    }
  }

  /**
   * @return {Promise<void>}
   */
  async function waitUntilLoaded() {
    while(true) {
      console.log('...wait until ui loaded');

      await Core.sleep(100);

      if (Modules.already) {
        break;
      }
    }

    console.log('ui load completed!');
  }

  /**
   * @return {void}
   */
  function main() {
    console.log('remake ui start!');

    const execs = [
      Txt2ImgTopExecutor,
      AlignToolsExecutor,
      HideToolsExecutor,
      AlignSettingsExecutor,
      HideSettingsExecutor,
      AlignTagSelectorExecutor,
      LoraExecutor,
      NewGenToolsExecutor,
      PngDropBackupExecutor,
    ];
    for (const ctor of execs) {
      new ctor().exec();
    }

    console.log('remake ui successfull!');
  }

  await waitUntilLoaded();
  main();
})
