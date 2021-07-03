<template>
    <div class="focus-session-start-dialog-container">
    </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';

import { FocusSessionStartupOption } from '../../../core/models/time-session/focus-session-startup-option';

class FocusSessionStartDialogProp {
    public data = prop<FocusSessionStartupOption>({ default: null });
}

@Options({})
export default class FocusSessionStartDialog extends Vue.with(FocusSessionStartDialogProp) {}
</script>

<style lang="scss" scoped>
.focus-session-start-dialog-container {

}
</style>
