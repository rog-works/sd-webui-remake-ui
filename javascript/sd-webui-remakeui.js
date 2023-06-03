onUiLoaded(async () => {
  async function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  async function waitUntilLoaded() {
    while(true) {
      console.log('...wait until ui loaded');

      await sleep(100);

      if (gradioApp().getElementById('interactive-tag-selector')) {
        break;
      }
    }

    console.log('ui load completed!');
  }

  function remakeUI() {
    console.log('remake ui start!');

    function alignTop() {
      const txt2img = gradioApp().getElementById('tab_txt2img');
      const top = txt2img.querySelector('div');
      const result = top.querySelector('#txt2img_results');

      const container = document.createElement('div');
      container.className = 'flex row';
      container.appendChild(top);
      container.appendChild(result);

      txt2img.appendChild(container);
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

      const $tools = gradioApp().getElementById('txt2img_tools');
      const $genButton = remakeGen(buttons);
      $tools.appendChild($genButton);
      $tools.appendChild(remakeStop(buttons, $genButton));
      $tools.appendChild(remakeSkip(buttons, $genButton));
      leaveGenButton(buttons.$gen);
      leaveGenButton(buttons.$stop);
      leaveGenButton(buttons.$skip);
    }

    function alignTools() {
      // const genButton = gradioApp().getElementById('txt2img_generate');
      // const stopButton = gradioApp().getElementById('txt2img_interrupt');
      // const skipButton = gradioApp().getElementById('txt2img_skip');
      // genButton.className = 'gr-button gr-button-lg gr-button-tool';
      // genButton.textContent = '▶️️';
      // genButton.style = 'min-height: initial';
      // stopButton.textContent = '❌';
      // stopButton.className = 'gr-button gr-button-lg gr-button-tool';
      // stopButton.style = 'min-height: initial; position: initial; width: initial; height: initial; background: initial; border-radius: 0.5rem;';
      // skipButton.textContent = '➖';
      // skipButton.className = 'gr-button gr-button-lg gr-button-tool';
      // skipButton.style = 'min-height: initial; position: initial; width: initial; height: initial; background: initial; border-radius: 0.5rem;';

      const tagSelectorButton = gradioApp().getElementById('txt2img_open_tag_selector');
      tagSelectorButton.textContent = '🏷';

      const $tools = gradioApp().getElementById('txt2img_tools');
      $tools.appendChild(tagSelectorButton);
      // $tools.appendChild(genButton);
      // $tools.appendChild(stopButton);
      // $tools.appendChild(skipButton);
    }

    function hideTools() {
      gradioApp().getElementById('txt2img_clear_prompt').style.display = 'none';
      gradioApp().getElementById('txt2img_style_apply').style.display = 'none';
      gradioApp().getElementById('txt2img_style_create').style.display = 'none';
      gradioApp().getElementById('txt2img_styles_row').style.display = 'none';
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
      remakeGenTools();
    }

    alignTop();
    alignTools();
    hideTools();
    alignSettings();
    hideSettings();
    alignTagSelector();
    remakeLora();

    console.log('remake ui successfull!');
  }

  await waitUntilLoaded();
  remakeUI();
})
