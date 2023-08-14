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
      image: {
        notFound: './file=html/card-no-preview.png',
      },
      lora: {
        newest: '新着順',
        refresh: '♻️',
        swap: '🔁',
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
          },
          statuses: {
            standby: 'StandBy',
            processing: 'Processing',
            complete: 'Complete',
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

    /** @return {HTMLElement} */
    get extraNetworksRefresh() { return Finder.by(this.id('txt2img_extra_refresh')); }

    /** @return {HTMLElement} */ // @ts-ignore
    get extraNetworksRefreshCivitai() { return Finder.by(this.id('txt2img_extra_close')).nextElementSibling; }

    /** @return {NodeListOf<HTMLElement>} */
    get extraNetworksTabs() { return Finder.queryAll('div.tabitem', Finder.by(this.id('txt2img_extra_tabs'))); }

    /** @return {HTMLElement} */
    get loraCards() { return Finder.by(this.id('txt2img_lora_cards')); }

    /** @return {HTMLElement} */
    get loraSubDirs() { return Finder.by(this.id('txt2img_lora_subdirs')); }

    /** @return {HTMLElement} */
    get scripts() { return Finder.by(this.id('txt2img_script_container')); }

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
      for (const [index, $orgAction] of $orgActions.entries()) {
        const $action = Helper.button();
        if (index === 0) {
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
              return inMatches && inMatches[2] === $path.textContent;
            }).length > 0;
            if (!contains && matches.length > 0) {
              const first = matches[0] || '';
              const [, loraType, , loraWeight] = first.match(new RegExp(pattern)) || [];
              $textarea.value = $textarea.value.replace(first, `<${loraType}:${$path.textContent}:${loraWeight}>`);
              updateInput($textarea);
            }
          });
        } else {
          $action.textContent = $orgAction.textContent;
          $action.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            $orgAction.click();
          });
        }

        $actions.appendChild($action);
      }

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
        const $tab = this.modules.extraNetworksTabs[0];
        let timeout = 0;
        while(timeout < 5000) {
          await Core.sleep(100);

          const $loading = Finder.query('div > div > div.wrap', $tab);
          if ($loading.classList.contains('opacity-0')) {
            return;
          }

          timeout = timeout + 100;
        }

        console.warn('refresh wait timedout.');
      }

      /**
       * @returns {Promise<void>}
       */
      const postRefresh = async () => {
        this.modules.extraNetworksRefreshCivitai.click();
        await Core.sleep(100);
      }

      const $refresh = Helper.button();
      $refresh.id = this.newModules.loraCardRefreshId;
      $refresh.style.margin = '0px'; // XXX
      $refresh.textContent = I18n.t.lora.refresh;
      $refresh.addEventListener('click', async () => {
        beforeRefresh();
        await waitUntilRefresh();
        await postRefresh();

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
      $left.appendChild($model);
      $left.appendChild($info);
      $left.appendChild($scan);
      for (const $sections of $remains) {
        $left.appendChild($sections);
      }

      const $right = Helper.div();
      $right.id = this.newModules.civitaiHelperBulkDownloadSectionId;
      $right.classList.add('gr-block', 'gr-box', 'relative', 'w-full', 'border-solid', 'border', 'border-gray-200', 'gr-padded');

      const $row = Helper.div();
      $row.classList.add('flex', 'row');
      $row.appendChild($left);
      $row.appendChild($right);

      $container.appendChild($row);
    }
  }

  class CivitaiHelperBulkDownloadExecutor extends Executor {
    /**
     * @override
     */
    exec() {
      const $container = Finder.by(this.newModules.civitaiHelperBulkDownloadSectionId);
      const $table = this.makeTable();
      const $textarea = this.makeTextarea();
      const $tools = this.makeTools($table, $textarea);
      $container.appendChild($tools);
      $container.appendChild($textarea);
      $container.appendChild($table);
    }

    /**
     * @returns {HTMLTableElement}
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
     */
    makeTextarea() {
      const $textarea = Helper.textarea();
      return $textarea;
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {HTMLTextAreaElement} $textarea
     * @returns {HTMLElement}
     */
    makeTools($table, $textarea) {
      const $tools = Helper.buttonContainer();
      const $runButton = this.makeRunButton($table);
      const $applyButton = this.makeApplyButton($table, $textarea);
      const $clearButton = this.makeClearButton($table);
      $tools.appendChild($runButton);
      $tools.appendChild($applyButton);
      $tools.appendChild($clearButton);
      return $tools;
    }

    /**
     * @param {HTMLTableElement} $table
     * @returns {HTMLButtonElement}
     */
    makeRunButton($table) {
      const $button = Helper.button();
      $button.textContent = I18n.t.civitaiHelper.model.actions.run;
      $button.addEventListener('click', async () => {
        $button.disabled = true;
        $button.classList.add('disabled', 'dark');

        await this.run($table);

        $button.disabled = false;
        $button.classList.remove('disabled', 'dark');
      });

      return $button;
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {HTMLTextAreaElement} $textarea
     * @returns {HTMLButtonElement}
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
     * @param {HTMLTableElement} $table
     */
    async run($table) {
      /**
       * @returns {Promise<boolean>}
       */
      const waitUntilInfoDownload = async () => {
        let timeout = 0;
        while(timeout < 5000) {
          await Core.sleep(100);

          const $wrap = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > div:nth-child(4) div.wrap`);
          if ($wrap.classList.contains('opacity-0')) {
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
        while(timeout < 10 * 60 * 1000) {
          await Core.sleep(1000);

          const $elems = Finder.queryAll(`#${this.modules.civitaiHelperModelSectionId} > div > div`); // XXX div:nth-child(5)だと何故か取得できない
          const $wrap = Finder.query('div.wrap', $elems[4]);
          if ($wrap.classList.contains('opacity-0')) {
            return true;
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
       * @return {Promise<boolean>}
       */
      const modelDownload = async (model) => {
        const $model = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > div:nth-child(4)`);
        /** @type {HTMLSelectElement} */ // @ts-ignore
        const $subdir = Finder.query('div:nth-child(2) select', $model);
        /** @type {HTMLSelectElement} */ // @ts-ignore
        const $version = Finder.query('div:nth-child(3) select', $model);
        Helper.selected($subdir, model.subdir);
        Helper.selected($version, model.version === 'latent' ? $version.options[0].value : model.version)
        await Core.sleep(10); // XXX DOM更新待ちのsleep

        /** @type {HTMLButtonElement} */ // @ts-ignore
        const $button = Finder.query(`#${this.modules.civitaiHelperModelSectionId} > div > button`);
        $button.click();
        if (!await waitUntilModelDownload()) {
          return false;
        }

        const $elems = Finder.queryAll(`#${this.modules.civitaiHelperModelSectionId} > div > div`); // XXX div:nth-child(5)だと何故か取得できない
        const $status = Finder.query('p', $elems[4]);
        const result = $status.textContent || '';
        return result.startsWith('Done') || result.endsWith('already existed') || false;
      };

      /**
       * @param {{baseUrl: string, path: string, subdir: string, version: string, status: string}} model
       * @return {Promise<boolean>}
       */
      const download = async model => {
        if (!await infoDownload(model)) {
          return false;
        }

        await Core.sleep(1000); // 対向システムへの負荷軽減

        if (!await modelDownload(model)) {
          return false;
        }

        await Core.sleep(5000); // 対向システムへの負荷軽減

        return true;
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

        if (!target) {
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
        const succeess = await download(model);
        Helper.selected(target.$status, succeess ? I18n.t.civitaiHelper.model.statuses.complete : I18n.t.civitaiHelper.model.statuses.error);
      }

      console.log('bulk download completed!');
    }

    /**
     * @param {HTMLTableElement} $table
     */
    clearTable($table) {
      const $body = Finder.query('tbody', $table);
      $body.innerHTML = '';
    }

    /**
     * @param {HTMLTextAreaElement} $textarea
     */
    clearTextarea($textarea) {
      $textarea.value = '';
      updateInput($textarea);
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {HTMLTextAreaElement} $textarea
     */
    apply($table, $textarea) {
      const lines = ($textarea.value.split('\n') || []).filter(line => line.trim().length);
      let prevSubdir = '';
      for (const line of lines) {
        const [url, orgSubdir, orgVersion] = line.split(' ').filter(value => value.length);
        const subdir = `\\${(orgSubdir || prevSubdir).split('/').filter(word => word.length).join('\\')}`;
        const version = orgVersion || 'latent';
        this.addReserve($table, {url, subdir, version});
        prevSubdir = subdir.split('\\').join('/');
      }

      this.clearTextarea($textarea);
    }

    /**
     * @param {HTMLTableElement} $table
     * @param {{url: string, subdir: string, version: string}} model
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
          const subdir = `\\${($subdir.textContent || '').trim().split('/').filter(word => word.length).join('\\')}`;
          if (subdir === '\\all') {
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
      $baseUrl.textContent = baseUrl || '';

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

    const others = [
      TabAlignExecutor,
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
