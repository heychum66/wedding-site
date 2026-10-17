// SVG figures ported exactly from the prototype. Pieces carry class "off" until dressed;
// the component strips it for the server render so the figures rest fully dressed.

export const HIM_SVG = `  <g class="mq">
    <path d="M62 94 Q50 140 46 205 L56 206 Q62 150 68 112 Z"/><path d="M138 94 Q150 140 154 205 L144 206 Q138 150 132 112 Z"/>
    <path d="M60 92 Q100 80 140 92 L136 205 L128 210 L126 392 L104 392 L100 232 L96 392 L74 392 L72 210 L64 205 Z"/>
    <rect x="92" y="68" width="16" height="20"/>
    <circle cx="100" cy="50" r="20"/>
    <circle cx="51" cy="211" r="6"/><circle cx="149" cy="211" r="6"/>
  </g>
  <path d="M81 38 Q100 20 119 38 Q114 30 100 30 Q86 30 81 38 Z" fill="#0B0A0D"/>
  <g class="pc drop off" data-k="trousers"><path d="M72 205 L128 205 L126 393 L104 393 L100 236 L96 393 L74 393 Z" fill="#111015" stroke="#3A3640" stroke-width=".6"/><path d="M75 212 L77 390 M125 212 L123 390" stroke="#4A4552" stroke-width="2"/></g>
  <g class="pc drop off" data-k="shirt"><path d="M78 86 L122 86 L118 204 L82 204 Z" fill="#F3EEE4"/><path d="M100 96 V200" stroke="#D9D2C4" stroke-width=".6"/><circle cx="100" cy="122" r="1.4" fill="#222"/><circle cx="100" cy="142" r="1.4" fill="#222"/></g>
  <g class="pc swing off" data-k="jacket">
    <path d="M60 92 Q48 140 45 200 L57 203 Q62 150 70 110 Z" fill="#0A090C" stroke="#3A3640" stroke-width=".6"/>
    <path d="M140 92 Q152 140 155 200 L143 203 Q138 150 130 110 Z" fill="#0A090C" stroke="#3A3640" stroke-width=".6"/>
    <path d="M60 92 Q72 86 86 86 L100 162 L114 86 Q128 86 140 92 L137 214 L100 219 L63 214 Z" fill="#0A090C" stroke="#3A3640" stroke-width=".6"/>
    <path d="M86 86 L100 162 L92 130 L79 104 Z" fill="#2A2731"/><path d="M114 86 L100 162 L108 130 L121 104 Z" fill="#2A2731"/>
    <circle cx="100" cy="178" r="2.4" fill="#2A2731"/>
  </g>
  <g class="pc pop off" data-k="bowtie"><path d="M88 85 L100 91 L88 97 Z M112 85 L100 91 L112 97 Z" fill="#050506" stroke="#CDAE6A" stroke-width=".5"/><circle cx="100" cy="91" r="2.6" fill="#050506" stroke="#CDAE6A" stroke-width=".5"/></g>
  <g class="pc pop off" data-k="square"><path d="M119 120 L131 120 L126 111 L123 115 Z" fill="#0E5A43"/></g>
  <g class="pc rise off" data-k="shoes"><ellipse cx="85" cy="397" rx="15" ry="5.5" fill="#050506" stroke="#4A4552" stroke-width=".6"/><ellipse cx="115" cy="397" rx="15" ry="5.5" fill="#050506" stroke="#4A4552" stroke-width=".6"/><path d="M76 395 Q82 393 88 395 M106 395 Q112 393 118 395" stroke="#9AA7C4" stroke-width=".8" opacity=".7"/></g>
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
  <defs><linearGradient id="gownG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A8A68"/><stop offset=".55" stop-color="#0E5A43"/><stop offset="1" stop-color="#073326"/></linearGradient></defs>
  <g class="pc drop off" data-k="gown"><path d="M70 96 Q100 106 130 96 Q128 132 119 168 Q127 214 152 404 Q100 416 48 404 Q73 214 81 168 Q72 132 70 96 Z" fill="url(#gownG)"/><path d="M100 172 Q102 290 96 410 M88 200 Q80 300 66 404 M112 200 Q122 300 136 404" stroke="#BFE6D5" stroke-width=".6" opacity=".35" fill="none"/></g>
  <g class="pc pop off" data-k="jewelry"><path d="M89 80 Q100 93 111 80" stroke="#B08D3E" stroke-width="1.2" fill="none"/><circle cx="100" cy="90" r="3" fill="#1E4FB0" stroke="#B08D3E" stroke-width=".8"/><path d="M82 56 V64 M118 56 V64" stroke="#B08D3E" stroke-width=".8"/><circle cx="82" cy="66" r="2.2" fill="#1E4FB0"/><circle cx="118" cy="66" r="2.2" fill="#1E4FB0"/></g>
  <g class="pc swing off" data-k="wrap"><path d="M58 122 Q100 150 142 122 L148 172 Q100 198 52 172 Z" fill="#FFFFFF" fill-opacity=".55" stroke="#B08D3E" stroke-opacity=".7" stroke-width=".7"/></g>
  <g class="pc pop off" data-k="clutch"><rect x="141" y="198" width="24" height="15" rx="2" fill="#CDAE6A" stroke="#FFF3D1" stroke-width=".5"/><path d="M141 203 H165" stroke="#7A5E26" stroke-width=".6"/></g>
  <path class="glint" d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z" transform="translate(124 86)"/>
  <path class="glint" d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z" transform="translate(62 260)"/>
  <path class="glint" d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" transform="translate(140 340)"/>`;
