<template>
  <Teleport to="body" :disabled="!visible" v-if="visibleCal">
    <div class="modal__main">
      <div class="alert-1-option">
        <img class="app-icon" alt="" src="/electron-vite.animate.svg" />
        <div class="title-description">
          <b class="title">{{ title }}</b>
          <div class="alert-description">{{ description }}</div>
        </div>
        <button class="button">
          <div class="label">确认</div>
        </button>
        <div class="checkbox">
          <a-checkbox />
          <div class="label">Don't ask again</div>
        </div>
        <div class="help-button">
          <div class="help-button1" @click="visibleCal = !visibleCal">
            <div class="div">
              <icon-close />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps({
  onClose: { type: Function },
  description: {
    type: String,
    default:
      'Description text about this alert is shown \nhere, explaining to users what the options \nunderneath are about and what to do.',
  },
  title: { type: String, default: 'Title' },
  visible: { type: Boolean, default: false },
});

const emits = defineEmits(['update:visible']);

const visibleCal = computed({
  get: () => props.visible,
  set: value => emits('update:visible', value),
});
</script>
<style lang="less" scoped>
.modal__main {
  position: absolute;
  z-index: 1001;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .app-icon {
    position: relative;
    width: 4rem;
    height: 4rem;
    object-fit: cover;
    z-index: 0;
  }
  .title {
    align-self: stretch;
    position: relative;
    line-height: 1rem;
  }
  .alert-description {
    align-self: stretch;
    position: relative;
    font-size: var(--subheadline-regular-size);
    line-height: 0.88rem;
  }
  .title-description {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: var(--gap-3xs);
    z-index: 1;
  }
  .label {
    position: relative;
    line-height: 1rem;
  }
  .button {
    border-radius: var(--br-8xs);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.17),
        rgba(255, 255, 255, 0)
      ),
      #007aff;
    width: 14.25rem;
    display: flex;
    flex-direction: row;
    padding: var(--padding-7xs) var(--padding-6xs);
    box-sizing: border-box;
    align-items: flex-start;
    justify-content: center;
    z-index: 2;
    color: var(--color-white);
    cursor: pointer;
    border: none;
  }
  .checkbox1 {
    position: relative;
    border-radius: var(--br-9xs-5);
    background-color: var(--color-white);
    box-shadow:
      0px 1px 2px rgba(0, 0, 0, 0.1) inset,
      0px 0px 2px rgba(0, 0, 0, 0.1) inset;
    border: 0.5px solid var(--color-gray-200);
    box-sizing: border-box;
    width: 0.88rem;
    height: 0.88rem;
  }
  .checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--gap-7xs);
    z-index: 3;
    text-align: left;
  }
  .div {
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 10px);
    line-height: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    mix-blend-mode: linear-burn;
    cursor: pointer;
  }
  .help-button1 {
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 10px);
    border-radius: var(--br-3xs);
    background-color: var(--color-whitesmoke-100);
    width: 1.25rem;
    height: 1.25rem;
    mix-blend-mode: linear-burn;
  }
  .help-button {
    position: absolute;
    margin: 0 !important;
    top: 1rem;
    right: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    z-index: 4;
    font-family: var(--body-emphasized);
  }
  .alert-1-option {
    position: relative;
    border-radius: var(--br-3xs);
    background-color: var(--color-whitesmoke-200);
    box-shadow:
      0px 0px 1px rgba(0, 0, 0, 0.6),
      0px 0px 2px rgba(0, 0, 0, 0.05),
      0px 38px 90px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(80px);
    width: 16.25rem;
    display: flex;
    flex-direction: column;
    padding: var(--padding-xl) var(--padding-base) var(--padding-base);
    box-sizing: border-box;
    align-items: center;
    justify-content: flex-start;
    gap: var(--gap-base);
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    text-align: center;
    font-size: var(--body-regular-size);
    color: var(--text-primary);
    font-family: var(--body-regular);
  }
}
</style>
