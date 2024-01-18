// @ts-check

/** @type { import("./types").onUiLoaded } */
/** @type { import("./types").GradioApp } */
/** @type { import("./types").open_model_url } */
/** @type { import("./types").add_trigger_words } */
/** @type { import("./types").use_preview_prompt } */

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

  class KeyCodes {
    static Enter = 'Enter';
    static Esc = 'Escape';
  };

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
     * @return {HTMLElement | null}
     */
    static findQuery(selector, $from = null) {
      if ($from) {
        return $from.querySelector(selector);
      } else {
        return Core.app.querySelector(selector);
      }
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
     * @return {HTMLAnchorElement}
     */
    static a() {
      return document.createElement('a');
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
     * @return {HTMLTextAreaElement}
     */
    static textarea() {
      const $ = document.createElement('textarea');
      $.classList.add('scroll-hide', 'block', 'gr-box', 'gr-input', 'w-full', 'gr-text-input');
      $.placeholder = '';
      return $;
    }

    /**
     * @return {HTMLTextAreaElement}
     */
    static textbox() {
      const $ = this.textarea();
      $.rows = 1;
      $.style['overflow-y'] = 'scroll';
      return $;
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
     * @param {string} value
     * @return {HTMLOptionElement}
     */
    static option(value) {
      const $ = document.createElement('option');
      $.value = value;
      $.textContent = value;
      return $;
    }

    /**
     * @return {HTMLInputElement}
     */
    static trackbar() {
      const $ = document.createElement('input');
      $.type = 'range';
      $.classList.add('w-full', 'disabled:cursor-not-allowed');
      return $;
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
      $.classList.add('lg', 'secondary', 'gradio-button', 'tool', 'svelte-cmf5ev'); // XXX cmf5evは適当なハッシュだと思うので再現性は不明
      return $;
    }

    /**
     * @return {HTMLTableElement}
     */
    static table() {
      const $ = document.createElement('table');
      return $;
    }

    /**
     * @return {HTMLTableSectionElement}
     */
    static tableHeader() {
      const $ = document.createElement('thead');
      return $;
    }

    /**
     * @return {HTMLTableSectionElement}
     */
    static tableBody() {
      const $ = document.createElement('tbody');
      return $;
    }

    /**
     * @param {string} text
     * @return {HTMLTableCellElement}
     */
    static tableHeaderCell(text) {
      const $ = document.createElement('th');
      $.textContent = text;
      return $;
    }

    /**
     * @return {HTMLTableRowElement}
     */
    static tableRow() {
      const $ = document.createElement('tr');
      return $;
    }

    /**
     * @return {HTMLTableCellElement}
     */
    static tableCell() {
      const $ = document.createElement('td');
      return $;
    }

    /**
     * @return {HTMLDivElement}
     */
    static buttonContainer() {
      const $ = this.div();
      $.classList.add('flex', 'row', 'flex-wrap', 'gap-1');
      return $;
    }

    /**
     * @return {HTMLDivElement}
     */
    static floatingButtonContainer() {
      const $ = this.buttonContainer();
      $.style.position = 'absolute';
      $.style['z-index'] = 100;
      return $;
    }

    /**
     * @return {HTMLDivElement}
    */
    static overlay() {
      /**
       * @param {HTMLElement} $
       * @returns {HTMLElement}
       * @private
       */
      function makeClose($) {
        const $button = Helper.button();
        $button.style.position = 'relative';
        $button.style.left = '-20px';
        $button.textContent = I18n.t.overlay.close;
        $button.addEventListener('click', () => Helper.hide($));

        const $container = Helper.div();
        $container.style.position = 'absolute';
        $container.appendChild($button);
        return $container;
      }

      const $ = Helper.div();
      $.style.position = 'fixed';
      // $overlay.style.width = '100%'; XXX 一旦廃止
      $.style.width = '50%';
      $.style.height = '100%';
      // $overlay.style.left = '0'; XXX 一旦廃止
      $.style.right = '0';
      $.style.top = '0';
      $.style.margin = '0';
      $.style.padding = '0';
      $.style.border = '0';
      $.style['min-width'] = 'initial';
      $.style['min-height'] = 'initial';
      $.style['z-index'] = 1001;
      $.style.display = 'none';
      $.appendChild(makeClose($));
      return $;
    }

    /**
     * @param {HTMLElement} $
     * @param {boolean?} visible
     */
    static shown($, visible) {
      $.style.display = visible === undefined || visible ? 'block' : 'none';
    }

    /**
     * @param {HTMLElement} $
     */
    static hide($) {
      $.style.display = 'none';
    }

    /**
     * セレクトボックスの選択状態を変更し、反映のため更新イベントを発火する
     *
     * @param {HTMLSelectElement} $select
     * @param {string} value
     */
    static selected($select, value) {
      $select.value = value;
      $select.dispatchEvent(new Event('change'));
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
      overlay: {
        close: '✖️',
      },
      image: {
        notFound: './file=html/card-no-preview.png',
      },
      lora: {
        newest: '新着順',
        refresh: '♻️',
        swap: '🔁',
        open: '🌐',
        words: '🔖',
        example: '🗣',
      },
      aspectTools: {
        x23: '2:3',
        x11: '1:1',
      },
      sendButtons: {
        img2img: 'i2i',
        inpaint: 'inp',
      },
      scripts: {
        blockWeight: 'BW',
        adetailer: 'AD',
        additionalNetworks: 'AN',
        controlNet: 'CN',
        script: 'SC',
      },
      civitaiHelper: {
        model: {
          headers: {
            baseUrl: 'Base URL',
            path: 'Path',
            subdir: 'Sub Folder',
            version: 'Version',
            status: 'Status',
          },
          actions: {
            run: '▶️',
            apply: '↙️',
            clear: '×',
            restore: '↩️',
            load: '📁️',
          },
          statuses: {
            standby: 'StandBy',
            processing: 'Processing',
            complete: 'Complete',
            pending: 'Pending',
            error: 'Error',
          },
        },
      },
    };
  }

  class Modules {
    /**
     * @param {'txt2img' | 'img2img'} mode
     */
    constructor(mode) {
      this._mode = mode;
    }

    /**
     * @return {Boolean}
     */
    static get already() {
      return Finder.exists('txt2img_lora_cards') && Finder.exists('img2img_lora_cards');
      // XXX tag-selectorは一旦廃止
      // return Finder.exists('interactive-tag-selector');
    }

    /**
     * @param {string} id
     * @return {string}
     */
    id(id) {
      return this._mode === 'txt2img' ? id : id.replace('txt2img', this._mode);
    }

    /** @return {HTMLElement} */
    get footer() { return Finder.by(this.id('footer')); }

    /** @return {HTMLElement} */
    get pain() { return Finder.by(this.id('tab_txt2img')); }

    /** @return {HTMLElement} */
    get genContainer() { return Finder.by(this.id('txt2img_toprow')); }

    /** @return {HTMLElement} */
    get genSettings() { return Finder.by(this.id('txt2img_settings')); }

    /** @return {HTMLElement} */
    get prompt() { return Finder.by(this.id('txt2img_prompt')); }

    /** @return {HTMLElement} */
    get results() { return Finder.by(this.id('txt2img_results')); }

    /** @return {HTMLElement} */
    get sendToImg2Img() { return Finder.by(this.id('txt2img_send_to_img2img')); }

    /** @return {HTMLElement} */
    get sendToInpaint() { return Finder.by(this.id('txt2img_send_to_inpaint')); }

    /** @return {HTMLElement} */ // @ts-ignore
    get resultImageFooter() { return Finder.by(this.id('txt2img_gallery_container')).nextElementSibling; }

    /** @return {HTMLElement} */
    get resultImage() { return Finder.by(this.id('txt2img_gallery')); }

    /** @return {HTMLElement} */
    get tokenCounter() { return Finder.by(this.id('txt2img_token_counter')); }

    /** @return {HTMLButtonElement} */ // @ts-ignore
    get genButton() { return Finder.by(this.id('txt2img_generate')); }

    /** @return {HTMLButtonElement} */ // @ts-ignore
    get stopButton() { return Finder.by(this.id('txt2img_interrupt')); }

    /** @return {HTMLButtonElement} */ // @ts-ignore
    get skipButton() { return Finder.by(this.id('txt2img_skip')); }

    /** @return {HTMLInputElement} */ // @ts-ignore
    get widthSlider() { return Finder.by(this.id('txt2img_width')); }

    /** @return {HTMLInputElement} */ // @ts-ignore
    get heightSlider() { return Finder.by(this.id('txt2img_height')); }

    /** @return {HTMLElement} */
    get img2imgModes() { return Finder.by(this.id('mode_img2img')); }

    /** @return {HTMLElement} */
    get img2imgInterrogates() { return Finder.by(this.id('interrogate_col')); }

    /** @return {HTMLElement} */
    get img2imgResizeMode() { return Finder.by(this.id('resize_mode')); }

    /** @return {HTMLElement} */
    get img2imgMaskMode() { return Finder.by(this.id('img2img_mask_mode')); }

    /** @return {HTMLElement} */
    get img2imgMaskedContent() { return Finder.by(this.id('img2img_inpainting_fill')); }

    /** @return {HTMLElement} */
    get img2imgInpaintArea() { return Finder.by(this.id('img2img_inpaint_full_res')); }

    /** @return {HTMLElement} */
    get img2imgInpaintControls() { return Finder.by(this.id('inpaint_controls')); }

    /** @return {HTMLElement} */
    get img2imgInpaintPadding() { return Finder.by(this.id('img2img_inpaint_full_res_padding')); }

    /** @return {HTMLElement} */
    get toolsContainer() { return Finder.by(this.id('txt2img_actions_column')); }

    /** @return {HTMLElement} */
    get tools() { return Finder.by(this.id('txt2img_tools')); }

    /** @return {HTMLElement} */
    get toolsPaste() { return Finder.query(this.id('#paste'), this.tools); }

    /** @return {HTMLElement} */
    get toolsClearPrompt() { return Finder.by(this.id('txt2img_clear_prompt')); }

    /** @return {HTMLElement} */
    get toolsStyleSelect() { return Finder.by(this.id('txt2img_styles_row')); }

    /** @return {HTMLElement} */
    get toolsStyleApply() { return Finder.by(this.id('txt2img_style_apply')); }

    /** @return {HTMLElement} */
    get sampler() { return Finder.by(this.id('sampler_selection_txt2img')); }

    /** @return {HTMLElement} */
    get steps() { return Finder.by(this.id('txt2img_steps')); }

    /** @return {HTMLElement} */
    get seedContainer() { return Finder.by(this.id('txt2img_seed_row')); }

    /** @return {HTMLElement} */
    get seedExtra() { return Finder.by(this.id('txt2img_subseed_show')); }

    /** @return {HTMLElement} */
    get cfgScale() { return Finder.by(this.id('txt2img_cfg_scale')); }

    /** @return {HTMLElement} */
    get settings() { return Finder.by(this.id('txt2img_settings')); }

    /** @return {HTMLElement} @private */
    get hiresFix() { return Finder.by('txt2img_hr'); }

    /** @return {HTMLElement} */
    get refiner() { return Finder.by(this.id('txt2img_enable')); }

    /** @return {HTMLElement} @private */
    get img2imgDenoiseStrength() { return Finder.by('img2img_denoising_strength'); }

    /** @return {HTMLElement} */
    get hiresFixOrDenoiseStrength() { return this._mode === 'txt2img' ? this.hiresFix : this.img2imgDenoiseStrength; } // XXX 互換性が無いUI

    /** @return {HTMLElement} */
    get extraTabs() { return Finder.by(this.id('txt2img_extra_tabs')); }

    /** @return {HTMLElement} */
    get extraNetworksRefresh() { return Finder.by(this.id('txt2img_extra_refresh')); }

    /** @return {HTMLElement} */ // @ts-ignore
    get extraNetworksRefreshCivitai() { return Finder.by(this.id('txt2img_extra_close')).nextElementSibling; }

    /** @return {HTMLElement} */
    get loraCardsWrap() { return Finder.query('div.wrap', Finder.by(this.id('txt2img_lora_cards_html'))); }

    /** @return {HTMLElement} */
    get loraCards() { return Finder.by(this.id('txt2img_lora_cards')); }

    /** @return {HTMLElement} */
    get loraSubDirs() { return Finder.by(this.id('txt2img_lora_subdirs')); }

    /** @return {HTMLElement} */
    get scripts() { return Finder.by(this.id('txt2img_script_container')); }

    /** @return {NodeListOf<HTMLElement>} */
    get scriptEntries() { return Finder.queryAll(`#${this.id('txt2img_script_container')} > div > div`); }

    /** @return {HTMLElement} */
    get civitaiHelper() { return Finder.by(this.id('tab_civitai_helper')); }

    /** @return {string} */
    get civitaiHelperModelSectionId() { return this.id('civitai_helper_model_pain'); }

    /** @return {HTMLElement} */
    get tagSelectorContainer() { return Finder.by(this.id('interactive-tag-selector')); }

    /** @return {HTMLElement} */
    get tagSelectorButton() { return Finder.by(this.id('txt2img_open_tag_selector')); }
  }

  class NewModules {
    /**
     * @param {'txt2img' | 'img2img'} mode
     */
    constructor(mode) {
      this._mode = mode;
    }

    /**
     * @param {string} id
     * @return {string}
     * @private
     */
    id(id) {
      return this._mode === 'txt2img' ? id : id.replace('txt2img', this._mode);
    }

    /** @return {string} */
    get genToolsId() { return this.id('txt2img_new_gen_tools'); }

    /** @return {string} */
    get promptBackupId() { return this.id('txt2img_prompt_backup'); }

    /** @return {string} */
    get seedStepsCfgContainerId() { return this.id('txt2img_seed_steps_cfg_settings'); }

    /** @return {string} */
    get loraCardHoverId() { return this.id('txt2img_lora_card_hover'); }

    /** @return {string} */
    get loraCardRefreshId() { return this.id('txt2img_lora_card_refresh'); }

    /** @return {string} */
    get civitaiHelperBulkDownloadSectionId() { return this.id('civitai_helper_bulk_download_pain'); }

    /** @return {HTMLElement} */
    get genTools() { return Finder.by(this.genToolsId); }

    /** @return {HTMLElement} */
    get promptBackup() { return Finder.by(this.promptBackupId); }

    /** @return {HTMLElement} */
    get seedStepsCfgContainer() { return Finder.by(this.seedStepsCfgContainerId); }

    /** @return {HTMLElement} */
    get loraCardHover() { return Finder.by(this.loraCardHoverId); }

    /** @return {HTMLButtonElement} */ // @ts-ignore
    get loraCardRefresh() { return Finder.by(this.loraCardRefreshId); }
  }

  class Executor {
    /**
     * @param {'txt2img' | 'img2img'} mode
     */
    constructor(mode) {
      this.mode = mode;
      this.modules = new Modules(mode);
      this.newModules = new NewModules(mode);
    }

    exec() {}
  }

  class Txt2ImgTopExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $pain = this.modules.pain;
      const $top = this.modules.genContainer;
      const $settings = this.modules.genSettings;
      const $result = this.modules.results;

      const $left = Helper.div();
      $left.style['flex-grow'] = '1';
      $left.style['max-width'] = '50%';
      $left.appendChild($top);
      $left.appendChild($settings);

      const $right = Helper.div();
      $right.style['flex-grow'] = '1';
      $right.style['max-width'] = '50%';
      $right.appendChild($result);

      const $container = Helper.div();
      $container.style.display = 'flex';
      $container.appendChild($left);
      $container.appendChild($right);

      $pain.appendChild($container);

      Helper.hide(this.modules.extraTabs);
    }
  }

  class Img2ImgTopExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $pain = this.modules.pain;
      const $top = this.modules.genContainer;
      const $settings = this.modules.genSettings;
      const $modes = this.modules.img2imgModes;
      const $result = this.modules.results;

      const $left = Helper.div();
      $left.style['flex-grow'] = '1';
      $left.style['max-width'] = '33%';
      $left.appendChild($top);
      $left.appendChild($settings);

      const $center = Helper.div();
      $center.style['flex-grow'] = '1';
      $center.style['max-width'] = '33%';
      $center.appendChild($modes);

      const $right = Helper.div();
      $right.style['flex-grow'] = '1';
      $right.style['max-width'] = '33%';
      $right.appendChild($result);

      const $container = Helper.div();
      $container.style.display = 'flex';
      $container.appendChild($left);
      $container.appendChild($center);
      $container.appendChild($right);

      $pain.appendChild($container);

      Helper.hide(this.modules.extraTabs);
    }
  }

  class HideToolsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      Helper.hide(this.modules.toolsClearPrompt);
      Helper.hide(this.modules.toolsStyleApply);
      Helper.hide(this.modules.toolsStyleSelect);
    }
  }

  class TabAlignExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const [$txt2img, $img2img, $extra, $pngInfo, $merger, $train, $civitai, $openpose, $networks, $tagEditor, $tagger, $settings, $extensions] = Finder.queryAll('#tabs > div > button');
      const $tabs = {$txt2img, $img2img, $extra, $pngInfo, $merger, $train, $civitai, $openpose, $networks, $tagEditor, $tagger, $settings, $extensions};

      Helper.hide($tabs.$networks);
      // Helper.hide($tabs.$merger);
      Helper.hide($tabs.$extra);

      // XXX 再配置できないので一旦コメントアウト
      // const $container = Finder.query('#tabs > div');
      // $container.appendChild($tabs.$txt2img);
      // $container.appendChild($tabs.$img2img);
      // $container.appendChild($tabs.$civitai);
      // $container.appendChild($tabs.$pngInfo);
      // $container.appendChild($tabs.$openpose);
      // $container.appendChild($tabs.$train);
      // $container.appendChild($tabs.$tagger);
      // $container.appendChild($tabs.$tagEditor);
      // $container.appendChild($tabs.$settings);
      // $container.appendChild($tabs.$extensions);
    }
  }

  class HideFooterExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      Helper.hide(this.modules.footer);
    }
  }

  class AlignSettingsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      this.align();
      this.hide();
    }

    /**
     * @private
     */
    align() {
      const $toolsContainer = this.modules.toolsContainer;
      $toolsContainer.style['min-width'] = null;

      const $sampler = this.modules.sampler;
      const $samplingMethod = Finder.query('div.form', $sampler);
      $samplingMethod.style['min-width'] = null;
      $samplingMethod.style['flex-grow'] = null;
      $sampler.appendChild($toolsContainer);

      const $container = Helper.div();
      $container.id = this.newModules.seedStepsCfgContainerId;
      $container.style.display = 'flex';
      $container.appendChild(this.modules.seedContainer);
      $container.appendChild(this.modules.steps);
      $container.appendChild(this.modules.cfgScale);

      const $settings = this.modules.settings;
      $settings.style['padding-top'] = 'initial';
      $settings.appendChild($container);
      $settings.appendChild(this.modules.hiresFixOrDenoiseStrength); // XXX 互換性が無いUI
      $settings.appendChild(this.modules.refiner);
      $settings.appendChild(this.modules.scripts);

      // XXX 不要な空のセクションが出来るため非表示
      const $emptySection = Finder.query('div.form', this.modules.tools);
      Helper.hide($emptySection);
    }

    /**
     * @private
     */
    hide() {
      Helper.hide(this.modules.seedExtra);
    }
  }

  class AlignTagSelectorExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $overlay = this.makeOverlay();
      this.alignButton();
      this.alignContainer($overlay);
      this.handleOpenClose($overlay);
    }

    /**
     * @private
     */
    makeOverlay() {
      const $overlay = Helper.overlay();
      $overlay.style['overflow-y'] = 'scroll';
      return $overlay;
    }

    /**
     * @private
     */
    alignButton() {
      const $open = this.modules.tagSelectorButton;
      $open.textContent = I18n.t.tagSelector.open;

      this.modules.tools.appendChild($open);
    }

    /**
     * @param {HTMLElement} $overlay
     * @private
     */
    alignContainer($overlay) {
      $overlay.appendChild(this.modules.tagSelectorContainer);
      this.modules.pain.appendChild($overlay);
    }

    /**
     * @param {HTMLElement} $overlay
     * @private
     */
    handleOpenClose($overlay) {
      const $button = this.modules.tagSelectorButton;
      $button.addEventListener('click', () => {
        Helper.shown($overlay, $overlay.style.display !== 'block');
      });
    }
  }

  class Img2ImgHideTools extends Executor {
    /**
     * @override
     */
    exec() {
      Helper.hide(this.modules.img2imgInterrogates);
    }
  }

  class Img2ImgAlignSettingsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $before = this.modules.hiresFixOrDenoiseStrength;
      $before.after(this.modules.img2imgInpaintControls);
      $before.after(this.modules.img2imgResizeMode);
    }
  }

  class Img2ImgNewSettingsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      this.remake(this.modules.img2imgResizeMode);
      this.remake(this.modules.img2imgMaskMode);
      this.remake(this.modules.img2imgMaskedContent);
      this.remake(this.modules.img2imgInpaintArea);
      this.align();
    }

    /**
     * @param {HTMLElement} $container
     * @private
     */
    remake($container) {
      const $radioContainer = Finder.query('div.flex', $container);

      const $select = Helper.select();
      for (const $input of Finder.queryAll('input[type="radio"]', $radioContainer)) {
        /** @type {HTMLInputElement} */ // @ts-ignore
        const $radio = $input;
        const $option = Helper.option($radio.value);
        $option.selected = $radio.checked;
        $select.appendChild($option);
      }

      $select.addEventListener('change', e => {
        /** @type {HTMLSelectElement} */ // @ts-ignore
        const $target = e?.target;
        /** @type {HTMLInputElement} */ // @ts-ignore
        const $radio = Finder.query(`input[type="radio"][value="${$target.value}"]`, $radioContainer);
        $radio.click(); // XXX `checked = true;`だとラジオのみ変化するだけで、実行処理に影響しないためクリック
      });

      $container.appendChild($select);

      Helper.hide($radioContainer);
    }

    /**
     * @private
     */
    align() {
      const $container = Helper.div();
      $container.classList.add('flex', 'row');
      $container.appendChild(this.modules.img2imgMaskMode);
      $container.appendChild(this.modules.img2imgMaskedContent);
      $container.appendChild(this.modules.img2imgInpaintArea);

      const $root = this.modules.img2imgInpaintControls;
      $root.appendChild($container);

      const $barsRoot = Finder.query('div > div', $root);
      $barsRoot.appendChild(this.modules.img2imgInpaintPadding);
    }
  }

  class NewLoraExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $space = this.makeSpace();
      const $contents = this.makeContents();
      const $container = this.makeContainer($space, $contents);
      const $overlay = this.makeOverlay($container);
      // this.handleClose($overlay, $space); XXX 一旦廃止
      this.handleCloseWithEsc($overlay);
      this.handleOpen($overlay);
      this.alignOverlay($overlay);
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    get $$overlay () {
      return Finder.by(`${this.mode}_new_lora`);
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    get $$container() {
      return Finder.query('.lora_container', this.$$overlay);
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    get $$contents() {
      return Finder.query('.lora_contents', this.$$overlay);
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    get $$items() {
      return Finder.query('.lora_items', this.$$overlay);
    }

    /**
     * @return {NodeListOf<HTMLElement>}
     * @private
     */
    get $$itemEntries() {
      return Finder.queryAll('.lora_item', this.$$overlay);
    }

    /**
     * @return {HTMLTextAreaElement}
     * @private
     */
    get $$search() {
      // @ts-ignore
      return Finder.query('.lora_search', this.$$overlay);
    }

    /**
     * @param {HTMLElement} $container
     * @return {HTMLElement}
     * @private
     */
    makeOverlay($container) {
      const $overlay = Helper.overlay();
      $overlay.id = `${this.mode}_new_lora`;
      $overlay.appendChild($container);
      return $overlay;
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    makeSpace() {
      return Helper.div();
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    makeContents() {
      const $items = Helper.div();
      $items.classList.add('lora_items');
      $items.style['overflow-y'] = 'scroll';
      $items.style.width = '50%';

      const $img = Helper.img();
      $img.src = I18n.t.image.notFound;
      $img.style.width = '100%';
      $img.style.height = 'auto';

      const $imgBox = Helper.div();
      $imgBox.style['overflow-y'] = 'auto';
      $imgBox.appendChild($img);
      $imgBox.style.width = '50%';

      for (const $card of Finder.queryAll('.card', this.modules.loraCards)) {
        const $item = this.makeItem($card);
        $item.addEventListener('mouseenter', () => {
          /** @type {HTMLImageElement} */ // @ts-ignore
          const $thumb = Finder.query('img', $item);
          $img.src = $thumb.src;
        });
        $items.appendChild($item);
      }

      const $search = this.makeSearch();
      $search.style['flex-basis'] = '50%';
      const $subDirs = this.makeSubDirs();
      $subDirs.style['flex-basis'] = '30%';
      const $newSort = this.makeNewSort();
      $newSort.style['flex-basis'] = '10%';
      const $refresh  = this.makeRefresh();
      $refresh.style['flex-basis'] = '10%';

      const $top = Helper.div();
      $top.style.display = 'flex';
      $top.style.width = '100%';
      $top.style.padding = '1rem 0';
      $top.appendChild($search);
      $top.appendChild($subDirs);
      $top.appendChild($newSort);
      $top.appendChild($refresh);

      const $bottom = Helper.div();
      $bottom.style.display = 'flex';
      $top.style.width = '100%';
      $bottom.style.height = 'calc(100% - 80px)';
      $bottom.appendChild($items);
      $bottom.appendChild($imgBox);

      const $contents = Helper.div();
      $contents.classList.add('lora_contents');
      $contents.style.width = '100%';
      $contents.style['background'] = 'rgba(0, 0, 0, 0.5)';
      $contents.style['border-radius'] = '0.5rem';
      $contents.appendChild($top);
      $contents.appendChild($bottom);
      return $contents;
    }

    /**
     * @param {HTMLElement} $card
     * @return {HTMLElement}
     * @private
     */
    makeItem($card) {
      /**
       * @param {string} loraName
       * @return {HTMLButtonElement}
       */
      const actionSwap = (loraName) => {
        const $action = Helper.button();
        $action.textContent = I18n.t.lora.swap;
        $action.addEventListener('click', e => {
          e.stopPropagation();
          e.preventDefault();
          /** @type {HTMLTextAreaElement} */ // @ts-ignore
          const $textarea = Finder.query('textarea', this.modules.prompt);
          const pattern = '<([^:]+):([^:]+):([^>]+)>';
          const matches = $textarea.value.match(new RegExp(pattern, 'g')) || [];
          const contains = matches.filter(loraTag => {
            const inMatches = loraTag.match(new RegExp(pattern));
            return inMatches && inMatches[2] === loraName;
          }).length > 0;
          if (!contains && matches.length > 0) {
            const first = matches[0] || '';
            const [, loraType, , loraWeight] = first.match(new RegExp(pattern)) || [];
            $textarea.value = $textarea.value.replace(first, `<${loraType}:${loraName}:${loraWeight}>`);
            updateInput($textarea);
          }
        });

        return $action;
      };

      /**
       * @param {string} searchTerm
       * @return {HTMLButtonElement}
       */
      const actionOpen = (searchTerm) => {
        const $action = Helper.button();
        $action.textContent = I18n.t.lora.open;
        $action.addEventListener('click', e => {
          open_model_url(e, 'lora', searchTerm);
        });

        return $action;
      };

      /**
       * @param {string} searchTerm
       * @return {HTMLButtonElement}
       */
      const actionWords = (searchTerm) => {
        const $action = Helper.button();
        $action.textContent = I18n.t.lora.words;
        $action.addEventListener('click', e => {
          add_trigger_words(e, 'lora', searchTerm);
        });

        return $action;
      };

      /**
       * @param {string} searchTerm
       * @return {HTMLButtonElement}
       */
      const actionExample = (searchTerm) => {
        const $action = Helper.button();
        $action.textContent = I18n.t.lora.example;
        $action.addEventListener('click', e => {
          use_preview_prompt(e, 'lora', searchTerm);
        });

        return $action;
      };

      /** @type {HTMLImageElement | null} */ // @ts-ignore
      const $orgThumb = Finder.findQuery('img', $card);
      const $thumb = Helper.img();
      $thumb.src = $orgThumb ? $orgThumb.src : I18n.t.image.notFound;
      $thumb.style.width = '25px';
      $thumb.style.height = 'auto';

      const $imgBox = Helper.div();
      $imgBox.style['flex-basis'] = '10%';
      // 縦横中心配置
      $imgBox.style.display = 'flex';
      $imgBox.style['justify-content'] = 'center';
      $imgBox.style['align-items'] = 'center';
      $imgBox.appendChild($thumb);

      const $path = Helper.div();
      $path.textContent = Finder.query('.actions > .name', $card).textContent;
      $path.style['text-align'] = 'left';
      $path.style['flex-basis'] = '60%';
      // 縦中心配置
      $path.style.display = 'flex';
      $path.style['align-items'] = 'center';
      // 3点リーダー表示
      $path.style.overflow = 'hidden';
      $path.style['white-space'] = 'nowrap';
      $path.style['text-overflow'] = 'ellipsis';

      // sortPath: '/stable-diffution/models/lora/path/to'
      // sortName: 'lora_name.safetensors'
      const loraDir = ($card.dataset.sortPath || '').split('/').slice(4).join('/');;
      const loraName = ($card.dataset.sortName || '').split('.')[0];
      const loraPath = [loraDir, loraName].join('/');
      const $actions = Helper.div();
      $actions.style['flex-basis'] = '30%';
      $actions.appendChild(actionSwap(loraName));
      $actions.appendChild(actionOpen(loraPath));
      $actions.appendChild(actionWords(loraPath));
      $actions.appendChild(actionExample(loraPath));

      const timeMatches = $thumb.src.match(/mtime=(\d+)/);
      const timestamp = timeMatches ? parseInt(timeMatches[1]) : 0;

      const $item = Helper.div();
      $item.classList.add('lora_item');
      $item.style.display = 'flex';
      $item.style['border-bottom'] = '1px white solid';
      $item.style['margin-bottom'] = '8px';
      $item.dataset.timestamp = `${timestamp}`;
      $item.dataset.search_term = loraPath;
      $item.appendChild($imgBox);
      $item.appendChild($path);
      $item.appendChild($actions);
      $item.addEventListener('click', () => $card.click());
      return $item;
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    makeSearch() {
      const timeoutMS = 300;
      const $search = Helper.textbox();
      $search.style.height = '42px';
      $search.classList.add('lora_search');
      let timerId = -1;
      $search.addEventListener('input', () => {
        if (timerId !== -1) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
          const values = $search.value.toLowerCase().split(' ').filter(str => str.trim().length > 0);
          for (const $item of this.$$itemEntries) {
            const term = ($item.dataset.search_term || '').toLowerCase();
            const visible = values.filter(value => term.indexOf(value) >= 0).length == values.length;
            $item.style.display = visible ? 'flex' : 'none';
          }

          timerId = -1;
        }, timeoutMS);
      });

      return $search;
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    makeSubDirs() {
      const $selectBox = Helper.select();
      for (const $dir of Finder.queryAll('button', this.modules.loraSubDirs)) {
        const $option = Helper.option(($dir.textContent || '').trim());
        $selectBox.appendChild($option);
      }

      $selectBox.addEventListener('change', e => {
        /** @type {HTMLInputElement} */ // @ts-ignore
        const $target = e?.target;
        const $search = this.$$search;
        // XXX かえって面倒なので一旦コメントアウト
        // const words = this.$$search.value.split(' ').filter(str => str.trim().length > 0);
        // $search.value = [...words, $target.value].join(' ');
        $search.value = $target.value;
        updateInput($search);
      });

      return $selectBox;
    }

    /**
     * @returns {HTMLElement}
     * @private
     */
    makeNewSort() {
      const $checkBox = Helper.checkbox();
      $checkBox.addEventListener('change', e => {
        /** @type {HTMLInputElement} */ // @ts-ignore
        const target = e?.target;
        const newest = target.checked;
        /** @type {{timestamp: string, term: string, elem: HTMLElement}[]} */
        const terms = [];
        for (const $item of this.$$itemEntries) {
          const term = $item.dataset.search_term?.toLowerCase() || '';
          terms.push({timestamp: $item.dataset.timestamp || '', term: term, elem: $item});
        }

        terms.sort((a, b) => {
          if (newest) {
            return parseInt(b.timestamp) - parseInt(a.timestamp);
          } else {
            return a.term > b.term ? 1 : -1;
          }
        });

        terms.forEach(term => {
          this.$$items.appendChild(term.elem);
        });
      });

      const $span = Helper.span();
      $span.textContent = I18n.t.lora.newest;

      const $label = Helper.label();
      $label.appendChild($checkBox);
      $label.appendChild($span);
      return $label;
    }

    /**
     * @returns {HTMLElement}
     * @private
     */
    makeRefresh() {
      const beforeRefresh = () => {
        const $newRefresh = this.newModules.loraCardRefresh;
        $newRefresh.disabled = true;
        $newRefresh.classList.add('disabled', 'dark');
        this.modules.extraNetworksRefresh.click();
      }

      /**
       * @returns {Promise<void>}
       */
      const waitUntilRefresh = async () => {
        const $cardsWrap = this.modules.loraCardsWrap;
        let timeout = 0;
        while(timeout < 5000) {
          await Core.sleep(100);

          if ($cardsWrap.classList.contains('hide')) {
            return;
          }

          timeout = timeout + 100;
        }

        console.warn('refresh wait timedout.');
      }

      const $refresh = Helper.button();
      $refresh.id = this.newModules.loraCardRefreshId;
      $refresh.style.margin = '0px'; // XXX
      $refresh.textContent = I18n.t.lora.refresh;
      $refresh.addEventListener('click', async () => {
        beforeRefresh();
        await waitUntilRefresh();

        const $container = this.$$container;
        $container.removeChild(this.$$contents);
        $container.appendChild(this.makeContents());
      });
      return $refresh;
    }

    /**
     * @param {HTMLElement} $space
     * @param {HTMLElement} $contents
     * @return {HTMLElement}
     * @private
     */
    makeContainer($space, $contents) {
      const $container = Helper.div();
      $container.classList.add('lora_container');
      $container.style.display = 'flex';
      $container.style.width = '100%';
      $container.style.height = '100%';
      // $container.appendChild($space); XXX 一旦廃止
      $container.appendChild($contents);
      return $container;
    }

    /**
     * @param {HTMLElement} $overlay
     * @private
     */
    handleOpen($overlay) {
      const $button = Helper.button();
      $button.textContent = '🌐';
      $button.addEventListener('click', () => {
        Helper.shown($overlay, $overlay.style.display !== 'block');
      });

      const $tools = this.modules.tools;
      $tools.appendChild($button);
    }

    /**
     * @param {HTMLElement} $overlay
     * @param {HTMLElement} $space
     * @private
     */
    handleClose($overlay, $space) {
      $space.addEventListener('click', () => Helper.hide($overlay));
    }

    /**
     * @param {HTMLElement} $overlay
     * @private
     */
    handleCloseWithEsc($overlay) {
      // XXX 共通性の高い箇所へ変更を検討
      this.modules.pain.tabIndex = -1;
      this.modules.pain.addEventListener('keydown', e => {
        if (e.key == KeyCodes.Esc) {
          Helper.hide($overlay);
        }
      });
    }

    /**
     * @param {HTMLElement} $overlay
     * @private
     */
    alignOverlay($overlay) {
      this.modules.pain.appendChild($overlay);
    }
  }

  class NewAspectToolExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $2x3Button = Helper.button();
      $2x3Button.textContent = I18n.t.aspectTools.x23;
      $2x3Button.addEventListener('click', this.handle2x3.bind(this));

      const $1x1Button = Helper.button();
      $1x1Button.textContent = I18n.t.aspectTools.x11;
      $1x1Button.addEventListener('click', this.handle1x1.bind(this));

      this.modules.tools.appendChild($2x3Button);
      this.modules.tools.appendChild($1x1Button);
    }

    /**
     * @private
     */
    handle2x3() {
      this.changeAspect([
        '512x768',
        '640x960',
        '768x1152',
        '896x1344',
        '1024x1536',
      ]);
    }

    /**
     * @private
     */
    handle1x1() {
      this.changeAspect([
        '512x512',
        '640x640',
        '768x768',
        '896x896',
        '960x960',
        '1024x1024',
      ]);
    }

    /**
     * @param {string[]} presets
     * @private
     */
    changeAspect(presets) {
      const $w = this.modules.widthSlider;
      const $h = this.modules.heightSlider;
      /** @type {HTMLInputElement} */ // @ts-ignore
      const $wNumber = Finder.query('input[type="number"]',$w);
      /** @type {HTMLInputElement} */ // @ts-ignore
      const $hNumber = Finder.query('input[type="number"]',$h);
      /** @type {HTMLInputElement} */ // @ts-ignore
      const $wRange = Finder.query('input[type="range"]',$w);
      /** @type {HTMLInputElement} */ // @ts-ignore
      const $hRange = Finder.query('input[type="range"]',$h);
      const current = `${$wNumber.value}x${$hNumber.value}`;
      const index = presets.indexOf(current);
      const [w, h] = presets[index === -1 ? 0 : (index + 1) % presets.length].split('x');
      $wNumber.value = w;
      $hNumber.value = h;
      $wRange.value = w;
      $hRange.value = h;
      updateInput($wNumber);
      updateInput($hNumber);
      updateInput($wRange);
      updateInput($hRange);
    }
  }

  class RemakeResultFooterExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $buttons = this.makeButtons();
      const $buttonContainer = this.makeButtonContainer($buttons);
      this.alignButtonContainer($buttonContainer);
      this.hideFooter();
    }

    /**
     * @returns {HTMLButtonElement[]}
     * @private
     */
    makeButtons() {
      return [
        this.makeButton(I18n.t.sendButtons.img2img, this.modules.sendToImg2Img),
        this.makeButton(I18n.t.sendButtons.inpaint, this.modules.sendToInpaint),
      ];
    }

    /**
     * @param {string} icon
     * @param {HTMLElement} $orgButton
     * @returns {HTMLButtonElement}
     * @private
     */
    makeButton(icon, $orgButton) {
      const $button = Helper.button();
      $button.textContent = icon;
      $button.addEventListener('click', () => $orgButton.click());
      return $button
    }

    /**
     * @param {HTMLButtonElement[]} $buttons
     * @returns {HTMLElement}
     * @private
     */
    makeButtonContainer($buttons) {
      const $container = Helper.floatingButtonContainer();
      $container.style.top = '-20px';
      $container.style.right = '40px';
      for (const $button of $buttons) {
        $container.appendChild($button);
      }

      return $container;
    }

    /**
     * @param {HTMLElement} $container
     * @private
     */
    alignButtonContainer($container) {
      const $parent = this.modules.resultImage;
      // XXX 直近影響は無いが、position属性の変更は表示崩れが起きる可能性大
      $parent.style.position = 'relative';
      $parent.appendChild($container);
    }

    /**
     * @private
     */
    hideFooter() {
      Helper.hide(this.modules.resultImageFooter);
    }
  }

  class AlignScriptEntriesExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      this.alignEntries();
      this.hideContainer();
    }

    /**
     * @private
     */
    alignEntries() {
      const $entries = this.modules.scriptEntries;
      // XXX エントリーにidが無いためインデックス参照
      const $contents = {
        adetailer: $entries[1],
        blockWeight: $entries[2],
        script: $entries[3],
        // XXX ControlNetは一旦廃止
        // controlNet: $entries[4],
      };
      const $remains = Array.from($entries).slice(5);
      const targets = {
        adetailer: {
          icon: I18n.t.scripts.adetailer,
          $content: $contents.adetailer,
          $enabler: Finder.query(`#${this.modules.id('script_txt2img_adetailer_ad_enable')} input[type="checkbox"]`, $contents.adetailer),
        },
        blockWeight: {
          icon: I18n.t.scripts.blockWeight,
          $content: $contents.blockWeight,
          $enabler: Finder.query('#lbw_active input[type="checkbox"]', $contents.blockWeight),
        },
        script: {
          icon: I18n.t.scripts.script,
          $content: $contents.script,
          $enabler: Finder.query('input', $contents.script),
        },
        // controlNet: {
        //   icon: I18n.t.scripts.controlNet,
        //   $content: $contents.controlNet,
        //   $enabler: Finder.query('input[type="checkbox"]', $contents.controlNet),
        // },
      };
      const $pain = this.modules.pain;
      /** @type {HTMLButtonElement} */ // @ts-ignore
      const $applyer = Finder.query('#paste', $pain);
      const $buttons = Helper.buttonContainer();
      for (const target of Object.values(targets)) {
        const $overlay = this.makeOverlay(target.$content);
        $pain.appendChild($overlay);

        const $button = this.makeButton(target.icon, $overlay, target.$enabler);
        $buttons.appendChild($button);

        this.handleEnable($button, target.$enabler, $applyer);

        // XXX 余りのエントリーはScript関連のエントリーとして扱う
        if (target.icon == I18n.t.scripts.script) {
          const $bg = Finder.query('div', $overlay);
          for (const $remain of $remains) {
            $bg.appendChild($remain);
          }
        }
      }

      this.modules.sampler.appendChild($buttons);

      // XXX Block Weightの重複エントリーが最後の要素に入るため非表示に設定
      Helper.hide($remains[$remains.length - 1]);
    }

    /**
     * @param {HTMLElement} $content
     * @returns {HTMLElement}
     * @private
     */
    makeOverlay($content) {
      const $overlay = Helper.overlay();
      const $bg = Helper.div();
      $bg.style['background'] = 'rgba(0, 0, 0, 0.5)';
      $bg.style['border-radius'] = '0.5rem';
      $bg.style['overflow-y'] = 'auto';
      $bg.style.padding = '1rem';
      $bg.style.width = '100%';
      $bg.style.height = '100%';
      $bg.appendChild($content);
      $overlay.appendChild($bg);
      return $overlay;
    }

    /**
     * @param {string} icon
     * @param {HTMLElement} $overlay
     * @param {HTMLElement} $enabler
     * @returns {HTMLButtonElement}
     * @private
     */
    makeButton(icon, $overlay, $enabler) {
      const $button = Helper.button();
      $button.textContent = icon;
      $button.addEventListener('click', e => {
        if (e.ctrlKey) {
          if (('type' in $enabler) && $enabler.type === 'checkbox') {
            $enabler.click();
          } else {
            // FIXME Dropdownは外部から操作不能なため一旦非対応
            console.warn(`Not supported dropdown enabler. ${icon}`);
          }
        } else {
          Helper.shown($overlay, $overlay.style.display !== 'block');
        }
      });
      // @see NewLoraExecutor.handleCloseWithEsc
      this.modules.pain.addEventListener('keydown', e => {
        if (e.key == KeyCodes.Esc) {
          Helper.hide($overlay);
        }
      });
      return $button;
    }

    /**
     * @param {HTMLButtonElement} $button
     * @param {HTMLElement} $enabler
     * @param {HTMLButtonElement} $applyer
     * @private
     */
    handleEnable($button, $enabler, $applyer) {
      if (('type' in $enabler) && $enabler.type === 'checkbox') {
        /** @type {HTMLInputElement} */ // @ts-ignore
        const $checkbox = $enabler;
        const handler = () => {
          if ($checkbox.checked) {
            $button.classList.add('text-green-500');
          } else {
            $button.classList.remove('text-green-500');
          }
        };

        if ($checkbox.checked) {
          $button.classList.add('text-green-500');
        }

        $enabler.addEventListener('change', handler);
        // XXX 反映までのタイムラグがあるため一定時間後にハンドラーを呼び出す
        $applyer.addEventListener('click', () => setTimeout(handler, 1000));
      } else {
        /** @type {HTMLSelectElement} */ // @ts-ignore
        const $select = $enabler;
        const handler = () => {
          if ($select.selectedIndex > 0) {
            $button.classList.add('text-green-500');
          } else {
            $button.classList.remove('text-green-500');
          }
        };

        if ($select.selectedIndex > 0) {
          $button.classList.add('text-green-500');
        }

        $enabler.addEventListener('change', handler);
        // XXX 反映までのタイムラグがあるため一定時間後にハンドラーを呼び出す
        $applyer.addEventListener('click', () => setTimeout(handler, 1000));
      }
    }

    /**
     * @private
     */
    hideContainer() {
      Helper.hide(this.modules.scripts);
    }
  }

  class CivitaiHelperAlignToolsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $pain = this.modules.civitaiHelper;
      const $container = Finder.query('div', $pain);
      const [$scan, $info, $model, ...$remains] = Finder.queryAll(`#${$pain.id} > div > div`);

      // @see CivitaiHelperBulkDownloadExecutor
      $model.id = this.modules.civitaiHelperModelSectionId;

      const $left = Helper.div();
      $left.style['flex-grow'] = '1';
      $left.style.width = '50%';
      $left.appendChild($model);
      $left.appendChild($info);
      $left.appendChild($scan);
      for (const $sections of $remains) {
        $left.appendChild($sections);
      }

      const $right = Helper.div();
      $right.id = this.newModules.civitaiHelperBulkDownloadSectionId;
      $right.style['flex-grow'] = '1';
      $right.style.width = '50%';
      $right.classList.add('gr-block', 'gr-box', 'relative', 'w-full', 'border-solid', 'border', 'border-gray-200', 'gr-padded');

      const $row = Helper.div();
      $row.style.display = 'flex';
      $row.appendChild($left);
      $row.appendChild($right);

      $container.appendChild($row);
    }
  }

  class CivitaiHelperBulkDownloadExecutor extends Executor {
    /**
     * @param {'txt2img' | 'img2img'} mode
     */
    constructor(mode) {
      super(mode);
      /** @type {number} */
      this.handleId = 0;
      /** @type {number} */
      this.cancelId = 0;
    }

    /**
     * @override
     */
    exec() {
      const $container = Finder.by(this.newModules.civitaiHelperBulkDownloadSectionId);
      const $table = this.makeTable();
      const $textarea = this.makeTextarea();
      const $buttons = this.makeButtons($table, $textarea);
      const $tools = this.makeTools(Object.values($buttons));
      this.handleKeydown($textarea, $buttons.run, $buttons.apply);
      $container.appendChild($tools);
      $container.appendChild($textarea);
      $container.appendChild($table);
    }

    /**
     * @returns {HTMLTableElement}
     * @private
     */
    makeTable() {
      const $table = Helper.table();
      const $header = Helper.tableHeader();
      const $body = Helper.tableBody();
      const $headerRow = Helper.tableRow();
      $headerRow.appendChild(Helper.tableHeaderCell(I18n.t.civitaiHelper.model.headers.baseUrl));
      $headerRow.appendChild(Helper.tableHeaderCell(I18n.t.civitaiHelper.model.headers.path));
      $headerRow.appendChild(Helper.tableHeaderCell(I18n.t.civitaiHelper.model.headers.subdir));
      $headerRow.appendChild(Helper.tableHeaderCell(I18n.t.civitaiHelper.model.headers.version));
      $headerRow.appendChild(Helper.tableHeaderCell(I18n.t.civitaiHelper.model.headers.status));
      $header.appendChild($headerRow);
      $table.appendChild($header);
      $table.appendChild($body);
      return $table;
    }

    /**
     * @returns {HTMLTextAreaElement}
     * @private
     */
    makeTextarea() {
      const $textarea = Helper.textarea();
      $textarea.style['min-height'] = '250px';
      $textarea.style['width'] = '100%';
      return $textarea;
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {HTMLTextAreaElement} $textarea
     * @returns {{run: HTMLButtonElement, apply: HTMLButtonElement, clear: HTMLButtonElement, restore: HTMLButtonElement, load: HTMLButtonElement}}
     * @private
     */
    makeButtons($table, $textarea) {
      const $runButton = this.makeRunButton($table);
      return {
        run: $runButton,
        apply: this.makeApplyButton($table, $textarea),
        clear: this.makeClearButton($table),
        restore: this.makeRestoreButton($runButton),
        load: this.makeLoadButton($table),
      };
    }

    /**
     * @param {HTMLButtonElement[]} $buttons
     * @returns {HTMLElement}
     * @private
     */
    makeTools($buttons) {
      const $tools = Helper.buttonContainer();
      for (const $button of $buttons) {
        $tools.appendChild($button);
      }
      return $tools;
    }

    /**
     * @param {HTMLTableElement} $table
     * @returns {HTMLButtonElement}
     * @private
     */
    makeRunButton($table) {
      const $button = Helper.button();
      $button.textContent = I18n.t.civitaiHelper.model.actions.run;
      $button.addEventListener('click', async () => {
        if (this.handleId === 0) {
          $button.disabled = true;
          $button.classList.add('disabled', 'dark');

          this.handleId = Math.ceil(Math.random() * 1000000);
          await this.run($table, this.handleId);
          this.handleId = 0;
          this.cancelId = 0;

          $button.disabled = false;
          $button.classList.remove('disabled', 'dark');
        } else {
          console.warn('already bulk downloading!');
        }
      });
      return $button;
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {HTMLTextAreaElement} $textarea
     * @returns {HTMLButtonElement}
     * @private
     */
    makeApplyButton($table, $textarea) {
      const $button = Helper.button();
      $button.textContent = I18n.t.civitaiHelper.model.actions.apply;
      $button.addEventListener('click', () => {
        this.apply($table, $textarea);
      });
      return $button;
    }

    /**
     * @param {HTMLTableElement} $table
     * @returns {HTMLButtonElement}
     * @private
     */
    makeClearButton($table) {
      const $button = Helper.button();
      $button.textContent = I18n.t.civitaiHelper.model.actions.clear;
      $button.addEventListener('click', () => {
        this.clearTable($table);
      });
      return $button;
    }

    /**
     * @param {HTMLButtonElement} $runButton
     * @returns {HTMLButtonElement}
     * @private
     */
    makeRestoreButton($runButton) {
      const $button = Helper.button();
      $button.textContent = I18n.t.civitaiHelper.model.actions.restore;
      $button.addEventListener('click', () => {
        this.cancelId = this.handleId;
        $runButton.disabled = false;
        $runButton.classList.remove('disabled', 'dark');
      });
      return $button;
    }

    /**
     * @param {HTMLTableElement} $table
     * @returns {HTMLButtonElement}
     * @private
     */
    makeLoadButton($table) {
      const $button = Helper.button();
      $button.textContent = I18n.t.civitaiHelper.model.actions.load;
      $button.addEventListener('click', () => {
        this.loadStorage($table);
      });
      return $button;
    }

    /**
     * @param {HTMLTextAreaElement} $textarea
     * @param {HTMLButtonElement} $runButton
     * @param {HTMLButtonElement} $applyButton
     * @private
     */
    handleKeydown($textarea, $runButton, $applyButton) {
      $textarea.addEventListener('keydown', e => {
        if (e.key === KeyCodes.Enter && e.ctrlKey) {
          if ($textarea.value.length === 0) {
            $runButton.click();
          } else {
            $applyButton.click();
          }
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {number} handleId
     * @private
     */
    async run($table, handleId) {
      /**
       * @returns {boolean}
       */
      const aborted = () => {
        return this.cancelId === handleId;
      }

      /**
       * @returns {Promise<boolean>}
       */
      const waitUntilInfoDownload = async () => {
        let timeout = 0;
        while(timeout < 5000 || aborted()) {
          await Core.sleep(100);
          if (aborted()) {
            return false;
          }

          const $wrap = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > div:nth-child(4) div.wrap`);
          if ($wrap.classList.contains('hide')) {
            /** @type {HTMLTextAreaElement} */ // @ts-ignore
            const $name = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > div:nth-child(4) > div textarea`);
            return $name.value.length > 0;
          }
        }

        console.warn('info download timedout.');
        return false;
      }

      /**
       * @returns {Promise<boolean>}
       */
      const waitUntilModelDownload = async () => {
        let timeout = 0;
        while(timeout < 10 * 60 * 1000 || aborted()) {
          await Core.sleep(1000);
          if (aborted()) {
            return false;
          }

          const $elems = Finder.queryAll(`#${this.modules.civitaiHelperModelSectionId} > div > div`); // XXX div:nth-child(5)だと何故か取得できない
          const $wrap = Finder.query('div.wrap', $elems[4]);
          if ($wrap.classList.contains('hide')) {
            return true;
          }

          const $error = $wrap.children[0]; // XXX Finder.query('span.error', $wrap)だと何故か取得できない
          if ($error && $error.classList.contains('error')) {
            return false;
          }
        }

        console.warn('model download timedout.');
        return false;
      }

      /**
       * @param {{baseUrl: string, path: string, subdir: string, version: string, status: string}} model
       * @return {Promise<boolean>}
       */
      const infoDownload = async (model) => {
        const $info = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > div:nth-child(2)`);
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $url = Finder.query('textarea', $info);
        /** @type {HTMLButtonElement} */ // @ts-ignore
        const $button = Finder.query('button', $info);
        $url.value = model.baseUrl;
        updateInput($url);
        await Core.sleep(10); // XXX DOM更新待ちのsleep

        $button.click();
        return await waitUntilInfoDownload();
      }

      /**
       * @param {{baseUrl: string, path: string, subdir: string, version: string, status: string}} model
       * @return {Promise<string>}
       */
      const modelDownload = async (model) => {
        const $model = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > div:nth-child(4)`);
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $subdir = Finder.query('div.form > div:nth-child(5) textarea', $model);
        /** @type {HTMLInputElement} */ // @ts-ignore
        const $version = Finder.query('div.form > div:nth-child(3) input', $model);
        $subdir.value = model.subdir;
        $version.value = model.version;
        updateInput($subdir)
        // FIXME dropdownに対しての操作は無力化されるので無意味
        updateInput($version)
        // FIXME
        await Core.sleep(10); // XXX DOM更新待ちのsleep

        /** @type {HTMLButtonElement} */ // @ts-ignore
        const $button = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > button`);
        $button.click();
        if (!await waitUntilModelDownload()) {
          return I18n.t.civitaiHelper.model.statuses.pending;
        }

        const $elems = Finder.queryAll(`#${this.modules.civitaiHelperModelSectionId} > div > div`); // XXX div:nth-child(5)だと何故か取得できない
        const $status = Finder.query('p', $elems[4]);
        const result = $status.textContent || '';
        if (result.startsWith('Done') && result.endsWith('.pending')) {
          return I18n.t.civitaiHelper.model.statuses.pending;
        } else if (result.startsWith('Done') || result.endsWith('already existed')) {
          return I18n.t.civitaiHelper.model.statuses.complete;
        } else {
          return I18n.t.civitaiHelper.model.statuses.error;
        }
      };

      /**
       * @param {{baseUrl: string, path: string, subdir: string, version: string, status: string}} model
       * @return {Promise<string>}
       */
      const download = async model => {
        if (!await infoDownload(model)) {
          return I18n.t.civitaiHelper.model.statuses.error;
        }

        await Core.sleep(1000); // 対向システムへの負荷軽減

        const result = await modelDownload(model);
        if (result !== I18n.t.civitaiHelper.model.statuses.complete) {
          return result;
        }

        await Core.sleep(5000); // 対向システムへの負荷軽減

        return I18n.t.civitaiHelper.model.statuses.complete;
      };

      while(true) {
        /** @type {NodeListOf<HTMLTableRowElement>} */ // @ts-ignore
        const $rows = Finder.queryAll('tbody > tr', $table);
        /** @type {{$baseUrl: HTMLElement, $path: HTMLElement, $subdir: HTMLSelectElement, $version: HTMLTextAreaElement, $status: HTMLSelectElement} | null} */
        let target = null;
        for (const $row of $rows) {
          const [$baseUrl, $path, $subdir_, $version_, $status_] = $row.cells;
          /** @type {HTMLSelectElement} */ // @ts-ignore
          const $subdir = Finder.query('select', $subdir_);
          /** @type {HTMLTextAreaElement} */ // @ts-ignore
          const $version = Finder.query('textarea', $version_);
          /** @type {HTMLSelectElement} */ // @ts-ignore
          const $status = Finder.query('select', $status_);
          if ($status.value === I18n.t.civitaiHelper.model.statuses.standby) {
            target = {$baseUrl, $path, $subdir, $version, $status};
            break;
          }
        };

        if (!target || aborted()) {
          break;
        }

        const model = {
          baseUrl: target.$baseUrl.textContent || '',
          path: target.$path.textContent || '',
          subdir: target.$subdir.value,
          version: target.$version.value,
          status: target.$status.value,
        };
        Helper.selected(target.$status, I18n.t.civitaiHelper.model.statuses.processing);
        const result = await download(model);
        Helper.selected(target.$status, result);
      }

      console.log(aborted() ? 'bulk download aborted!' : 'bulk download completed!');
    }

    /**
     * @param {HTMLTableElement} $table
     * @private
     */
    clearTable($table) {
      const $body = Finder.query('tbody', $table);
      $body.innerHTML = '';
    }

    /**
     * @param {HTMLTextAreaElement} $textarea
     * @private
     */
    clearTextarea($textarea) {
      $textarea.value = '';
      updateInput($textarea);
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {HTMLTextAreaElement} $textarea
     * @private
     */
    apply($table, $textarea) {
      const lines = ($textarea.value.split('\n') || []).filter(line => line.trim().length);
      let prevSubdir = '';
      for (const line of lines) {
        const [url, orgSubdir, orgVersion] = line.split(' ').filter(value => value.length);
        const subdir = `/${orgSubdir || prevSubdir}`;
        const version = orgVersion || 'latent';
        this.addReserve($table, {url, subdir, version});
        prevSubdir = subdir.substring(1);
      }

      this.clearTextarea($textarea);
      this.saveStorage($table);
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {{url: string, subdir: string, version: string}} model
     * @private
     */
    addReserve($table, model) {
      /**
       * @param {string} initialValue
       * @returns {[boolean, HTMLSelectElement]}
       */
      const makeSubdirSelect = (initialValue) => {
        const $subdirs = Finder.queryAll('button', this.modules.loraSubDirs);
        const $select = Helper.select();
        let selected = false;
        for (const $subdir of $subdirs) {
          const subdir_ = ($subdir.textContent || '').trim().split('/').filter(word => word.length).join('/');
          const subdir = `/${subdir_}`
          if (subdir === '/all') {
            continue;
          }

          const $option = Helper.option(subdir);
          $option.selected = $option.value === initialValue;
          selected = selected || $option.selected;
          $select.options.add($option);
        }

        return [selected, $select];
      }

      const [_, baseUrl, path] = model.url.match(/(https:\/\/civitai.com\/models\/\d+)(.*)/) || [];
      const $baseUrl = Helper.tableCell();
      const $link = Helper.a();
      $link.href = baseUrl || '';
      $link.target = '_blank'
      $link.textContent = $link.href;
      $baseUrl.appendChild($link);

      const $path = Helper.tableCell();
      $path.textContent = path || '';

      const $subdir = Helper.tableCell();
      const [subdirExists, $subdirSelect] = makeSubdirSelect(model.subdir);
      $subdir.appendChild($subdirSelect);

      const $version = Helper.tableCell();
      const $versionText = Helper.textbox();
      $versionText.value = model.version;
      updateInput($versionText);
      $version.appendChild($versionText);

      const $status = Helper.tableCell();
      const $select = Helper.select();
      $select.appendChild(Helper.option(I18n.t.civitaiHelper.model.statuses.standby));
      $select.appendChild(Helper.option(I18n.t.civitaiHelper.model.statuses.processing));
      $select.appendChild(Helper.option(I18n.t.civitaiHelper.model.statuses.complete));
      $select.appendChild(Helper.option(I18n.t.civitaiHelper.model.statuses.pending));
      $select.appendChild(Helper.option(I18n.t.civitaiHelper.model.statuses.error));
      $select.value = baseUrl && subdirExists ? I18n.t.civitaiHelper.model.statuses.standby : I18n.t.civitaiHelper.model.statuses.error;
      $status.appendChild($select);

      const $row = Helper.tableRow();
      $row.appendChild($baseUrl);
      $row.appendChild($path);
      $row.appendChild($subdir);
      $row.appendChild($version);
      $row.appendChild($status);

      const $body = Finder.query('tbody', $table);
      $body.appendChild($row);
    }

    /**
     * @param {HTMLTableElement} $table
     */
    saveStorage($table) {
      /** @type {{url: string, subdir: string, version: string}[]} */
      const items = [];
      for (const $row of $table.rows) {
        const [$baseUrl, $path, $subdir_, $version_, $status_] = $row.cells;
        if ($baseUrl.textContent === I18n.t.civitaiHelper.model.headers.baseUrl) {
          continue;
        }

        /** @type {HTMLSelectElement} */ // @ts-ignore
        const $subdir = Finder.query('select', $subdir_);
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $version = Finder.query('textarea', $version_);
        items.push({
          url: $baseUrl.textContent || '',
          subdir: $subdir.value,
          version: $version.value,
        });
      }

      localStorage.setItem('bulk-download-items', JSON.stringify(items));
    }

    /**
     * @param {HTMLTableElement} $table
     */
    loadStorage($table) {
      const data = localStorage.getItem('bulk-download-items');
      if (data) {
        /** @type {{url: string, subdir: string, version: string}[]} */
        const items = JSON.parse(data);
        for (const item of items) {
          this.addReserve($table, {url: item.url, subdir: item.subdir, version: item.version});
        }
      }
    }
  }

  class NewGenToolsExecutor extends Executor {
    /** @typedef {{$gen: HTMLButtonElement, $stop: HTMLButtonElement, $skip: HTMLButtonElement}} OrgButtons */

    /**
     * @override
     */
    exec() {
      const buttons = {
        $gen: this.modules.genButton,
        $stop: this.modules.stopButton,
        $skip: this.modules.skipButton,
      };
      const $genButton = this.makeNewGen(buttons);
      const $container = Helper.floatingButtonContainer();
      $container.id = this.newModules.genToolsId;
      $container.style.right = '100px';
      $container.style.top = '-12px';
      $container.style['min-width'] = 'min(120px, 100%)';
      $container.appendChild($genButton);
      $container.appendChild(this.makeNewStop(buttons, $genButton));
      $container.appendChild(this.makeNewSkip(buttons, $genButton));

      Helper.leaveButton(buttons.$gen);
      Helper.leaveButton(buttons.$stop);
      Helper.leaveButton(buttons.$skip);

      this.modules.prompt.before($container);
      this.modules.genContainer.classList.remove('svelte-15lo0d8'); // XXX '15lo0d8'はハッシュ値と思われるので再現性は不明
    }

    /**
     * @param {OrgButtons} orgButtons
     * @return {HTMLButtonElement}
     * @private
     */
    makeNewGen(orgButtons) {
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
        } else {
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
     * @private
     */
    makeNewStop(orgButtons, $genButton) {
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
        } else {
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
     * @private
     */
    makeNewSkip(orgButtons, $genButton) {
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
        } else {
          $button.disabled = false;
          $button.classList.remove('disabled', 'dark');
        }
      });

      return $button;
    }
  }

  class NewPromptToolsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $backup = this.makeBackup();
      const $restore = this.makeRestore();
      this.handleDrop();

      const $container = Helper.floatingButtonContainer();
      $container.style.right = '8px';
      $container.style.bottom = '-4px';
      $container.style['min-width'] = 'min(80px, 100%)';
      $container.appendChild(this.modules.toolsPaste);
      $container.appendChild($restore);
      $container.appendChild($backup);

      this.newModules.genTools.after($container);
    }

    /**
     * @private
     */
    makeBackup() {
      const $backup = Helper.div();
      $backup.id = this.newModules.promptBackupId;
      Helper.hide($backup);
      return $backup;
    }

    /**
     * @private
     */
    makeRestore() {
      const $restore = Helper.button();
      $restore.textContent = I18n.t.pngDropBackup.restore;
      $restore.addEventListener('click', () => {
        const $prompt = this.modules.prompt;
        const $backup = this.newModules.promptBackup;
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $textarea = Finder.query('textarea', $prompt);
        $textarea.value = $backup.textContent || '';
        updateInput($textarea);
      });
      return $restore;
    }

    /**
     * @private
     */
    handleDrop() {
      const $prompt = this.modules.prompt;
      $prompt.addEventListener('drop', () => {
        $prompt.dispatchEvent(new Event('prompt:backup'));
      });
      $prompt.addEventListener('prompt:backup', () => {
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $textarea = Finder.query('textarea', $prompt);
        const $backup = this.newModules.promptBackup;
        $backup.textContent = $textarea.value;
      });
    }
  }

  class RemakeSettingTrackbarExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      this.remake(Finder.by(this.modules.id('txt2img_batch_count')), [1, 5, 10, 20, 50, 100]);
      this.remake(Finder.by(this.modules.id('txt2img_steps')), [20, 25, 30, 35]);
      this.remake(Finder.by(this.modules.id('txt2img_hr_scale')), [1, 1.25, 1.5, 1.6, 1.75, 2]);
      this.remake(Finder.by(this.modules.id('txt2img_hires_steps')), [0, 20, 25, 30, 35]);
      this.remake(Finder.by(this.modules.id('txt2img_denoising_strength')), [0.4, 0.5, 0.6, 0.7]);
    }

    /**
     * @param {HTMLElement} $container
     * @param {number[]} values
     * @private
     */
    remake($container, values) {
      /** @type {HTMLInputElement} */ // @ts-ignore
      const $trackbar = Finder.query('input[type="range"]', $container);
      /** @type {HTMLInputElement} */ // @ts-ignore
      const $numeric = Finder.query('input[type="number"]', $container);
      $trackbar.value = String(values[0]);
      $numeric.value = String(values[0]);
      updateInput($trackbar);
      updateInput($numeric);

      const $newTrackbar = Helper.trackbar();
      $newTrackbar.value = String(0);
      $newTrackbar.min = String(0);
      $newTrackbar.max = String(values.length - 1);
      $newTrackbar.step = String(1);
      $newTrackbar.addEventListener('input', () => {
        $trackbar.value = String(values[$newTrackbar.value]);
        $numeric.value = String(values[$newTrackbar.value]);
        updateInput($trackbar);
        updateInput($numeric);
      });

      $container.appendChild($newTrackbar);
      Helper.hide($trackbar);
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

    const txt2imgs = [
      Txt2ImgTopExecutor,
      HideToolsExecutor,
      AlignSettingsExecutor,
      // AlignTagSelectorExecutor,
      NewAspectToolExecutor,
      NewLoraExecutor,
      NewGenToolsExecutor,
      NewPromptToolsExecutor,
      AlignScriptEntriesExecutor,
      RemakeResultFooterExecutor,
      // RemakeSettingTrackbarExecutor,
    ];
    for (const ctor of txt2imgs) {
      new ctor('txt2img').exec();
    }

    const img2imgs = [
      Img2ImgTopExecutor,
      HideToolsExecutor,
      AlignSettingsExecutor,
      // Img2ImgHideTools,
      // Img2ImgAlignSettingsExecutor,
      // Img2ImgNewSettingsExecutor,
      NewAspectToolExecutor,
      NewLoraExecutor,
      NewGenToolsExecutor,
      NewPromptToolsExecutor,
      AlignScriptEntriesExecutor,
      RemakeResultFooterExecutor,
    ];
    for (const ctor of img2imgs) {
      new ctor('img2img').exec();
    }

    const others = [
      // TabAlignExecutor,
      // HideFooterExecutor,
    ];
    for (const ctor of others) {
      new ctor('txt2img').exec();
    }

    const civitaiHelpers = [
      CivitaiHelperAlignToolsExecutor,
      CivitaiHelperBulkDownloadExecutor,
    ];
    for (const ctor of civitaiHelpers) {
      new ctor('txt2img').exec();
    }

    console.log('remake ui successfull!');
  }

  await waitUntilLoaded();
  main();
});
