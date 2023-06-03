// @ts-check

/** @dypedef { import("./types.d.ts").onUiLoaded }.onUiLoaded */

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
  static app() {
    return gradioApp();
  }

  /**
   * @param {string} id
   * @return {HTMLElement}
   */
  static byId(id) {
    const $ = this.app().getElementById(id);
    if (!$) {
      throw Error(`Unknown element by id. id = ${id}`);
    }

    return $;
  }

  /**
   * @param {string} selector
   * @param {HTMLElement | null} elem
   * @return {HTMLElement}
   */
  static byQuery(selector, elem = null) {
    /** @type {HTMLElement | null} */
    let $ = null;
    if (elem) {
      $ = elem.querySelector(selector);
    } else {
      $ = this.app().querySelector(selector);
    }

    if (!$) {
      throw Error(`Unknown element by query. query = ${selector}`);
    }

    return $;
  }

  /**
   * @param {string} selector
   * @param {HTMLElement | null} elem
   * @return {NodeListOf<HTMLElement>}
   */
  static byQueryAll(selector, elem = null) {
    if (elem) {
      return elem.querySelectorAll(selector);
    } else {
      return this.app().querySelectorAll(selector);
    }
  }

  /**
   * @return {HTMLDivElement}
   */
  static div() {
    return document.createElement('div');
  }

  /**
   * @return {HTMLButtonElement}
   */
  static button() {
    const $ = document.createElement('button');
    $.classList.add('gr-button', 'gr-button-lg', 'gr-button-tool');
    return $;
  }

  static iconButton() {}
}

class Texts {
  static t = {
    tagSelector: {
      open: '🏷',
    },
    pngDropBackup: {
      restore: '♻️',
    },
  };
}

class Executor {
  /**
   * @return {void}
   */
  exec() {}
}

class Txt2ImgTopExecutor extends Executor {
  /**
   * @return {void}
   * @override
   */
  exec() {
    const $txt2img = Core.byId('tab_txt2img');
    const $top = Core.byQuery('div', $txt2img);
    const $result = Core.byQuery('#txt2img_results', $top);

    const $container = Core.div();
    $container.className = 'flex row';
    $container.appendChild($top);
    $container.appendChild($result);

    $txt2img?.appendChild($container);
  }
}

class AlignToolsExecutor extends Executor {
  /**
   * @return {void}
   * @override
   */
  exec() {
    const $open = Core.byId('txt2img_open_tag_selector');
    $open.textContent = Texts.t.tagSelector.open;

    const $tools = Core.byId('txt2img_tools');
    $tools.appendChild($open);
  }
}

class HideToolsExecutor extends Executor {
  /**
   * @return {void}
   * @override
   */
  exec() {
    Core.byId('txt2img_clear_prompt').style.display = 'none';
    Core.byId('txt2img_style_apply').style.display = 'none';
    Core.byId('txt2img_style_create').style.display = 'none';
    Core.byId('txt2img_styles_row').style.display = 'none';
  }
}

class PngDropBackupExecutor extends Executor {
  /**
   * @return {void}
   * @override
   */
  exec() {
    const $backup = Core.div();
    $backup.id = 'txt2img_prompt_backup';
    $backup.style.display = 'none';

    const $restore = Core.button();
    $restore.textContent = Texts.t.pngDropBackup.restore;
    $restore.addEventListener('click', () => {
      const $prompt = Core.byId('txt2img_prompt');
      /** @type {HTMLTextAreaElement} */
      const $textarea = Core.byQuery('textarea', $prompt);
      $textarea.value = $backup.textContent || '';
    });

    const $prompt = Core.byId('txt2img_prompt');
    $prompt.addEventListener('drop', () => {
      /** @type {HTMLTextAreaElement} */
      const $textarea = Core.byQuery('textarea', $prompt);
      const $backup = Core.byId('txt2img_prompt_backup');
      $backup.textContent = $textarea.value;
    });

    const $container = Core.div();
    $container.classList.add('flex', 'row', 'flex-wrap', 'gap-1');
    $container.style.position = 'absolute';
    $container.style.right = '0px';
    $container.style.bottom = '-12px';
    $container.style['min-width'] = 'min(40px, 100%)';
    $container.style['z-index'] = 100;
    $container.appendChild($restore);
    $container.appendChild($backup);

    const $genTools = Core.byId('txt2img_new_gen_tools');
    $genTools.after($container);
  }
}

