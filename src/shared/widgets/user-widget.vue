<template>
    <div class="user-widget-container" v-if="profile">
        <div class="avatar">
            <img :src="profile.avatarUrl" @error="$event.target.src = 'focus-protocol://src/assets/images/avatar_placeholder.jpg'" />
        </div>

        <div class="content">
            <div class="user-information">
                <span>{{ profile.name }}</span>
                <span>Rating {{ rating }}%</span>
            </div>

            <div class="actions">
                <account-reactivate class="action-button" @click="$emit('user:switch')" />
                <logout class="action-button" @click="$emit('user:logout')" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { AccountReactivate, Logout } from 'mdue';

import store from '../../store';
import { userKey } from '../../store/user/user.state';
import { UserProfile } from '../../core/models/user/user-profile';
import { PerformanceRating } from '../../core/models/user/performance-rating';

@Options({
    components: {
        AccountReactivate,
        Logout
    },
    emits: [
        'user:switch',
        'user:logout'
    ]
})
export default class UserWidget extends Vue {

    get profile(): UserProfile | null {
        return store.getters[`${userKey}/profile`];
    }

    get rating(): number {
        const profile = this.profile?.ratings ?? new PerformanceRating();
        const { determination, estimation, planning, adaptability, sustainability } = profile;

        return (determination + estimation + planning + adaptability + sustainability) / 5;
    }
}
</script>

<style lang="scss" scoped>
.user-widget-container {
    $avatar-dimension: 12.5vh;

    display: flex;
    align-items: center;

    .avatar {
        margin-right: 0.55vh;
        width: $avatar-dimension;
        height: $avatar-dimension;
        border: 2px solid var(--primary-colors-0-00);

        img {
            width: 100%;
            height: 100%;
        }
    }

    .content {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 0.5vh 1.75vh 0.5vh 1vh;
        height: calc(#{$avatar-dimension} / 7 * 4);
        border: 2px solid var(--primary-colors-0-00);

        .user-information {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            min-width: 10vw;
            height: 100%;

            & > span:first-of-type {
                text-transform: uppercase;
                color: var(--context-colors-info-00);
                font-size: var(--font-sizes-600);
            }
        }

        .actions {
            display: flex;

            .action-button {
                margin-left: 1.25vh;
                font-size: var(--font-sizes-600);
                transition: color 0.3s;

                &:hover {
                    cursor: pointer;
                    color: var(--primary-colors-7-00);
                }
            }
        }
    }
}
</style>
