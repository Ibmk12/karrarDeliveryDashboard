<template>
  <div class="login-page" :class="{ 'is-paused': bgPaused }">
    <!-- Brand panel: the UAE map; KD vans and motorbikes leave the Ajman warehouse for each emirate, one by one; then the slogan and facts -->
    <div class="login-bg kl-panel">
      <div class="kl-top">
        <img class="kl-logo" src="@/assets/img/karrar-logo-light.png" alt="" />
        <span class="kl-name">{{ $tt('Karrar Delivery') }}</span>
      </div>

      <svg ref="bgSvg" class="km-map" viewBox="25 20 545 395" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="kmClip"><path d="M30.8 225.5 L55.0 247.5 L88.0 253.0 L143.0 231.0 L187.0 236.5 L231.0 242.0 L286.0 236.5 L319.0 225.5 L341.0 203.5 L363.0 176.0 L390.5 148.5 L418.0 134.2 L440.0 113.3 L453.2 103.4 L464.2 95.7 L475.2 81.4 L495.0 66.0 L511.5 52.8 L520.3 35.2 L525.8 26.4 L534.6 49.5 L536.8 74.8 L547.8 77.0 L556.6 110.0 L557.7 145.2 L544.5 159.5 L522.5 159.5 L511.5 187.0 L498.3 225.5 L489.5 253.0 L467.5 275.0 L451.0 319.0 L429.0 352.0 L407.0 404.8 L319.0 396.0 L209.0 385.0 L143.0 369.6 L77.0 297.0 L33.0 253.0 Z" /></clipPath>
          <radialGradient id="kmHalo"><stop offset="0" stop-color="#f57c00" stop-opacity=".38" /><stop offset="1" stop-color="#f57c00" stop-opacity="0" /></radialGradient>
          <radialGradient id="kmGlow"><stop offset="0" stop-color="#f57c00" stop-opacity=".32" /><stop offset="1" stop-color="#f57c00" stop-opacity="0" /></radialGradient>
        </defs>
        <!-- the UAE, a survey grid inside, the emirate borders -->
        <path class="km-land" d="M30.8 225.5 L55.0 247.5 L88.0 253.0 L143.0 231.0 L187.0 236.5 L231.0 242.0 L286.0 236.5 L319.0 225.5 L341.0 203.5 L363.0 176.0 L390.5 148.5 L418.0 134.2 L440.0 113.3 L453.2 103.4 L464.2 95.7 L475.2 81.4 L495.0 66.0 L511.5 52.8 L520.3 35.2 L525.8 26.4 L534.6 49.5 L536.8 74.8 L547.8 77.0 L556.6 110.0 L557.7 145.2 L544.5 159.5 L522.5 159.5 L511.5 187.0 L498.3 225.5 L489.5 253.0 L467.5 275.0 L451.0 319.0 L429.0 352.0 L407.0 404.8 L319.0 396.0 L209.0 385.0 L143.0 369.6 L77.0 297.0 L33.0 253.0 Z" />
        <g class="km-grid" clip-path="url(#kmClip)"><path d="M20 0 V420" /><path d="M42 0 V420" /><path d="M64 0 V420" /><path d="M86 0 V420" /><path d="M108 0 V420" /><path d="M130 0 V420" /><path d="M152 0 V420" /><path d="M174 0 V420" /><path d="M196 0 V420" /><path d="M218 0 V420" /><path d="M240 0 V420" /><path d="M262 0 V420" /><path d="M284 0 V420" /><path d="M306 0 V420" /><path d="M328 0 V420" /><path d="M350 0 V420" /><path d="M372 0 V420" /><path d="M394 0 V420" /><path d="M416 0 V420" /><path d="M438 0 V420" /><path d="M460 0 V420" /><path d="M482 0 V420" /><path d="M504 0 V420" /><path d="M526 0 V420" /><path d="M548 0 V420" /><path d="M570 0 V420" /><path d="M592 0 V420" /><path d="M0 10 H600" /><path d="M0 32 H600" /><path d="M0 54 H600" /><path d="M0 76 H600" /><path d="M0 98 H600" /><path d="M0 120 H600" /><path d="M0 142 H600" /><path d="M0 164 H600" /><path d="M0 186 H600" /><path d="M0 208 H600" /><path d="M0 230 H600" /><path d="M0 252 H600" /><path d="M0 274 H600" /><path d="M0 296 H600" /><path d="M0 318 H600" /><path d="M0 340 H600" /><path d="M0 362 H600" /><path d="M0 384 H600" /><path d="M0 406 H600" /></g>
        <!-- each emirate warms up once it has been reached -->
        <g clip-path="url(#kmClip)">
          <circle class="km-glow is-0" cx="275.0" cy="294.8" r="34" />
          <circle class="km-glow is-1" cx="453.2" cy="148.5" r="34" />
          <circle class="km-glow is-2" cx="497.2" cy="129.8" r="34" />
          <circle class="km-glow is-3" cx="465.3" cy="103.4" r="34" />
          <circle class="km-glow is-4" cx="487.3" cy="91.3" r="34" />
          <circle class="km-glow is-5" cx="517.0" cy="69.3" r="34" />
          <circle class="km-glow is-6" cx="544.5" cy="116.6" r="34" />
        </g>
        <path class="km-emirates" clip-path="url(#kmClip)" d="M401.5 146.3 L423.5 165.0 L456.5 181.5 L489.5 184.8 L511.5 187.0 M447.7 107.8 L454.3 123.2 L467.5 143.0 L481.8 159.5 L495.0 170.5 L522.5 159.5 M456.5 97.9 L464.2 105.6 L473.0 106.7 M465.3 94.6 L475.2 101.2 L473.0 106.7 M475.2 101.2 L495.0 101.2 L501.6 93.5 M477.4 79.2 L495.0 88.0 L501.6 93.5 M501.6 93.5 L522.5 90.2 L539.0 77.0 M539.0 77.0 L528.0 104.5 L530.2 132.0 L544.5 158.4" />
        <path class="km-border" pathLength="1" d="M30.8 225.5 L55.0 247.5 L88.0 253.0 L143.0 231.0 L187.0 236.5 L231.0 242.0 L286.0 236.5 L319.0 225.5 L341.0 203.5 L363.0 176.0 L390.5 148.5 L418.0 134.2 L440.0 113.3 L453.2 103.4 L464.2 95.7 L475.2 81.4 L495.0 66.0 L511.5 52.8 L520.3 35.2 L525.8 26.4 L534.6 49.5 L536.8 74.8 L547.8 77.0 L556.6 110.0 L557.7 145.2 L544.5 159.5 L522.5 159.5 L511.5 187.0 L498.3 225.5 L489.5 253.0 L467.5 275.0 L451.0 319.0 L429.0 352.0 L407.0 404.8 L319.0 396.0 L209.0 385.0 L143.0 369.6 L77.0 297.0 L33.0 253.0 Z" />
        <!-- routes from the warehouse, kept inside the country -->
        <g clip-path="url(#kmClip)">
          <path id="kmR0" class="km-route is-0" pathLength="1" d="M390.5 231.0 C 380.4 237.4, 349.3 258.9, 330.0 269.5 C 310.7 280.1, 284.2 290.6, 275.0 294.8" />
          <path id="kmR1" class="km-route is-1" pathLength="1" d="M390.5 231.0 C 394.2 224.6, 404.3 203.5, 412.5 192.5 C 420.7 181.5, 433.2 172.3, 440.0 165.0 C 446.8 157.7, 451.0 151.3, 453.2 148.5" />
          <path id="kmR2" class="km-route is-2" pathLength="1" d="M390.5 231.0 C 397.8 225.5, 420.8 209.9, 434.5 198.0 C 448.3 186.1, 462.6 170.9, 473.0 159.5 C 483.5 148.1, 493.2 134.7, 497.2 129.8" />
          <path id="kmR3" class="km-route is-3" pathLength="1" d="M390.5 231.0 C 396.0 223.7, 413.4 202.6, 423.5 187.0 C 433.6 171.4, 444.0 151.4, 451.0 137.5 C 458.0 123.6, 462.9 109.1, 465.3 103.4" />
          <path id="kmR4" class="km-route is-4" pathLength="1" d="M390.5 231.0 C 398.8 223.7, 426.2 203.5, 440.0 187.0 C 453.8 170.5, 465.1 147.9, 473.0 132.0 C 480.9 116.0, 484.9 98.1, 487.3 91.3" />
          <path id="kmR5" class="km-route is-5" pathLength="1" d="M390.5 231.0 C 400.6 224.6, 432.7 210.8, 451.0 192.5 C 469.3 174.2, 489.5 141.5, 500.5 121.0 C 511.5 100.5, 514.3 77.9, 517.0 69.3" />
          <path id="kmR6" class="km-route is-6" pathLength="1" d="M390.5 231.0 C 401.5 226.4, 436.3 217.3, 456.5 203.5 C 476.7 189.8, 496.8 163.0, 511.5 148.5 C 526.2 134.0, 539.0 121.9, 544.5 116.6" />
          <path class="km-head is-0" pathLength="1" d="M390.5 231.0 C 380.4 237.4, 349.3 258.9, 330.0 269.5 C 310.7 280.1, 284.2 290.6, 275.0 294.8" />
          <path class="km-head is-1" pathLength="1" d="M390.5 231.0 C 394.2 224.6, 404.3 203.5, 412.5 192.5 C 420.7 181.5, 433.2 172.3, 440.0 165.0 C 446.8 157.7, 451.0 151.3, 453.2 148.5" />
          <path class="km-head is-2" pathLength="1" d="M390.5 231.0 C 397.8 225.5, 420.8 209.9, 434.5 198.0 C 448.3 186.1, 462.6 170.9, 473.0 159.5 C 483.5 148.1, 493.2 134.7, 497.2 129.8" />
          <path class="km-head is-3" pathLength="1" d="M390.5 231.0 C 396.0 223.7, 413.4 202.6, 423.5 187.0 C 433.6 171.4, 444.0 151.4, 451.0 137.5 C 458.0 123.6, 462.9 109.1, 465.3 103.4" />
          <path class="km-head is-4" pathLength="1" d="M390.5 231.0 C 398.8 223.7, 426.2 203.5, 440.0 187.0 C 453.8 170.5, 465.1 147.9, 473.0 132.0 C 480.9 116.0, 484.9 98.1, 487.3 91.3" />
          <path class="km-head is-5" pathLength="1" d="M390.5 231.0 C 400.6 224.6, 432.7 210.8, 451.0 192.5 C 469.3 174.2, 489.5 141.5, 500.5 121.0 C 511.5 100.5, 514.3 77.9, 517.0 69.3" />
          <path class="km-head is-6" pathLength="1" d="M390.5 231.0 C 401.5 226.4, 436.3 217.3, 456.5 203.5 C 476.7 189.8, 496.8 163.0, 511.5 148.5 C 526.2 134.0, 539.0 121.9, 544.5 116.6" />
        </g>
        <!-- the emirates -->
        <g class="km-stop is-0">
          <circle class="km-ring" cx="275.0" cy="294.8" r="4" />
          <circle class="km-dot" cx="275.0" cy="294.8" r="3.4" />
          <text class="" x="275.0" y="286.8" text-anchor="middle">{{ $tt('Abu Dhabi') }}</text>
        </g>
        <g class="km-stop is-1">
          <circle class="km-ring" cx="453.2" cy="148.5" r="4" />
          <circle class="km-dot" cx="453.2" cy="148.5" r="3.4" />
          <text class="" x="453.2" y="140.5" text-anchor="middle">{{ $tt('Dubai') }}</text>
        </g>
        <g class="km-stop is-2">
          <circle class="km-ring" cx="497.2" cy="129.8" r="4" />
          <circle class="km-dot" cx="497.2" cy="129.8" r="3.4" />
          <text class="" x="497.2" y="121.8" text-anchor="middle">{{ $tt('Sharjah') }}</text>
        </g>
        <g class="km-stop is-3">
          <circle class="km-ring" cx="465.3" cy="103.4" r="4" />
          <circle class="km-dot" cx="465.3" cy="103.4" r="3.4" />
          <text class="is-small" x="465.3" y="95.4" text-anchor="middle">{{ $tt('Ajman') }}</text>
        </g>
        <g class="km-stop is-4">
          <circle class="km-ring" cx="487.3" cy="91.3" r="4" />
          <circle class="km-dot" cx="487.3" cy="91.3" r="3.4" />
          <text class="is-small" x="487.3" y="83.3" text-anchor="middle">{{ $tt('Umm Al Quwain') }}</text>
        </g>
        <g class="km-stop is-5">
          <circle class="km-ring" cx="517.0" cy="69.3" r="4" />
          <circle class="km-dot" cx="517.0" cy="69.3" r="3.4" />
          <text class="" x="517.0" y="61.3" text-anchor="middle">{{ $tt('Ras Al Khaimah') }}</text>
        </g>
        <g class="km-stop is-6">
          <circle class="km-ring" cx="544.5" cy="116.6" r="4" />
          <circle class="km-dot" cx="544.5" cy="116.6" r="3.4" />
          <text class="" x="544.5" y="108.6" text-anchor="middle">{{ $tt('Fujairah') }}</text>
        </g>
        <g class="km-drop is-0"><rect x="-3.5" y="-3.5" width="7" height="6" rx="1.2" /><path d="M0 -3.5 V2.5" /></g>
        <g class="km-drop is-1"><rect x="-3.5" y="-3.5" width="7" height="6" rx="1.2" /><path d="M0 -3.5 V2.5" /></g>
        <g class="km-drop is-2"><rect x="-3.5" y="-3.5" width="7" height="6" rx="1.2" /><path d="M0 -3.5 V2.5" /></g>
        <g class="km-drop is-3"><rect x="-3.5" y="-3.5" width="7" height="6" rx="1.2" /><path d="M0 -3.5 V2.5" /></g>
        <g class="km-drop is-4"><rect x="-3.5" y="-3.5" width="7" height="6" rx="1.2" /><path d="M0 -3.5 V2.5" /></g>
        <g class="km-drop is-5"><rect x="-3.5" y="-3.5" width="7" height="6" rx="1.2" /><path d="M0 -3.5 V2.5" /></g>
        <g class="km-drop is-6"><rect x="-3.5" y="-3.5" width="7" height="6" rx="1.2" /><path d="M0 -3.5 V2.5" /></g>
        <!-- KD vans and motorbikes: out together a moment apart, a parcel left at each emirate, back to the warehouse -->
        <g class="km-veh is-0" opacity="0">
          <g class="km-bob"><g class="km-icon is-0"><path class="km-body" d="M-15 -3 V-12 Q-15 -14 -13 -14 H5 L12 -8.5 H14 Q15.5 -8.5 15.5 -7 V-3 Z" /><rect class="km-panel" x="-12.5" y="-12.5" width="16" height="7.5" rx="1.2" /><image class="km-logo is-0" :href="logoDark" x="-11.5" y="-12" width="14" height="6.5" /><circle class="km-wheel" cx="-9" cy="-2" r="2.6" /><circle class="km-wheel" cx="9" cy="-2" r="2.6" /></g></g>
          <animateMotion dur="12s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0;1;1;0;0" keyTimes="0;0.0667;0.3000;0.3667;0.5833;1" keySplines="0 0 1 1;0.45 0 0.4 1;0 0 1 1;0.45 0 0.4 1;0 0 1 1"><mpath href="#kmR0" xlink:href="#kmR0" /></animateMotion>
        </g>
        <g class="km-veh is-1" opacity="0">
          <g class="km-bob"><g class="km-icon is-1"><path class="km-body" d="M-7 -3 L-3 -7 H3 L6 -9 H8 L9 -5 L7 -3 Z" /><path class="km-rider" d="M0 -7 L1.5 -12.5 L5 -10.5" /><circle class="km-helmet" cx="2.8" cy="-14.5" r="2" /><rect class="km-box" x="-11.5" y="-13" width="8" height="7" rx="1.2" /><image class="km-logo is-1" :href="logoLight" x="-11" y="-11.2" width="7" height="3.4" /><circle class="km-wheel" cx="-6" cy="-1.8" r="2.2" /><circle class="km-wheel" cx="7.5" cy="-1.8" r="2.2" /></g></g>
          <animateMotion dur="12s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0;1;1;0;0" keyTimes="0;0.0917;0.3250;0.3917;0.6083;1" keySplines="0 0 1 1;0.45 0 0.4 1;0 0 1 1;0.45 0 0.4 1;0 0 1 1"><mpath href="#kmR1" xlink:href="#kmR1" /></animateMotion>
        </g>
        <g class="km-veh is-2" opacity="0">
          <g class="km-bob"><g class="km-icon is-2"><path class="km-body" d="M-15 -3 V-12 Q-15 -14 -13 -14 H5 L12 -8.5 H14 Q15.5 -8.5 15.5 -7 V-3 Z" /><rect class="km-panel" x="-12.5" y="-12.5" width="16" height="7.5" rx="1.2" /><image class="km-logo is-2" :href="logoDark" x="-11.5" y="-12" width="14" height="6.5" /><circle class="km-wheel" cx="-9" cy="-2" r="2.6" /><circle class="km-wheel" cx="9" cy="-2" r="2.6" /></g></g>
          <animateMotion dur="12s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0;1;1;0;0" keyTimes="0;0.1167;0.3500;0.4167;0.6333;1" keySplines="0 0 1 1;0.45 0 0.4 1;0 0 1 1;0.45 0 0.4 1;0 0 1 1"><mpath href="#kmR2" xlink:href="#kmR2" /></animateMotion>
        </g>
        <g class="km-veh is-3" opacity="0">
          <g class="km-bob"><g class="km-icon is-3"><path class="km-body" d="M-7 -3 L-3 -7 H3 L6 -9 H8 L9 -5 L7 -3 Z" /><path class="km-rider" d="M0 -7 L1.5 -12.5 L5 -10.5" /><circle class="km-helmet" cx="2.8" cy="-14.5" r="2" /><rect class="km-box" x="-11.5" y="-13" width="8" height="7" rx="1.2" /><image class="km-logo is-3" :href="logoLight" x="-11" y="-11.2" width="7" height="3.4" /><circle class="km-wheel" cx="-6" cy="-1.8" r="2.2" /><circle class="km-wheel" cx="7.5" cy="-1.8" r="2.2" /></g></g>
          <animateMotion dur="12s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0;1;1;0;0" keyTimes="0;0.1417;0.3750;0.4417;0.6583;1" keySplines="0 0 1 1;0.45 0 0.4 1;0 0 1 1;0.45 0 0.4 1;0 0 1 1"><mpath href="#kmR3" xlink:href="#kmR3" /></animateMotion>
        </g>
        <g class="km-veh is-4" opacity="0">
          <g class="km-bob"><g class="km-icon is-4"><path class="km-body" d="M-15 -3 V-12 Q-15 -14 -13 -14 H5 L12 -8.5 H14 Q15.5 -8.5 15.5 -7 V-3 Z" /><rect class="km-panel" x="-12.5" y="-12.5" width="16" height="7.5" rx="1.2" /><image class="km-logo is-4" :href="logoDark" x="-11.5" y="-12" width="14" height="6.5" /><circle class="km-wheel" cx="-9" cy="-2" r="2.6" /><circle class="km-wheel" cx="9" cy="-2" r="2.6" /></g></g>
          <animateMotion dur="12s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0;1;1;0;0" keyTimes="0;0.1667;0.4000;0.4667;0.6833;1" keySplines="0 0 1 1;0.45 0 0.4 1;0 0 1 1;0.45 0 0.4 1;0 0 1 1"><mpath href="#kmR4" xlink:href="#kmR4" /></animateMotion>
        </g>
        <g class="km-veh is-5" opacity="0">
          <g class="km-bob"><g class="km-icon is-5"><path class="km-body" d="M-7 -3 L-3 -7 H3 L6 -9 H8 L9 -5 L7 -3 Z" /><path class="km-rider" d="M0 -7 L1.5 -12.5 L5 -10.5" /><circle class="km-helmet" cx="2.8" cy="-14.5" r="2" /><rect class="km-box" x="-11.5" y="-13" width="8" height="7" rx="1.2" /><image class="km-logo is-5" :href="logoLight" x="-11" y="-11.2" width="7" height="3.4" /><circle class="km-wheel" cx="-6" cy="-1.8" r="2.2" /><circle class="km-wheel" cx="7.5" cy="-1.8" r="2.2" /></g></g>
          <animateMotion dur="12s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0;1;1;0;0" keyTimes="0;0.1917;0.4250;0.4917;0.7083;1" keySplines="0 0 1 1;0.45 0 0.4 1;0 0 1 1;0.45 0 0.4 1;0 0 1 1"><mpath href="#kmR5" xlink:href="#kmR5" /></animateMotion>
        </g>
        <g class="km-veh is-6" opacity="0">
          <g class="km-bob"><g class="km-icon is-6"><path class="km-body" d="M-15 -3 V-12 Q-15 -14 -13 -14 H5 L12 -8.5 H14 Q15.5 -8.5 15.5 -7 V-3 Z" /><rect class="km-panel" x="-12.5" y="-12.5" width="16" height="7.5" rx="1.2" /><image class="km-logo is-6" :href="logoDark" x="-11.5" y="-12" width="14" height="6.5" /><circle class="km-wheel" cx="-9" cy="-2" r="2.6" /><circle class="km-wheel" cx="9" cy="-2" r="2.6" /></g></g>
          <animateMotion dur="12s" repeatCount="indefinite" calcMode="spline" keyPoints="0;0;1;1;0;0" keyTimes="0;0.2167;0.4500;0.5167;0.7333;1" keySplines="0 0 1 1;0.45 0 0.4 1;0 0 1 1;0.45 0 0.4 1;0 0 1 1"><mpath href="#kmR6" xlink:href="#kmR6" /></animateMotion>
        </g>
        <!-- the KD warehouse in the centre of the country -->
        <g class="km-wh" transform="translate(390.5 231.0)">
          <circle r="30" fill="url(#kmHalo)" />
          <circle class="km-wh-pulse" r="12" />
          <circle class="km-wh-depart" r="12" />
          <path class="km-wh-roof" d="M-15 -6 L0 -15 L15 -6 Z" />
          <rect class="km-wh-body" x="-13.5" y="-6" width="27" height="15" rx="1.5" />
          <rect class="km-wh-sign" x="-9.5" y="-4.5" width="19" height="7" rx="1.2" />
          <image :href="logoDark" x="-8" y="-4.2" width="16" height="6.4" />
          <rect class="km-wh-door" x="-5" y="3.5" width="10" height="5.5" />
          <text class="km-wh-label" x="0" y="23" text-anchor="middle">{{ $tt('KD warehouse') }}</text>
        </g>
      </svg>

      <!-- live count of emirates reached in this round -->
      <p class="km-count" aria-hidden="true">
        <span class="km-count-n">{{ kmReached }}</span><span class="km-count-of">/ 7</span>
        <span class="km-count-label">{{ $tt('emirates reached') }}</span>
        <span class="km-count-bar"><i :style="{ width: (kmReached / 7) * 100 + '%' }"></i></span>
      </p>

      <div class="kl-copy">
        <h2 class="kl-slogan">{{ $tt('Your partner in success') }}</h2>
        <p class="kl-lead">{{ $tt('Deliveries to every emirate, tracked from the trader to the customer’s door.') }}</p>
        <ul class="kl-facts">
          <li><md-icon>place</md-icon><span>{{ $tt('All seven emirates') }}</span></li>
          <li><md-icon>timeline</md-icon><span>{{ $tt('Live status for every order') }}</span></li>
        </ul>
      </div>

      <p class="kl-legal">{{ $tt('Karrar for delivery services') }}</p>
    </div>

    <!-- language + theme, available before signing in -->
    <div class="login-tools">
      <button
        type="button"
        class="k-theme-btn"
        :aria-label="$tt($theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')"
        :title="$tt($theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')"
        @click="$toggleTheme()"
      >
        <transition name="k-theme-icon" mode="out-in">
          <md-icon :key="$theme">{{ $theme === 'dark' ? 'light_mode' : 'dark_mode' }}</md-icon>
        </transition>
      </button>
      <k-lang-toggle></k-lang-toggle>
    </div>

    <form class="action" @submit.prevent>
      <div class="login-card">
        <div class="login-brand">
          <span class="k-logo-fx">
            <img src="@/assets/img/karrar-logo-transparent.png" alt="KD" class="login-logo" />
          </span>
          <h1 class="login-title">
            {{ rememberedName ? $tt('Welcome back, {name}', { name: rememberedName }) : $tt('Welcome back') }}
          </h1>
          <p class="login-subtitle">
            {{ $tt('Sign in to the Karrar Delivery dashboard') }}
            <button v-if="remembered" type="button" class="k-not-you" @click="forgetMe">{{ $tt('Not you?') }}</button>
          </p>
        </div>

        <div v-if="!online" class="k-login-note is-offline" role="alert">
          <md-icon>wifi_off</md-icon>
          <span>{{ $tt("You're offline. Check your internet connection.") }}</span>
        </div>

        <transition name="k-note">
          <div v-if="online && signedOut && !errorMessage" class="k-login-note is-ok" role="status">
            <md-icon>check_circle</md-icon>
            <span>{{ $tt("You've signed out.") }}</span>
          </div>
        </transition>

        <div v-if="sessionExpired && !errorMessage" class="session-message" role="status">
          <md-icon>schedule</md-icon>
          <span>{{ $tt('Your session expired. Please sign in again.') }}</span>
        </div>

        <transition name="k-alert">
          <div v-if="errorMessage" class="error-message" :class="{ 'is-bump': alertBump }" role="alert" aria-live="assertive">
            <md-icon>error_outline</md-icon>
            <span>{{ $tt(errorMessage) }}</span>
          </div>
        </transition>

        <div class="k-phone" :class="{ 'has-error': hasPhoneError || phoneMissing, 'has-warning': phoneHint && !hasPhoneError && !phoneMissing }">
          <label class="k-phone-label" for="login-phone">{{ $tt('Phone number') }}</label>
          <div ref="ccWrap" class="k-phone-field">
          <div class="k-phone-input k-phone-box" :class="{ 'k-field-shake': shakePhone, 'is-cc-open': ccOpen }">
            <button
              ref="ccBtn"
              type="button"
              class="k-cc-btn"
              :aria-label="$tt('Country key') + ': ' + $tt(country.fullName) + ' +' + country.code"
              aria-haspopup="listbox"
              :aria-expanded="String(ccOpen)"
              @click="toggleCc"
              @keydown.down.prevent="openCc"
              @keydown.up.prevent="openCc"
            >
              <span class="k-flag" v-html="flags[country.code]"></span>
              <span class="k-cc-code">+{{ country.code }}</span>
              <md-icon class="k-cc-chev">expand_more</md-icon>
            </button>
            <span class="k-phone-sep" aria-hidden="true"></span>
            <input
              id="login-phone"
              ref="phoneInput"
              :value="formattedPhone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              maxlength="20"
              :placeholder="country.placeholder"
              @input="onPhoneInput"
              @keydown.enter.prevent="onPhoneEnter"
            />
            <md-icon v-if="localPhone.length === 9" class="k-phone-ok" :title="$tt('Phone number looks right')">check_circle</md-icon>
            <span v-else class="k-phone-count">{{ localPhone.length }}/9</span>
          </div>

          <!-- country list -->
          <transition name="k-cc-pop">
            <ul
              v-if="ccOpen"
              ref="ccList"
              class="k-cc-list"
              role="listbox"
              tabindex="-1"
              :aria-label="$tt('Country key')"
              :aria-activedescendant="'k-cc-opt-' + ccActive"
              @keydown="onCcKey"
            >
              <li
                v-for="(c, i) in countries"
                :id="'k-cc-opt-' + i"
                :key="c.code"
                role="option"
                :aria-selected="String(c.code === countryCode)"
                class="k-cc-opt"
                :class="{ 'is-active': i === ccActive, 'is-selected': c.code === countryCode }"
                @mouseenter="ccActive = i"
                @mousedown.prevent="pickCc(c)"
              >
                <span class="k-flag is-lg" v-html="flags[c.code]"></span>
                <span class="k-cc-text">
                  <strong>{{ $tt(c.fullName) }}</strong>
                  <small>{{ c.sample }}</small>
                </span>
                <span class="k-cc-dial">+{{ c.code }}</span>
                <md-icon class="k-cc-check">{{ c.code === countryCode ? 'check_circle' : '' }}</md-icon>
              </li>
            </ul>
          </transition>
          </div>
          <transition name="k-hint">
            <p v-if="phoneHint" class="k-phone-hint is-warning" role="status">
              <md-icon>warning_amber</md-icon>
              {{ $tt(phoneHint, { first: country.firstDigitsText }) }}
            </p>
            <p v-else-if="phoneMissing" class="k-phone-hint" role="alert">
              <md-icon>error_outline</md-icon>
              {{ $tt('Enter your phone number') }}
            </p>
          </transition>
        </div>

        <div class="k-pass" :class="{ 'has-error': hasPasswordError || passwordMissing }">
          <div class="k-pass-head">
            <label class="k-phone-label" for="login-password">{{ $tt('Password') }}</label>
            <!-- hidden for now -->
            <!-- <button type="button" class="k-forgot" :aria-expanded="String(showForgot)" @click="showForgot = !showForgot">
              {{ $tt('Forgot password?') }}
            </button> -->
          </div>
          <div class="k-pass-input" :class="{ 'k-field-shake': shakePass }">
            <md-icon>lock_outline</md-icon>
            <input
              id="login-password"
              ref="passwordInput"
              v-model="user.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              @input="onPasswordInput"
              @keydown="checkCapsLock"
              @keyup="checkCapsLock"
              @blur="capsLock = false"
              @keyup.enter="signIn"
            />
            <button
              type="button"
              class="k-pass-toggle"
              :aria-label="$tt(showPassword ? 'Hide password' : 'Show password')"
              :title="$tt(showPassword ? 'Hide password' : 'Show password')"
              @click="showPassword = !showPassword"
            >
              <md-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</md-icon>
            </button>
          </div>
          <transition name="k-hint">
            <p v-if="passwordMissing" class="k-phone-hint" role="alert">
              <md-icon>error_outline</md-icon>
              {{ $tt('Enter your password') }}
            </p>
          </transition>
          <transition name="k-hint">
            <p v-if="capsLock" class="k-caps-hint">
              <md-icon>keyboard_capslock</md-icon>
              {{ $tt('Caps Lock is on') }}
            </p>
          </transition>
          <!-- "Forgot password?" note, hidden for now
          <transition name="k-hint">
            <p v-if="showForgot" class="k-forgot-note" role="status">
              <md-icon>support_agent</md-icon>
              {{ $tt('Ask your administrator to reset your password.') }}
            </p>
          </transition>
          -->
        </div>

        <md-button class="md-raised md-primary login-btn" @click="signIn()" :disabled="isLoading || !online">
          <span v-if="isLoading" class="login-btn-busy">
            <md-progress-spinner :md-diameter="18" :md-stroke="3" md-mode="indeterminate" class="login-spinner"></md-progress-spinner>
            {{ $tt('Signing in…') }}
          </span>
          <span v-else>{{ $tt('Sign in') }}</span>
        </md-button>
        <transition name="k-hint">
          <p v-if="isLoading && slowServer" class="k-slow-note" role="status">
            <md-icon>hourglass_top</md-icon>
            {{ $tt('The server is waking up. This can take up to a minute…') }}
          </p>
        </transition>
      </div>
      <p class="login-footer">
        &copy; {{ new Date().getFullYear() }} {{ $tt('Karrar Delivery') }} · {{ $tt('Delivery Services') }}
      </p>
    </form>
  </div>
