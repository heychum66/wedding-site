// SVG figures (a suit and tie, a below-the-knee dress), first drawn for the prototype.
// A data-k can cover several groups: "suit" is trousers + jacket, "shirt" is shirt + tie. Pieces carry class "off" until dressed;
// the component strips it for the server render so the figures rest fully dressed.

export const HIM_SVG = `  <g class="mq">
    <path d="M62 94 Q50 140 46 205 L56 206 Q62 150 68 112 Z"/><path d="M138 94 Q150 140 154 205 L144 206 Q138 150 132 112 Z"/>
    <path d="M60 92 Q100 80 140 92 L136 205 L128 210 L126 392 L104 392 L100 232 L96 392 L74 392 L72 210 L64 205 Z"/>
    <rect x="92" y="68" width="16" height="20"/>
    <circle cx="100" cy="50" r="20"/>
    <circle cx="51" cy="211" r="6"/><circle cx="149" cy="211" r="6"/>
  </g>
  <path d="M81 38 Q100 20 119 38 Q114 30 100 30 Q86 30 81 38 Z" fill="#0B0A0D"/>
  <g class="pc drop off" data-k="suit"><path d="M72 205 L128 205 L126 393 L104 393 L100 236 L96 393 L74 393 Z" fill="#22304F" stroke="#3B4866" stroke-width=".6"/><path d="M86 214 L85 390 M114 214 L115 390" stroke="#2F3E62" stroke-width=".9"/></g>
  <g class="pc drop off" data-k="shirt"><path d="M78 86 L122 86 L118 204 L82 204 Z" fill="#F7F4EE"/><path d="M100 98 V200" stroke="#DCD6CA" stroke-width=".6"/><path d="M88 85 L100 98 L112 85 L108 83 L100 92 L92 83 Z" fill="#FFFFFF" stroke="#D2CABB" stroke-width=".6"/></g>
  <g class="pc drop off" data-k="shirt"><path d="M96.5 92 L103.5 92 L102.5 100 L97.5 100 Z" fill="#0E5A43"/><path d="M97.5 100 L102.5 100 L107 150 L100 158 L93 150 Z" fill="#0E5A43"/><path d="M95 116 L105 110 M94 130 L106 124 M93.5 144 L106.5 138" stroke="#2A8A68" stroke-width="1.3" opacity=".55"/></g>
  <g class="pc swing off" data-k="suit">
    <path d="M60 92 Q48 140 45 200 L57 203 Q62 150 70 110 Z" fill="#22304F" stroke="#3B4866" stroke-width=".6"/>
    <path d="M140 92 Q152 140 155 200 L143 203 Q138 150 130 110 Z" fill="#22304F" stroke="#3B4866" stroke-width=".6"/>
    <path d="M60 92 Q72 86 86 86 L100 166 L114 86 Q128 86 140 92 L137 214 L100 219 L63 214 Z" fill="#22304F" stroke="#3B4866" stroke-width=".6"/>
    <path d="M86 86 L100 166 L93 132 L81 112 L86 106 L79 101 Z" fill="#2C3B60" stroke="#3B4866" stroke-width=".5"/><path d="M114 86 L100 166 L107 132 L119 112 L114 106 L121 101 Z" fill="#2C3B60" stroke="#3B4866" stroke-width=".5"/>
    <circle cx="100" cy="176" r="2.2" fill="#3B4866"/><circle cx="100" cy="192" r="2.2" fill="#3B4866"/>
    <path d="M70 168 L88 168 M112 168 L130 168" stroke="#3B4866" stroke-width=".8"/>
  </g>
  <g class="pc rise off" data-k="shoes"><path d="M70 393 Q84 389 99 393 L99 400 L70 400 Q68 396 70 393 Z" fill="#1B1412"/><path d="M101 393 Q116 389 130 393 Q132 396 130 400 L101 400 Z" fill="#1B1412"/><path d="M75 394 Q83 392 90 394 M110 394 Q117 392 125 394" stroke="#8A7A70" stroke-width=".8" opacity=".7"/></g>
  <path class="glint" d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z" transform="translate(150 80)"/>
  <path class="glint" d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z" transform="translate(52 150)"/>
  <path class="glint" d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" transform="translate(132 300)"/>`;

export const HER_SVG = `  <g class="mq">
    <path d="M66 94 Q54 140 52 200 L60 201 Q64 150 74 112 Z"/><path d="M134 94 Q146 140 148 200 L140 201 Q136 150 126 112 Z"/>
    <path d="M66 92 Q100 84 134 92 Q132 130 120 168 Q130 200 126 215 L118 392 L104 392 L100 250 L96 392 L82 392 L74 215 Q70 200 80 168 Q68 130 66 92 Z"/>
    <rect x="94" y="67" width="12" height="20"/>
    <circle cx="100" cy="50" r="19"/>
    <circle cx="56" cy="205" r="5.5"/><circle cx="144" cy="205" r="5.5"/>
  </g>
  <path d="M81 48 Q82 26 100 26 Q120 26 119 48 Q116 34 100 34 Q86 34 81 48 Z" fill="#0B0A0D"/><circle cx="116" cy="32" r="9" fill="#0B0A0D"/>
  <defs><linearGradient id="dressG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A8A68"/><stop offset=".55" stop-color="#0E5A43"/><stop offset="1" stop-color="#073326"/></linearGradient></defs>
  <g class="pc rise off" data-k="heels"><path d="M80 390 Q89 386 98 390 L98 396 L84 396 L82.5 401 L80.5 401 Z" fill="#B08D3E"/><path d="M102 390 Q111 386 120 390 L120 401 L118 401 L116.5 396 L102 396 Z" fill="#B08D3E"/></g>
  <g class="pc drop off" data-k="dress"><path d="M71 96 Q86 108 100 108 Q114 108 129 96 Q128 132 119 168 Q133 240 143 322 Q100 334 57 322 Q67 240 81 168 Q72 132 71 96 Z" fill="url(#dressG)"/><path d="M81 168 Q100 175 119 168" stroke="#BFE6D5" stroke-width=".9" opacity=".5" fill="none"/><path d="M100 176 Q101 250 99 328 M89 190 Q82 260 72 322 M111 190 Q119 260 128 322" stroke="#BFE6D5" stroke-width=".6" opacity=".35" fill="none"/></g>
  <g class="pc pop off" data-k="jewelry"><path d="M89 80 Q100 93 111 80" stroke="#B08D3E" stroke-width="1.2" fill="none"/><circle cx="100" cy="90" r="3" fill="#1E4FB0" stroke="#B08D3E" stroke-width=".8"/><path d="M82 56 V64 M118 56 V64" stroke="#B08D3E" stroke-width=".8"/><circle cx="82" cy="66" r="2.2" fill="#1E4FB0"/><circle cx="118" cy="66" r="2.2" fill="#1E4FB0"/></g>
  <path class="glint" d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z" transform="translate(124 86)"/>
  <path class="glint" d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z" transform="translate(62 260)"/>
  <path class="glint" d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" transform="translate(140 340)"/>`;