onUiLoaded(async () => {
  /**
   * @return {Promise<void>}
   */
  async function waitUntilLoaded() {
    while(true) {
      console.log('...wait until ui loaded');

      await Core.sleep(100);

      if (gradioApp().getElementById('interactive-tag-selector')) {
        break;
      }
    }

    console.log('ui load completed!');
  }

  /**
   * @return {void}
   */
  function remakeUI() {
    console.log('remake ui start!');

    /**
     * @return {void}
     */
    function alignTop() {
      new Txt2ImgTopExecutor().exec();
    }

    function leaveGenButton($button) {
      $button.textContent = '';
      $button.style.position = 'fixed';
      $button.style.width = 0;
      $button.style.height = 0;
      $button.style.top = 0;
      $button.style.left = 0;
      $button.style.top = 0;
      $button.style.margin = 0;
      $button.style.padding = 0;
      $button.style.border = 0;
      $button.style['min-width'] = 'initial';
      $button.style['min-height'] = 'initial';
      $button.classList.remove('gr-button-primary', 'gr-button-secondary');
    }

    function remakeGenTools() {
      function remakeGen(orgButtons) {
        const $button = document.createElement('button');
        $button.classList.add('gr-button', 'gr-button-lg', 'gr-button-tool');
        $button.textContent = '▶️️';
        $button.addEventListener('click', () => {
          orgButtons.$gen.click();
          $button.disabled = true;
          $button.classList.add('disabled', 'dark');
        });
        const observer = new MutationObserver(records => {;
          for (const record of records) {
            if (record.attributeName === 'style' && /display:\s[^;]+;/.test(record.oldValue)) {
              if (!/display:\snone;/.test(record.oldValue)) {
                $button.disabled = false;
                $button.classList.remove('disabled', 'dark');
              }
              break;
            }
          }
        });
        observer.observe(orgButtons.$stop, {attributes: true, attributeOldValue: true});

        return $button;
      }

      function remakeStop(orgButtons, $genButton) {
        const $button = document.createElement('button');
        $button.classList.add('gr-button', 'gr-button-lg', 'gr-button-tool', 'disabled', 'dark');
        $button.textContent = '️■️';
        $button.disabled = true;
        $button.addEventListener('click', () => {
          orgButtons.$stop.click();
        });
        $genButton.addEventListener('click', () => {
          $button.disabled = false;
          $button.classList.remove('disabled', 'dark');
        });
        const observer = new MutationObserver(records => {;
          for (const record of records) {
            if (record.attributeName === 'style' && /display:\s[^;]+;/.test(record.oldValue)) {
              if (!/display:\snone;/.test(record.oldValue)) {
                $button.disabled = true;
                $button.classList.add('disabled', 'dark');
              }
              break;
            }
          }
        });
        observer.observe(orgButtons.$stop, {attributes: true, attributeOldValue: true});

        return $button;
      }

      function remakeSkip(orgButtons, $genButton) {
        const $button = document.createElement('button');
        $button.classList.add('gr-button', 'gr-button-lg', 'gr-button-tool', 'disabled', 'dark');
        $button.textContent = '➡️';
        $button.disabled = true;
        $button.addEventListener('click', () => {
          orgButtons.$skip.click();
        });
        $genButton.addEventListener('click', () => {
          $button.disabled = false;
          $button.classList.remove('disabled', 'dark');
        });
        const observer = new MutationObserver(records => {;
          for (const record of records) {
            if (record.attributeName === 'style' && /display:\s[^;]+;/.test(record.oldValue)) {
              if (!/display:\snone;/.test(record.oldValue)) {
                $button.disabled = true;
                $button.classList.add('disabled', 'dark');
              }
              break;
            }
          }
        });
        observer.observe(orgButtons.$stop, {attributes: true, attributeOldValue: true});

        return $button;
      }

      const buttons = {
        $gen: gradioApp().getElementById('txt2img_generate'),
        $stop: gradioApp().getElementById('txt2img_interrupt'),
        $skip: gradioApp().getElementById('txt2img_skip'),
      };

      const $genButton = remakeGen(buttons);

      const $container = document.createElement('div');
      $container.id = 'txt2img_new_gen_tools';
      $container.classList.add('flex', 'row', 'flex-wrap', 'gap-1');
      $container.style.position = 'absolute';
      $container.style.right = '100px';
      $container.style.top = '-12px';
      $container.style['min-width'] = 'min(120px, 100%)';
      $container.style['z-index'] = 100;
      $container.appendChild($genButton);
      $container.appendChild(remakeStop(buttons, $genButton));
      $container.appendChild(remakeSkip(buttons, $genButton));

      leaveGenButton(buttons.$gen);
      leaveGenButton(buttons.$stop);
      leaveGenButton(buttons.$skip);

      const $counter = gradioApp().getElementById('txt2img_token_counter');
      $counter.after($container);
    }

    function addPngDropBackup() {
      new PngDropBackupExecutor().exec();
    }

    function alignTools() {
      new AlignToolsExecutor().exec();
    }

    function hideTools() {
      new HideToolsExecutor().exec();
    }

    function alignSettings() {
      const samplerContainer = gradioApp().getElementById('sampler_selection_txt2img');
      const tools = gradioApp().getElementById('txt2img_actions_column');
      samplerContainer.appendChild(tools);

      const step = gradioApp().getElementById('txt2img_steps');
      const seed = gradioApp().getElementById('txt2img_seed');
      const cfg = gradioApp().getElementById('txt2img_cfg_scale');
      const container = document.createElement('div');
      container.id = 'txt2img_seed_step_cfg_settings';
      container.className = 'flex row w-full flex-wrap gap-4';
      container.appendChild(seed);
      container.appendChild(step);
      container.appendChild(cfg);

      const settings = gradioApp().getElementById('txt2img_settings');
      settings.style['padding-top'] = 'initial';
      settings.appendChild(container);
      settings.appendChild(gradioApp().getElementById('txt2img_extra_networks'));
      settings.appendChild(gradioApp().getElementById('txt2img_script_container'));
    }

    function hideSettings() {
      gradioApp().getElementById('txt2img_seed_row').style.display = 'none';
    }

    function alignTagSelector() {
      const $tagSelector = gradioApp().getElementById('interactive-tag-selector');
      gradioApp().getElementById('txt2img_seed_step_cfg_settings').after($tagSelector);
    }

    function remakeLora() {
      const mouse = { x: 0, y: 0 };

      function handleMouse() {
        window.addEventListener('mousemove', (e) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        });
      }

      function imageHover() {
        const $hover = document.createElement('div');
        $hover.id = 'txt2img_lora_card_hover';
        $hover.style.position = 'fixed';
        $hover.style.display = 'none';
        $hover.style['z-index'] = 1000;

        const $image = document.createElement('img');
        $hover.appendChild($image);

        const $container = gradioApp().getElementById('txt2img_lora_cards');
        $container.appendChild($hover);
      }

      function hoverShow($model) {
        const $hover = gradioApp().getElementById('txt2img_lora_card_hover');
        const $image = $hover.querySelector('img');
        $image.src = $model.querySelector('img').src;
        $hover.style.width = '240px';
        $hover.style.display = '';
        $hover.style.left = `${Math.max(0, mouse.x - 240)}px`;
        $hover.style.top = `${Math.max(0, mouse.y - 400)}px`;
      }

      function hoverHide() {
        const $hover = gradioApp().getElementById('txt2img_lora_card_hover');
        $hover.style.display = 'none';
      }

      function cards() {
        function byCard($card) {
          const $img = document.createElement('img');
          const matches = $card.style['background-image'].match(/"(.+)"/);
          $img.src = matches ? matches[1] : './file=html/card-no-preview.png';
          $img.style = 'width: 25px; height: auto;';
          const $imgBox = document.createElement('div');
          $imgBox.style = 'width: 25px; height: auto;';
          $imgBox.appendChild($img);

          const $path = document.createElement('div');
          $path.textContent = $card.querySelector('.actions > .name').textContent;

          const $actions = $card.querySelector('.actions > .additional');

          const timeMatches = $img.src.match(/mtime=(\d+)/);
          const timestamp = timeMatches ? parseInt(timeMatches[1]) : 0;

          const $model = document.createElement('div');
          $model.className = 'flex row w-full gr-button gr-button-primary lora_model';
          $model.dataset.timestamp = timestamp;
          $model.appendChild($imgBox);
          $model.appendChild($path);
          $model.appendChild($actions);
          $model.addEventListener('click', () => { $card.click(); });
          $model.addEventListener('mouseenter', e => { hoverShow(e.target); });
          $model.addEventListener('mouseleave', () => { hoverHide(); });
          return $model;
        }

        const $container = gradioApp().getElementById('txt2img_lora_cards');
        $container.querySelectorAll('.card').forEach($card => {
          const $model = byCard($card);
          $card.style.display = 'none';
          $container.appendChild($model);
        });
      }

      function search() {
        let timerId = -1;
        const $searchText = gradioApp().querySelector('#txt2img_extra_tabs > div > textarea');
        $searchText.addEventListener('input', () => {

          if (timerId !== -1) {
            clearTimeout(timerId);
          }

          timerId = setTimeout(() => {
            const $container = gradioApp().getElementById('txt2img_lora_cards');
            $container.querySelectorAll('.lora_model').forEach($model => {
              const term = $model.querySelector('.search_term').textContent;
              const shown = $searchText.value.length === 0 || term.toLowerCase().indexOf($searchText.value.toLowerCase()) > 0;
              $model.style.display = shown ? '' : 'none';
            });

            timerId = -1;
          }, 100);
        });
      }

      function refresh() {
        const $refreshButton = gradioApp().getElementById('txt2img_extra_close').nextElementSibling;
        $refreshButton.addEventListener('click', () => { remakeLora(); });
      }

      function subDirs() {
        const $selectBox = document.createElement('select');
        $selectBox.className = 'gr-box gr-input';
        $selectBox.addEventListener('change', e => {
          $container.querySelectorAll('button').forEach($dir => {
            if ($dir.textContent === e.target.value) {
              $dir.click();
            }
          });
        });

        const $container = gradioApp().getElementById('txt2img_lora_subdirs');
        $container.querySelectorAll('button').forEach($dir => {
          const $option = document.createElement('option');
          $option.value = $dir.textContent;
          $option.textContent = $dir.textContent;
          $selectBox.appendChild($option);
          $dir.style.display = 'none';
        });

        $container.appendChild($selectBox);
      }

      function sort() {
        const $checkBox = document.createElement('input');
        $checkBox.style.margin = '0px 10px';
        $checkBox.type = 'checkbox';
        $checkBox.className = 'gr-check-radio gr-checkbox';

        const $span = document.createElement('span');
        $span.textContent = '新着順';

        const $label = document.createElement('label');
        $label.appendChild($checkBox);
        $label.appendChild($span);

        const $container = gradioApp().getElementById('txt2img_lora_subdirs');
        $container.appendChild($label);

        $checkBox.addEventListener('change', e => {
          const newest = e.target.checked;
          const $container = gradioApp().getElementById('txt2img_lora_cards');
          const items = [];
          $container.querySelectorAll('.lora_model').forEach($model => {
            const term = $model.querySelector('.search_term').textContent;
            items.push({timestamp: $model.dataset.timestamp, term: term, elem: $model});
          });

          items.sort((a, b) => {
            return newest ? (b.timestamp - a.timestamp) : (a.term.toLowerCase() > b.term.toLowerCase() ? 1 : -1);
          });

          items.forEach(item => {
            $container.appendChild(item.elem);
          });
        });
      }

      handleMouse();
      imageHover();
      cards();
      search();
      refresh();
      subDirs();
      sort();
    }

    alignTop();
    alignTools();
    hideTools();
    alignSettings();
    hideSettings();
    alignTagSelector();
    remakeLora();
    remakeGenTools();
    addPngDropBackup();

    console.log('remake ui successfull!');
  }

  await waitUntilLoaded();
  remakeUI();
})