</template>

<script>
import {AuthenticationService} from "@/services/AuthenticationService";
import { ensureProfile } from "@/plugins/auth";
import { Config } from "@/services/Config";

// Country keys for the phone number. The number is sent to the backend as
// key + 9 digits, e.g. 971 + 501234567 -> "971501234567".
const COUNTRIES = [
  { code: "971", label: "🇦🇪 +971", name: "UAE", fullName: "United Arab Emirates", sample: "50 123 4567", firstDigits: ["5"], firstDigitsText: "5", placeholder: "5XXXXXXXX" },
  { code: "966", label: "🇸🇦 +966", name: "KSA", fullName: "Saudi Arabia", sample: "55 123 4567", firstDigits: ["5"], firstDigitsText: "5", placeholder: "5XXXXXXXX" },
  { code: "249", label: "🇸🇩 +249", name: "Sudan", fullName: "Sudan", sample: "91 234 5678", firstDigits: ["9", "1"], firstDigitsText: "9 / 1", placeholder: "9XXXXXXXX" },
];
const COUNTRY_KEY = "karrar.loginCountry";

// Small SVG flags: emoji flags don't show on Windows (they appear as "AE", "SA").
const FLAGS = {
  971:
    '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#00732f"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#000"/><rect width="8" height="20" fill="#ef3340"/></svg>',
  966:
    '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#006c35"/><path d="M8 7.6c1.5-1.1 3 .9 4.5-.2s3 .9 4.5-.1 3 .9 4.5-.2" stroke="#fff" stroke-width="1.15" fill="none" stroke-linecap="round"/><path d="M8.6 13.4h12.6" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/><path d="M21.2 12.5l1.8.9-1.8.9z" fill="#fff"/></svg>',
  249:
    '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#d21034"/><rect y="13.33" width="30" height="6.67" fill="#000"/><path d="M0 0 11 10 0 20z" fill="#007229"/></svg>',
};
// last person who signed in on this device: { cc, phone (9 digits), name }
const REMEMBER_KEY = "karrar.lastLogin";

