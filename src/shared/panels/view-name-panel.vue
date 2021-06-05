<template>
    <div class="view-name-panel-container">
        <svg width="218" height="33" viewBox="0 0 218 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#view_name_panel_filter0_d)">
                <path d="M207.198 3H10.8019C8.32867 3 6.22705 4.80821 5.85791 7.25374L3.36734 23.7537C2.91083 26.7782 5.25264 29.5 8.31134 29.5H209.689C212.747 29.5 215.089 26.7782 214.633 23.7537L212.142 7.25374C211.773 4.80821 209.671 3 207.198 3Z" fill="url(#view_name_panel_paint0_linear)" fill-opacity="0.01"/>
            </g>

            <g filter="url(#view_name_panel_filter1_d)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.86907 7.10449C5.31204 4.16985 7.83399 2 10.8019 2H207.198C210.166 2 212.688 4.16985 213.131 7.10448L215.621 23.6045C216.169 27.2338 213.359 30.5 209.689 30.5H8.31131C4.64086 30.5 1.83069 27.2338 2.37851 23.6045L4.86907 7.10449ZM10.8019 4C8.82328 4 7.14198 5.44657 6.84667 7.40299L4.35611 23.903C3.99089 26.3225 5.86434 28.5 8.31131 28.5H209.689C212.136 28.5 214.009 26.3225 213.644 23.903L211.153 7.40299C210.858 5.44656 209.177 4 207.198 4H10.8019Z" fill="white" fill-opacity="0.9"/>
            </g>

            <defs>
                <filter id="view_name_panel_filter0_d" x="1.3103" y="1" width="215.379" height="30.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>

                <filter id="view_name_panel_filter1_d" x="0.310059" y="0" width="217.38" height="32.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>

                <linearGradient id="view_name_panel_paint0_linear" x1="109.5" y1="-7" x2="109.5" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.8"/>
                    <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
            </defs>
        </svg>

        <span class="name">{{ name }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class ViewNamePanelProp {
    public name = prop<string>({ default: 'no view selected' });
}

export default class ViewNamePanel extends Vue.with(ViewNamePanelProp) {}
</script>

<style lang="scss" scoped>
.view-name-panel-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        position: absolute;
    }

    .name {
        text-transform: uppercase;
    }
}
</style>
