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
     * @return {HTMLTextAreaElement}
     */
    static textarea() {
      const $ = document.createElement('textarea');
      $.classList.add('scroll-hide', 'block', 'gr-box', 'gr-input', 'w-full', 'gr-text-input');
      $.placeholder = '';
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
    static hide($) {
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
        refresh: '♻️',
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
      return Finder.exists('interactive-tag-selector');
    }

    /**
     * @param {string} id
     * @return {string}
     * @access private
     */
    id(id) {
      return this._mode === 'txt2img' ? id : id.replace('txt2img', this._mode);
    }

    /** @return {HTMLElement} */
    get pain() { return Finder.by(this.id('tab_txt2img')); }

    /** @return {HTMLElement} */
    get prompt() { return Finder.by(this.id('txt2img_prompt')); }

    /** @return {HTMLElement} */
    get results() { return Finder.by(this.id('txt2img_results')); }

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
    get toolsStyleCreate() { return Finder.by(this.id('txt2img_style_create')); }

    /** @return {HTMLElement} */
    get sampler() { return Finder.by(this.id('sampler_selection_txt2img')); }

    /** @return {HTMLElement} */
    get steps() { return Finder.by(this.id('txt2img_steps')); }

    /** @return {HTMLElement} */
    get seedContainer() { return Finder.by(this.id('txt2img_seed_row')); }

    /** @return {HTMLElement} */
    get seedExtra() { return Finder.by(this.id('txt2img_subseed_show_box')); }

    /** @return {HTMLElement} */
    get cfgScale() { return Finder.by(this.id('txt2img_cfg_scale')); }

    /** @return {HTMLElement} */
    get settings() { return Finder.by(this.id('txt2img_settings')); }

    /** @return {HTMLElement} @access private */
    get hiresFix() { return Finder.by('txt2img_hires_fix'); }

    /** @return {HTMLElement} @access private */
    get img2imgDenoiseStrength() { return Finder.by('img2img_denoising_strength'); }

    /** @return {HTMLElement} */
    get hiresFixOrDenoiseStrength() { return this._mode === 'txt2img' ? this.hiresFix : this.img2imgDenoiseStrength; } // XXX 互換性が無いUI

    /** @return {HTMLElement} */
    get extraNetworks() { return Finder.by(this.id('txt2img_extra_networks')); }

    /** @return {HTMLElement} */ // @ts-ignore
    get extraNetworksRefresh() { return Finder.by(this.id('txt2img_extra_close')).nextElementSibling; }

    /** @return {HTMLTextAreaElement} */ // @ts-ignore
    get extraNetworksSearchText() { return Finder.query(this.id('#txt2img_extra_tabs > div > textarea')); }

    /** @return {HTMLElement} */
    get loraCards() { return Finder.by(this.id('txt2img_lora_cards')); }

    /** @return {HTMLElement} */
    get loraSubDirs() { return Finder.by(this.id('txt2img_lora_subdirs')); }

    /** @return {HTMLElement} */
    get scripts() { return Finder.by(this.id('txt2img_script_container')); }

    /** @return {HTMLElement} */
    get civitaiHelper() { return Finder.by(this.id('tab_civitai_helper')); }

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
     * @access private
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

    /** @return {HTMLElement} */
    get genTools() { return Finder.by(this.genToolsId); }

    /** @return {HTMLElement} */
    get promptBackup() { return Finder.by(this.promptBackupId); }

    /** @return {HTMLElement} */
    get seedStepsCfgContainer() { return Finder.by(this.seedStepsCfgContainerId); }

    /** @return {HTMLElement} */
    get loraCardHover() { return Finder.by(this.loraCardHoverId); }
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
      const $top = Finder.query('div', $pain);
      const $result = this.modules.results;

      const $container = Helper.div();
      $container.classList.add('flex', 'row');
      $container.appendChild($top);
      $container.appendChild($result);

      $pain.appendChild($container);
    }
  }

  class Img2ImgTopExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $pain = this.modules.pain;
      const $top = Finder.query('div', $pain);

      const $modes = this.modules.img2imgModes;
      const $result = this.modules.results;

      const $container = Helper.div();
      $container.classList.add('flex', 'row');
      $container.appendChild($top);
      $container.appendChild($modes);
      $container.appendChild($result);

      $pain.appendChild($container);
    }
  }

  class HideToolsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      Helper.hide(this.modules.toolsClearPrompt);
      Helper.hide(this.modules.toolsStyleApply);
      Helper.hide(this.modules.toolsStyleCreate);
      Helper.hide(this.modules.toolsStyleSelect);
    }
  }

  class AlignSettingsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $toolsContainer = this.modules.toolsContainer;
      this.modules.sampler.appendChild($toolsContainer);

      const $container = Helper.div();
      $container.id = this.newModules.seedStepsCfgContainerId;
      $container.classList.add('flex', 'row', 'w-full', 'flex-wrap', 'gap-4');
      $container.appendChild(this.modules.seedContainer);
      $container.appendChild(this.modules.steps);
      $container.appendChild(this.modules.cfgScale);

      const $settings = this.modules.settings;
      $settings.style['padding-top'] = 'initial';
      $settings.appendChild($container);
      $settings.appendChild(this.modules.hiresFixOrDenoiseStrength); // XXX 互換性が無いUI
      $settings.appendChild(this.modules.extraNetworks);
      $settings.appendChild(this.modules.scripts);
    }
  }

  class HideSettingsExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      Helper.hide(this.modules.seedExtra);
    }
  }

  class AlignTagSelectorExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      this.alignOpen();
      this.alignContainer();
    }

    /**
     * @access private
     */
    alignOpen() {
      const $open = this.modules.tagSelectorButton;
      $open.textContent = I18n.t.tagSelector.open;

      this.modules.tools.appendChild($open);
    }

    /**
     * @access private
     */
    alignContainer() {
      this.modules.hiresFix.after(this.modules.tagSelectorContainer);
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
     * @access private
     */
    remake($container) {
      const $radioContainer = Finder.query('div.flex', $container);

      const $select = Helper.select();
      for (const $input of Finder.queryAll('input[type="radio"]', $radioContainer)) {
        /** @type {HTMLInputElement} */ // @ts-ignore
        const $radio = $input;
        const $option = Helper.option();
        $option.value = $radio.value;
        $option.textContent = $radio.value;
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
     * @access private
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
      this.handleClose($overlay, $space);
      this.handleOpen($overlay);
      this.alignOverlay($overlay);
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    get $$overlay () {
      return Finder.by(`${this.mode}_new_lora`);
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    get $$container() {
      return Finder.query('.lora_container', this.$$overlay);
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    get $$contents() {
      return Finder.query('.lora_contents', this.$$overlay);
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    get $$items() {
      return Finder.query('.lora_items', this.$$overlay);
    }

    /**
     * @return {NodeListOf<HTMLElement>}
     * @access private
     */
    get $$itemEntries() {
      return Finder.queryAll('.lora_item', this.$$overlay);
    }

    /**
     * @return {HTMLTextAreaElement}
     * @access private
     */
    get $$search() {
      // @ts-ignore
      return Finder.query('.lora_search', this.$$overlay);
    }

    /**
     * @param {HTMLElement} $container
     * @return {HTMLElement}
     * @access private
     */
    makeOverlay($container) {
      const $overlay = Helper.div();
      $overlay.id = `${this.mode}_new_lora`;
      $overlay.style.position = 'fixed';
      $overlay.style.width = '100%';
      $overlay.style.height = '100%';
      $overlay.style.left = '0';
      $overlay.style.top = '0';
      $overlay.style.margin = '0';
      $overlay.style.padding = '0';
      $overlay.style.border = '0';
      $overlay.style['min-width'] = 'initial';
      $overlay.style['min-height'] = 'initial';
      $overlay.style['z-index'] = 1001;
      $overlay.style.display = 'none';
      $overlay.appendChild($container);
      return $overlay;
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    makeSpace() {
      return Helper.div();
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    makeContents() {
      const $items = Helper.div();
      $items.classList.add('lora_items');
      $items.style['overflow-y'] = 'scroll';

      const $img = Helper.img();
      $img.src = I18n.t.image.notFound;
      $img.style.width = '100%';
      $img.style.height = 'auto';

      const $imgBox = Helper.div();
      $imgBox.appendChild($img);

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
      $top.classList.add('flex', 'row');
      $top.style.padding = '1rem 0';
      $top.appendChild($search);
      $top.appendChild($subDirs);
      $top.appendChild($newSort);
      $top.appendChild($refresh);

      const $bottom = Helper.div();
      $bottom.classList.add('flex', 'row');
      $bottom.style['min-height'] = 'calc(100% - 100px)';
      $bottom.appendChild($items);
      $bottom.appendChild($imgBox);

      const $contents = Helper.div();
      $contents.classList.add('flex', 'flex-col', 'p-4', 'm-2', 'border', 'lora_contents');
      $contents.style['background'] = 'rgba(0, 0, 0, 0.5)';
      $contents.style['border-radius'] = '0.5rem';
      $contents.appendChild($top);
      $contents.appendChild($bottom);
      return $contents;
    }

    /**
     * @param {HTMLElement} $card
     * @return {HTMLElement}
     * @access private
     */
    makeItem($card) {
      const $thumb = Helper.img();
      const matches = $card.style['background-image'].match(/"(.+)"/);
      $thumb.src = matches ? matches[1] : I18n.t.image.notFound;
      $thumb.style.width = '25px';
      $thumb.style.height = 'auto';

      const $imgBox = Helper.div();
      $imgBox.style['flex-basis'] = '10%';
      $imgBox.appendChild($thumb);

      const $path = Helper.div();
      $path.textContent = Finder.query('.actions > .name', $card).textContent;
      $path.style['text-align'] = 'left';
      $path.style['flex-basis'] = '60%';

      const $actions = Helper.div();
      $actions.style['flex-basis'] = '30%';

      const $orgActions = Finder.queryAll('.actions > .additional > ul > a', $card);
      $orgActions.forEach(($orgAction) => {
        const $action = Helper.button();
        $action.textContent = $orgAction.textContent;
        $action.addEventListener('click', e => {
          e.stopPropagation();
          e.preventDefault();
          $orgAction.click();
        });
        $actions.appendChild($action);
      });

      const timeMatches = $thumb.src.match(/mtime=(\d+)/);
      const timestamp = timeMatches ? parseInt(timeMatches[1]) : 0;

      const $searchTerm = Finder.query('.actions > .additional > .search_term', $card);
      const $item = Helper.div();
      $item.classList.add('flex', 'lora_item');
      $item.dataset.timestamp = `${timestamp}`;
      $item.dataset.search_term = $searchTerm.textContent || '';
      $item.appendChild($imgBox);
      $item.appendChild($path);
      $item.appendChild($actions);
      $item.addEventListener('click', () => $card.click());
      return $item;
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    makeSearch() {
      const timeoutMS = 300;
      const $search = Helper.textarea();
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
            const visible = values.filter(value => term.indexOf(value) > 0).length == values.length;
            $item.style.display = visible ? '' : 'none';
          }

          timerId = -1;
        }, timeoutMS);
      });

      return $search;
    }

    /**
     * @return {HTMLElement}
     * @access private
     */
    makeSubDirs() {
      const $selectBox = Helper.select();
      for (const $dir of Finder.queryAll('button', this.modules.loraSubDirs)) {
        const $option = Helper.option();
        $option.value = ($dir.textContent || '').trim();
        $option.textContent = $option.value;
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
     * @access private
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
     * @access private
     */
    makeRefresh() {
      const $refresh = Helper.button();
      $refresh.style.margin = '0px'; // XXX
      $refresh.textContent = I18n.t.lora.refresh;
      $refresh.addEventListener('click', () => {
        const $container = this.$$container;
        $container.removeChild(this.$$contents);
        $container.appendChild(this.makeContents());
      });
      return $refresh;
    }

    /**
     * @param {HTMLElement} $contents
     * @param {HTMLElement} $space
     * @return {HTMLElement}
     * @access private
     */
    makeContainer($space, $contents) {
      const $container = Helper.div();
      $container.classList.add('flex', 'row', 'lora_container');
      $container.style.width = '100%';
      $container.style.height = '100%';
      $container.appendChild($space);
      $container.appendChild($contents);
      return $container;
    }

    /**
     * @param {HTMLElement} $overlay
     * @access private
     */
    handleOpen($overlay) {
      const $button = Helper.button();
      $button.textContent = '🌐';
      $button.addEventListener('click', () => {
        $overlay.style.display = 'block';
      });

      const $tools = this.modules.tools;
      $tools.appendChild($button);
    }

    /**
     * @param {HTMLElement} $overlay
     * @param {HTMLElement} $space
     * @access private
     */
    handleClose($overlay, $space) {
      $space.addEventListener('click', () => Helper.hide($overlay));
    }

    /**
     * @param {HTMLElement} $overlay
     * @access private
     */
    alignOverlay($overlay) {
      const $tabs = Finder.by('tabs');
      $tabs.appendChild($overlay);
    }
  }

  class NewAspectToolExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $button = Helper.button();
      $button.textContent = '2:3';
      $button.addEventListener('click', () => {
        const presets = [
          '512x768',
          '640x960',
          '768x1152',
          '896x1344',
          '1024x1536',
        ];
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
      });

      this.modules.tools.appendChild($button);
    }
  }

  class CivitaiHelperAlignTools extends Executor {
    /**
     * @override
     */
    exec() {
      const $pain = this.modules.civitaiHelper;
      const $container = Finder.query('div', $pain);
      const [$scan, $info, $model, $bulkScan, ..._] = Finder.queryAll(`#${$pain.id} > div > div`);

      const $row1 = Helper.div();
      $row1.classList.add('flex', 'row');
      $row1.appendChild($model);
      $row1.appendChild($info);

      const $row2 = Helper.div();
      $row2.classList.add('flex', 'row');
      $row2.appendChild($scan);
      $row2.appendChild($bulkScan);

      $pain.appendChild($row1);
      $pain.appendChild($row2);
      $pain.appendChild($container);
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

      this.modules.tokenCounter.after($container);
    }

    /**
     * @param {OrgButtons} orgButtons
     * @return {HTMLButtonElement}
     * @access private
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
     * @access private
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
     * @access private
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
     * @access private
     */
    makeBackup() {
      const $backup = Helper.div();
      $backup.id = this.newModules.promptBackupId;
      Helper.hide($backup);
      return $backup;
    }

    /**
     * @access private
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
     * @access private
     */
    handleDrop() {
      const $prompt = this.modules.prompt;
      $prompt.addEventListener('drop', () => {
        /** @type {HTMLTextAreaElement} */ // @ts-ignore
        const $textarea = Finder.query('textarea', $prompt);
        const $backup = this.newModules.promptBackup;
        $backup.textContent = $textarea.value;
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

    const txt2imgs = [
      Txt2ImgTopExecutor,
      HideToolsExecutor,
      AlignSettingsExecutor,
      HideSettingsExecutor,
      AlignTagSelectorExecutor,
      NewAspectToolExecutor,
      NewLoraExecutor,
      NewGenToolsExecutor,
      NewPromptToolsExecutor,
    ];
    for (const ctor of txt2imgs) {
      new ctor('txt2img').exec();
    }

    const img2imgs = [
      Img2ImgTopExecutor,
      HideToolsExecutor,
      AlignSettingsExecutor,
      HideSettingsExecutor,
      Img2ImgHideTools,
      Img2ImgAlignSettingsExecutor,
      Img2ImgNewSettingsExecutor,
      NewAspectToolExecutor,
      NewLoraExecutor,
      NewGenToolsExecutor,
      NewPromptToolsExecutor,
    ];
    for (const ctor of img2imgs) {
      new ctor('img2img').exec();
    }

    const civitaiHelpers = [
      CivitaiHelperAlignTools,
    ];
    for (const ctor of civitaiHelpers) {
      new ctor('img2img').exec();
    }

    console.log('remake ui successfull!');
  }

  await waitUntilLoaded();
  main();
});