function readRemembered() {
  try {
    const r = JSON.parse(localStorage.getItem(REMEMBER_KEY) || "null");
    return r && /^\d{9}$/.test(r.phone) && COUNTRIES.some((c) => c.code === r.cc) ? r : null;
  } catch (e) {
    return null;
  }
}

// "501234567" -> "50 123 4567"
function formatPhone(d) {
  if (!d) return "";
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(" ");
}

// Pull the 9 local digits out of whatever was typed, pasted or autofilled.
// Returns { digits, code (country found in the number, if any), dropped (digits removed) }.
function parsePhone(raw, countries) {
  const all = String(raw || "").replace(/\D/g, "");
  let d = all;
  let code = null;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length > 9) {
    const c = countries.find((x) => d.startsWith(x.code) && d.length - x.code.length >= 9);
    if (c) {
      code = c.code;
      d = d.slice(c.code.length);
    }
  }
  if (d.startsWith("0")) d = d.replace(/^0+/, ""); // local "05..." -> "5..."
  d = d.slice(0, 9);
  return { digits: d, code, dropped: all.length - d.length };
}

export default {
  name: "Login",
  data() {
    return {
      user: {
        phone: null,
        password: null
      },
      countries: COUNTRIES,
      flags: FLAGS,
      ccOpen: false,
      ccActive: 0,
      countryCode: (() => {
        try {
          const saved = localStorage.getItem(COUNTRY_KEY);
          return COUNTRIES.some((c) => c.code === saved) ? saved : "971"; // UAE by default
        } catch (e) {
          return "971";
        }
      })(),
      localPhone: "",
      phoneHint: null,
      showPassword: false,
      capsLock: false,
      sessionExpired: false,
      redirectTo: null,
      errorMessage: null,
      hasPhoneError: false,
      hasPasswordError: false,
      isLoading: false,
      slowServer: false,
      showForgot: false,
      bgPaused: false,
      pkgOpen: false,
      kmReached: 0,
      kmTimer: null,
      etaMin: 25,
      klDest: "Dubai Marina",
      dayPart: "dusk",
      klLive: "Picked up from trader",
      klDust: false,
      klLite: false,
      klExtras: false,
      etaTimer: null,
      logoLight: require("@/assets/img/karrar-logo-light.png"),
      logoDark: require("@/assets/img/karrar-logo-transparent.png"),
      remembered: readRemembered(),
      signedOut: false,
      phoneMissing: false,
      passwordMissing: false,
      online: typeof navigator === "undefined" || navigator.onLine !== false,
      shakePhone: false,
      shakePass: false,
      alertBump: false,
      appVersion: process.env.VUE_APP_VERSION || "",
      buildDate: process.env.VUE_APP_BUILD_DATE || ""
    }
  },
  computed: {
    country() {
      return this.countries.find((c) => c.code === this.countryCode) || this.countries[0];
    },
    // 501234567 -> "50 123 4567" (easier to check by eye)
    rememberedName() {
      const n = this.remembered && this.remembered.name;
      return n ? String(n).trim() : ""; // first and last name, as in the top bar
    },
    formattedPhone() {
      return formatPhone(this.localPhone);
    },
  },
  mounted() {
    // why we are here: session ran out (set by the API layer) or a page needed sign-in
    try {
      const expiredFrom = sessionStorage.getItem("karrar.sessionExpired");
      if (expiredFrom !== null) {
        this.sessionExpired = true;
        sessionStorage.removeItem("karrar.sessionExpired");
        if (expiredFrom && expiredFrom !== "/login") this.redirectTo = expiredFrom;
      }
    } catch (e) {
      /* sessionStorage unavailable */
    }
    const q = this.$route.query || {};
    if (q.redirect && String(q.redirect).startsWith("/") && q.redirect !== "/login") this.redirectTo = q.redirect;
    if (q.expired) this.sessionExpired = true;

    // just signed out?
    try {
      if (sessionStorage.getItem("karrar.signedOut")) {
        this.signedOut = !this.sessionExpired;
        sessionStorage.removeItem("karrar.signedOut");
        this.signedOutTimer = setTimeout(() => (this.signedOut = false), 4000);
      }
    } catch (e) {
      /* ignore */
    }

    // same person as last time on this device: fill the number, go straight to the password
    if (this.remembered) {
      this.countryCode = this.remembered.cc;
      this.localPhone = this.remembered.phone;
      this.syncPhone();
    }

    // start typing straight away
    this.$nextTick(() => {
      const target = this.remembered ? this.$refs.passwordInput : this.$refs.phoneInput;
      if (target) target.focus();
    });

    // Render puts the backend to sleep: knock on the door now so it's awake
    // by the time the password is typed (the reply itself doesn't matter)
    this.wakeServer();

    window.addEventListener("online", this.onOnline);
    window.addEventListener("offline", this.onOnline);

    // stop the background animation while the tab is hidden (saves battery on phones)
    document.addEventListener("visibilitychange", this.onVisibility);
    this.onVisibility();
    this.kmTimer = setInterval(this.tickKm, 250);
    // the widget's ETA follows the van (reads the route animation's own clock)
    const h = new Date().getHours();
    this.dayPart = h >= 7 && h < 16 ? "day" : (h >= 16 && h < 19) || (h >= 5 && h < 7) ? "dusk" : "night";
    this.klDust = this.dayPart === "dusk" && Math.random() < 0.35;
    // calm first impression: the extras (motorbike, heat shimmer, dust) only from the second visit
    try {
      const visits = parseInt(localStorage.getItem("karrar.loginVisits") || "0", 10) + 1;
      localStorage.setItem("karrar.loginVisits", String(visits));
      this.klExtras = visits >= 2;
    } catch (e) {
      this.klExtras = false;
    }
    // older / low-power machines: drop the extra layers
    this.klLite = (navigator.hardwareConcurrency || 8) <= 4 || !!(navigator.connection && navigator.connection.saveData);
    // the widget only shows on wide screens: stop its animations otherwise
    this.klWide = window.matchMedia ? window.matchMedia("(min-width: 1024px)") : null;
    if (this.klWide) {
      this.onKlWide = () => this.onVisibility();
      if (this.klWide.addEventListener) this.klWide.addEventListener("change", this.onKlWide);
      this.onVisibility();
    }
  },
  beforeDestroy() {
    clearInterval(this.etaTimer);
    clearInterval(this.kmTimer);
    if (this.klWide && this.onKlWide && this.klWide.removeEventListener) this.klWide.removeEventListener("change", this.onKlWide);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("online", this.onOnline);
    window.removeEventListener("offline", this.onOnline);
    clearTimeout(this.slowTimer);
    clearTimeout(this.shakeTimer);
    clearTimeout(this.signedOutTimer);
    document.removeEventListener("mousedown", this.onCcOutside, true);
  },
  methods: {
    // 12s loop: the van drives from 8% to 80%; ETA counts 25 -> 0 over that stretch
    // brand map: how many emirates have been reached in this round (arrivals in seconds of the 12s loop)
    tickKm() {
      const el = document.querySelector(".km-route.is-0");
      const anim = el && el.getAnimations && el.getAnimations()[0];
      if (!anim || anim.currentTime == null) {
        // reduced motion: the finished map
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) this.kmReached = 7;
        return;
      }
      const t = (anim.currentTime / 1000) % 12;
      const arrivals = [3.60,3.90,4.20,4.50,4.80,5.10,5.40];
      this.kmReached = t > 11.64 ? 0 : arrivals.filter((a) => t >= a).length;
      // keep the vehicles (SVG clock) in step with the lines (CSS clock)
      const svg = this.$refs.bgSvg;
      if (svg && svg.getCurrentTime && !document.hidden) {
        const smil = svg.getCurrentTime() % 12;
        let drift = Math.abs(t - smil);
        drift = Math.min(drift, 12 - drift);
        if (drift > 0.12) svg.setCurrentTime(anim.currentTime / 1000);
      }
    },
    tickEta() {
      const el = this.$refs.klProgress;
      const anim = el && el.getAnimations && el.getAnimations()[0];
      if (!anim || anim.currentTime == null) return;
      // keep the van (SVG clock) locked to the route glow (CSS clock)
      const svg = this.$refs.bgSvg;
      if (svg && svg.getCurrentTime && !document.hidden && !(svg.animationsPaused && svg.animationsPaused())) {
        const css = (anim.currentTime / 1000) % 12;
        const smil = svg.getCurrentTime() % 12;
        let drift = Math.abs(css - smil);
        drift = Math.min(drift, 12 - drift);
        if (drift > 0.12) svg.setCurrentTime(anim.currentTime / 1000);
      }
      const f = (anim.currentTime % 12000) / 12000;
      const loop = Math.floor(anim.currentTime / 12000);
      const dests = ["Dubai Marina", "Sharjah City Centre", "Al Ain Mall", "Abu Dhabi Corniche", "Ras Al Khaimah Port", "Fujairah Beach"];
      this.klDest = dests[loop % dests.length];
      this.klLive = f < 0.3 ? "Picked up from trader" : f < 0.68 ? "On the way" : f < 0.8 ? "Arriving soon" : "Delivered";
      this.etaMin = f < 0.08 ? 25 : f >= 0.8 ? 0 : Math.max(1, Math.ceil(25 * (0.8 - f) / 0.72));
    },
    // Sign in pressed: the van jumps ahead to "Delivered" (12s loop, delivered at 80%)
    klRushToDelivered() {
      const target = 0.8 * 12000 + 50;
      const box = this.$refs.klWidget;
      if (box && box.getAnimations) {
        box.getAnimations({ subtree: true }).forEach((a) => {
          const t = a.effect && a.effect.getTiming && a.effect.getTiming();
          if (!t || t.duration !== 12000 || a.currentTime == null) return;
          const loopStart = Math.floor(a.currentTime / 12000) * 12000;
          if (a.currentTime - loopStart < target) a.currentTime = loopStart + target;
        });
      }
      const svg = this.$refs.bgSvg;
      if (svg && svg.getCurrentTime) {
        const now = svg.getCurrentTime();
        const loopStart = Math.floor(now / 12) * 12;
        if (now - loopStart < 9.6) svg.setCurrentTime(loopStart + 9.65);
      }
      this.tickEta();
    },
    checkCapsLock(e) {
      if (e && typeof e.getModifierState === "function") this.capsLock = e.getModifierState("CapsLock");
    },
    onOnline() {
      this.online = navigator.onLine !== false;
      if (this.online) this.wakeServer();
    },
    wakeServer() {
      if (!this.online || typeof fetch !== "function") return;
      try {
        const root = Config.base_url().replace(/\/api\/v1\/?$/, "/");
        fetch(root, { mode: "no-cors", cache: "no-store", credentials: "omit" }).catch(() => {});
      } catch (e) {
        /* best effort only */
      }
    },
    forgetMe() {
      try {
        localStorage.removeItem(REMEMBER_KEY);
      } catch (e) {
        /* ignore */
      }
      this.remembered = null;
      this.localPhone = "";
      this.user.password = null;
      this.syncPhone();
      this.clearErrors();
      this.$nextTick(() => this.$refs.phoneInput && this.$refs.phoneInput.focus());
    },
    rememberMe() {
      const entry = { cc: this.countryCode, phone: this.localPhone, name: "" };
      const prev = readRemembered();
      if (prev && prev.cc === entry.cc && prev.phone === entry.phone) entry.name = prev.name || "";
      const save = () => {
        try {
          localStorage.setItem(REMEMBER_KEY, JSON.stringify(entry));
        } catch (e) {
          /* ignore */
        }
      };
      save();
      // fill in the name once the profile is loaded
      Promise.resolve(ensureProfile())
        .then((p) => {
          if (p && p.name) {
            entry.name = p.name;
            save();
          }
        })
        .catch(() => {});
    },
    // Shake only the box(es) that need attention, with a red ring, and
    // nudge the message at the top if it was already showing.
    shakeFields(phone, pass) {
      this.shakePhone = false;
      this.shakePass = false;
      this.alertBump = false;
      clearTimeout(this.shakeTimer);
      // wait a frame so the animation restarts on repeated clicks
      this.$nextTick(() =>
        requestAnimationFrame(() => {
          this.shakePhone = !!phone;
          this.shakePass = !!pass;
          this.alertBump = true;
          this.shakeTimer = setTimeout(() => {
            this.shakePhone = false;
            this.shakePass = false;
            this.alertBump = false;
          }, 800);
        })
      );
    },
    onVisibility() {
      const narrow = this.klWide ? !this.klWide.matches : false;
      this.bgPaused = document.hidden;
      const svg = this.$refs.bgSvg;
      if (svg && typeof svg.pauseAnimations === "function") {
        if (document.hidden || narrow) svg.pauseAnimations();
        else {
          // keep the van (SVG clock) in step with the route glow (CSS clock)
          this.$nextTick(() => {
            const el = this.$refs.klProgress;
            const anim = el && el.getAnimations && el.getAnimations()[0];
            if (anim && anim.currentTime != null && svg.setCurrentTime) svg.setCurrentTime(anim.currentTime / 1000);
            svg.unpauseAnimations();
          });
        }
      }
    },
    // Accepts typing, pasting and browser autofill:
    //   "+971 50 123 4567", "00971501234567", "0501234567", "501234567"
    // A full number picks its country; a leading 0 is dropped; max 9 digits,
    // and the first digit must fit the country.
    onPhoneInput(e) {
      const el = e.target;
      const raw = String(el.value || "");
      const caret = el.selectionStart == null ? raw.length : el.selectionStart;
      const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;

      const parsed = parsePhone(raw, this.countries);
      let changedShape = parsed.dropped > 0;
      if (parsed.code && parsed.code !== this.countryCode) {
        this.countryCode = parsed.code;
        this.rememberCountry();
        changedShape = true;
      }

      let digits = parsed.digits;
      if (digits && !this.country.firstDigits.includes(digits[0])) {
        digits = "";
        this.phoneHint = "Numbers for this country start with {first}";
      } else {
        this.phoneHint = null;
      }
      this.localPhone = digits;
      if (digits) this.phoneMissing = false;
      this.signedOut = false;
      this.clearErrors();
      this.syncPhone();

      // write the formatted value back and keep the caret after the same digit
      const formatted = formatPhone(digits);
      el.value = formatted;
      let pos = formatted.length;
      if (!changedShape) {
        let seen = 0;
        pos = 0;
        while (pos < formatted.length && seen < digitsBeforeCaret) {
          if (/\d/.test(formatted[pos])) seen++;
          pos++;
        }
      }
      if (document.activeElement === el) el.setSelectionRange(pos, pos);
    },
    // Enter in the phone box moves on to the password (or signs in if it's filled)
    onPhoneEnter() {
      if (this.user.password) this.signIn();
      else if (this.$refs.passwordInput) this.$refs.passwordInput.focus();
    },
    rememberCountry() {
      try {
        localStorage.setItem(COUNTRY_KEY, this.countryCode);
      } catch (e) {
        /* not remembered */
      }
    },
    onCountryChange() {
      this.rememberCountry();
      // a number typed for the previous country may not fit the new one
      if (this.localPhone && !this.country.firstDigits.includes(this.localPhone[0])) {
        this.localPhone = "";
        this.phoneHint = "Numbers for this country start with {first}";
      } else {
        this.phoneHint = null;
      }
      this.syncPhone();
      this.$nextTick(() => this.$refs.phoneInput && this.$refs.phoneInput.focus());
    },
    syncPhone() {
      this.user.phone = this.localPhone ? this.countryCode + this.localPhone : null;
    },
    stopSlowTimer() {
      clearTimeout(this.slowTimer);
      this.slowServer = false;
    },
    // ---- country key list
    toggleCc() {
      if (this.ccOpen) this.closeCc(true);
      else this.openCc();
    },
    openCc() {
      if (this.ccOpen) return;
      const i = this.countries.findIndex((c) => c.code === this.countryCode);
      this.ccActive = i < 0 ? 0 : i;
      this.ccOpen = true;
      document.addEventListener("mousedown", this.onCcOutside, true);
      this.$nextTick(() => this.$refs.ccList && this.$refs.ccList.focus());
    },
    closeCc(focusButton) {
      this.ccOpen = false;
      document.removeEventListener("mousedown", this.onCcOutside, true);
      if (focusButton) this.$nextTick(() => this.$refs.ccBtn && this.$refs.ccBtn.focus());
    },
    onCcOutside(e) {
      if (this.$refs.ccWrap && !this.$refs.ccWrap.contains(e.target)) this.closeCc(false);
    },
    onCcKey(e) {
      const n = this.countries.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.ccActive = (this.ccActive + 1) % n;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.ccActive = (this.ccActive - 1 + n) % n;
      } else if (e.key === "Home") {
        e.preventDefault();
        this.ccActive = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        this.ccActive = n - 1;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.pickCc(this.countries[this.ccActive]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        this.closeCc(true);
      } else if (e.key === "Tab") {
        this.closeCc(false);
      }
    },
    pickCc(c) {
      this.closeCc(false);
      if (c.code !== this.countryCode) {
        this.countryCode = c.code;
        this.onCountryChange(); // remembers it and puts the cursor in the number
      } else {
        this.$nextTick(() => this.$refs.phoneInput && this.$refs.phoneInput.focus());
      }
    },
    onPasswordInput() {
      if (this.user.password) this.passwordMissing = false;
      this.signedOut = false;
      this.clearErrors();
    },
    clearErrors() {
      this.errorMessage = null;
      this.hasPhoneError = false;
      this.hasPasswordError = false;
    },
    signIn() {
      // Phone must be exactly 9 digits after the country key
      if (this.localPhone && this.localPhone.length !== 9) {
        this.hasPhoneError = true;
        this.errorMessage = "Enter 9 digits after the country key";
        this.signedOut = false;
        this.shakeFields(true, false);
        return;
      }
      // Validate inputs
      if (!this.user.phone || !this.user.password) {
        this.phoneMissing = !this.user.phone;
        this.passwordMissing = !this.user.password;
        this.signedOut = false;
        this.errorMessage =
          this.phoneMissing && this.passwordMissing
            ? "Enter your phone number and password"
            : this.phoneMissing
              ? "Enter your phone number"
              : "Enter your password";
        this.shakeFields(this.phoneMissing, this.passwordMissing);
        // put the cursor in the first empty box
        this.$nextTick(() => {
          const el = this.phoneMissing ? this.$refs.phoneInput : this.$refs.passwordInput;
          if (el) el.focus();
        });
        return;
      }

      this.isLoading = true;
      this.clearErrors();
      // Render puts the backend to sleep; the first sign-in can take a while
      this.slowServer = false;
      clearTimeout(this.slowTimer);
      this.slowTimer = setTimeout(() => {
        this.slowServer = true;
      }, 5000);

      AuthenticationService.login(this.user)
        .then(response => {
          this.isLoading = false;
          this.stopSlowTimer();
          if (response.data && response.data.accessToken) {
            if (AuthenticationService.isAuth()) {
              this.rememberMe(); // also loads the profile
              // back to the page the user was on before (if any), otherwise home
              this.$router.push(this.redirectTo || "/");
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.stopSlowTimer();
          const apiError = err && err.response && err.response.data && err.response.data.errorDtoList && err.response.data.errorDtoList[0];
          const apiMessage = (apiError && apiError.errorMessage) || "";

          if (err.isAuthError) {
            // wrong phone number or password
            this.errorMessage = "Invalid phone number or password";
            this.hasPhoneError = true;
            this.hasPasswordError = true;
            this.shakeFields(true, true);
            // select the password so typing again replaces it
            this.$nextTick(() => {
              const el = this.$refs.passwordInput;
              if (el) {
                el.focus();
                el.select();
              }
            });
          } else if (/disabled|غير مفعل/i.test(apiMessage)) {
            this.errorMessage = "Your account is disabled. Please contact an administrator.";
          } else if (!err.response) {
            // backend not reachable (down, offline, CORS ...)
            this.errorMessage = "Can't reach the server. Check your connection and try again.";
          } else if (err.response.status >= 500 && !apiMessage) {
            this.errorMessage = "The server had a problem. Please try again in a moment.";
          } else {
            this.errorMessage = apiMessage || "An error occurred during login. Please try again later.";
            console.error("Login error:", err);
          }
        });
    }
  },
}
</script>
<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(1200px 600px at 85% 110%, rgba(245, 124, 0, 0.38), transparent 60%),
    radial-gradient(900px 500px at -10% -20%, rgba(59, 130, 246, 0.16), transparent 60%),
    linear-gradient(160deg, #0b1222 0%, #111c33 55%, #0d1526 100%);
}

/* faint dotted grid for texture (single-column layout only) */
@media (min-width: 1024px) {
  .login-page::after { display: none; }
}

.login-page::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  pointer-events: none;
}

.login-tools {
  position: absolute;
  top: 16px;
  inset-inline-end: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
}

.session-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1d4ed8;
  background-color: #dbeafe;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: start;
}

.session-message .md-icon {
  color: #2563eb !important;
  font-size: 20px !important;
  margin: 0;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 18px;
  padding: 32px 32px 28px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
}

.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 22px;
}

.login-logo {
  height: 56px;
  width: auto;
  margin-bottom: 16px;
  animation: k-logo-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.login-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.login-subtitle {
  margin: 6px 0 0;
  font-size: 13.5px;
  color: #6b7280;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: start;
}

.error-message .md-icon {
  color: #dc2626 !important;
  font-size: 20px !important;
  margin: 0;
}

.login-btn {
  width: 100%;
  height: 44px !important;
  margin: 18px 0 0 !important;
  font-size: 15px !important;
}

.login-spinner {
  display: inline-block;
  vertical-align: middle;
}

.login-spinner >>> .md-progress-spinner-circle {
  stroke: #fff !important;
}

.login-footer {
  margin-top: 20px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
  }
}
</style>
