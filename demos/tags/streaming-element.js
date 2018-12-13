// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';

customElements.define('streaming-element', class StreamingElement extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowRoot.appendChild(document.createElement('slot'));
    this.reset();
  }

  reset() {
    this.innerHTML = '';

    let mo;
    const iframeReady = new Promise(resolve => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      this._shadowRoot.appendChild(iframe);

      iframe.onload = () => {
        iframe.onload = null;
        iframe.contentDocument.write('<streaming-element-inner>');

        const inner = iframe.contentDocument.querySelector('streaming-element-inner');
        mo = new MutationObserver(mutations => {
          for (const mutation of mutations) {
            for(const node of mutation.addedNodes) {
              this.appendChild(node);
            }
          }
        });

        mo.observe(inner, { childList: true });
        resolve(iframe);
      };
      iframe.src = '';
    });

    async function end() {
      const iframe = await iframeReady;
      iframe.contentDocument.write('</streaming-element-inner>');
      iframe.contentDocument.close();
      iframe.remove();
      mo.disconnect();
    }

    this.writable = new WritableStream({
      async write(chunk) {
        const iframe = await iframeReady;
        iframe.contentDocument.write(chunk);
      },
      close: end,
      abort: end
    });
  }
});
